# ✅ Assets Checklist (1 Seite)

**Bilder & Videos hochladen + komprimieren**

---

## Bildkomprimierung

**Limits:**
- Desktop: max 200KB
- Mobile: max 100KB
- Format: WebP oder SVG

**Wenn zu groß:**
```bash
# Sharp (Node.js)
npx sharp input.jpg --format webp --quality 80

# ImageMagick
convert input.jpg -quality 80 output.webp

# Online: TinyPNG, Compressor.io
```

- [ ] Format WebP oder SVG?
- [ ] Größe unter Limit?
- [ ] Mehrere Größen? (Desktop + Mobile)
- [ ] Alt-Text vorhanden?
- [ ] Lazy Loading? (außer LCP/Hero)

---

## Responsive Images

```html
<picture>
  <source media="(min-width: 1200px)" srcset="image-1920w.webp">
  <source media="(min-width: 768px)" srcset="image-768w.webp">
  <source media="(max-width: 767px)" srcset="image-375w.webp">
  <img src="image-1920w.webp" alt="Text" loading="lazy">
</picture>
```

- [ ] Picture-Element vorhanden?
- [ ] Media-Queries richtig?
- [ ] Responsive funktioniert (Breakpoints: 1200px, 768px, 375px)?

---

## Videokomprimierung

**Limits:**
- Desktop: max 2MB
- Mobile: max 1MB
- Format: MP4 H.264

**FFmpeg:**
```bash
ffmpeg -i input.mov -vcodec libx264 -b:v 1500k -s 1920x1080 -r 24 output.mp4
```

- [ ] Format MP4 H.264?
- [ ] Größe unter Limit?
- [ ] Mobile-Version generiert?
- [ ] Bitrate optimiert? (1500k Desktop, 800k Mobile)
- [ ] FPS max 30?
- [ ] Poster/Thumbnail vorhanden?

---

## Video HTML

```html
<video autoplay muted loop playsinline poster="thumb.jpg" loading="lazy">
  <source src="video-desktop.mp4" media="(min-width: 1200px)">
  <source src="video-mobile.mp4" media="(max-width: 768px)">
  <source src="video.mp4">
</video>
```

- [ ] Autoplay + Muted + Loop?
- [ ] Playsinline für Mobile?
- [ ] Poster vorhanden?
- [ ] Loading="lazy"?

---

## Performance Check

- [ ] LCP < 2.5s? (Google Test: PageSpeed Insights)
- [ ] Alle Bilder lazy-loaded? (außer Hero)
- [ ] WebP Format? (nicht JPG/PNG)
- [ ] SVG optimiert? (SVGO)

---

## CD-Manual

- [ ] Asset-Entscheidung dokumentiert?

---

**Detailinformationen:** [WORKFLOW_ASSETS.md](../GUIDES/WORKFLOW_ASSETS.md)
