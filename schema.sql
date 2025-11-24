-- Releases (Albums/Singles)
CREATE TABLE IF NOT EXISTS releases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('album', 'single', 'ep')),
  release_date TEXT,
  cover_image_url TEXT,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tracks
CREATE TABLE IF NOT EXISTS tracks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  release_id INTEGER,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  waveform_data TEXT, -- JSON string for waveform peaks
  duration INTEGER, -- in seconds
  bpm INTEGER,
  genre TEXT,
  track_number INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (release_id) REFERENCES releases(id) ON DELETE SET NULL
);

-- Blog Posts
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL, -- HTML from TipTap
  excerpt TEXT,
  cover_image_url TEXT,
  published BOOLEAN DEFAULT 0,
  tags TEXT, -- JSON array of strings
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Events / Tour Dates
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL, -- ISO date string
  venue TEXT NOT NULL,
  city TEXT NOT NULL,
  ticket_url TEXT,
  status TEXT DEFAULT 'upcoming' CHECK(status IN ('upcoming', 'sold_out', 'cancelled', 'past')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Gallery Images
CREATE TABLE IF NOT EXISTS gallery_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL,
  caption TEXT,
  category TEXT DEFAULT 'general' CHECK(category IN ('live', 'studio', 'press', 'general')),
  display_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Videos
CREATE TABLE IF NOT EXISTS videos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  url TEXT NOT NULL, -- YouTube/Vimeo URL
  thumbnail_url TEXT,
  platform TEXT CHECK(platform IN ('youtube', 'vimeo', 'native')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
