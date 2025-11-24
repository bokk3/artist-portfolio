I need you to completely refactor my existing project files (PROJECT_CONTEXT.md, .gemini-rules, and all 18 Plan files) for a NEW project: a stunning music artist portfolio website.

## NEW PROJECT OVERVIEW

**Project Name:** [Artist Name] Music Portfolio
**Purpose:** A beautiful, modern music portfolio website that surpasses SoundCloud's design, featuring music releases, blog, events, gallery, and admin panel.

## CORE REQUIREMENTS

### Frontend Features (Public-Facing):

1. **Music Player with Waveforms**

   - Beautiful audio player with animated waveforms (use WaveSurfer.js or Peaks.js)
   - Track listing with play/pause, seek, volume control
   - Album/single artwork display
   - Lyrics display (optional, toggleable)
   - Playlist functionality
   - Download links for releases
   - Embedded players for sharing

2. **Video Support**

   - Music video gallery
   - Embedded video player (YouTube/Vimeo integration + native HTML5)
   - Video thumbnails with play overlays
   - Full-screen video modal

3. **Artist Homepage/Hero**

   - Full-screen hero with latest release or featured track
   - Animated background (subtle particle effects or gradient animations)
   - Artist photo/branding
   - Social media links prominently displayed
   - "Now Playing" or "Latest Release" section

4. **Releases/Discography Section**

   - Grid layout of albums/singles/EPs
   - Album artwork as cards with hover effects
   - Release date, track count, streaming links
   - Filter by: All, Albums, Singles, EPs, Features
   - Click to expand and see tracklist + play inline

5. **Blog/News Section**

   - Card-based layout for blog posts
   - Featured image for each post
   - Rich text content with proper typography
   - Tags/categories for posts
   - Reading time estimate
   - Share buttons (Twitter, Facebook, WhatsApp)
   - Comments section (optional, can use Disqus or custom)

6. **Events/Tour Dates**

   - Upcoming shows in chronological order
   - Past events archive
   - Each event shows: Date, Venue, City, Ticket link, RSVP
   - "Add to Calendar" functionality (Google/Apple Calendar)
   - Location map integration (Google Maps embed)

7. **Gallery**

   - Masonry or grid layout for photos/videos
   - Lightbox modal for full-size viewing
   - Categories: Live Shows, Studio, Press, Behind the Scenes
   - Lazy loading for performance
   - Download option for press photos

8. **About Section**

   - Artist bio with rich text
   - Press photos
   - Press kit download
   - Contact information for booking/press
   - Embedded Spotify/Apple Music artist profile

9. **Social Media Integration**

   - Links to: Instagram, Twitter/X, TikTok, YouTube, Spotify, Apple Music, SoundCloud, Bandcamp
   - Embedded Instagram feed (optional)
   - Latest tweets/posts display (optional)

10. **Contact/Newsletter**
    - Newsletter signup form (Mailchimp/ConvertKit integration)
    - Contact form for booking/inquiries
    - EPK (Electronic Press Kit) download

### Admin Panel Features (Password Protected):

**Authentication:**

- Single password login (read from .env: ADMIN_PASSWORD)
- No user registration, just one admin
- Session-based authentication with JWT or simple token
- Auto-logout after inactivity
- Protected API routes

**Admin Dashboard Sections:**

1. **Music Management**

   - Upload new tracks (MP3, WAV, FLAC support)
   - Auto-generate waveform on upload
   - Add track metadata: Title, Artist, Album, Release Date, Genre, BPM, Lyrics
   - Upload album artwork
   - Set track as featured/hidden
   - Reorder tracks in playlists
   - Add streaming links (Spotify, Apple Music, YouTube, etc.)
   - Delete tracks

2. **Video Management**

   - Upload videos or add YouTube/Vimeo links
   - Add video title, description, release date
   - Upload custom thumbnail
   - Set featured video
   - Delete videos

3. **Blog Post Management (WYSIWYG Editor)**

   - Rich text editor with formatting (Bold, Italic, Headers, Lists, Links, Images)
   - Use TipTap, Lexical, or React-Quill for WYSIWYG
   - Upload images inline
   - Add featured image
   - Set publish date (can schedule for future)
   - Draft/Published status
   - SEO fields: Meta title, description, keywords
   - Tags/categories management
   - Preview before publishing
   - Edit/delete existing posts

4. **Events Management**

   - Add new events: Date, Time, Venue, City, Country, Ticket Link
   - Edit/delete events
   - Mark event as "Sold Out" or "Cancelled"
   - Automatically move past events to archive

5. **Gallery Management**

   - Bulk upload images
   - Add captions and categories
   - Reorder images (drag and drop)
   - Delete images
   - Set featured gallery image

6. **Settings**
   - Update artist bio
   - Update social media links
   - Change hero image/background
   - Update contact email
   - Toggle features on/off (e.g., hide blog if not in use)
   - Analytics integration (Google Analytics ID)

**Admin Panel UI Requirements:**

- Clean, modern dashboard with sidebar navigation
- Responsive (works on tablet)
- Drag-and-drop file uploads with progress bars
- Real-time preview of changes
- Success/error notifications (toast messages)
- Confirmation dialogs for destructive actions (delete)
- Dark mode for late-night updates

## DESIGN REQUIREMENTS

**Visual Style:**

- **More beautiful than SoundCloud** - think Apple Music meets Bandcamp with a unique twist
- Fresh, original color scheme (NOT the typical black/white or SoundCloud orange)
- Suggested palettes (choose one or create similar):
  - Option 1: Deep purple (#6B46C1) + Electric blue (#3B82F6) + Coral (#FF6B6B)
  - Option 2: Forest green (#2D6A4F) + Gold (#FFD700) + Cream (#F5F5DC)
  - Option 3: Midnight blue (#0A1929) + Neon pink (#FF10F0) + Cyan (#00D9FF)
  - Option 4: Burgundy (#800020) + Sage green (#9CAF88) + Warm beige (#E8DCC4)

**Design Principles:**

- Bold, large typography with excellent hierarchy
- Generous white space
- Smooth animations and transitions (60fps)
- Glassmorphism for cards/overlays
- Gradient accents
- Parallax scrolling effects
- Micro-interactions (hover states, loading animations)
- Audio-reactive visualizations (waveforms pulse with playback)

**Typography:**

- Heading font: Something bold and unique (e.g., "Clash Display", "Syne", "Cabinet Grotesk")
- Body font: Clean and readable (e.g., "Inter", "DM Sans", "Outfit")

**Layout:**

- Mobile-first responsive design
- Hero takes up 100vh on desktop
- Smooth scrolling between sections
- Sticky audio player at bottom when track is playing
- Navbar: Logo left, Navigation center, Social icons + CTA right

## TECHNICAL STACK

**Required Technologies:**

- Next.js 15 (App Router)
- React 19
- TypeScript (strict mode)
- Tailwind CSS v4
- shadcn/ui components
- Framer Motion (animations)
- SQLite (for database - tracks, posts, events, gallery)
- Better-sqlite3 (Node.js SQLite driver)
- Server Actions (for admin mutations)
- WaveSurfer.js or Peaks.js (audio waveforms)
- TipTap or Lexical (WYSIWYG editor)
- React Dropzone (file uploads)
- Next-Auth or custom JWT (admin authentication)
- Zod (form validation)
- React Hook Form (forms)
- Lucide React (icons)

**File Upload Strategy:**

- Store uploaded files in `/public/uploads/` directory
- Organize by type: `/uploads/audio/`, `/uploads/images/`, `/uploads/videos/`
- Serve files as static assets
- Consider CDN/cloud storage for production (S3, Cloudinary) - but start with local

**Database Schema (SQLite):**
Tables needed:

1. `tracks` - id, title, artist, album, artwork_url, audio_url, waveform_data, release_date, genre, bpm, lyrics, featured, created_at
2. `videos` - id, title, description, video_url, thumbnail_url, release_date, featured, created_at
3. `blog_posts` - id, title, slug, content, featured_image, excerpt, published, publish_date, tags, created_at, updated_at
4. `events` - id, title, date, time, venue, city, country, ticket_url, status (upcoming/past/cancelled), created_at
5. `gallery_images` - id, image_url, caption, category, order, created_at
6. `settings` - key-value pairs for site settings

## YOUR TASK

Please refactor ALL of the following files for this new music portfolio project:

1. **PROJECT_CONTEXT.md**

   - Rewrite completely for the music portfolio project
   - Include all features listed above
   - Define the visual design direction
   - Specify the color palette
   - List all technologies

2. **.gemini-rules**

   - Update all development rules to reflect music portfolio needs
   - Add rules for:
     - Audio file handling and waveform generation
     - WYSIWYG editor implementation
     - Admin authentication patterns
     - File upload best practices
     - Database schema conventions
     - API route protection
   - Keep existing quality standards (TypeScript, Tailwind, performance)

3. **All 18 Plan files (Plan 1 through Plan 18)**

   - Completely rewrite each plan to build the music portfolio features
   - Suggested new plan structure:

   **MVP Phase (Plans 1-7):**

   - Plan 1: Project Setup & Database Schema
   - Plan 2: Authentication System (Admin Login)
   - Plan 3: Core Layout & Navigation
   - Plan 4: Music Player & Waveform Integration
   - Plan 5: Releases/Discography Section
   - Plan 6: Admin Panel - Music Management
   - Plan 7: Homepage Hero & Featured Content

   **V1 Phase (Plans 8-17):**

   - Plan 8: Blog System (Frontend)
   - Plan 9: Admin Panel - Blog Management (WYSIWYG)
   - Plan 10: Events/Tour Dates Section
   - Plan 11: Admin Panel - Events Management
   - Plan 12: Gallery with Lightbox
   - Plan 13: Admin Panel - Gallery Management
   - Plan 14: Video Integration & Player
   - Plan 15: About Section & Social Integration
   - Plan 16: Newsletter & Contact Forms
   - Plan 17: Performance Optimization & SEO

   **V1.5 Phase (Plan 18):**

   - Plan 18: Advanced Features (Analytics, Comments, Streaming Stats)

4. **globals.css color scheme**
   - Provide a complete new color palette in Tailwind v4 format
   - Include custom CSS for audio player styling
   - Waveform color schemes

## OUTPUT FORMAT

Please provide:

1. Complete new **PROJECT_CONTEXT.md** file
2. Complete new **.gemini-rules** file
3. All 18 refactored **Plan files** (Plan 1 through Plan 18) with detailed tasks
4. Suggested **color scheme** for globals.css (CSS variables)
5. **Database schema** SQL for SQLite setup

Make sure each plan is:

- Detailed with specific implementation steps
- Includes component names and file paths
- References the correct libraries
- Has clear task breakdowns
- Follows the original plan format/structure

Focus on making this the most beautiful, functional music portfolio possible. Think Apple Music's polish + Bandcamp's artist focus + unique creative flair.

Begin with PROJECT_CONTEXT.md.
