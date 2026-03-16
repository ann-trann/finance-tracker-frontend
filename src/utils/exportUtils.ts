import { Transaction } from "../types"

// ─── helpers ────────────────────────────────────────────────────────────────

/** Escape a cell value for CSV (wrap in quotes if it contains comma / quote / newline) */
const csvCell = (value: unknown): string => {
  const str = value === null || value === undefined ? "" : String(value)
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

/** Trigger a browser download for a Blob */
const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/** Format a date string / Date object to YYYY-MM-DD */
const fmtDate = (d: string | Date | undefined) =>
  d ? new Date(d).toISOString().slice(0, 10) : ""

// ─── column definitions ──────────────────────────────────────────────────────

type Col = { header: string; value: (t: Transaction) => unknown }

const COLUMNS: Col[] = [
  { header: "ID",          value: (t) => t.id },
  { header: "Date",        value: (t) => fmtDate(t.date) },
  { header: "Description", value: (t) => t.description ?? "" },
  { header: "Category",    value: (t) => t.category?.name ?? "" },
  { header: "Type",        value: (t) => t.type },
  { header: "Amount",      value: (t) => Number(t.amount) },
  { header: "Wallet",      value: (t) => t.wallet?.name ?? t.walletId },
  { header: "Created At",  value: (t) => fmtDate(t.createdAt) },
]

// ─── CSV export ──────────────────────────────────────────────────────────────

/**
 * Export an array of transactions to a UTF-8 CSV file.
 * A BOM (0xEF 0xBB 0xBF) is prepended so Excel opens it correctly.
 */
export const exportToCSV = (
  transactions: Transaction[],
  filename = "transactions.csv"
) => {
  const header = COLUMNS.map((c) => csvCell(c.header)).join(",")
  const rows = transactions.map((t) =>
    COLUMNS.map((c) => csvCell(c.value(t))).join(",")
  )
  const csvContent = [header, ...rows].join("\r\n")

  // UTF-8 BOM so Excel renders Vietnamese characters correctly
  const BOM = "\uFEFF"
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" })
  downloadBlob(blob, filename)
}

// ─── Excel (XLSX) export ─────────────────────────────────────────────────────

/**
 * Build a minimal XLSX file from scratch — no third-party library required.
 *
 * The XLSX format is a ZIP archive containing XML files.
 * We use the JSZip-free approach: produce a single-sheet workbook as a
 * data-URI encoded Blob via the SpreadsheetML (XML Spreadsheet 2003)
 * format, which Excel / LibreOffice / Google Sheets all open natively.
 *
 * For a proper multi-sheet / styled XLSX without a bundler plugin you can
 * swap this for the `xlsx` (SheetJS) npm package — see the comment below.
 */
export const exportToExcel = (
  transactions: Transaction[],
  filename = "transactions.xlsx"
) => {
  // ── Option A: pure SpreadsheetML (no dependencies) ───────────────────────
  // Produces an .xls-compatible XML that Excel opens as a workbook.
  // Rename to .xls if you prefer, but most modern apps accept it as .xlsx.
  const xmlRows = [
    // Header row
    `  <Row ss:StyleID="header">\n` +
      COLUMNS.map(
        (c) => `    <Cell><Data ss:Type="String">${escXml(c.header)}</Data></Cell>`
      ).join("\n") +
      `\n  </Row>`,
    // Data rows
    ...transactions.map(
      (t) =>
        `  <Row>\n` +
        COLUMNS.map((c) => {
          const val = c.value(t)
          const isNum = typeof val === "number"
          return `    <Cell><Data ss:Type="${isNum ? "Number" : "String"}">${escXml(val)}</Data></Cell>`
        }).join("\n") +
        `\n  </Row>`
    ),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook
  xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="header">
      <Font ss:Bold="1"/>
      <Interior ss:Color="#4F81BD" ss:Pattern="Solid"/>
      <Font ss:Color="#FFFFFF" ss:Bold="1"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="Transactions">
    <Table>
${xmlRows.join("\n")}
    </Table>
  </Worksheet>
</Workbook>`

  const blob = new Blob([xml], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  })
  downloadBlob(blob, filename)

  // ── Option B: SheetJS (xlsx npm package) — richer XLSX, requires install ──
  // Uncomment and `npm install xlsx` to use:
  //
  // import * as XLSX from "xlsx"
  // const ws = XLSX.utils.json_to_sheet(
  //   transactions.map((t) =>
  //     Object.fromEntries(COLUMNS.map((c) => [c.header, c.value(t)]))
  //   )
  // )
  // const wb = XLSX.utils.book_new()
  // XLSX.utils.book_append_sheet(wb, ws, "Transactions")
  // XLSX.writeFile(wb, filename)
}

/** Escape special XML characters */
const escXml = (value: unknown): string => {
  const s = value === null || value === undefined ? "" : String(value)
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}