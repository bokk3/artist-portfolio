-- Music Artist Portfolio Database Schema

-- Tracks Table
CREATE TABLE IF NOT EXISTS tracks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT,
  artwork_url TEXT,
  audio_url TEXT NOT NULL,
  waveform_data TEXT, -- JSON string of waveform peaks
  release_date TEXT,
  genre TEXT,
  bpm INTEGER,
  lyrics TEXT,
  featured BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Videos Table
CREATE TABLE IF NOT EXISTS videos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL, -- YouTube/Vimeo link or local path
  thumbnail_url TEXT,
  release_date TEXT,
  featured BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL, -- HTML content from WYSIWYG
  featured_image TEXT,
  excerpt TEXT,
  published BOOLEAN DEFAULT 0,
  publish_date DATETIME,
  tags TEXT, -- Comma-separated tags
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  date TEXT NOT NULL, -- ISO date string
  time TEXT,
  venue TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT,
  ticket_url TEXT,
  status TEXT DEFAULT 'upcoming', -- upcoming, past, cancelled, sold_out
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Gallery Images Table
CREATE TABLE IF NOT EXISTS gallery_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_url TEXT NOT NULL,
  caption TEXT,
  category TEXT, -- live, studio, press, bts
  display_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Settings Table
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- Initial Settings
INSERT OR IGNORE INTO settings (key, value) VALUES 
('site_title', 'Artist Name'),
('contact_email', 'booking@artist.com'),
('hero_image', '/uploads/hero-default.jpg');
