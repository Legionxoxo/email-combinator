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
    .replace(/:.*$/, '')          // Strip port (e.g. tesla.com:8080 → tesla.com)
    .toLowerCase()
}

/**
 * Splits a name field on whitespace into individual lowercase words.
 * e.g. "Mary Jane" → ["mary", "jane"], "K K " → ["k", "k"]
 */
function splitWords(name: string): string[] {
  return name.trim().toLowerCase().split(/\s+/).filter(Boolean)
}

/**
 * From a list of words belonging to one name field, produce all usable "atoms":
 * - Each individual word
 * - Each word's initial
 * - If multiple words: joined, dot-joined, hyphen-joined, underscore-joined, combined initials
 */
function getNameAtoms(words: string[]): { full: string[]; initials: string[] } {
  if (words.length === 0) return { full: [], initials: [] }

  const fullAtoms: string[] = []
  const initialAtoms: string[] = []

  // Each individual word and its initial
  for (const w of words) {
    fullAtoms.push(w)
    initialAtoms.push(w[0])
  }

  // Multi-word combinations
  if (words.length > 1) {
    fullAtoms.push(words.join(''))        // maryjane
    fullAtoms.push(words.join('.'))        // mary.jane
    fullAtoms.push(words.join('-'))        // mary-jane
    fullAtoms.push(words.join('_'))        // mary_jane
    initialAtoms.push(words.map(w => w[0]).join(''))  // mj
  }

  // Deduplicate
  return {
    full: [...new Set(fullAtoms)],
    initials: [...new Set(initialAtoms)],
  }
}

/**
 * Sanitizes a name field to prevent XSS and invalid characters.
 * Removes HTML tags, control characters, and leading/trailing whitespace.
 */
function sanitizeNameInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .trim()
}

/**
 * Validates that a generated email is a legitimate email format.
 * No spaces, exactly one @, valid characters in local part, valid domain.
 */
function isValidEmail(email: string): boolean {
  // Must not contain spaces
  if (email.includes(' ')) return false
  // Basic structural validation: local@domain.tld
  // Local part: alphanumeric, dots, hyphens, underscores, plus signs
  const regex = /^[a-z0-9]([a-z0-9._+-]*[a-z0-9])?@[a-z0-9]([a-z0-9.-]*[a-z0-9])?\.[a-z]{2,}$/
  return regex.test(email)
}

/**
 * Helper to add two-part permutations (A+B patterns) using all separators.
 */
function addTwoPartPermutations(
  permutations: string[],
  partsA: string[],
  partsB: string[],
  domain: string
) {
  for (const a of partsA) {
    for (const b of partsB) {
      permutations.push(`${a}${b}@${domain}`)
      permutations.push(`${a}.${b}@${domain}`)
      permutations.push(`${a}-${b}@${domain}`)
      permutations.push(`${a}_${b}@${domain}`)
    }
  }
}

export function generateEmailPermutations(
  firstName: string,
  middleName: string,
  lastName: string,
  domain: string
): string[] {
  const fWords = splitWords(firstName)
  const mWords = splitWords(middleName)
  const lWords = splitWords(lastName)
  const d = cleanDomain(domain)

  if (fWords.length === 0 || lWords.length === 0 || !d) return []

  const fAtoms = getNameAtoms(fWords)
  const mAtoms = getNameAtoms(mWords)
  const lAtoms = getNameAtoms(lWords)

  // All full+initial variants for each field
  const fAll = [...fAtoms.full, ...fAtoms.initials]
  const mAll = [...mAtoms.full, ...mAtoms.initials]
  const lAll = [...lAtoms.full, ...lAtoms.initials]

  // Single-word full atoms (length > 1, no separator chars) — these are individual
  // words. When first has multiple words and f is one of these, bare f+m+l
  // collides with two-part f="johnpaul" l="musk" → johnpaulmusk@.
  const fSingleWord = fAtoms.full.filter(
    (a) => a.length > 1 && !a.includes('-') && !a.includes('_')
  )

  const permutations: string[] = []

  // ── Single field only ──
  for (const f of fAll) {
    permutations.push(`${f}@${d}`)
  }
  for (const l of lAll) {
    permutations.push(`${l}@${d}`)
  }

  // ── First + Last combinations ──
  addTwoPartPermutations(permutations, fAll, lAll, d)

  // ── Last + First combinations ──
  addTwoPartPermutations(permutations, lAll, fAll, d)

  // ── Middle combinations (if middle exists) ──
  if (mAll.length > 0) {
    // First + Middle
    addTwoPartPermutations(permutations, fAll, mAll, d)

    // Middle + Last
    addTwoPartPermutations(permutations, mAll, lAll, d)

    // Last + Middle
    addTwoPartPermutations(permutations, lAll, mAll, d)

    // Three-part: First + Middle + Last (with separators)
    for (const f of fAll) {
      for (const m of mAll) {
        for (const l of lAll) {
          // Skip bare f+m+l when f is a single word AND first has multiple words —
          // produces "johnpaulmusk@" which duplicates two-part f="johnpaul" l="musk".
          const skipBare = fWords.length > 1 && fSingleWord.includes(f)
          if (!skipBare) {
            permutations.push(`${f}${m}${l}@${d}`)
          }
          permutations.push(`${f}.${m}.${l}@${d}`)
          permutations.push(`${f}-${m}-${l}@${d}`)
          permutations.push(`${f}_${m}_${l}@${d}`)
        }
      }
    }
  }

  // Remove duplicates and filter invalid emails
  return [...new Set(permutations)].filter(isValidEmail)
}


export interface ParseResult {
  contacts: ContactInput[]
  totalRows: number
  skippedRows: number
  duplicatesRemoved: number
  errors: string[]
}

/** Column name aliases for each field — centralizes magic strings */
const COLUMN_ALIASES = {
  firstName: ['first_name', 'firstname', 'first name'],
  middleName: ['middle_name', 'middlename', 'middle name'],
  lastName: ['last_name', 'lastname', 'last name'],
  domain: ['domain', 'company_website', 'website', 'company domain'],
} as const

/**
 * Extracts a field value from a CSV row by trying multiple column name aliases.
 */
function extractField(row: Record<string, string>, field: keyof typeof COLUMN_ALIASES): string {
  const aliases = COLUMN_ALIASES[field]
  for (const alias of aliases) {
    const value = row[alias]
    if (value !== undefined && value !== '') {
      return value
    }
  }
  return ''
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
    const firstName = sanitizeNameInput(extractField(row, 'firstName'))
    const middleName = sanitizeNameInput(extractField(row, 'middleName'))
    const lastName = sanitizeNameInput(extractField(row, 'lastName'))
    const domainRaw = extractField(row, 'domain') // Domain cleaning handled by cleanDomain below

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
