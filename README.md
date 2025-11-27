# 🎵 Artist Portfolio Website

A modern, high-performance music artist portfolio website built with Next.js 16, React 19, and TypeScript. Features a stunning dark theme with neon accents, complete admin panel, and all the essentials for a professional music presence.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## ✨ Features

### 🎸 Public-Facing

- **Music Player** - Interactive waveform player with WaveSurfer.js
- **Releases & Discography** - Beautiful release showcase with tracklists
- **Blog** - Rich text blog with reading time estimation
- **Events/Tour Dates** - Upcoming and past shows with ticket links
- **Photo Gallery** - Lightbox gallery with category filtering
- **Video Section** - YouTube/Vimeo integration with modal player
- **About Page** - Artist bio, stats, and vision
- **Contact Page** - Get in touch form
- **Press Kit** - Downloadable media assets
- **Newsletter** - Email subscription with database storage

### Admin Panel

- **Dashboard** - Overview with stats and quick actions
- **Music Management** - CRUD for releases and tracks
- **Blog Management** - Create and edit blog posts
- **Events Management** - Manage tour dates
- **Gallery Management** - Upload and organize photos
- **Video Management** - Add YouTube/Vimeo videos
- **Settings** - Configure site info and social links
- **Authentication** - Secure JWT-based login

### 🚀 Technical Features

- **SEO Optimized** - Open Graph, Twitter Cards, sitemap, robots.txt
- **Responsive Design** - Mobile-first, works on all devices
- **Dark Mode** - Beautiful dark theme with neon accents
- **Type-Safe** - Full TypeScript coverage
- **Database** - SQLite with better-sqlite3
- **Modern UI** - ShadCN UI components
- **Animations** - Smooth 60fps transitions with Framer Motion
- **Error Handling** - Custom 404 and error pages
- **Loading States** - Skeleton loaders and spinners

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4
- **UI Components:** ShadCN UI
- **Database:** SQLite (better-sqlite3)
- **Authentication:** JWT with jose
- **Music Player:** WaveSurfer.js
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Lightbox:** yet-another-react-lightbox
- **Forms:** React Hook Form + Zod
- **Notifications:** Sonner

## 📦 Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd artist-portfolio
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
# Create .env.local file
cp .env.example .env.local

# Edit .env.local and add your values
# At minimum, set JWT_SECRET
```

4. **Initialize the database**

```bash
npm run db:init
```

This will create the SQLite database with all tables and a default admin user:

- Email: `admin@artist.com`
- Password: `admin123` (⚠️ change this!)

5. **Start development server**

```bash
npm run dev
```

Visit `http://localhost:3000` to see your site!

📖 **For detailed database setup and Docker deployment, see [docs/DATABASE.md](docs/DATABASE.md)**

## 🗄️ Database Schema

The application uses SQLite with the following tables:

- `users` - Admin users
- `releases` - Music releases/albums
- `tracks` - Individual tracks
- `posts` - Blog posts
- `events` - Tour dates/events
- `videos` - Video content
- `gallery` - Photo gallery images
- `newsletter_subscribers` - Email subscribers

## 🎨 Customization

### Theme Colors

The theme uses a "Midnight Blue + Neon Pink + Cyan" color scheme. To customize:

1. Edit `docs/theme-colors.css`
2. Update Tailwind config if needed

### Fonts

- **Headings:** Clash Display
- **Body:** Outfit

Configure fonts in `app/layout.tsx`.

## 📝 Content Management

### Adding Content

**Music Release:**

1. Log in to `/admin`
2. Navigate to Music → Add Release
3. Fill in release details
4. Add tracks

**Blog Post:**

1. Go to Admin → Blog → New Post
2. Write content (HTML supported)
3. Add tags and cover image
4. Publish or save as draft

**Event:**

1. Admin → Events → Add Event
2. Enter date, venue, city
3. Add ticket URL

## 🚀 Deployment

### Docker Deployment

```bash
# Build the Docker image
docker build -t artist-portfolio .

# Run the container
docker run -p 3000:3000 artist-portfolio
```

### Vercel/Netlify

1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Configure environment variables
4. Deploy!

### Environment Variables

```env
JWT_SECRET=your-jwt-secret
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

## 📚 Documentation

- **Plans:** See `/docs/plans/` for detailed implementation plans
- **Theme:** `docs/theme-colors.css` for color scheme
- **Context:** `docs/PROJECT_CONTEXT.md` for project overview

## 🔒 Admin Access

Default admin route: `/admin/login`

**Initial Setup:**

1. Run database initialization
2. Create admin user (modify `lib/db-init.js`)
3. Log in with credentials

## 🎯 Project Structure

```
artist-portfolio/
├── app/                  # Next.js app directory
│   ├── (public)/        # Public pages
│   ├── admin/           # Admin panel
│   ├── api/             # API routes
│   └── actions/         # Server actions
├── components/          # React components
│   └── ui/             # ShadCN UI components
├── lib/                # Utilities and database
├── context/            # React context providers
├── docs/               # Documentation
└── public/             # Static assets
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 💬 Support

For questions or issues, please open an issue on GitHub or contact via email.

## 🎉 Acknowledgments

Built with ❤️ in Belgium by [truyens.pro](https://truyens.pro)

- UI Components: [ShadCN UI](https://ui.shadcn.com/)
- Icons: [Lucide](https://lucide.dev/)
- Audio: [WaveSurfer.js](https://wavesurfer.xyz/)

## 📝 Changelog

### v2.0.0 - The Battle-Tested Portfolio 🚀

**Visual Polish & Theming**

- **New**: Glassmorphism design system with frosted glass effects across UI
- **New**: Theme Switcher with 3 themes: Slate Gray (default), Midnight Neon, Rose Charcoal
- **New**: Magnetic buttons with hover effects
- **New**: Enhanced page transitions with spring animations
- **New**: Kinetic typography (Marquee) for announcements
- **New**: Subtle 3D starfield background
- **Improved**: Audio visualizer - constrained to bottom 50%, smoother animations

**Fan Engagement**

- **New**: Guestbook with admin moderation queue (`/guestbook`, `/admin/guestbook`)
- **New**: Unlockable Content component for newsletter exclusives
- **New**: Email-gated high-res downloads on release pages

**Commerce & EPK**

- **New**: Merch Store with product grid (`/merch`)
- **New**: Password-protected EPK (Electronic Press Kit) for industry (`/epk`)
- **New**: High-res asset downloads for press

**Technical Hardening & SEO**

- **New**: Dynamic Open Graph image generation (`/api/og`)
- **New**: JSON-LD schema for MusicGroup/Artist
- **Improved**: Image optimization (AVIF/WebP)
- **Improved**: Package imports optimization
- **Fixed**: Footer rendering issue

### v1.3.0 - Battle-Tested Player & PWA

- **New**: Battle-Tested Player with `localStorage` persistence and advanced queue management.
- **New**: PWA Support - Installable app with offline capabilities.
- **New**: Analytics - Track plays (30s threshold) and store in database.
- **New**: Social Sharing - Share tracks with timestamp deep-links.
- **Improved**: UI Polish - Centered hero buttons and player controls.
- **Fixed**: Turbopack compatibility issues.

### v1.2.2

- **Fixed**: Player positioning issue where it would render off-screen or overlap content.
- **Fixed**: Player controls (Repeat/Shuffle) causing track restarts.
- **Fixed**: Waveform interaction not seeking correctly.

---

**Made with ❤️ for artists who want to showcase their work beautifully.**
