"use client"

import { Button } from "@/components/ui/button"
import { Copy, Download, Check, AlertTriangle, Info } from "lucide-react"
import { useState } from "react"
import type { PermutationResult, ParseResult } from "@/lib/email-permutator"
import { generateOutputCSV } from "@/lib/email-permutator"

interface ResultsTableProps {
  results: PermutationResult[]
  parseStats?: Omit<ParseResult, 'contacts'> | null
}

export function ResultsTable({ results, parseStats }: ResultsTableProps) {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null)

  const totalEmails = results.reduce((acc, r) => acc + r.emails.length, 0)

  const copyEmail = async (email: string, index: string) => {
    await navigator.clipboard.writeText(email)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const copyAllEmails = async () => {
    const allEmails = results.flatMap((r) => r.emails).join("\n")
    await navigator.clipboard.writeText(allEmails)
    setCopiedIndex("all")
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const downloadCSV = () => {
    const csv = generateOutputCSV(results)
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "email-permutations.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (results.length === 0 && !parseStats) return null

  return (
    <div className="space-y-4">
      {/* Parse Stats Banner */}
      {parseStats && (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Info className="h-4 w-4 text-accent" />
              <span className="text-foreground font-medium">
                Imported {results.length} of {parseStats.totalRows} rows
              </span>
            </div>
            {parseStats.skippedRows > 0 && (
              <span className="text-yellow-500">
                • {parseStats.skippedRows} skipped (missing required fields)
              </span>
            )}
            {parseStats.duplicatesRemoved > 0 && (
              <span className="text-muted-foreground">
                • {parseStats.duplicatesRemoved} duplicate{parseStats.duplicatesRemoved > 1 ? 's' : ''} removed
              </span>
            )}
          </div>
          {parseStats.errors.length > 0 && (
            <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm">
              <div className="flex items-center gap-1.5 mb-1">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-yellow-500 font-medium">
                  CSV Parsing Warnings
                </span>
              </div>
              <ul className="list-disc list-inside text-yellow-400/80 text-xs space-y-0.5">
                {parseStats.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {results.length === 0 && parseStats && (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">
            No valid contacts found. Please check your CSV format.
          </p>
        </div>
      )}

      {results.length > 0 && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Results</h2>
              <p className="text-muted-foreground text-sm">
                {totalEmails} email permutations from {results.length} contact
                {results.length > 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={copyAllEmails}>
                {copiedIndex === "all" ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                Copy All
              </Button>
              <Button onClick={downloadCSV}>
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {results.map((result, resultIndex) => (
              <div
                key={`${result.firstName}-${result.lastName}-${result.domain}`}
                className="rounded-lg border border-border bg-card overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-border bg-secondary/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-foreground">
                        {result.firstName} {result.middleName && `${result.middleName} `}{result.lastName}
                      </span>
                      <span className="text-muted-foreground ml-2">
                        @{result.domain}
                      </span>
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {result.emails.length} variations
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                    {result.emails.map((email, emailIndex) => (
                      <div
                        key={email}
                        className="group flex items-center justify-between rounded-md bg-secondary px-3 py-2 text-sm hover:bg-secondary/80 transition-colors"
                      >
                        <span className="font-mono text-foreground truncate mr-2">
                          {email}
                        </span>
                        <button
                          onClick={() =>
                            copyEmail(email, `${resultIndex}-${emailIndex}`)
                          }
                          className="text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                          aria-label={`Copy ${email}`}
                        >
                          {copiedIndex === `${resultIndex}-${emailIndex}` ? (
                            <Check className="h-4 w-4 text-accent" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
