'use strict';
/* ═══════════════════════════════════════════════════════════════
   ENDING.JS — Premium Cinematic Farewell
   Studio Ghibli · Disney · Luxury · Emotional · Timeless
   ═══════════════════════════════════════════════════════════════ */

/* ── State ── */
const ES = {
    running: false, rafId: null, startTime: null,
    audio: null, canvas: null, ctx: null, W: 0, H: 0,
    particles: [], flowers: [], fireworks: [], butterflies: [],
    stars: [], clouds: [], fwTimer: null, phase: 0
};

/* ══════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════ */
function endingInit() {
    buildDOM();
    window.addEventListener('resize', onResize, { passive: true });
    // Event delegation — works regardless of when elements appear
    document.body.addEventListener('click', function (e) {
        if (e.target.closest('#endingLaunchBtn')) onLaunchClick(e);
        if (e.target.closest('#endingClose'))     onEndingClose();
    });
}

function onResize() {
    if (!ES.canvas) return;
    ES.W = ES.canvas.width  = window.innerWidth;
    ES.H = ES.canvas.height = window.innerHeight;
}

/* ══════════════════════════════════════════════
   BUILD DOM
   ══════════════════════════════════════════════ */
function buildDOM() {
    if (document.getElementById('endingOverlay')) return;

    // Page transition fade
    const fade = document.createElement('div');
    fade.id = 'endingPageFade';
    document.body.appendChild(fade);

    // Main overlay
    const ov = document.createElement('div');
    ov.id = 'endingOverlay';
    ov.innerHTML = `
        <div id="endingSky"></div>
        <canvas id="endingCanvas"></canvas>
        <div id="endingClouds"></div>
        <div id="endingAurora">
            <div class="aurora-band"></div>
            <div class="aurora-band"></div>
            <div class="aurora-band"></div>
        </div>
        <div class="e-lens" style="width:22vw;height:22vw;top:6%;left:8%;--lens-op:0.45;animation-duration:9s;"></div>
        <div class="e-lens" style="width:12vw;height:12vw;top:20%;right:10%;--lens-op:0.3;animation-duration:13s;animation-delay:4s;"></div>
        <div id="endingInner">
            <div id="endingScrollArea">
                <div id="endingContent">
                    <h2 class="ending-heading" id="eh1">🌸 Thank You, Samruddhi</h2>
                    <div class="ending-divider" id="ediv1"></div>
                    <p class="ending-para" id="ep1">Thank you for being such a memorable part of my college journey.</p>
                    <p class="ending-para" id="ep2">Some people become part of our story for only a chapter,<br>yet remain in our memories for a lifetime.</p>
                    <p class="ending-para" id="ep3">I genuinely wish you happiness, success, peace,<br>and a beautiful future.</p>
                    <p class="ending-para" id="ep4">Thank you for taking the time to read everything.</p>
                    <p class="ending-para" id="ep5">Take care. 🌸</p>
                    <div class="ending-divider" id="ediv2"></div>
                    <svg id="endingSignatureSvg" viewBox="0 0 260 60" xmlns="http://www.w3.org/2000/svg">
                        <path id="sigPath" d="M18 42 C22 20,30 18,36 30 C40 38,38 44,34 44 C28 44,26 36,32 30 M44 44 L48 18 M44 32 L56 32 M58 20 C58 20,55 44,62 44 C68 44,68 32,64 32 C60 32,58 44,66 44 M72 44 L76 18 M80 28 C78 28,74 44,80 44 C86 44,86 28,80 28 M92 28 C90 28,86 44,92 44 C98 44,100 32,96 32 C92 32,90 44,98 44 M104 20 L104 44 M104 20 C108 20,114 22,114 28 C114 34,108 34,104 34 M120 28 C118 28,114 44,120 44 C126 44,128 28,120 28"/>
                    </svg>
                    <p class="ending-final-quote" id="efq">— Written with gratitude, honesty, and care.</p>
                </div>
            </div>
        </div>
        <button id="endingClose" aria-label="Close ending">✕</button>`;
    document.body.appendChild(ov);
    spawnClouds();
}

/* ══════════════════════════════════════════════
   LAUNCH CLICK
   ══════════════════════════════════════════════ */
function onLaunchClick(e) {
    if (ES.running) return;
    ES.running = true;

    // Ripple effect on button
    const btn = e.target.closest('#endingLaunchBtn');
    const rip = document.createElement('span');
    rip.className = 'btn-ripple';
    const rc = btn.getBoundingClientRect();
    const sz = Math.max(rc.width, rc.height) * 2.2;
    rip.style.cssText = `width:${sz}px;height:${sz}px;left:${e.clientX - rc.left}px;top:${e.clientY - rc.top}px`;
    btn.appendChild(rip);
    setTimeout(() => rip.remove(), 800);
    btn.classList.add('btn-used');

    // Fade out existing background music gracefully
    const pa = document.getElementById('audioPlayer');
    if (pa && !pa.paused) {
        const sv = pa.volume, t0 = performance.now();
        (function fo(now) {
            const p = Math.min((now - t0) / 1400, 1);
            pa.volume = sv * (1 - p);
            if (p < 1) requestAnimationFrame(fo);
            else { pa.pause(); pa.volume = sv; }
        })(performance.now());
    }

    // Fade to white then start ending
    const fade = document.getElementById('endingPageFade');
    fade.classList.add('fade-active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        startEnding();
        setTimeout(() => fade.classList.remove('fade-active'), 200);
    }, 1100);
}

/* ══════════════════════════════════════════════
   START ENDING
   ══════════════════════════════════════════════ */
function startEnding() {
    const ov = document.getElementById('endingOverlay');
    ov.classList.add('ending-active');
    ov.style.opacity = '0';
    ov.style.transition = 'opacity 1.8s ease';

    // Grab canvas fresh — overlay is now in DOM
    ES.canvas = document.getElementById('endingCanvas');
    ES.ctx    = ES.canvas.getContext('2d');
    ES.W      = ES.canvas.width  = window.innerWidth;
    ES.H      = ES.canvas.height = window.innerHeight;

    requestAnimationFrame(() => { ov.style.opacity = '1'; });

    // Kick off audio with fade-in
    startAudio();

    // Init all particle systems
    initStars();
    initParticles();
    initFlowers();
    ES.fireworks   = [];
    ES.butterflies = [];
    ES.startTime   = performance.now();
    ES.rafId       = requestAnimationFrame(loop);

    // Sky phase timeline
    const sky = document.getElementById('endingSky');
    setTimeout(() => sky.classList.add('phase-golden'),   1200);
    setTimeout(() => sky.classList.add('phase-evening'),  4500);
    setTimeout(() => sky.classList.add('phase-twilight'), 8000);
    setTimeout(() => sky.classList.add('phase-night'),   12000);

    // Aurora after night
    setTimeout(() => document.getElementById('endingAurora').classList.add('aurora-visible'), 13500);

    // Fireworks start after golden phase
    setTimeout(startFireworks, 2000);

    // Reveal text after 3 s
    setTimeout(() => {
        const c = document.getElementById('endingContent');
        if (c) c.classList.add('content-visible');
        revealText();
    }, 3200);

    // Butterflies in twilight
    setTimeout(initButterflies, 10000);

    // Close button
    setTimeout(() => document.getElementById('endingClose').classList.add('close-visible'), 5500);
}

/* ══════════════════════════════════════════════
   AUDIO
   ══════════════════════════════════════════════ */
function startAudio() {
    if (!ES.audio) {
        ES.audio = new Audio('assets/Chaudhary_0.mp3');
        ES.audio.preload = 'auto';
    }
    if (!ES.audio.paused) return;
    ES.audio.currentTime = 0;
    ES.audio.volume = 0;
    ES.audio.play().then(() => {
        fadeAudioTo(0.82, 3000);
    }).catch(() => {});
}

function fadeAudioTo(target, dur) {
    const t0 = performance.now(), start = ES.audio.volume;
    (function tick(now) {
        const p = Math.min((now - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        ES.audio.volume = Math.max(0, Math.min(1, start + (target - start) * eased));
        if (p < 1) requestAnimationFrame(tick);
    })(performance.now());
}

/* ══════════════════════════════════════════════
   MAIN RENDER LOOP
   ══════════════════════════════════════════════ */
function loop(now) {
    const el = now - ES.startTime;
    const { ctx, W, H } = ES;
    ctx.clearRect(0, 0, W, H);

    drawStars(ctx, el);
    drawParticles(ctx, el);
    drawFlowers(ctx, el);
    drawFireworks(ctx);
    drawButterflies(ctx, el);

    ES.rafId = requestAnimationFrame(loop);
}

/* ══════════════════════════════════════════════
   STARS
   ══════════════════════════════════════════════ */
function initStars() {
    ES.stars = Array.from({ length: 280 }, () => ({
        x:  Math.random(),
        y:  Math.random() * 0.7,
        r:  0.4 + Math.random() * 1.8,
        tw: Math.random() * Math.PI * 2,
        sp: 0.4 + Math.random() * 1.6,
        col: Math.random() > 0.7 ? '255,240,200' : '255,255,255'
    }));
}

function drawStars(ctx, el) {
    const t = el / 1000;
    // Stars fade in after 11 seconds (night phase)
    const alpha = Math.max(0, Math.min(1, (t - 11) / 6));
    if (alpha <= 0) return;
    ES.stars.forEach(s => {
        const op = alpha * (0.35 + 0.65 * Math.abs(Math.sin(s.tw + t * s.sp)));
        ctx.beginPath();
        ctx.arc(s.x * ES.W, s.y * ES.H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.col},${op})`;
        ctx.fill();
    });
}

/* ══════════════════════════════════════════════
   MAGICAL LIGHT PARTICLES
   ══════════════════════════════════════════════ */
function initParticles() {
    const palettes = [
        '212,175,55',   // warm gold
        '232,195,100',  // rose gold
        '255,245,200',  // champagne
        '255,255,240',  // warm white
        '240,200,160'   // peach gold
    ];
    ES.particles = Array.from({ length: 320 }, () => ({
        x:   Math.random() * ES.W,
        y:   Math.random() * ES.H,
        vx:  (Math.random() - 0.5) * 0.28,
        vy:  -0.08 - Math.random() * 0.42,
        r:   0.6 + Math.random() * 2.8,
        col: palettes[Math.floor(Math.random() * palettes.length)],
        ph:  Math.random() * Math.PI * 2,
        sp:  0.6 + Math.random() * 1.2,
        op:  0.25 + Math.random() * 0.55
    }));
}

function drawParticles(ctx, el) {
    const t = el / 1000;
    ES.particles.forEach(p => {
        p.x += p.vx + Math.sin(t * 0.4 + p.ph) * 0.22;
        p.y += p.vy;
        if (p.y < -6) { p.y = ES.H + 6; p.x = Math.random() * ES.W; }
        if (p.x < -6) p.x = ES.W + 6;
        if (p.x > ES.W + 6) p.x = -6;
        const a = p.op * (0.5 + 0.5 * Math.sin(t * p.sp + p.ph));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.col},${a})`;
        ctx.fill();
    });
}

/* ══════════════════════════════════════════════
   FLOWER SHOWER
   ══════════════════════════════════════════════ */

// Petal color palettes: [inner, outer]
const PETAL_COLORS = [
    ['#fff8f8', '#f9ccd8'],  // sakura pink
    ['#ffffff', '#fce8ee'],  // white lily
    ['#ffe0e8', '#e8809a'],  // rose
    ['#ffd8e8', '#f09098'],  // pink petal
    ['#ffffff', '#f0f0f0'],  // white petal
    ['#fff0f8', '#f8b8c8']   // blush
];

function mkFlower() {
    return {
        x:   Math.random() * (ES.W || innerWidth),
        y:   -(20 + Math.random() * 100),
        vx:  (Math.random() - 0.5) * 1.4,
        vy:  0.7 + Math.random() * 2.0,
        rot: Math.random() * Math.PI * 2,
        rs:  (Math.random() - 0.5) * 0.06,
        sz:  8 + Math.random() * 24,
        tp:  Math.floor(Math.random() * PETAL_COLORS.length),
        op:  0.55 + Math.random() * 0.4,
        sw:  Math.random() * Math.PI * 2,    // sway phase
        sa:  0.35 + Math.random() * 1.1,     // sway amplitude
        petals: 3 + Math.floor(Math.random() * 3) // 3-5 petals
    };
}

function initFlowers() {
    const H = ES.H || innerHeight;
    ES.flowers = Array.from({ length: 90 }, () => {
        const f = mkFlower();
        f.y = Math.random() * H; // pre-scatter vertically
        return f;
    });
}

function drawFlowers(ctx, el) {
    const t = el / 1000;
    for (const f of ES.flowers) {
        f.x   += f.vx + Math.sin(t * 0.55 + f.sw) * f.sa;
        f.y   += f.vy;
        f.rot += f.rs;

        // Respawn when off-screen
        if (f.y > ES.H + 50) {
            const n = mkFlower(); Object.assign(f, n);
        }
        if (f.x < -60) f.x = ES.W + 40;
        if (f.x > ES.W + 60) f.x = -40;

        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.rot);
        ctx.globalAlpha = f.op;
        drawPetal(ctx, f.tp, f.sz, f.petals);
        ctx.restore();
    }
    ctx.globalAlpha = 1;
}

function drawPetal(ctx, tp, sz, n) {
    const [c1, c2] = PETAL_COLORS[tp];
    const g = ctx.createRadialGradient(0, -sz * 0.1, 0, 0, 0, sz);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2);
    ctx.fillStyle = g;

    for (let i = 0; i < n; i++) {
        ctx.save();
        ctx.rotate((i / n) * Math.PI * 2);
        ctx.beginPath();
        ctx.ellipse(0, -sz * 0.48, sz * 0.28, sz * 0.52, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    // Centre dot
    ctx.beginPath();
    ctx.arc(0, 0, sz * 0.14, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,220,180,0.8)';
    ctx.fill();
}

/* ══════════════════════════════════════════════
   ELEGANT FIREWORKS
   Gold · Rose Gold · Warm White · Champagne only
   ══════════════════════════════════════════════ */
function startFireworks() {
    if (!ES.running) return;
    launchFirework();
    ES.fwTimer = setTimeout(startFireworks, 900 + Math.random() * 1400);
}

function launchFirework() {
    const GOLD_PALETTE = [
        '#d4af37', '#e8c84a', '#ffd970', '#fffadc',
        '#f0c8d0', '#e8d0f8', '#ffe4b8', '#fff8e8'
    ];
    const cx  = ES.W * (0.1 + Math.random() * 0.8);
    const cy  = ES.H * (0.05 + Math.random() * 0.4);
    const col = GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)];
    const pts = [];
    const n   = 55 + Math.floor(Math.random() * 45);

    // Main burst
    for (let i = 0; i < n; i++) {
        const a  = (i / n) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const sp = 1.2 + Math.random() * 3.8;
        pts.push({
            x: cx, y: cy,
            vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 0.8,
            life: 1, decay: 0.010 + Math.random() * 0.012,
            r: 1.4 + Math.random() * 2.6, col, glow: true
        });
    }
    // Sparkle trails
    for (let i = 0; i < 22; i++) {
        const a  = Math.random() * Math.PI * 2;
        const sp = 0.3 + Math.random() * 1.2;
        pts.push({
            x: cx, y: cy,
            vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
            life: 1, decay: 0.025 + Math.random() * 0.02,
            r: 0.7 + Math.random() * 1.2, col: '#fff8e0', glow: false
        });
    }
    ES.fireworks.push(pts);
}

function drawFireworks(ctx) {
    ES.fireworks = ES.fireworks.filter(pts => {
        let alive = false;
        for (const p of pts) {
            if (p.life <= 0.02) continue;
            alive = true;
            p.x  += p.vx; p.y += p.vy;
            p.vy += 0.055;       // gravity
            p.vx *= 0.978;       // drag
            p.life -= p.decay;
            const a = Math.max(0, p.life * 0.9);
            if (p.glow) {
                // Soft glow halo
                const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3.5);
                grad.addColorStop(0, p.col.replace(')', `,${a * 0.5})`).replace('rgb', 'rgba'));
                grad.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * 3.5, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();
            }
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
            ctx.fillStyle = p.col;
            ctx.globalAlpha = a;
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        return alive;
    });
}

/* ══════════════════════════════════════════════
   BUTTERFLIES — white & golden, subtle
   ══════════════════════════════════════════════ */
function initButterflies() {
    ES.butterflies = Array.from({ length: 8 }, () => ({
        x:  Math.random() * ES.W,
        y:  ES.H * (0.2 + Math.random() * 0.6),
        vx: (Math.random() - 0.5) * 1.1,
        vy: (Math.random() - 0.5) * 0.55,
        wp: Math.random() * Math.PI * 2,
        ws: 3.2 + Math.random() * 3.5,
        sz: 7 + Math.random() * 11,
        op: 0,
        gold: Math.random() > 0.5
    }));
}

function drawButterflies(ctx, el) {
    if (!ES.butterflies.length) return;
    const t = el / 1000;
    for (const b of ES.butterflies) {
        b.op = Math.min(0.6, b.op + 0.004);
        b.x += b.vx + Math.sin(t * 0.6 + b.wp) * 0.5;
        b.y += b.vy + Math.cos(t * 0.45 + b.wp) * 0.3;
        if (b.x < -40) b.x = ES.W + 30;
        if (b.x > ES.W + 40) b.x = -30;
        if (b.y < 10)       b.vy =  Math.abs(b.vy);
        if (b.y > ES.H - 10) b.vy = -Math.abs(b.vy);

        const wing = Math.abs(Math.sin(t * b.ws + b.wp));
        const wingCol = b.gold ? 'rgba(255,240,180,0.52)' : 'rgba(255,255,255,0.46)';
        const bodyCol = b.gold ? 'rgba(212,175,55,0.9)'   : 'rgba(220,220,220,0.85)';
        const rimCol  = b.gold ? 'rgba(212,175,55,0.35)'  : 'rgba(200,200,200,0.3)';

        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.globalAlpha = b.op;

        // Wings
        for (const s of [-1, 1]) {
            ctx.beginPath();
            ctx.ellipse(s * b.sz * wing, -b.sz * 0.15, b.sz * 0.92, b.sz * 0.55, s * 0.38, 0, Math.PI * 2);
            ctx.fillStyle = wingCol;
            ctx.fill();
            ctx.strokeStyle = rimCol;
            ctx.lineWidth = 0.7;
            ctx.stroke();
        }
        // Body
        ctx.beginPath();
        ctx.ellipse(0, 0, 1.6, b.sz * 0.35, 0, 0, Math.PI * 2);
        ctx.fillStyle = bodyCol;
        ctx.fill();

        ctx.restore();
    }
    ctx.globalAlpha = 1;
}

/* ══════════════════════════════════════════════
   CLOUDS (CSS-based, soft depth)
   ══════════════════════════════════════════════ */
function spawnClouds() {
    const container = document.getElementById('endingClouds');
    if (!container) return;

    const configs = [
        { w: '38vw', h: '18vw', top: '5%',  delay: '0s',   dur: '55s', op: 0.11 },
        { w: '28vw', h: '12vw', top: '12%', delay: '14s',  dur: '70s', op: 0.08 },
        { w: '45vw', h: '20vw', top: '2%',  delay: '28s',  dur: '80s', op: 0.09 },
        { w: '22vw', h: '10vw', top: '18%', delay: '5s',   dur: '48s', op: 0.07 },
        { w: '35vw', h: '16vw', top: '8%',  delay: '40s',  dur: '65s', op: 0.10 }
    ];

    configs.forEach(c => {
        const el = document.createElement('div');
        el.className = 'e-cloud';
        el.style.cssText = `
            width:${c.w}; height:${c.h}; top:${c.top};
            background: radial-gradient(ellipse at 50% 60%,
                rgba(255,250,240,0.85) 0%, rgba(255,245,230,0.4) 50%, transparent 80%);
            --cloud-op:${c.op};
            animation-duration:${c.dur};
            animation-delay:${c.delay};`;
        container.appendChild(el);
    });
}

/* ══════════════════════════════════════════════
   TEXT REVEAL
   ══════════════════════════════════════════════ */
function revealText() {
    const show = (id, delay) =>
        setTimeout(() => document.getElementById(id)?.classList.add('line-visible'), delay);

    show('eh1',   0);
    show('ediv1', 800);
    show('ep1',   1100);
    show('ep2',   2300);
    show('ep3',   3600);
    show('ep4',   4900);
    show('ep5',   6000);
    show('ediv2', 7000);

    // Signature — draw like real handwriting
    setTimeout(() => {
        const svg  = document.getElementById('endingSignatureSvg');
        const path = document.getElementById('sigPath');
        if (!svg || !path) return;
        svg.classList.add('sig-visible');
        setTimeout(() => {
            path.classList.add('sig-draw');
            // Gold sparkles when pen lifts
            setTimeout(sigSparkle, 2900);
        }, 300);
    }, 8000);

    show('efq', 11500);
}

function sigSparkle() {
    const svg = document.getElementById('endingSignatureSvg');
    if (!svg) return;
    const rc = svg.getBoundingClientRect();
    for (let i = 0; i < 10; i++) {
        const sp = document.createElement('div');
        const emoji = ['✦', '✧', '⋆', '✦'][Math.floor(Math.random() * 4)];
        sp.style.cssText = `
            position:fixed; z-index:9200; pointer-events:none;
            font-size:${0.5 + Math.random() * 0.55}rem;
            color:#d4af37; user-select:none;
            left:${rc.right - 25 + (Math.random() - 0.5) * 60}px;
            top:${rc.top + rc.height / 2 + (Math.random() - 0.5) * 30}px;
            animation: cursorPetalFade 1000ms ease-out forwards;
            --cp-rot:${Math.random() * 50 - 25}deg;
            --cp-dy:-${1.2 + Math.random() * 2}rem;
            --cp-dur:1000ms;`;
        sp.textContent = emoji;
        document.body.appendChild(sp);
        setTimeout(() => sp.remove(), 1050);
    }
}

/* ══════════════════════════════════════════════
   CLOSE / CLEANUP
   ══════════════════════════════════════════════ */
function onEndingClose() {
    // Fade out audio
    if (ES.audio && !ES.audio.paused) {
        const a = ES.audio, sv = a.volume, t0 = performance.now();
        (function fo(now) {
            const p = Math.min((now - t0) / 1600, 1);
            a.volume = sv * (1 - p);
            if (p < 1) requestAnimationFrame(fo); else a.pause();
        })(performance.now());
    }

    clearTimeout(ES.fwTimer);
    cancelAnimationFrame(ES.rafId);
    ES.running = false;
    ES.fireworks = [];
    ES.butterflies = [];

    const ov = document.getElementById('endingOverlay');
    ov.style.transition = 'opacity 1.1s ease';
    ov.style.opacity = '0';

    setTimeout(() => {
        ov.classList.remove('ending-active');
        ov.style.opacity = '';

        // Reset all revealed elements
        ['eh1','ediv1','ep1','ep2','ep3','ep4','ep5','ediv2','efq']
            .forEach(id => document.getElementById(id)?.classList.remove('line-visible'));

        document.getElementById('endingSignatureSvg')?.classList.remove('sig-visible');
        document.getElementById('sigPath')?.classList.remove('sig-draw');
        document.getElementById('endingContent')?.classList.remove('content-visible');
        document.getElementById('endingSky')?.className = '';
        document.getElementById('endingAurora')?.classList.remove('aurora-visible');
        document.getElementById('endingClose')?.classList.remove('close-visible');
        document.getElementById('endingLaunchBtn')?.classList.remove('btn-used');

        // Restore scroll
        document.body.style.overflow = '';

        // Clean up canvas refs for next open
        ES.canvas = null;
        ES.ctx    = null;
        ES.running = false;
    }, 1150);
}

/* ══════════════════════════════════════════════
   BOOTSTRAP
   ══════════════════════════════════════════════ */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', endingInit);
} else {
    endingInit();
}
