# Last Known Photo

A curated archive of the final known photographs of famous people before their deaths. Built with Vue 3, Vite, and deployed on Netlify.

> "The future's uncertain and the end is always near" — Jim Morrison

## Setup

```bash
npm install
npm run dev
```

## Adding New Posts

### Option A: Manual (JSON files)

1. Create a new `.json` file in `content/posts/` with this schema:

```json
{
  "id": "unique-id",
  "slug": "url-slug",
  "name": "Subject Name",
  "title": "Brief caption about the photo",
  "imageUrl": "/images/filename.jpg",
  "date": "Date of photo",
  "deathDate": "Date of death",
  "age": 46,
  "tags": ["tag1", "tag2"],
  "sourceUrl": "https://source.com",
  "sourceLabel": "Source Name",
  "description": "Full description of the subject and photo."
}
```

2. Place the image in `public/images/`
3. Commit and push — Netlify will auto-deploy

### Option B: Admin Panel

Visit `/admin` on the site and use the built-in form to create posts. The admin generates a JSON file for download — place it in `content/posts/` and commit.

### Option C: Decap CMS

Visit `/admin/` (note the trailing slash) to use Decap CMS, which commits directly to your Git repo. Requires Netlify Identity to be enabled on your Netlify site.

To set up Decap CMS:
1. Enable Netlify Identity in your Netlify site settings
2. Enable Git Gateway under Identity > Services
3. Invite yourself as a user
4. Visit `yoursite.com/admin/` to log in and manage content

## Scraping Existing Posts

```bash
node scraper.js
```

This scrapes all posts from the original Tumblr blog, downloads images, and generates JSON data files.

## Deployment

The site is configured for Netlify. Connect your Git repo to Netlify and it will auto-deploy on push.

- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirects are configured in `netlify.toml`

## Tech Stack

- Vue 3 + TypeScript
- Vite
- Vue Router
- Scoped component styles (no Tailwind)
- Netlify for hosting
- Decap CMS (optional) for content management
