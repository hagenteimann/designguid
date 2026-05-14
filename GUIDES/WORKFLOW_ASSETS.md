# Workflow: Bilder & Videos komprimieren

**Konsolidiert aus: ASSETS.md**

---

## Übersicht

Agent komprimiert **automatisch**, wenn zu groß:
- **Bilder:** Max 200KB (Desktop), 100KB (Mobile)
- **Videos:** Max 2MB (Desktop), 1MB (Mobile)

> **Lizenz-Pflicht:** Kein Asset ohne bekannte Lizenz einbauen. Erlaubte Quellen und Icon-Libraries → [DESIGN_SYSTEM.md – Erlaubte Quellen](./DESIGN_SYSTEM.md)

---

## Bilder-Komprimierung

### Format & Größe

| Format | Max Desktop | Max Mobile |
|--------|------------|-----------|
| WebP (Fotos) | 200 KB | 100 KB |
| SVG (Icons) | 50 KB | 50 KB |

### Tools

**Sharp (Node.js)**
```javascript
const sharp = require('sharp');
sharp('input.jpg')
  .webp({ quality: 80 })
  .toFile('output.webp');
```

**ImageMagick (CLI)**
```bash
convert input.jpg -quality 80 -resize 1920x output.webp
```

**Online:** TinyPNG, Compressor.io

### Responsive Images

```html
<picture>
  <source
    media="(min-width: 1200px)"
    srcset="image-1920w.webp 1920w, image-1280w.webp 1280w"
    type="image/webp"
  />
  <source
    media="(min-width: 768px)"
    srcset="image-768w.webp"
    type="image/webp"
  />
  <source
    media="(max-width: 767px)"
    srcset="image-375w.webp 375w, image-480w.webp 480w"
    type="image/webp"
  />
  <img
    src="image-1920w.webp"
    alt="Beschreibung"
    loading="lazy"
    decoding="async"
  />
</picture>
```

---

## Video-Komprimierung

### Format & Größe

| Typ | Max Desktop | Max Mobile | Format |
|-----|------------|-----------|--------|
| Hero Auto-Play | 2 MB | 1 MB | MP4 H.264 |
| Feature Video | 5 MB | 2 MB | MP4 H.264 |

### Spezifikationen

```
Container: MP4 (.mp4)
Video-Codec: H.264
Bitrate: 1500k (Desktop), 800k (Mobile)
Frame Rate: 24-30 fps (nie höher)
Resolution: 1920x1080 (Desktop), 720x480 (Mobile)
Audio-Codec: AAC (oder entfernen bei Background Videos)
```

### FFmpeg Befehle

**Desktop Video (mit Audio)**
```bash
ffmpeg -i input.mov \
  -vcodec libx264 \
  -b:v 1500k \
  -s 1920x1080 \
  -r 24 \
  -acodec aac \
  -b:a 96k \
  output.mp4
```

**Mobile Video (ohne Audio)**
```bash
ffmpeg -i input.mov \
  -vcodec libx264 \
  -b:v 800k \
  -s 720x480 \
  -r 24 \
  -an \
  output-mobile.mp4
```

### HTML Video

`loading="lazy"` ist auf `<video>` nicht gültig (nur `<img>` und `<iframe>`). Responsives Video-Switching per `media` auf `<source>` funktioniert browserübergreifend nicht zuverlässig – stattdessen JS nutzen:

```html
<video
  id="hero-video"
  autoplay
  muted
  loop
  playsinline
  poster="thumbnail.jpg"
>
  <source data-src-desktop="video-desktop.mp4"
          data-src-mobile="video-mobile.mp4"
          type="video/mp4">
</video>

<script>
  const video  = document.getElementById('hero-video');
  const source = video.querySelector('source');
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  source.src = isMobile
    ? source.dataset.srcMobile
    : source.dataset.srcDesktop;
  video.load();
</script>
```

---

## Agent-Workflow

**User:** "Upload 25MB Video"

**Agent:**
```
1. 🔍 Größe-Check: 25MB (Limit: 2MB)
2. 🔧 FFmpeg startet:
   ffmpeg -i input.mov -vcodec libx264 -b:v 1500k ...
3. ✅ Desktop-Version: 1.8MB
4. 📱 Mobile-Version: 0.8MB
5. 🎥 HTML generieren mit <video>
6. 📖 CD-Manual updaten?
```

---

## Batch-Verarbeitung

**Alle JPGs → WebP**
```bash
for file in *.jpg; do
  convert "$file" -quality 80 "${file%.jpg}.webp"
done
```

**Alle Videos → MP4 H.264**
```bash
for file in *.mov; do
  ffmpeg -i "$file" \
    -vcodec libx264 -b:v 1500k -s 1920x1080 -r 24 -an \
    "${file%.mov}.mp4"
done
```

---

## Checklisten

### Bilder-Upload
- [ ] Format WebP oder SVG?
- [ ] Größe unter Limit?
- [ ] Responsive Versionen generiert?
- [ ] Alt-Text vorhanden?
- [ ] Lazy Loading (außer LCP)?

### Video-Upload
- [ ] Format MP4 H.264?
- [ ] Größe unter Limit?
- [ ] Mobile-Version generiert?
- [ ] Bitrate optimiert?
- [ ] FPS max 30?
- [ ] Poster/Thumbnail vorhanden?

---

## Performance Impact

| Maßnahme | LCP | Performance |
|----------|-----|-------------|
| Bildkomprimierung | ⬇️⬇️ | Besser |
| Responsive Images | ⬇️⬇️⬇️ | Sehr gut |
| Video-Bitrate | ⬇️⬇️ | Besser |
| Lazy Loading | ⬇️ | Besser |

**Target:** LCP < 2.5s (Google "Good" Bereich)

---

## Tools-Übersicht

| Tool | Funktion | Installation |
|------|----------|--------------|
| Sharp | Bilder komprimieren | `npm install sharp` |
| ImageMagick | Bilder (CLI) | `brew install imagemagick` |
| FFmpeg | Videos komprimieren | `brew install ffmpeg` |
| SVGO | SVG optimieren | `npm install -g svgo` |

---

## SVG Optimierung

**SVGO (CLI)**
```bash
npx svgo input.svg -o output.svg
```

**SVGO Konfiguration**
```javascript
// svgo.config.js
module.exports = {
  plugins: [
    'removeViewBox',
    'removeEmptyContainers',
    'convertPathData',
    'cleanupEnableBackground'
  ]
};
```

---

## Integration mit CD-Manual

**CD-Manual Eintrag:**
```
- Kategorie: Assets & Optimierung
- Bilder: WebP max 200KB (Desktop), 100KB (Mobile)
- Videos: MP4 H.264 max 2MB (Desktop), 1MB (Mobile)
- Responsive: Picture-Element mit 3 Breakpoints
- Tools: Sharp (Bilder), FFmpeg (Videos)
- Lazy Loading: Aktiviert (außer LCP)
```

---

*Workflow: Assets – Push8 Web Agency – Stand Mai 2026*
