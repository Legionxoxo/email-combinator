import Papa from 'papaparse'

export interface ContactInput {
  firstName: string
  middleName: string
  lastName: string
  domain: string
}

export interface PermutationResult {
  firstName: string
  middleName: string
  lastName: string
  domain: string
  emails: string[]
}

export function cleanDomain(domain: string): string {
  return domain
    .trim()
    .replace(/^https?:\/\//, '') // Remove http:// or https://
    .replace(/^www\./, '')       // Remove www.
    .replace(/\/$/, '')           // Remove trailing slash
    .toLowerCase()
}

export function generateEmailPermutations(
  firstName: string,
  middleName: string,
  lastName: string,
  domain: string
): string[] {
  const f = firstName.toLowerCase().trim()
  const m = middleName.toLowerCase().trim()
  const l = lastName.toLowerCase().trim()
  const d = cleanDomain(domain)

  if (!f || !l || !d) return []

  const fInitial = f[0]
  const mInitial = m ? m[0] : ""
  const lInitial = l[0]

  const permutations: string[] = []

  // First name only
  permutations.push(`${f}@${d}`)

  // Last name only
  permutations.push(`${l}@${d}`)

  // First + Middle (if middle exists)
  if (m) {
    permutations.push(`${f}${m}@${d}`)
    permutations.push(`${f}.${m}@${d}`)
    permutations.push(`${fInitial}${m}@${d}`)
    permutations.push(`${fInitial}.${m}@${d}`)
    permutations.push(`${f}${mInitial}@${d}`)
    permutations.push(`${f}.${mInitial}@${d}`)
    permutations.push(`${fInitial}${mInitial}@${d}`)
    permutations.push(`${fInitial}.${mInitial}@${d}`)
  }

  // First + Last combinations
  permutations.push(`${f}${l}@${d}`)
  permutations.push(`${f}.${l}@${d}`)
  permutations.push(`${fInitial}${l}@${d}`)
  permutations.push(`${fInitial}.${l}@${d}`)
  permutations.push(`${f}${lInitial}@${d}`)
  permutations.push(`${f}.${lInitial}@${d}`)
  permutations.push(`${fInitial}${lInitial}@${d}`)
  permutations.push(`${fInitial}.${lInitial}@${d}`)

  // Middle + Last (if middle exists)
  if (m) {
    permutations.push(`${m}${l}@${d}`)
    permutations.push(`${m}.${l}@${d}`)
    permutations.push(`${mInitial}${l}@${d}`)
    permutations.push(`${mInitial}.${l}@${d}`)
    permutations.push(`${m}${lInitial}@${d}`)
    permutations.push(`${m}.${lInitial}@${d}`)
    permutations.push(`${mInitial}${lInitial}@${d}`)
    permutations.push(`${mInitial}.${lInitial}@${d}`)
  }

  // Last + First combinations
  permutations.push(`${l}${f}@${d}`)
  permutations.push(`${l}.${f}@${d}`)
  permutations.push(`${l}${fInitial}@${d}`)
  permutations.push(`${l}.${fInitial}@${d}`)
  permutations.push(`${lInitial}${f}@${d}`)
  permutations.push(`${lInitial}.${f}@${d}`)
  permutations.push(`${lInitial}${fInitial}@${d}`)
  permutations.push(`${lInitial}.${fInitial}@${d}`)

  // Last + Middle (if middle exists)
  if (m) {
    permutations.push(`${l}${m}@${d}`)
    permutations.push(`${l}.${m}@${d}`)
    permutations.push(`${l}${mInitial}@${d}`)
    permutations.push(`${l}.${mInitial}@${d}`)
    permutations.push(`${lInitial}${m}@${d}`)
    permutations.push(`${lInitial}.${m}@${d}`)
    permutations.push(`${lInitial}${mInitial}@${d}`)
    permutations.push(`${lInitial}.${mInitial}@${d}`)
  }

  // Hyphen combinations
  permutations.push(`${f}-${l}@${d}`)
  permutations.push(`${fInitial}-${l}@${d}`)
  permutations.push(`${f}-${lInitial}@${d}`)
  permutations.push(`${fInitial}-${lInitial}@${d}`)
  permutations.push(`${l}-${f}@${d}`)
  permutations.push(`${l}-${fInitial}@${d}`)
  permutations.push(`${lInitial}-${f}@${d}`)
  permutations.push(`${lInitial}-${fInitial}@${d}`)

  // Hyphen combinations with middle (if middle exists)
  if (m) {
    permutations.push(`${f}-${m}@${d}`)
    permutations.push(`${f}-${mInitial}@${d}`)
    permutations.push(`${m}-${l}@${d}`)
    permutations.push(`${m}-${lInitial}@${d}`)
    permutations.push(`${f}-${m}-${l}@${d}`)
    permutations.push(`${fInitial}-${m}-${l}@${d}`)
    permutations.push(`${f}-${mInitial}-${l}@${d}`)
    permutations.push(`${fInitial}-${mInitial}-${l}@${d}`)
  }

  // Underscore combinations
  permutations.push(`${f}_${l}@${d}`)
  permutations.push(`${fInitial}_${l}@${d}`)
  permutations.push(`${f}_${lInitial}@${d}`)
  permutations.push(`${fInitial}_${lInitial}@${d}`)
  permutations.push(`${l}_${f}@${d}`)
  permutations.push(`${l}_${fInitial}@${d}`)
  permutations.push(`${lInitial}_${f}@${d}`)
  permutations.push(`${lInitial}_${fInitial}@${d}`)

  // Underscore combinations with middle (if middle exists)
  if (m) {
    permutations.push(`${f}_${m}@${d}`)
    permutations.push(`${f}_${mInitial}@${d}`)
    permutations.push(`${m}_${l}@${d}`)
    permutations.push(`${m}_${lInitial}@${d}`)
    permutations.push(`${f}_${m}_${l}@${d}`)
    permutations.push(`${fInitial}_${m}_${l}@${d}`)
    permutations.push(`${f}_${mInitial}_${l}@${d}`)
    permutations.push(`${fInitial}_${mInitial}_${l}@${d}`)
  }

  // Remove duplicates
  return [...new Set(permutations)]
}


export interface ParseResult {
  contacts: ContactInput[]
  totalRows: number
  skippedRows: number
  duplicatesRemoved: number
  errors: string[]
}

export function parseCSV(content: string): ParseResult {
  const result = Papa.parse<Record<string, string>>(content, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header: string) => header.toLowerCase().trim()
  })

  const errors: string[] = []

  // Capture papaparse errors
  if (result.errors && result.errors.length > 0) {
    for (const err of result.errors) {
      const rowInfo = err.row !== undefined ? ` (row ${err.row + 2})` : ''
      errors.push(`${err.message}${rowInfo}`)
    }
  }

  if (!result.data || result.data.length === 0) {
    return { contacts: [], totalRows: 0, skippedRows: 0, duplicatesRemoved: 0, errors }
  }

  const totalRows = result.data.length
  const allContacts: ContactInput[] = []
  let skippedRows = 0

  for (const row of result.data) {
    const firstName = (
      row['first_name'] || row['firstname'] || row['first name'] || ''
    ).trim()
    const middleName = (
      row['middle_name'] || row['middlename'] || row['middle name'] || ''
    ).trim()
    const lastName = (
      row['last_name'] || row['lastname'] || row['last name'] || ''
    ).trim()
    const domainRaw = (
      row['domain'] || row['company domain'] || row['website'] || ''
    ).trim()

    const domain = cleanDomain(domainRaw)

    if (firstName && lastName && domain) {
      allContacts.push({ firstName, middleName, lastName, domain })
    } else {
      skippedRows++
    }
  }

  // Deduplicate by firstName+lastName+domain (case-insensitive)
  const seen = new Set<string>()
  const contacts: ContactInput[] = []
  let duplicatesRemoved = 0

  for (const contact of allContacts) {
    const key = `${contact.firstName.toLowerCase()}|${contact.lastName.toLowerCase()}|${contact.domain.toLowerCase()}`
    if (seen.has(key)) {
      duplicatesRemoved++
    } else {
      seen.add(key)
      contacts.push(contact)
    }
  }

  return { contacts, totalRows, skippedRows, duplicatesRemoved, errors }
}

export function generateOutputCSV(results: PermutationResult[]): string {
  const rows = results.flatMap((result) =>
    result.emails.map((email) => ({
      'First Name': result.firstName,
      'Middle Name': result.middleName,
      'Last Name': result.lastName,
      'Domain': result.domain,
      'Email': email,
    }))
  )

  return Papa.unparse(rows)
}
