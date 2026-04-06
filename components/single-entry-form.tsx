"use client"

import React from "react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { cleanDomain } from "@/lib/email-permutator"

const singleEntrySchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().default(""),
  lastName: z.string().min(1, "Last name is required"),
  domain: z.string().min(1, "Domain is required"),
})

type SingleEntryFormValues = z.infer<typeof singleEntrySchema>

interface SingleEntryFormProps {
  onGenerate: (firstName: string, middleName: string, lastName: string, domain: string) => void
}

export function SingleEntryForm({ onGenerate }: SingleEntryFormProps) {
  const form = useForm<SingleEntryFormValues>({
    resolver: zodResolver(singleEntrySchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      domain: "",
    },
    mode: "onBlur",
  })

  const onSubmit = (values: SingleEntryFormValues) => {
    onGenerate(values.firstName, values.middleName, values.lastName, cleanDomain(values.domain))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <Label htmlFor="firstName" className="text-muted-foreground text-sm">
                  First Name
                </Label>
                <FormControl>
                  <Input
                    id="firstName"
                    placeholder="Tim"
                    {...field}
                    className="bg-secondary border-border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="middleName"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <Label htmlFor="middleName" className="text-muted-foreground text-sm">
                  Middle Name <span className="text-muted-foreground">(optional)</span>
                </Label>
                <FormControl>
                  <Input
                    id="middleName"
                    placeholder="David"
                    {...field}
                    className="bg-secondary border-border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <Label htmlFor="lastName" className="text-muted-foreground text-sm">
                  Last Name
                </Label>
                <FormControl>
                  <Input
                    id="lastName"
                    placeholder="Cook"
                    {...field}
                    className="bg-secondary border-border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="domain"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <Label htmlFor="domain" className="text-muted-foreground text-sm">
                  Domain
                </Label>
                <FormControl>
                  <Input
                    id="domain"
                    placeholder="spacex.com"
                    {...field}
                    className="bg-secondary border-border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full md:w-auto">
          Generate Emails
        </Button>
      </form>
    </Form>
  )
}
