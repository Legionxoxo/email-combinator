"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SingleEntryForm } from "@/components/single-entry-form"
import { BulkUploadForm } from "@/components/bulk-upload-form"
import { ResultsTable } from "@/components/results-table"
import {
  generateEmailPermutations,
  parseCSV,
  cleanDomain,
  type PermutationResult,
  type ParseResult,
} from "@/lib/email-permutator"
import { User, FileSpreadsheet, Mail } from "lucide-react"

export function EmailPermutator() {
  const [results, setResults] = useState<PermutationResult[]>([])
  const [parseStats, setParseStats] = useState<Omit<ParseResult, 'contacts'> | null>(null)

  const handleSingleGenerate = (
    firstName: string,
    middleName: string,
    lastName: string,
    domain: string
  ) => {
    const cleanedDomain = cleanDomain(domain)
    const emails = generateEmailPermutations(firstName, middleName, lastName, cleanedDomain)
    setResults([{ firstName, middleName, lastName, domain: cleanedDomain, emails }])
    setParseStats(null)
  }

  const handleBulkUpload = (csvContent: string) => {
    const { contacts, ...stats } = parseCSV(csvContent)
    setParseStats(stats)
    const newResults: PermutationResult[] = contacts.map((contact) => ({
      ...contact,
      emails: generateEmailPermutations(
        contact.firstName,
        contact.middleName,
        contact.lastName,
        contact.domain
      ),
    }))
    setResults(newResults)
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="single" className="w-full">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger
            value="single"
            className="data-[state=active]:bg-card data-[state=active]:text-foreground"
          >
            <User className="h-4 w-4 mr-2" />
            Single Entry
          </TabsTrigger>
          <TabsTrigger
            value="bulk"
            className="data-[state=active]:bg-card data-[state=active]:text-foreground"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Bulk Upload
          </TabsTrigger>
        </TabsList>
        <TabsContent value="single" className="mt-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="h-5 w-5 text-accent" />
              <h2 className="text-lg font-medium text-foreground">
                Generate Email Permutations
              </h2>
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              Enter a first name, last name, and domain to generate all possible
              email combinations.
            </p>
            <SingleEntryForm onGenerate={handleSingleGenerate} />
          </div>
        </TabsContent>
        <TabsContent value="bulk" className="mt-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileSpreadsheet className="h-5 w-5 text-accent" />
              <h2 className="text-lg font-medium text-foreground">
                Bulk Upload
              </h2>
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              Upload a CSV file or paste content from Google Sheets. Rows
              without a domain will be skipped.
            </p>
            <BulkUploadForm onUpload={handleBulkUpload} />
          </div>
        </TabsContent>
      </Tabs>

      <ResultsTable results={results} parseStats={parseStats} />
    </div>
  )
}
