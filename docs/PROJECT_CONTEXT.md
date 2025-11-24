# Music Artist Portfolio

## Project Mission

Build a stunning, modern music portfolio website that surpasses SoundCloud's design, featuring music releases, blog, events, gallery, and a password-protected admin panel. The design should be "Apple Music meets Bandcamp" with a unique, high-end aesthetic.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Runtime**: Node.js 24-alpine
- **Language**: TypeScript (strict mode)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4 + shadcn/ui (Mandatory)
- **Animations**: Framer Motion
- **Database**: SQLite (better-sqlite3)
- **Audio**: WaveSurfer.js
- **Editor**: TipTap
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## Design Philosophy

- **Visual Style**: Bold, large typography, generous white space, glassmorphism, and smooth animations (60fps).
- **Color Palette**:
  - **Selected**: Option 3: Midnight blue (#0A1929) + Neon pink (#FF10F0) + Cyan (#00D9FF)
  - _(Refer to `docs/theme-colors.css` for variables)_
- **Typography**:
  - Headings: "Clash Display"
  - Body: "Outfit"
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
