"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SingleEntryFormProps {
  onGenerate: (firstName: string, middleName: string, lastName: string, domain: string) => void
}

export function SingleEntryForm({ onGenerate }: SingleEntryFormProps) {
  const [firstName, setFirstName] = useState("")
  const [middleName, setMiddleName] = useState("")
  const [lastName, setLastName] = useState("")
  const [domain, setDomain] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (firstName && lastName && domain) {
      onGenerate(firstName, middleName, lastName, domain)
    }
  }

  const isValid = firstName.trim() && lastName.trim() && domain.trim()

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-muted-foreground text-sm">
            First Name
          </Label>
          <Input
            id="firstName"
            placeholder="Tim"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="bg-secondary border-border"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="middleName" className="text-muted-foreground text-sm">
            Middle Name <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="middleName"
            placeholder="David"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
            className="bg-secondary border-border"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-muted-foreground text-sm">
            Last Name
          </Label>
          <Input
            id="lastName"
            placeholder="Cook"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="bg-secondary border-border"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="domain" className="text-muted-foreground text-sm">
            Domain
          </Label>
          <Input
            id="domain"
            placeholder="spacex.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="bg-secondary border-border"
          />
        </div>
      </div>
      <Button type="submit" disabled={!isValid} className="w-full md:w-auto">
        Generate Emails
      </Button>
    </form>
  )
}
