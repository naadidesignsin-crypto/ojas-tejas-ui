# Ojas by Tejas - Modular React UI Figma Fixed

This version restores the Figma-style look and keeps the project modular.
Every section is a separate React component and every area has its own CSS file.

## Important

Do not replace only one old file in the previous project. Extract this full project cleanly, because the previous version may have mixed CSS/component names.

## Run on Windows PowerShell

```powershell
cd D:\React\Naadi
Remove-Item -Recurse -Force ojas-by-tejas-modular-react
# Extract this ZIP here and keep folder name: ojas-by-tejas-modular-react
cd D:\React\Naadi\ojas-by-tejas-modular-react
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Add your client demo video

Put your real video here:

```text
ojas-by-tejas-modular-react/public/videos/client-demo.mp4
```

The React video path is already configured as:

```jsx
/videos/client-demo.mp4
```

Test video directly:

```text
http://localhost:5173/videos/client-demo.mp4
```

If this URL plays, the board play button will also play it.

## Folder structure

```text
src/
 ├─ components/
 │   ├─ Header.jsx
 │   ├─ HeroSection.jsx
 │   ├─ HeroContent.jsx
 │   ├─ VideoFrame.jsx
 │   ├─ QuickMenu.jsx
 │   ├─ SplitFeature.jsx
 │   ├─ Gallery.jsx
 │   ├─ About.jsx
 │   ├─ WhyChoose.jsx
 │   ├─ Testimonials.jsx
 │   ├─ Subscribe.jsx
 │   └─ Footer.jsx
 ├─ data/
 │   └─ siteData.js
 ├─ styles/
 │   ├─ global.css
 │   ├─ header.css
 │   ├─ hero.css
 │   ├─ video-frame.css
 │   ├─ quick-menu.css
 │   ├─ sections.css
 │   ├─ gallery.css
 │   ├─ about.css
 │   ├─ why-choose.css
 │   ├─ testimonials.css
 │   ├─ subscribe.css
 │   └─ footer.css
 └─ assets/
```
