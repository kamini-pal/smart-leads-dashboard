import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Lead from '../models/Lead';
import { ApiError, LeadQueryParams, LeadStatus, LeadSource } from '../types';
import generateCsv, { leadCsvColumns } from '../utils/csvExport';

/**
 * Lead Controller — handles all Lead CRUD operations + filtering + pagination.
 *
 * EVERY route is protected by authMiddleware, so req.user is always available.
 */

// ────────────────────────────────────────────────────────────
// POST /api/leads — Create a new lead
// ────────────────────────────────────────────────────────────
export const createLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    const { name, email, status, source } = req.body;

    const lead = await Lead.create({
      name,
      email,
      status,
      source,
      createdBy: req.user!.userId, // Set by authMiddleware
    });

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// ────────────────────────────────────────────────────────────
// GET /api/leads — Get all leads with filtering, search,
//                  sorting, and pagination
// ────────────────────────────────────────────────────────────
export const getLeads = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, source, search, sort, page, limit } = req.query as LeadQueryParams;

    /**
     * STEP 1: Build the filter object.
     *
     * HOW MONGODB FILTERING WORKS:
     * We build a "filter" object step by step. Each filter is optional.
     * MongoDB uses this object to match documents.
     *
     * Example: If status=qualified AND source=instagram, the filter becomes:
     * { status: "qualified", source: "instagram" }
     *
     * MongoDB returns ONLY documents matching ALL conditions (AND logic).
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};

    // Filter by status (if provided)
    if (status && Object.values(LeadStatus).includes(status)) {
      filter.status = status;
    }

    // Filter by source (if provided)
    if (source && Object.values(LeadSource).includes(source)) {
      filter.source = source;
    }

    /**
     * STEP 2: Search by name or email using regex.
     *
     * HOW REGEX SEARCH WORKS:
     * $or: MongoDB returns documents matching ANY of the conditions
     * $regex: Matches a pattern within a string (like "contains")
     * $options: 'i' means case-insensitive
     *
     * Example: search="rahul" matches:
     * - name: "Rahul Sharma" ✅ (case-insensitive, contains "rahul")
     * - email: "rahul@gmail.com" ✅
     * - name: "John" ❌
     *
     * WHY regex instead of exact match?
     * Users type partial names. "rah" should match "Rahul".
     */
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    /**
     * STEP 3: Pagination — calculate skip and limit.
     *
     * HOW PAGINATION WORKS:
     * ┌──────────────────────────────────────────────────┐
     * │ Total: 25 leads, Limit: 10 per page              │
     * │                                                   │
     * │ Page 1: skip 0,  show leads 1-10                  │
     * │ Page 2: skip 10, show leads 11-20                 │
     * │ Page 3: skip 20, show leads 21-25                 │
     * │                                                   │
     * │ Formula: skip = (page - 1) * limit                │
     * │ Page 2: skip = (2-1) * 10 = 10 → skip first 10   │
     * └──────────────────────────────────────────────────┘
     *
     * WHY backend pagination?
     * Loading 10,000 leads into the browser would be slow.
     * We send only 10 at a time + metadata for the UI.
     */
    const pageNum = Math.max(1, parseInt(page || '1', 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit || '10', 10)));
    const skip = (pageNum - 1) * limitNum;

    /**
     * STEP 4: Sorting.
     *
     * { createdAt: -1 } = newest first (descending)
     * { createdAt: 1 }  = oldest first (ascending)
     */
    const sortOrder = sort === 'oldest' ? 1 : -1; // Default: latest first

    /**
     * STEP 5: Execute the query.
     *
     * We run TWO queries:
     * 1. countDocuments(filter) — total count (for pagination metadata)
     * 2. find(filter).sort().skip().limit() — actual page of results
     *
     * WHY two queries?
     * find() with limit only returns 10 docs, but the frontend needs
     * to know the TOTAL count to show "Page 1 of 5" in the UI.
     */
    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .populate('createdBy', 'name email'), // Include creator's name & email
      Lead.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      message: 'Leads fetched successfully',
      data: leads,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ────────────────────────────────────────────────────────────
// GET /api/leads/stats — Dashboard overview statistics
// ────────────────────────────────────────────────────────────
export const getLeadStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [total, statusAgg, sourceAgg, recentLeads] = await Promise.all([
      Lead.countDocuments(),
      Lead.aggregate<{ _id: LeadStatus; count: number }>([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Lead.aggregate<{ _id: LeadSource; count: number }>([
        { $group: { _id: '$source', count: { $sum: 1 } } },
      ]),
      Lead.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('createdBy', 'name email'),
    ]);

    const byStatus = {
      new: 0,
      contacted: 0,
      qualified: 0,
      lost: 0,
    };
    statusAgg.forEach(({ _id, count }) => {
      if (_id in byStatus) {
        byStatus[_id as keyof typeof byStatus] = count;
      }
    });

    const bySource = {
      website: 0,
      instagram: 0,
      referral: 0,
    };
    sourceAgg.forEach(({ _id, count }) => {
      if (_id in bySource) {
        bySource[_id as keyof typeof bySource] = count;
      }
    });

    res.status(200).json({
      success: true,
      message: 'Lead stats fetched successfully',
      data: {
        total,
        byStatus,
        bySource,
        recentLeads,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ────────────────────────────────────────────────────────────
// GET /api/leads/:id — Get a single lead by ID
// ────────────────────────────────────────────────────────────
export const getLeadById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    const lead = await Lead.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!lead) {
      throw new ApiError(404, 'Lead not found');
    }

    res.status(200).json({
      success: true,
      message: 'Lead fetched successfully',
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// ────────────────────────────────────────────────────────────
// PUT /api/leads/:id — Update a lead
// ────────────────────────────────────────────────────────────
export const updateLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: 'after', // Return the UPDATED document (not the old one)
        runValidators: true,     // Run schema validators on update too
      }
    ).populate('createdBy', 'name email');

    if (!lead) {
      throw new ApiError(404, 'Lead not found');
    }

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// ────────────────────────────────────────────────────────────
// DELETE /api/leads/:id — Delete a lead
// ────────────────────────────────────────────────────────────
export const deleteLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      throw new ApiError(404, 'Lead not found');
    }

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// ────────────────────────────────────────────────────────────
// GET /api/leads/export/csv — Export leads as CSV file
// ────────────────────────────────────────────────────────────
export const exportLeadsCsv = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, source, search } = req.query as LeadQueryParams;

    /**
     * Build the SAME filter as getLeads.
     * This way, if the user is viewing filtered leads on the dashboard,
     * the CSV export will contain the SAME filtered results.
     *
     * Example: User filters by status=qualified, clicks "Export CSV"
     * → Only qualified leads appear in the downloaded file.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};

    if (status && Object.values(LeadStatus).includes(status)) {
      filter.status = status;
    }
    if (source && Object.values(LeadSource).includes(source)) {
      filter.source = source;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Fetch ALL matching leads (no pagination — export everything)
    const leads = await Lead.find(filter)
      .sort({ createdAt: -1 })
      .lean(); // .lean() returns plain JS objects (faster, no Mongoose overhead)

    // Generate CSV string
    const csv = generateCsv(leads, leadCsvColumns);

    /**
     * Set response headers to trigger a file download.
     *
     * Content-Type: text/csv → tells the browser "this is a CSV file"
     * Content-Disposition: attachment → triggers download instead of display
     * filename= → the name of the downloaded file
     */
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads-export.csv');
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};
