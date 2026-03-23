# VanshVriksha (वंशवृक्ष) — Family Network

## Project Overview
A private, interactive family tree web application for the Dhakephalkar family. The tree is the navigation layer for a living repository of photos, stories, and memories about family members. NOT a genealogy research tool — this is a family knowledge base.

**Current scope**: 57 family members across 4 generations (starting from great-grandfather who had 5 sons and 1 daughter).

## Tech Stack
- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (email/password for admins)
- **File Storage**: Supabase Storage (photos bucket)
- **Tree Visualization**: D3.js (`d3-hierarchy`, `d3-zoom`, `d3-selection`)
- **Deployment**: Vercel

## Architecture
```
app/
├── page.tsx                  # Landing page with hero + "View Tree" CTA
├── layout.tsx                # Root layout with metadata, fonts
├── tree/
│   └── page.tsx              # Interactive family tree (D3.js)
├── person/
│   └── [id]/
│       └── page.tsx          # Person profile page
├── admin/
│   ├── page.tsx              # Admin dashboard (protected)
│   ├── login/
│   │   └── page.tsx          # Login page
│   ├── add/
│   │   └── page.tsx          # Add person form
│   └── edit/
│       └── [id]/
│           └── page.tsx      # Edit person form
├── api/                      # API routes if needed
└── globals.css               # Global styles + Tailwind

components/
├── tree/
│   ├── FamilyTree.tsx        # Main D3.js tree component
│   ├── TreeNode.tsx          # Individual node (photo + name)
│   └── TreeTooltip.tsx       # Hover tooltip
├── person/
│   ├── PersonCard.tsx        # Compact person display
│   ├── PhotoGallery.tsx      # Photo grid
│   └── StoryList.tsx         # Stories/memories list
├── admin/
│   ├── PersonForm.tsx        # Add/edit person form
│   ├── PhotoUpload.tsx       # Drag-drop photo upload
│   └── RelationshipManager.tsx # Set parents/spouse
├── ui/                       # Shared UI primitives
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Modal.tsx
└── layout/
    ├── Header.tsx
    └── Footer.tsx

lib/
├── supabase/
│   ├── client.ts             # Browser Supabase client
│   ├── server.ts             # Server-side Supabase client
│   └── middleware.ts         # Auth middleware
├── queries/
│   ├── people.ts             # CRUD for people table
│   ├── relationships.ts     # CRUD for relationships
│   ├── photos.ts            # CRUD for photos + storage
│   └── stories.ts           # CRUD for stories
├── tree/
│   └── buildHierarchy.ts    # Transform flat data → D3 tree hierarchy
└── utils.ts                  # Shared utilities

types/
└── database.ts               # TypeScript interfaces for all tables
```

## Database Schema
Four tables in Supabase PostgreSQL:
- `people` — person records (name, dates, bio, photo_url, generation, etc.)
- `relationships` — parent_child and spouse links between people
- `photos` — additional photos per person (stored in Supabase Storage)
- `stories` — text memories/stories about a person

RLS: Public read access, authenticated write access.

## Coding Rules
- Use TypeScript strict mode throughout
- Use Next.js App Router conventions (server components by default, 'use client' only when needed)
- Use Tailwind CSS utility classes — no custom CSS unless absolutely necessary
- Prefer server components for data fetching, client components for interactivity
- Use `@supabase/ssr` for server-side Supabase client
- All data fetching in `lib/queries/` — components never call Supabase directly
- Use conventional commit messages: feat:, fix:, style:, refactor:, docs:
- Keep components small and focused — extract when > 100 lines
- Handle loading and error states for all async operations

## Design Guidelines
- Warm, elegant aesthetic — not corporate or clinical
- Color palette: Deep forest green (#1B4332) as primary, warm gold (#D4A843) as accent, cream (#FDF8F0) as background
- Font: Inter for body text, Playfair Display for headings (gives it a heritage feel)
- Tree nodes: circular photo avatars with subtle border, name below
- Responsive: design for desktop first, ensure tablet works, mobile is stretch goal
- Smooth animations on tree interactions (zoom, pan, node hover)

## Common Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npx supabase gen types typescript --project-id <id> > types/supabase.ts  # Generate types from DB
```

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=       # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # Supabase anon/public key
SUPABASE_SERVICE_ROLE_KEY=      # Server-side only, never expose to client
```

## Important Context
- This is a demo/MVP to share with family (specifically uncle) for feedback
- Prioritize visual polish over feature completeness
- The tree visualization is the hero feature — it must look beautiful and feel smooth
- 57 people, 4 generations — the tree should be comfortably navigable at this scale
- Admin functionality is secondary — simple forms are fine
- No need for real-time features, complex caching, or over-engineering
- When compacting, preserve the full list of modified files and current implementation status
