# عقاري — Aqari MVP 🏠

AI-powered Saudi real estate marketing description generator. Paste property details, get professional Arabic/English descriptions optimized for the Saudi market.

## Features

- **AI Description Generator** — Turn raw property specs into polished real estate listings
- **Bilingual Arabic/English** — Generates professional descriptions in both languages
- **Sector-Specific Templates** — Tailored for Saudi real estate (Aqar, Bayut, Property Finder)
- **Preview & Download** — View formatted output, copy to clipboard
- **Settings Panel** — Control tone, language, and output format
- **Smart Degradation** — DeepSeek → OpenAI → Demo (works without any API keys)

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI:** DeepSeek (primary), OpenAI (fallback)
- **Runtime:** Edge

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env.local

# 3. Run dev server
npm run dev
# → http://localhost:3000
```

## Local Development

```bash
npm run dev        # Dev server
npm run build      # Production build
npm run start      # Start production
```

## 🧪 Demo Mode

عقاري works fully without any API keys. Simply run `npm run dev` and use the app:

- The generator returns high-quality Arabic mock descriptions
- All UI features are functional (settings, preview, copy)
- No external services required for development/testing

Add `DEEPSEEK_API_KEY` or `OPENAI_API_KEY` for live AI generation.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DEEPSEEK_API_KEY` | No | DeepSeek API key (primary AI provider) |
| `OPENAI_API_KEY` | No | OpenAI fallback if DeepSeek unavailable |

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── generate/     # AI generation endpoint
│   ├── preview/          # Generated content preview
│   ├── settings/         # User preferences
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page (property input form)
├── components/           # React components
└── lib/
    └── prompts.ts        # AI prompt templates (Saudi real estate)
```

## Deployment

### Vercel

```bash
vercel
```

No additional configuration needed beyond setting API keys in the Vercel dashboard.

## Known Limitations

- PDF output is client-side only (print-to-PDF)
- No image upload for properties
- No user accounts or history
- Single-use generation (no batch processing)

## License

Private — All rights reserved.

---

Built with ❤️ for the Saudi real estate market 🇸🇦
