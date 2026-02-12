"use client"

import React from "react"

import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, FileSpreadsheet } from "lucide-react"

interface BulkUploadFormProps {
  onUpload: (csvContent: string) => void
}

export function BulkUploadForm({ onUpload }: BulkUploadFormProps) {
  const [csvContent, setCsvContent] = useState("")
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file && (file.type === "text/csv" || file.name.endsWith(".csv"))) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const content = event.target?.result as string
          setCsvContent(content)
          onUpload(content)
        }
        reader.readAsText(file)
      }
    },
    [onUpload]
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        setCsvContent(content)
        onUpload(content)
      }
      reader.readAsText(file)
    }
  }

  const handlePaste = () => {
    if (csvContent.trim()) {
      onUpload(csvContent)
    }
  }

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? "border-accent bg-accent/10"
            : "border-border hover:border-muted-foreground"
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 rounded-full bg-secondary">
            <FileSpreadsheet className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-foreground font-medium">
              Drop your CSV file here
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              or click to browse
            </p>
          </div>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
            id="csv-upload"
          />
          <Button variant="secondary" asChild className="mt-2">
            <label htmlFor="csv-upload" className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </label>
          </Button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or paste CSV content
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="csvContent"
          className="text-muted-foreground text-sm"
        >
          CSV Content
        </Label>
        <Textarea
          id="csvContent"
          placeholder="first_name,middle_name,last_name,domain
Tim,David,Cook,spacex.com
Elon,Reeve,Musk,tesla.com"
          value={csvContent}
          onChange={(e) => setCsvContent(e.target.value)}
          className="bg-secondary border-border min-h-[150px] font-mono text-sm"
        />
        <Button
          onClick={handlePaste}
          disabled={!csvContent.trim()}
          className="w-full md:w-auto"
        >
          Process CSV
        </Button>
      </div>

      <div className="rounded-lg bg-secondary/50 p-4 text-sm">
        <p className="font-medium text-foreground mb-2">Expected CSV Format:</p>
        <code className="text-muted-foreground block font-mono text-xs">
          first_name,middle_name,last_name,domain
          <br />
          Tim,David,Cook,spacex.com
          <br />
          Elon,Reeve,Musk,tesla.com
        </code>
        <p className="text-muted-foreground mt-2 text-xs">
          Middle name is optional. Rows without a domain will be skipped.
        </p>
      </div>
    </div>
  )
}
