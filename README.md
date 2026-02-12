# Email Permutator

A modern, privacy-focused email permutation tool built with Next.js. Generate all possible email combinations for sales prospecting purely on the client-side.

![Email Permutator App Screenshot](app/opengraph-image.png)

## Features

- **Privacy First**: All processing runs locally in your browser. No data is ever sent to a server.
- **Single Entry Mode**: Quickly generate permutations for one contact.
- **Bulk Upload**: Drag & drop CSV files or copy-paste data directly.
- **Smart Parsing**: Automatically detects CSV headers and handles messy data.
- **Export Options**: Download results as a CSV or copy directly to clipboard.
- **Responsive Design**: Works on desktop and mobile.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/Legionxoxo/email-combinator.git
    cd email-combinator
    ```
2.  Install dependencies:
    ```bash
    pnpm install
    ```
3.  Run the development server:
    ```bash
    pnpm dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## Usage

### Bulk Upload format
The app expects a CSV with the following columns (headers are case-insensitive):
- `first_name`
- `last_name`
- `domain`
- `middle_name` (optional)

Example:
```csv
first_name,last_name,domain
Elon,Musk,tesla.com
Tim,Cook,apple.com
```

## Large Dataset Handling & Roadmap

Currently, the application is optimized for small to medium datasets (up to ~2,000 rows).

### Current Limitations
- **Visual Performance**: Rendering 10,000+ rows (resulting in ~300,000+ email DOM elements) can cause browser lag or freezing.
- **Synchronous Processing**: Very large files block the main thread during the initial permutation generation.

### Future Implementation Plan (High Scale)
We have a roadmap to support enterprise-scale lists (10k - 100k rows):

1.  **Virtualized Rendering**: Implement `react-window` or `tanstack-virtual` to only render rows currently visible on the screen. This will allow smooth scrolling through millions of generated emails with zero lag.
2.  **Async/Web Worker Processing**: Move the heavy permutation logic to a Web Worker or chunk the processing using `requestIdleCallback`. This ensures the UI remains responsive even while crunching 50k contacts.
3.  **Streaming Exports**: Generate the CSV download file in chunks to avoid memory spikes.
