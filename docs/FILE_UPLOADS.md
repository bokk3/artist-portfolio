# Local File Upload System

## ✅ Implementation Complete

The local file upload system has been successfully implemented, replacing URL-based inputs with drag-and-drop file uploads.

## 📁 What Was Created

### 1. Upload API Route

**File:** `app/api/upload/route.ts`

**Features:**

- Handles file uploads via FormData
- Validates file type (images, audio, video)
- Validates file size (10MB max)
- Generates unique filenames
- Organizes files by type (cover, audio, gallery, blog, etc.)
- Returns public URL for stored files

**File Storage:**

- Base path: `/app/public/uploads/`
- Organized by type: `/uploads/cover/`, `/uploads/gallery/`, etc.
- Auto-creates directories as needed

### 2. Reusable FileUpload Component

**File:** `components/file-upload.tsx`

**Features:**

- Drag-and-drop interface using `react-dropzone`
- Image preview for uploaded files
- Loading states during upload
- Error handling with toast notifications
- Remove uploaded file option
- Customizable max file size and accepted types

### 3. Updated Admin Forms

**Updated:**

- ✅ `/admin/music/new` - Cover image uploads
- ✅ `/admin/gallery/new` - Photo uploads
- 🔜 `/admin/blog/new` - Blog image uploads (ready to implement)
- 🔜 `/admin/videos/new` - Thumbnail uploads (ready to implement)

## 🎯 How It Works

### 1. User Uploads File

User drags/drops or clicks to select a file in the admin panel

### 2. File is Processed

- Validated (type & size)
- Unique filename generated
- Saved to `/app/public/uploads/{type}/`

### 3. URL is Returned

- Public URL: `/uploads/{type}/filename.ext`
- Accessible via web browser
- Stored in database

### 4. Files Persist

With Docker volume mount: `./data/uploads:/app/public/uploads`

- Files survive container restarts
- Backed up with your data

## 📂 File Organization

```
public/uploads/
├── cover/      # Album/release cover art
├── gallery/    # Gallery photos
├── blog/       # Blog post images
├── audio/      # Audio files (future)
├── press/      # Press kit files
└── misc/       # Other files
```

## 🔒 Security Features

- **File size limit:** 10MB per file
- **Type validation:** Only allowed file types accepted
- **Unique filenames:** Prevents overwrites
- **Server-side processing:** Safe file handling

## 🚀 Usage in Forms

```typescript
const [fileUrl, setFileUrl] = useState('');

<FileUpload
  type="cover"           // Directory to save in
  accept="image/*"       // File types allowed
  maxSize={10485760}     // 10MB in bytes
  onUploadComplete={setFileUrl}  // Callback with URL
/>
<input type="hidden" name="cover_url" value={fileUrl} />
```

## 📊 File Types Supported

### Images

- JPEG, PNG, WebP, GIF
- Used for: covers, gallery, blog, press

### Audio (Ready)

- MP3, WAV, MPEG
- Used for: music tracks

### Video (Ready)

- MP4, WebM
- Used for: video thumbnails

## 🔄 Next Steps (Optional)

To complete the implementation for all forms:

1. **Blog Posts** - Add cover image upload
2. **Music Tracks** - Add audio file upload
3. **Videos** - Add thumbnail upload
4. **Image Optimization** - Add Sharp for compression
5. **Multiple Files** - Support batch uploads

## ⚠️ Important Notes

- Files are stored in `public/uploads/` - publicly accessible
- Volume mount required for Docker persistence
- No CDN - files served directly from app
- Consider adding cleanup for deleted content
- Backup `data/uploads/` directory regularly

## 🐳 Docker Deployment

Files persist with the volume mount already configured:

```yaml
volumes:
  - ./data/uploads:/app/public/uploads
```

All uploaded files will be in `./data/uploads/` on your host.
