'use strict';
/* ═══════════════════════════════════════════════════════════════
   ENDING-PAGE.JS — Standalone Cinematic Farewell
   Runs on ending.html — the dedicated Thank You page
   ═══════════════════════════════════════════════════════════════ */

const EP = {
    canvas: null, ctx: null, W: 0, H: 0,
    rafId: null, startTime: null,
    particles: [], flowers: [], fireworks: [],
    butterflies: [], stars: [],
    fwTimer: null, running: false
};

/* ── Boot ── */
function init() {
    EP.canvas = document.getElementById('endingCanvas');
    EP.ctx    = EP.canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize, { passive: true });

    spawnClouds();
    startAudio();
    initStars();
    initParticles();
    initFlowers();

    EP.startTime = performance.now();
    EP.running   = true;
    EP.rafId     = requestAnimationFrame(loop);

    // Sky timeline — 7 phases across 55 seconds
    const sky = document.getElementById('endingSky');
    setTimeout(() => sky.classList.add('phase-golden'),    1000);   //  1s — warm golden sunrise
    setTimeout(() => sky.classList.add('phase-amber'),     9000);   //  9s — amber afternoon glow
    setTimeout(() => sky.classList.add('phase-sunset'),   17000);   // 17s — fiery orange sunset
    setTimeout(() => sky.classList.add('phase-evening'),  25000);   // 25s — soft orange-pink evening
    setTimeout(() => sky.classList.add('phase-twilight'), 34000);   // 34s — purple twilight
    setTimeout(() => sky.classList.add('phase-indigo'),   43000);   // 43s — deep indigo dusk
    setTimeout(() => sky.classList.add('phase-night'),    52000);   // 52s — starry night
    setTimeout(() => document.getElementById('endingAurora').classList.add('aurora-visible'), 54000);

    // Fireworks
    setTimeout(startFireworks, 1800);

    // Text reveal after 2.8 s
    setTimeout(() => {
        document.getElementById('endingContent').classList.add('content-visible');
        revealText();
    }, 2800);

    // Butterflies in twilight
    setTimeout(initButterflies, 9500);

    // Close button after 5 s
    setTimeout(() => document.getElementById('endingClose').classList.add('close-visible'), 5000);

    // Close button → back to letter
    document.getElementById('endingClose').addEventListener('click', () => {
        if (EP.audio && !EP.audio.paused) fadeAudioTo(0, 1400, () => EP.audio.pause());
        window.history.length > 1 ? window.history.back() : (window.location.href = 'index.html');
    });
}

function resize() {
    EP.W = EP.canvas.width  = window.innerWidth;
    EP.H = EP.canvas.height = window.innerHeight;
}

/* ── Audio ── */
function startAudio() {
    EP.audio = document.getElementById('endingAudio');
    if (!EP.audio) return;
    EP.audio.volume = 0;
    EP.audio.play().then(() => fadeAudioTo(0.82, 3200)).catch(() => {
        // Autoplay blocked — page still looks great; flowers keep floating
    });

    // Trigger cinematic ending at 90% playback — runs exactly once
    let endingTriggered = false;
    EP.audio.addEventListener('timeupdate', () => {
        if (endingTriggered) return;
        if (!EP.audio.duration || EP.audio.duration === Infinity) return;
        if (EP.audio.currentTime >= EP.audio.duration * 0.90) {
            endingTriggered = true;
            startCinematicEnding();
        }
    });
}

function fadeAudioTo(target, dur, onDone) {
    if (!EP.audio) return;
    const t0 = performance.now(), start = EP.audio.volume;
    (function tick(now) {
        const p     = Math.min((now - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        EP.audio.volume = Math.max(0, Math.min(1, start + (target - start) * eased));
        if (p < 1) requestAnimationFrame(tick);
        else if (onDone) onDone();
    })(performance.now());
}

/* ── Main loop ── */
function loop(now) {
    const el = now - EP.startTime;
    EP.ctx.clearRect(0, 0, EP.W, EP.H);
    drawStars(EP.ctx, el);
    drawParticles(EP.ctx, el);
    drawFlowers(EP.ctx, el);
    drawFireworks(EP.ctx);
    drawButterflies(EP.ctx, el);
    EP.rafId = requestAnimationFrame(loop);
}

/* ── Stars ── */
function initStars() {
    EP.stars = Array.from({ length: 280 }, () => ({
        x: Math.random(), y: Math.random() * 0.7,
        r: 0.4 + Math.random() * 1.8,
        tw: Math.random() * Math.PI * 2,
        sp: 0.4 + Math.random() * 1.6,
        col: Math.random() > 0.7 ? '255,240,200' : '255,255,255'
    }));
}

function drawStars(ctx, el) {
    const t = el / 1000;
    const alpha = Math.max(0, Math.min(1, (t - 11) / 6));
    if (alpha <= 0) return;
    EP.stars.forEach(s => {
        const op = alpha * (0.35 + 0.65 * Math.abs(Math.sin(s.tw + t * s.sp)));
        ctx.beginPath();
        ctx.arc(s.x * EP.W, s.y * EP.H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.col},${op})`;
        ctx.fill();
    });
}

/* ── Magic particles ── */
function initParticles() {
    const C = ['212,175,55','232,195,100','255,245,200','255,255,240','240,200,160'];
    EP.particles = Array.from({ length: 300 }, () => ({
        x: Math.random() * EP.W, y: Math.random() * EP.H,
        vx: (Math.random() - 0.5) * 0.28, vy: -0.08 - Math.random() * 0.42,
        r: 0.6 + Math.random() * 2.8,
        col: C[Math.floor(Math.random() * C.length)],
        ph: Math.random() * Math.PI * 2, sp: 0.6 + Math.random() * 1.2,
        op: 0.25 + Math.random() * 0.55
    }));
}

function drawParticles(ctx, el) {
    const t = el / 1000;
    EP.particles.forEach(p => {
        p.x += p.vx + Math.sin(t * 0.4 + p.ph) * 0.22; p.y += p.vy;
        if (p.y < -6) { p.y = EP.H + 6; p.x = Math.random() * EP.W; }
        if (p.x < -6) p.x = EP.W + 6;
        if (p.x > EP.W + 6) p.x = -6;
        const a = p.op * (0.5 + 0.5 * Math.sin(t * p.sp + p.ph));
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.col},${a})`; ctx.fill();
    });
}

/* ── Flower shower ── */
const PETAL_COLORS = [
    ['#fff8f8','#f9ccd8'], ['#ffffff','#fce8ee'], ['#ffe0e8','#e8809a'],
    ['#ffd8e8','#f09098'], ['#ffffff','#f0f0f0'], ['#fff0f8','#f8b8c8']
];

function mkFlower() {
    return {
        x: Math.random() * (EP.W || innerWidth),
        y: -(20 + Math.random() * 100),
        vx: (Math.random() - 0.5) * 1.4, vy: 0.7 + Math.random() * 2.0,
        rot: Math.random() * Math.PI * 2, rs: (Math.random() - 0.5) * 0.06,
        sz: 8 + Math.random() * 24, tp: Math.floor(Math.random() * PETAL_COLORS.length),
        op: 0.55 + Math.random() * 0.4,
        sw: Math.random() * Math.PI * 2, sa: 0.35 + Math.random() * 1.1,
        petals: 3 + Math.floor(Math.random() * 3)
    };
}

function initFlowers() {
    EP.flowers = Array.from({ length: 90 }, () => {
        const f = mkFlower(); f.y = Math.random() * (EP.H || innerHeight); return f;
    });
}

function drawFlowers(ctx, el) {
    const t = el / 1000;
    // After song ends (EP.running=false), slow multiplier for peaceful drift
    const speedMult = EP.running ? 1.0 : 0.5;
    for (const f of EP.flowers) {
        f.x += (f.vx + Math.sin(t * 0.55 + f.sw) * f.sa) * speedMult;
        f.y += f.vy * speedMult;
        f.rot += f.rs * speedMult;
        if (f.y > EP.H + 50) {
            const n = mkFlower();
            Object.assign(f, n);
            // Keep slow speed after song ends
            if (!EP.running) { f.vy *= 0.5; f.vx *= 0.5; f.sa *= 0.5; }
        }
        if (f.x < -60) f.x = EP.W + 40;
        if (f.x > EP.W + 60) f.x = -40;
        ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(f.rot); ctx.globalAlpha = f.op;
        drawPetal(ctx, f.tp, f.sz, f.petals);
        ctx.restore();
    }
    ctx.globalAlpha = 1;
}

function drawPetal(ctx, tp, sz, n) {
    const [c1, c2] = PETAL_COLORS[tp];
    const g = ctx.createRadialGradient(0, -sz * 0.1, 0, 0, 0, sz);
    g.addColorStop(0, c1); g.addColorStop(1, c2);
    ctx.fillStyle = g;
    for (let i = 0; i < n; i++) {
        ctx.save(); ctx.rotate((i / n) * Math.PI * 2);
        ctx.beginPath(); ctx.ellipse(0, -sz * 0.48, sz * 0.28, sz * 0.52, 0, 0, Math.PI * 2);
        ctx.fill(); ctx.restore();
    }
    ctx.beginPath(); ctx.arc(0, 0, sz * 0.14, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,220,180,0.8)'; ctx.fill();
}

/* ── Fireworks ── */
function startFireworks() {
    if (!EP.running) return;
    launchFirework();
    EP.fwTimer = setTimeout(startFireworks, 900 + Math.random() * 1400);
}

function launchFirework() {
    const GOLD = ['#d4af37','#e8c84a','#ffd970','#fffadc','#f0c8d0','#e8d0f8','#ffe4b8','#fff8e8'];
    const cx = EP.W * (0.1 + Math.random() * 0.8);
    const cy = EP.H * (0.05 + Math.random() * 0.4);
    const col = GOLD[Math.floor(Math.random() * GOLD.length)];
    const pts = [];
    const n = 55 + Math.floor(Math.random() * 45);
    for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const sp = 1.2 + Math.random() * 3.8;
        pts.push({ x:cx, y:cy, vx:Math.cos(a)*sp, vy:Math.sin(a)*sp-0.8,
            life:1, decay:0.010+Math.random()*0.012, r:1.4+Math.random()*2.6, col, glow:true });
    }
    for (let i = 0; i < 22; i++) {
        const a = Math.random()*Math.PI*2, sp = 0.3+Math.random()*1.2;
        pts.push({ x:cx, y:cy, vx:Math.cos(a)*sp, vy:Math.sin(a)*sp,
            life:1, decay:0.025+Math.random()*0.02, r:0.7+Math.random()*1.2, col:'#fff8e0', glow:false });
    }
    EP.fireworks.push(pts);
}

function drawFireworks(ctx) {
    EP.fireworks = EP.fireworks.filter(pts => {
        let alive = false;
        for (const p of pts) {
            if (p.life <= 0.02) continue; alive = true;
            p.x += p.vx; p.y += p.vy; p.vy += 0.055; p.vx *= 0.978; p.life -= p.decay;
            const a = Math.max(0, p.life * 0.9);
            if (p.glow) {
                const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*3.5);
                g.addColorStop(0, p.col); g.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.beginPath(); ctx.arc(p.x,p.y,p.r*3.5,0,Math.PI*2);
                ctx.fillStyle = g; ctx.globalAlpha = a*0.4; ctx.fill();
            }
            ctx.beginPath(); ctx.arc(p.x,p.y,p.r*p.life,0,Math.PI*2);
            ctx.fillStyle = p.col; ctx.globalAlpha = a; ctx.fill();
        }
        ctx.globalAlpha = 1; return alive;
    });
}

/* ── Butterflies ── */
function initButterflies() {
    EP.butterflies = Array.from({ length: 8 }, () => ({
        x: Math.random()*EP.W, y: EP.H*(0.2+Math.random()*0.6),
        vx: (Math.random()-0.5)*1.1, vy: (Math.random()-0.5)*0.55,
        wp: Math.random()*Math.PI*2, ws: 3.2+Math.random()*3.5,
        sz: 7+Math.random()*11, op: 0, gold: Math.random()>0.5
    }));
}

function drawButterflies(ctx, el) {
    if (!EP.butterflies.length) return;
    const t = el / 1000;
    for (const b of EP.butterflies) {
        b.op = Math.min(0.6, b.op + 0.004);
        b.x += b.vx + Math.sin(t*0.6+b.wp)*0.5;
        b.y += b.vy + Math.cos(t*0.45+b.wp)*0.3;
        if (b.x < -40) b.x = EP.W+30; if (b.x > EP.W+40) b.x = -30;
        if (b.y < 10) b.vy = Math.abs(b.vy); if (b.y > EP.H-10) b.vy = -Math.abs(b.vy);
        const wing    = Math.abs(Math.sin(t*b.ws+b.wp));
        const wingCol = b.gold ? 'rgba(255,240,180,0.52)' : 'rgba(255,255,255,0.46)';
        const bodyCol = b.gold ? 'rgba(212,175,55,0.9)'   : 'rgba(220,220,220,0.85)';
        const rimCol  = b.gold ? 'rgba(212,175,55,0.35)'  : 'rgba(200,200,200,0.3)';
        ctx.save(); ctx.translate(b.x, b.y); ctx.globalAlpha = b.op;
        for (const s of [-1,1]) {
            ctx.beginPath(); ctx.ellipse(s*b.sz*wing, -b.sz*0.15, b.sz*0.92, b.sz*0.55, s*0.38, 0, Math.PI*2);
            ctx.fillStyle = wingCol; ctx.fill(); ctx.strokeStyle = rimCol; ctx.lineWidth = 0.7; ctx.stroke();
        }
        ctx.beginPath(); ctx.ellipse(0,0,1.6,b.sz*0.35,0,0,Math.PI*2);
        ctx.fillStyle = bodyCol; ctx.fill(); ctx.restore();
    }
    ctx.globalAlpha = 1;
}

/* ── Clouds ── */
function spawnClouds() {
    const container = document.getElementById('endingClouds');
    if (!container) return;
    [
        { w:'38vw', h:'18vw', top:'5%',  delay:'0s',  dur:'55s', op:0.11 },
        { w:'28vw', h:'12vw', top:'12%', delay:'14s', dur:'70s', op:0.08 },
        { w:'45vw', h:'20vw', top:'2%',  delay:'28s', dur:'80s', op:0.09 },
        { w:'22vw', h:'10vw', top:'18%', delay:'5s',  dur:'48s', op:0.07 },
        { w:'35vw', h:'16vw', top:'8%',  delay:'40s', dur:'65s', op:0.10 }
    ].forEach(c => {
        const el = document.createElement('div');
        el.className = 'e-cloud';
        el.style.cssText = `width:${c.w};height:${c.h};top:${c.top};
            background:radial-gradient(ellipse at 50% 60%,rgba(255,250,240,0.85) 0%,rgba(255,245,230,0.4) 50%,transparent 80%);
            --cloud-op:${c.op};animation-duration:${c.dur};animation-delay:${c.delay};`;
        container.appendChild(el);
    });
}

/* ── Text reveal ── */
function revealText() {
    const show = (id, d) => setTimeout(() => document.getElementById(id)?.classList.add('line-visible'), d);
    show('eh1',   0);
    show('ediv1', 800);
    show('ep1',   1100);
    show('ep2',   2400);
    show('ep3',   3700);
    show('ep4',   5000);
    show('ep5',   6100);
    show('ediv2', 7100);

    // Handwritten signature
    setTimeout(() => {
        const svg  = document.getElementById('endingSignatureSvg');
        const path = document.getElementById('sigPath');
        if (!svg || !path) return;
        svg.classList.add('sig-visible');
        setTimeout(() => { path.classList.add('sig-draw'); setTimeout(sigSparkle, 3000); }, 300);
    }, 8200);

    show('efq', 12000);
}

function sigSparkle() {
    const svg = document.getElementById('endingSignatureSvg');
    if (!svg) return;
    const rc = svg.getBoundingClientRect();
    ['✦','✧','⋆','✦','✧'].forEach((ch, i) => {
        setTimeout(() => {
            const sp = document.createElement('div');
            sp.style.cssText = `position:fixed;z-index:999;pointer-events:none;
                font-size:${0.5+Math.random()*0.5}rem;color:#d4af37;
                left:${rc.right-20+(Math.random()-0.5)*60}px;
                top:${rc.top+rc.height/2+(Math.random()-0.5)*30}px;
                animation:sparkleFloat 1s ease-out forwards;`;
            sp.textContent = ch;
            document.body.appendChild(sp);
            setTimeout(() => sp.remove(), 1050);
        }, i * 120);
    });
}

/* ── Sparkle keyframe (injected once) ── */
(function injectSparkleAnim() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes sparkleFloat {
            0%   { opacity:1; transform:translateY(0) scale(1); }
            100% { opacity:0; transform:translateY(-2rem) scale(0.5); }
        }`;
    document.head.appendChild(style);
})();

/* ── Bootstrap ── */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

/* ══════════════════════════════════════════════════════════════
   CINEMATIC ENDING SEQUENCE
   Triggered at 90% audio playback — music continues underneath.
   ══════════════════════════════════════════════════════════════ */
function startCinematicEnding() {

    // ── 0s: Fireworks stop, flowers & particles soften ──
    EP.running = false;
    clearTimeout(EP.fwTimer);
    EP.flowers.forEach(f   => { f.vy *= 0.60; f.vx *= 0.60; f.sa *= 0.60; });
    EP.particles.forEach(p => { p.vy *= 0.65; p.vx *= 0.65; });

    // Hide close button — no interaction from here
    const closeBtn = document.getElementById('endingClose');
    if (closeBtn) {
        closeBtn.style.transition = 'opacity 1.2s ease';
        closeBtn.style.opacity = '0';
        closeBtn.style.pointerEvents = 'none';
    }

    // ── 1.5s: Background dims, aurora fades ──
    setTimeout(() => {
        const sky = document.getElementById('endingSky');
        const aurora = document.getElementById('endingAurora');
        if (sky)    { sky.style.transition    = 'opacity 2.8s ease'; sky.style.opacity    = '0.3'; }
        if (aurora) { aurora.style.transition = 'opacity 2.5s ease'; aurora.style.opacity = '0';   }
        EP.canvas.style.transition = 'opacity 2.8s ease';
        EP.canvas.style.opacity    = '0.4';
    }, 1500);

    // ── 3s: Velvet curtains begin closing — music still playing ──
    setTimeout(() => {
        const L = document.getElementById('curtainLeft');
        const R = document.getElementById('curtainRight');
        if (L) L.classList.add('curtain-close');
        if (R) R.classList.add('curtain-close');
    }, 3000);

    // ── 7s: Curtains fully closed — gently fade audio to silence ──
    setTimeout(() => {
        // Audio fades out over ~1s matching the final note
        fadeAudioTo(0, 1200);
    }, 7000);

    // ── 8s: Everything behind curtains fades to black ──
    setTimeout(() => {
        cancelAnimationFrame(EP.rafId);
        EP.canvas.style.transition = 'opacity 1s ease'; EP.canvas.style.opacity = '0';
        const sky    = document.getElementById('endingSky');
        const inner  = document.getElementById('endingInner');
        const clouds = document.getElementById('endingClouds');
        [sky, inner, clouds].forEach(el => {
            if (el) { el.style.transition = 'opacity 1s ease'; el.style.opacity = '0'; }
        });
    }, 8000);

    // ── 9s: Black credits screen fades in ──
    setTimeout(() => {
        const screen = document.getElementById('creditsScreen');
        if (screen) screen.classList.add('credits-bg-visible');
        initCreditsCanvas();
    }, 9000);

    // ── 9s: "Made with Gratitude." ──
    setTimeout(() => showCreditBlock('creditBlock1'), 9000);

    // ── 12s: Hide block 1 ──
    setTimeout(() => hideCreditBlock('creditBlock1'), 12000);

    // ── 13.5s: "Designed & Created by / Atharva Pawar" ──
    setTimeout(() => showCreditBlock('creditBlock2'), 13500);

    // ── 17.5s: Hide block 2 ──
    setTimeout(() => hideCreditBlock('creditBlock2'), 17500);

    // ── 19s: "BE Computer Engineering / Class of 2026" ──
    setTimeout(() => showCreditBlock('creditBlock3'), 19000);

    // ── 23s: Final fade — credits canvas dims ──
    setTimeout(() => {
        hideCreditBlock('creditBlock3');
        const cc = document.getElementById('creditsCanvas');
        if (cc) { cc.style.transition = 'opacity 3s ease'; cc.style.opacity = '0'; }
    }, 23000);

    // ── 26s: Total blackout ──
    setTimeout(() => {
        cancelAnimationFrame(CC.rafId);
        const screen = document.getElementById('creditsScreen');
        if (screen) {
            screen.style.transition = 'background 1s ease';
            screen.style.background = '#000';
        }
    }, 26000);
}

function showCreditBlock(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('credits-hide');
    // Force reflow so transition fires
    void el.offsetWidth;
    el.classList.add('credits-show');
}

function hideCreditBlock(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('credits-show');
    el.classList.add('credits-hide');
}

/* ── Tiny gold particle canvas for credits ── */
let CC = { canvas: null, ctx: null, pts: [], rafId: null, W: 0, H: 0 };

function initCreditsCanvas() {
    CC.canvas = document.getElementById('creditsCanvas');
    if (!CC.canvas) return;
    CC.ctx = CC.canvas.getContext('2d');
    CC.W   = CC.canvas.width  = window.innerWidth;
    CC.H   = CC.canvas.height = window.innerHeight;

    // Spawn sparse gold particles
    CC.pts = Array.from({ length: 120 }, () => ({
        x: Math.random() * CC.W, y: Math.random() * CC.H,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -0.06 - Math.random() * 0.22,
        r:  0.5 + Math.random() * 2.2,
        ph: Math.random() * Math.PI * 2,
        op: 0.15 + Math.random() * 0.35
    }));

    CC.canvas.classList.add('credits-visible');
    CC.rafId = requestAnimationFrame(creditsLoop);
}

function creditsLoop(now) {
    if (!CC.ctx) return;
    CC.ctx.clearRect(0, 0, CC.W, CC.H);
    const t = now / 1000;
    CC.pts.forEach(p => {
        p.x += p.vx + Math.sin(t * 0.3 + p.ph) * 0.15;
        p.y += p.vy;
        if (p.y < -4) { p.y = CC.H + 4; p.x = Math.random() * CC.W; }
        const a = p.op * (0.5 + 0.5 * Math.sin(t * 0.8 + p.ph));
        CC.ctx.beginPath();
        CC.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        CC.ctx.fillStyle = `rgba(212,175,55,${a})`;
        CC.ctx.fill();
    });
    CC.rafId = requestAnimationFrame(creditsLoop);
}

/* ── Bootstrap ── */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
