import { useState, useCallback } from "react"
import { Transaction } from "../types"
import { exportToCSV, exportToExcel } from "../utils/exportUtils"

export type ExportType = "csv" | "excel"
export type ExportStatus = "idle" | "exporting" | "done" | "error"

interface UseExportOptions {
  /** Prefix for the downloaded filename, e.g. "transactions-2024-06" */
  filenamePrefix?: string
}

interface UseExportReturn {
  exporting: ExportType | null
  status: ExportStatus
  error: string | null
  exportCSV: (data: Transaction[]) => void
  exportExcel: (data: Transaction[]) => void
}

export const useExport = (options: UseExportOptions = {}): UseExportReturn => {
  const { filenamePrefix = "transactions" } = options

  const [exporting, setExporting] = useState<ExportType | null>(null)
  const [status, setStatus] = useState<ExportStatus>("idle")
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(
    (type: ExportType, data: Transaction[]) => {
      if (exporting) return // prevent double-click

      setExporting(type)
      setStatus("exporting")
      setError(null)

      // Defer to next tick so the spinner renders before heavy work
      setTimeout(() => {
        try {
          const filename = `${filenamePrefix}-${today()}`

          if (type === "csv") {
            exportToCSV(data, `${filename}.csv`)
          } else {
            exportToExcel(data, `${filename}.xlsx`)
          }

          setStatus("done")
        } catch (err) {
          console.error("[useExport] Export failed:", err)
          setError(err instanceof Error ? err.message : "Export failed")
          setStatus("error")
        } finally {
          // Reset after a short delay so the UI can show success/error state
          setTimeout(() => {
            setExporting(null)
            setStatus("idle")
          }, 1800)
        }
      }, 50)
    },
    [exporting, filenamePrefix]
  )

  return {
    exporting,
    status,
    error,
    exportCSV: (data) => run("csv", data),
    exportExcel: (data) => run("excel", data),
  }
}

// ─── helpers ─────────────────────────────────────────────────────────────────

const today = () => new Date().toISOString().slice(0, 10) // "2024-06-15"