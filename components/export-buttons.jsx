"use client"

import { Button } from "@/components/ui/button"
import { FileJson, FileSpreadsheet } from "lucide-react"
import { exportToJSON, exportToCSV } from "@/lib/export-utils"
import { useState } from "react"

export function ExportButtons({ data, filename = "export" }) {
  const [exporting, setExporting] = useState(false)

  const handleExportJSON = () => {
    setExporting(true)
    setTimeout(() => {
      exportToJSON(data, `${filename}.json`)
      setExporting(false)
    }, 300)
  }

  const handleExportCSV = () => {
    setExporting(true)
    setTimeout(() => {
      exportToCSV(data, `${filename}.csv`)
      setExporting(false)
    }, 300)
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportJSON}
        disabled={exporting}
        className="transition-all duration-200 hover:scale-105 bg-transparent"
      >
        <FileJson className="h-4 w-4 mr-2" />
        Export JSON
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportCSV}
        disabled={exporting}
        className="transition-all duration-200 hover:scale-105 bg-transparent"
      >
        <FileSpreadsheet className="h-4 w-4 mr-2" />
        Export CSV
      </Button>
    </div>
  )
}
