import { EmailPermutator } from "@/components/email-permutator"
import { Mail } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-secondary mb-4">
            <Mail className="h-8 w-8 text-accent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight text-balance">
            Email Permutator
          </h1>
          <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto text-pretty">
            Generate all possible email combinations from first name, last name,
            and domain. Perfect for sales prospecting and outreach.
          </p>
        </header>

        <EmailPermutator />

        <footer className="mt-16 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground text-sm">
            Generates email permutation patterns per contact
          </p>
        </footer>
      </div>
    </main>
  )
}
