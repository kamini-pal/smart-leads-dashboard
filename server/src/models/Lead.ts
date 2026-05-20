import mongoose, { Schema } from 'mongoose';
import { LeadStatus, LeadSource } from '../types';

/**
 * Lead Model — defines how a Lead is stored in MongoDB.
 *
 * KEY DESIGN DECISIONS:
 * - `createdBy` links each lead to the user who created it
 * - Enums ensure only valid status/source values are saved
 * - Indexes on status, source, and email speed up filtering queries
 * - timestamps: true auto-manages createdAt and updatedAt
 */

const leadSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Lead email is required'],
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: Object.values(LeadStatus),
      default: LeadStatus.NEW,
    },
    source: {
      type: String,
      enum: Object.values(LeadSource),
      required: [true, 'Lead source is required'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User', // References the User model (who created this lead)
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Indexes — speed up queries that filter/search frequently.
 *
 * WHY: Without indexes, MongoDB scans EVERY document to find matches.
 * With indexes, it jumps directly to matching documents (like a book index).
 *
 * We index the fields we filter by most: status, source, email, createdBy.
 */
leadSchema.index({ status: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ email: 1 });
leadSchema.index({ createdBy: 1 });
// Compound index for common filter combination
leadSchema.index({ createdBy: 1, status: 1, source: 1 });

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
