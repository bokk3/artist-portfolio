# Music Artist Portfolio

## Project Mission

Build a stunning, modern music portfolio website that surpasses SoundCloud's design, featuring music releases, blog, events, gallery, and a password-protected admin panel. The design should be "Apple Music meets Bandcamp" with a unique, high-end aesthetic.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Runtime**: Node.js 24-alpine
- **Language**: TypeScript (strict mode)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Animations**: Framer Motion
- **Database**: SQLite (better-sqlite3)
- **Audio**: WaveSurfer.js or Peaks.js
- **Editor**: TipTap or Lexical
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## Design Philosophy

- **Visual Style**: Bold, large typography, generous white space, glassmorphism, and smooth animations (60fps).
- **Color Palette**:
  - Option 1: Deep purple (#6B46C1) + Electric blue (#3B82F6) + Coral (#FF6B6B)
  - Option 2: Forest green (#2D6A4F) + Gold (#FFD700) + Cream (#F5F5DC)
  - Option 3: Midnight blue (#0A1929) + Neon pink (#FF10F0) + Cyan (#00D9FF)
  - Option 4: Burgundy (#800020) + Sage green (#9CAF88) + Warm beige (#E8DCC4)
    _(User to select one, defaulting to Option 3 for now as it fits "modern/stunning")_
- **Typography**:
  - Headings: "Clash Display", "Syne", or "Cabinet Grotesk"
  - Body: "Inter", "DM Sans", or "Outfit"
- **Responsiveness**: Mobile-first, 100vh hero on desktop.

## Core Features

1. **Music Player**: Animated waveforms, persistent footer player, playlist support.
2. **Video Support**: Embedded players, video gallery.
3. **Releases**: Grid layout for albums/singles.
4. **Blog**: Rich text posts, tags, share buttons.
5. **Events**: Tour dates, ticket links, past events archive.
6. **Gallery**: Masonry layout, lightbox.
7. **Admin Panel**: Password-protected, file uploads, content management.

## Project Structure

- `/app`: Next.js App Router pages and layouts.
- `/components`: Reusable UI components.
- `/lib`: Utility functions and database configuration.
- `/public/uploads`: Local storage for user uploads (audio, images, videos).
- `/db`: SQLite database file and schema.
