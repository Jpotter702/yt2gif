# GIFClip

Convert any YouTube video into a shareable GIF in seconds.

## 🎯 Purpose

GIFClip is a utility web app that allows users to:
- Paste a YouTube link
- Choose a start and end time
- Render a high-quality GIF (with options for resolution, watermark, etc.)
- Download and share instantly

---

## 🚀 Features

- YouTube download via `yt-dlp`
- GIF generation via `ffmpeg` with palette optimization
- Frontend clip range selector
- Watermarked free exports, HD premium options
- Download link and preview
- Light ads + freemium upsell path

---

## 🛠 Tech Stack

- `yt-dlp` – YouTube clip fetching
- `ffmpeg` – GIF rendering + watermarking
- Frontend – React or plain HTML/JS
- Backend – FastAPI or Express.js
- Supabase/Firebase – Auth and usage tracking
- S3/R2 – Temporary GIF storage

---

## 🧠 Roadmap

### Phase 1 – Freemium MVP
- [ ] GIF generation engine (yt-dlp + ffmpeg)
- [ ] Free vs premium limits
- [ ] Stripe or LemonSqueezy integration
- [ ] Google AdSense banner placement

### Phase 2 – Integrations
- [ ] Slack App
- [ ] Discord or ChatGPT plugin
- [ ] Chrome extension (YouTube button)

### Phase 3 – Monetization Expansion
- [ ] Developer API (REST + key system)
- [ ] Private-use licensing
- [ ] Partner dashboard

---

## 📸 Example

```text
Input:
https://youtube.com/watch?v=dQw4w9WgXcQ
Start: 0:10
End: 0:15

Output:
https://gifclip.io/rickroll-clip.gif
