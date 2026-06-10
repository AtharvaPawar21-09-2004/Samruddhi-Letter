# 🌸 Setup & Quick Start Guide

## Quick Start (2 minutes)

### Option 1: Direct Open (Fastest)
1. Find `index.html` in the project folder
2. Double-click it to open in your default browser
3. Done! The website is ready to use

**Note:** Music won't play with direct file open. Use Option 2 for music support.

### Option 2: Local Server (Recommended with Music)

#### Windows - Using Python

1. **Check if Python is installed:**
   ```bash
   python --version
   ```
   If not installed, download from python.org

2. **Open Command Prompt or PowerShell in the project folder:**
   - Hold Shift + Right-click in the folder
   - Select "Open PowerShell window here"

3. **Run the server:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # OR Python 2
   python -m SimpleHTTPServer 8000
   ```

4. **Open in browser:**
   - Visit: http://localhost:8000
   - Press Ctrl+C to stop the server

#### Mac/Linux - Using Python

1. **Open Terminal in the project folder**

2. **Run the server:**
   ```bash
   # Python 3 (recommended)
   python3 -m http.server 8000
   
   # OR Python 2
   python -m SimpleHTTPServer 8000
   ```

3. **Open in browser:**
   - Visit: http://localhost:8000
   - Press Ctrl+C to stop

#### Using Node.js (if installed)

1. **Install http-server (one-time):**
   ```bash
   npm install -g http-server
   ```

2. **Navigate to project folder and run:**
   ```bash
   http-server
   ```

3. **Open in browser:** http://localhost:8080

## 🎵 Adding Music

1. Find or download a royalty-free song (MP3 format)
2. Place the file in the `assets/` folder
3. Name it exactly: `song.mp3`
4. Reload the website - music will work!

### Where to Find Music:
- **Pixabay Music:** pixabay.com/music (free, no attribution required)
- **Bensound:** bensound.com (free, requires attribution)
- **YouTube Audio Library:** Free for YouTube creators
- **FreePM:** freepm.net (free)

## ✏️ Customizing Content

### Change the Letter Text
1. Open `index.html` in any text editor
2. Find the section that says "Dear Samruddhi,"
3. Replace the letter content between the `<p>` tags
4. Save and refresh the browser

### Change Colors
1. Open `style.css`
2. At the top, find the `:root` section with color variables
3. Change colors like this:
   ```css
   --primary-pink: #FFB6D9;  /* Change this hex code */
   ```
4. Save and refresh

### Change Song Title/Artist
1. Open `index.html`
2. Find: `<p class="song-title">Our Journey</p>`
3. Replace "Our Journey" with your song name
4. Find: `<p class="song-artist">A Tribute</p>`
5. Replace "A Tribute" with artist name
6. Save and refresh

## 🔍 File Overview

| File | Purpose |
|------|---------|
| `index.html` | Website structure and content |
| `style.css` | All styling, animations, and responsive design |
| `script.js` | Interactive features (buttons, music player) |
| `README.md` | Complete documentation |
| `assets/` | Folder for music and images |

## 🎨 Color Customization Cheat Sheet

Edit these in `style.css` within the `:root {}` section:

```css
--primary-pink: #FFB6D9;    /* Main button and accent color */
--soft-rose: #FFE5EC;       /* Light backgrounds and borders */
--lavender: #E6D7FF;        /* Purple tint in gradients */
--soft-peach: #FFE5D9;      /* Warm accent color */
--cream: #FFFAF0;           /* Main background */
--text-dark: #4A4A4A;       /* Main text color */
--text-light: #6B6B6B;      /* Secondary text */
```

Popular pastel colors to try:
- Soft Blue: `#D4E8F7`
- Soft Green: `#D4F1D4`
- Soft Yellow: `#FFF9E6`
- Soft Orange: `#FFE5CC`

## 🖥️ Browser Compatibility

| Browser | Status |
|---------|--------|
| Chrome | ✅ Full support |
| Firefox | ✅ Full support |
| Safari | ✅ Full support |
| Edge | ✅ Full support |
| Mobile Safari (iOS) | ✅ Full support |
| Chrome Mobile | ✅ Full support |
| IE 11 | ⚠️ Limited (no modern CSS) |

## ⌨️ Keyboard Shortcuts

- **Escape (Esc):** Close letter and go back to welcome
- **Space:** Play/Pause music (when letter is open)

## 🐛 Quick Fixes

### Music doesn't play:
- [ ] Check if `assets/song.mp3` exists
- [ ] Use a local server (not direct file open)
- [ ] Try a different browser
- [ ] Refresh page (Ctrl+R or Cmd+R)

### Website looks wrong:
- [ ] Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- [ ] Clear browser cache
- [ ] Check if CSS file is loading (right-click → Inspect → Network tab)

### Text is too big/small on mobile:
- [ ] This is normal responsive design
- [ ] Zoom out/in with Ctrl+Mouse Wheel (or Cmd+Mouse Wheel on Mac)
- [ ] Rotate phone to landscape mode

## 📚 Additional Resources

- **HTML Tutorial:** Learn about content structure
- **CSS Tutorial:** Learn about styling and animations
- **JavaScript Tutorial:** Learn about interactivity
- **Responsive Design:** MDN Web Docs

## 🎯 Next Steps

1. **Try it out:** Open `index.html` in your browser
2. **Add music:** Place a song in the `assets/` folder
3. **Customize:** Edit letter text and colors
4. **Share:** Send to the recipient!

## 💡 Pro Tips

- Use Chrome DevTools (F12) to test responsive design
- Take screenshots at different screen sizes
- Test keyboard shortcuts (Esc, Space)
- Try the website on your phone before sharing

## 📞 Support

If something doesn't work:
1. Check the browser console (F12 → Console tab)
2. Look for error messages
3. Try clearing browser cache and reloading
4. Test in a different browser

---

**Enjoy your beautiful farewell website! 🌸**

For detailed documentation, see `README.md`
