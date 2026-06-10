# 🌸 A Letter for Samruddhi

A beautiful, elegant single-page farewell website created with pure HTML, CSS, and JavaScript. This project features a soft pastel design, smooth animations, and an interactive letter experience.

## 📋 Project Overview

This website serves as a heartfelt digital farewell letter with an interactive experience. Users begin on a welcome page with a lily flower banner and can click a button to reveal a beautifully formatted letter, complete with a music player and decorative elements.

### Key Features

✨ **Modern & Elegant Design**
- Soft pastel color theme (pink, lavender, peach, cream)
- Clean typography with Poppins font family
- Professional layout with proper spacing

🌸 **Lily Flower Theme**
- SVG lily banner on welcome page
- Floating flower decorations throughout
- Subtle, elegant aesthetic

💌 **Interactive Letter**
- Welcome page with call-to-action button
- Smooth fade-in transition to letter section
- Beautiful letter card with formatted content
- Close button to return to welcome screen

🎵 **Music Player**
- Play/Pause controls
- Volume slider (0-100%)
- No autoplay (respects user choice)
- Shows song title and artist information

📱 **Fully Responsive**
- Mobile-first design approach
- Optimized for all screen sizes (mobile, tablet, desktop)
- Flexbox and CSS Grid layouts
- Touch-friendly interactive elements

✨ **Smooth Animations**
- Fade-in effects
- Floating flower animations
- Hover effects on buttons
- Slide-up entrance animations

♿ **Accessibility**
- Keyboard shortcuts (Escape, Space)
- Reduced motion support
- Semantic HTML structure
- ARIA labels for screen readers

## 🗂️ Project Structure

```
project/
├── index.html          # Main HTML structure
├── style.css           # Complete styling and animations
├── script.js           # Interactive functionality
├── README.md           # This file
└── assets/
    ├── song.mp3        # Background music file (add your own)
    └── flowers/        # Directory for flower assets (if needed)
```

## 🎨 Color Palette

| Color | Hex Code | Usage |
|-------|----------|-------|
| Primary Pink | #FFB6D9 | Buttons, accents |
| Soft Rose | #FFE5EC | Backgrounds, borders |
| Lavender | #E6D7FF | Gradient backgrounds |
| Soft Peach | #FFE5D9 | Accent backgrounds |
| Cream | #FFFAF0 | Main background |
| Text Dark | #4A4A4A | Primary text |
| Text Light | #6B6B6B | Secondary text |
| Accent Gold | #FFE082 | Lily center |

## 🚀 Getting Started

### Installation

1. Clone or download this project to your local machine
2. Navigate to the project folder
3. No build process required - it's pure HTML/CSS/JS!

### Usage

#### Basic Setup

1. **Open the website:**
   - Double-click `index.html` or open it in your web browser
   - Or use a local server (recommended for best experience)

2. **Add your music file:**
   - Replace or add your music file to `assets/song.mp3`
   - Supported formats: MP3, WAV, OGG, FLAC

3. **Customize the content:**
   - Edit the letter text in `index.html`
   - Modify colors in `style.css` using CSS variables
   - Update song title and artist in `script.js`

#### Running with a Local Server (Recommended)

Using Python 3:
```bash
cd "path/to/project"
python -m http.server 8000
# Then visit http://localhost:8000
```

Using Python 2:
```bash
cd "path/to/project"
python -m SimpleHTTPServer 8000
# Then visit http://localhost:8000
```

Using Node.js (with http-server):
```bash
npm install -g http-server
cd "path/to/project"
http-server
```

## 🎯 How to Customize

### Editing the Letter

Open `index.html` and find the `.letter-content` section:

```html
<div class="letter-content">
    <p>Your letter text here...</p>
</div>
```

### Changing Colors

Edit the CSS variables in `style.css`:

```css
:root {
    --primary-pink: #FFB6D9;
    --soft-rose: #FFE5EC;
    /* ... other colors ... */
}
```

### Adding Music

1. Prepare your audio file (MP3 format recommended for browser compatibility)
2. Place it in the `assets/` folder and name it `song.mp3`
3. Update the song title in `index.html`:

```html
<p class="song-title">Your Song Title</p>
<p class="song-artist">Your Artist Name</p>
```

### Modifying the Lily

The lily SVG can be edited directly in the HTML. Look for the `<svg>` element in the `.lily-banner` section to adjust colors and shapes.

## 🔧 JavaScript API

The website exposes utility functions for advanced customization:

```javascript
// Access via console
window.websiteUtils.openLetter()           // Programmatically open letter
window.websiteUtils.closeLetter()          // Programmatically close letter
window.websiteUtils.toggleAudioPlayback()  // Toggle music
window.websiteUtils.updateVolume(70)       // Set volume (0-100)
window.websiteUtils.logCurrentState()      // Log current state
```

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Esc** | Close letter and return to welcome |
| **Space** | Play/Pause music (when letter is open) |

## 🌐 Browser Support

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Opera (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Responsive Breakpoints

- **Desktop:** 1200px and above
- **Tablet:** 768px to 1199px
- **Mobile:** Below 768px
- **Small Mobile:** Below 480px

## ✅ Feature Checklist

- [x] Modern, elegant design with soft pastel theme
- [x] Lily flower banner and decorations
- [x] Welcome screen with call-to-action button
- [x] Smooth fade-in letter transition
- [x] Beautiful letter card with formatted content
- [x] Poppins font family throughout
- [x] Proper spacing and typography
- [x] Responsive mobile and desktop design
- [x] Music player with play/pause controls
- [x] Volume slider
- [x] No autoplay (respects user preference)
- [x] Music player information display
- [x] Floating flower decorations
- [x] Elegant, not flashy design
- [x] Smooth fade-in animations
- [x] Soft button hover effects
- [x] Floating flower animations
- [x] Footer with gratitude message
- [x] Clean, well-commented code
- [x] Flexbox and Grid layouts
- [x] Accessibility features
- [x] Keyboard shortcuts

## 🎨 Design Inspirations

This website draws inspiration from:
- Minimal design principles
- Soft, pastel aesthetics
- Elegant farewell experiences
- Modern web animations

## 📝 License

This project is free to use and modify for personal purposes.

## 🙏 Credits

Created with care and gratitude for Samruddhi.

---

## 🐛 Troubleshooting

### Music not playing?
- Ensure the `assets/song.mp3` file exists
- Check browser console for error messages
- Verify file format is MP3 (most compatible)
- Try using a local server instead of opening the file directly

### Animations not smooth?
- Check if "Reduce motion" is enabled in system settings
- Update your browser to the latest version
- Disable browser extensions that might affect styling

### Text overflow on mobile?
- This shouldn't happen with responsive design enabled
- Clear browser cache and reload
- Check if CSS file is loading correctly

### Need help?
- Check browser console (F12) for error messages
- Review the code comments in `script.js` and `style.css`
- Test in different browsers to isolate issues

---

**Made with gratitude ❤️**

For any questions or customization needs, feel free to modify the code directly - it's yours to personalize!
