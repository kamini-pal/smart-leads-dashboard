/**
 * CSV Export Utility.
 *
 * HOW CSV WORKS (beginner explanation):
 * CSV = Comma Separated Values. It's a plain text format that
 * spreadsheet apps (Excel, Google Sheets) can open.
 *
 * Each line is a row, values are separated by commas:
 *   Name,Email,Status,Source,CreatedAt
 *   Rahul Sharma,rahul@gmail.com,new,website,2026-05-19
 *   Priya Singh,priya@gmail.com,contacted,instagram,2026-05-19
 *
 * EDGE CASES WE HANDLE:
 * - Values containing commas → wrapped in quotes ("New York, USA")
 * - Values containing quotes → escaped with double quotes ("He said ""hello""")
 * - Values containing newlines → wrapped in quotes
 */

interface CsvColumn {
  header: string;   // Column header displayed in CSV
  key: string;      // Key to access from the data object
}

/**
 * Converts an array of objects into a CSV string.
 *
 * @param data - Array of objects (e.g., lead documents from MongoDB)
 * @param columns - Which fields to include and their header names
 * @returns CSV string ready to send as a file download
 */
const generateCsv = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>[],
  columns: CsvColumn[]
): string => {
  // Row 1: Column headers
  const headerRow = columns.map((col) => escapeField(col.header)).join(',');

  // Remaining rows: Data values
  const dataRows = data.map((item) => {
    return columns
      .map((col) => {
        const value = item[col.key];
        // Convert dates to readable format, handle null/undefined
        if (value instanceof Date) {
          return escapeField(value.toISOString().split('T')[0]); // YYYY-MM-DD
        }
        return escapeField(String(value ?? ''));
      })
      .join(',');
  });

  return [headerRow, ...dataRows].join('\n');
};

/**
 * Escapes a single CSV field value.
 * If the value contains commas, quotes, or newlines, wrap it in quotes.
 */
const escapeField = (value: string): string => {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    // Escape internal quotes by doubling them
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

/** Column definitions for Lead CSV export */
export const leadCsvColumns: CsvColumn[] = [
  { header: 'Name', key: 'name' },
  { header: 'Email', key: 'email' },
  { header: 'Status', key: 'status' },
  { header: 'Source', key: 'source' },
  { header: 'Created At', key: 'createdAt' },
];

export default generateCsv;
