const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const els = {
    hero: document.getElementById("heroSection"),
    letter: document.getElementById("letterSection"),
    openButton: document.getElementById("openButton"),
    closeButton: document.getElementById("closeButton"),
    openingBloom: document.getElementById("openingBloom"),
    petalLayer: document.getElementById("petalLayer"),
    flowerProgress: document.getElementById("flowerProgress"),
    scrollProgress: document.getElementById("scrollProgress"),
    scrollProgressBloom: document.getElementById("scrollProgressBloom"),
    signatureRow: document.getElementById("signatureRow"),
    finalChapterParagraph: document.getElementById("finalChapterParagraph"),
    audio: document.getElementById("audioPlayer"),
    musicPlayer: document.getElementById("musicPlayer"),
    playButton: document.getElementById("playButton"),
    progressInput: document.getElementById("progressInput"),
    volumeInput: document.getElementById("volumeInput"),
    currentTime: document.getElementById("currentTime"),
    durationTime: document.getElementById("durationTime")
};

const state = {
    opened: false,
    transitionRunning: false,
    petalsCalmed: false,
    progressBloomed: false,
    siteStartedAt: performance.now(),
    letterReadProgress: 0,
    finalChapterReached: false,
    finalChapterInView: false,
    finalChapterEntryAt: 0,
    finalChapterActive: false,
    musicEverPlayed: false,
    finalChapterMusicAttempted: false
};

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
}

function createRipple(button, event) {
    if (!button || prefersReducedMotion) return;

    const rect = button.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height);

    ripple.className = "ripple";
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    button.appendChild(ripple);

    window.setTimeout(() => ripple.remove(), 760);
}

function createPetal(options = {}) {
    if (!els.petalLayer || prefersReducedMotion) return null;

    const petal = document.createElement("span");
    const size = options.size || 7 + Math.random() * 11;
    const x = options.x ?? Math.random() * window.innerWidth;
    const y = options.y ?? "-9vh";
    const drift = options.drift ?? (Math.random() - 0.5) * (window.innerWidth < 760 ? 70 : 150);
    const duration = options.duration || 12000 + Math.random() * 9000;

    petal.className = "petal";
    petal.style.setProperty("--size", `${size}px`);
    petal.style.setProperty("--x", `${x}px`);
    petal.style.setProperty("--y", typeof y === "number" ? `${y}px` : y);
    petal.style.setProperty("--drift", `${drift}px`);
    petal.style.setProperty("--r", `${Math.random() * 360}deg`);
    petal.style.setProperty("--duration", `${duration}ms`);
    petal.style.setProperty("--opacity", `${options.opacity ?? 0.2 + Math.random() * 0.22}`);
    els.petalLayer.appendChild(petal);

    window.setTimeout(() => petal.remove(), duration + 120);
    return petal;
}

function createOpeningBurst() {
    if (prefersReducedMotion) return;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < 12; i += 1) {
        window.setTimeout(() => {
            const petal = document.createElement("span");
            const angle = Math.random() * Math.PI * 2;
            const distance = 34 + Math.random() * 78;

            petal.className = "burst-petal";
            petal.style.setProperty("--x", `${centerX}px`);
            petal.style.setProperty("--y", `${centerY}px`);
            petal.style.setProperty("--size", `${6 + Math.random() * 7}px`);
            petal.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
            petal.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
            document.body.appendChild(petal);

            window.setTimeout(() => petal.remove(), 1700);
        }, i * 36);
    }
}

function setupPetals() {
    if (!els.petalLayer || prefersReducedMotion) return;

    const baseMaxPetals = window.innerWidth < 760 ? 12 : 18;
    let activePetals = 0;

    function spawnPetal() {
        const maxPetals = state.finalChapterActive ? baseMaxPetals + 8 : baseMaxPetals;
        if (activePetals >= maxPetals) return;

        activePetals += 1;
        const petal = createPetal({
            opacity: state.finalChapterActive ? 0.26 + Math.random() * 0.16 : state.petalsCalmed ? 0.13 + Math.random() * 0.14 : undefined,
            duration: state.finalChapterActive ? 9000 + Math.random() * 7000 : state.petalsCalmed ? 15000 + Math.random() * 10000 : undefined
        });

        if (!petal) {
            activePetals -= 1;
            return;
        }

        const duration = Number.parseFloat(petal.style.getPropertyValue("--duration"));
        window.setTimeout(() => {
            activePetals -= 1;
        }, duration + 150);
    }

    for (let i = 0; i < Math.ceil(baseMaxPetals / 2); i += 1) {
        window.setTimeout(spawnPetal, i * 900);
    }

    window.setInterval(spawnPetal, window.innerWidth < 760 ? 1800 : 1500);
}

function driftPetalsFromSignature() {
    if (prefersReducedMotion) return;

    const rect = els.signatureRow.getBoundingClientRect();
    const originX = rect.left + rect.width * 0.78;

    for (let i = 0; i < 5; i += 1) {
        window.setTimeout(() => {
            createPetal({
                x: originX + (Math.random() - 0.5) * 42,
                y: rect.top + rect.height * 0.45,
                size: 6 + Math.random() * 7,
                drift: 40 + Math.random() * 90,
                duration: 5200 + Math.random() * 2300,
                opacity: 0.28
            });
        }, i * 320);
    }
}

function createFinalChapterPetals() {
    if (prefersReducedMotion) return;

    for (let i = 0; i < 10; i += 1) {
        window.setTimeout(() => {
            createPetal({
                x: Math.random() * window.innerWidth,
                size: 7 + Math.random() * 9,
                drift: (Math.random() - 0.35) * (window.innerWidth < 760 ? 90 : 170),
                duration: 7600 + Math.random() * 4200,
                opacity: 0.25 + Math.random() * 0.16
            });
        }, i * 260);
    }
}

function setupReveals() {
    const revealItems = document.querySelectorAll(".reveal");

    if (prefersReducedMotion) {
        revealItems.forEach((item) => item.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.14,
        rootMargin: "0px 0px -7% 0px"
    });

    revealItems.forEach((item) => observer.observe(item));
}

function setupSignatureBloom() {
    if (!els.signatureRow) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting || els.signatureRow.classList.contains("bloomed")) return;

            els.signatureRow.classList.add("bloomed");
            state.petalsCalmed = true;
            state.progressBloomed = true;
            els.flowerProgress?.querySelector(".bloom")?.classList.add("is-active");
            if (els.scrollProgressBloom) els.scrollProgressBloom.style.width = "100%";
            driftPetalsFromSignature();
            observer.unobserve(els.signatureRow);
        });
    }, {
        threshold: 0.58
    });

    observer.observe(els.signatureRow);
}

function setupScrollProgress() {
    if (!els.flowerProgress || !els.scrollProgress || !els.scrollProgressBloom) return;

    let ticking = false;

    function update() {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
        const firstStage = clamp(progress / 0.52, 0, 1);
        const bloomStage = clamp((progress - 0.52) / 0.48, 0, 1);

        els.scrollProgress.style.width = `${firstStage * 100}%`;
        els.scrollProgressBloom.style.width = `${bloomStage * 100}%`;

        els.flowerProgress.querySelector(".seed")?.classList.add("is-active");
        els.flowerProgress.querySelector(".stem")?.classList.toggle("is-active", progress > 0.28);
        els.flowerProgress.querySelector(".bloom")?.classList.toggle("is-active", progress > 0.78 || state.progressBloomed);
        ticking = false;
    }

    window.addEventListener("scroll", () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
    }, { passive: true });

    update();
}

function setupScrollPetals() {
    if (!els.petalLayer || prefersReducedMotion) return;

    let lastScrollTime = 0;
    const scrollPetalThrottle = 180;

    window.addEventListener("scroll", () => {
        const now = performance.now();
        if (now - lastScrollTime < scrollPetalThrottle) return;
        lastScrollTime = now;

        const scrollVelocity = Math.abs(window.scrollY - (window.__lastScrollY || 0)) / scrollPetalThrottle;
        window.__lastScrollY = window.scrollY;

        if (scrollVelocity > 0.05 && Math.random() > 0.4) {
            const petalCount = Math.ceil(scrollVelocity * 2.5);
            for (let i = 0; i < petalCount; i++) {
                window.setTimeout(() => {
                    createPetal({
                        x: Math.random() * window.innerWidth,
                        opacity: 0.15 + Math.random() * 0.18,
                        duration: 8000 + Math.random() * 6000
                    });
                }, i * 80);
            }
        }
    }, { passive: true });
}

function updateLetterReadProgress() {
    const letterBody = document.querySelector(".letter-body");
    if (!state.opened || !letterBody) return;

    const letterTop = letterBody.getBoundingClientRect().top + window.scrollY;
    const readableHeight = Math.max(letterBody.scrollHeight, 1);
    const viewportBottom = window.scrollY + window.innerHeight;
    const progress = clamp((viewportBottom - letterTop) / readableHeight, 0, 1);

    state.letterReadProgress = Math.max(state.letterReadProgress, progress);
}

function hasSpentEnoughTime() {
    return performance.now() - state.siteStartedAt >= 20000;
}

function checkFinalChapterMusic() {
    if (state.finalChapterMusicAttempted || state.musicEverPlayed || !els.audio) return;

    updateLetterReadProgress();

    const hasReadingProgress = state.letterReadProgress >= 0.4;
    const timeOk = hasSpentEnoughTime();
    const finalParagraphEnteredAfterTimeGate = state.finalChapterEntryAt - state.siteStartedAt >= 20000;

    if (state.finalChapterInView && finalParagraphEnteredAfterTimeGate && timeOk && hasReadingProgress) {
        state.finalChapterReached = true;
    }

    // Also trigger if she's in view of final paragraph AND has read enough, even without time gate
    // (covers fast readers and mobile users)
    if (state.finalChapterInView && hasReadingProgress && timeOk) {
        state.finalChapterReached = true;
    }

    if (!timeOk || !hasReadingProgress || !state.finalChapterReached) return;

    startFinalChapterMusic();
}

function setupReadingIntentAutoplay() {
    if (!els.finalChapterParagraph || !els.audio) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            state.finalChapterInView = entry.isIntersecting;
            if (entry.isIntersecting) {
                state.finalChapterEntryAt = performance.now();
                checkFinalChapterMusic();
            }
        });
    }, {
        threshold: 0.48
    });

    observer.observe(els.finalChapterParagraph);

    window.addEventListener("scroll", () => {
        updateLetterReadProgress();
        checkFinalChapterMusic();
    }, { passive: true });

    window.setTimeout(checkFinalChapterMusic, 45000);
}

function startFinalChapterMusic() {
    state.finalChapterMusicAttempted = true;
    state.musicEverPlayed = true;
    state.finalChapterActive = true;

    document.body.classList.add("final-chapter");
    createFinalChapterPetals();

    window.setTimeout(() => {
        state.finalChapterActive = false;
    }, 16000);

    els.audio.volume = 0;
    els.volumeInput.value = "0";

    els.audio.play()
        .then(() => fadeAudioVolume(0.50, 4000))
        .catch(() => {
            // Autoplay blocked — show tap hint so she knows music is waiting
            state.finalChapterActive = false;
            document.body.classList.remove("final-chapter");
            state.musicEverPlayed = false;
            showTapHint();
        });
}

function fadeAudioVolume(targetVolume, duration) {
    return new Promise((resolve) => {
        const startTime = performance.now();
        const startVolume = els.audio.volume;

        function tick(now) {
            const progress = clamp((now - startTime) / duration, 0, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const volume = startVolume + (targetVolume - startVolume) * eased;

            els.audio.volume = clamp(volume, 0, 1);
            if (targetVolume > 0) {
                els.volumeInput.value = String(Math.round(volume * 100));
            }

            if (progress < 1 && !els.audio.paused) {
                requestAnimationFrame(tick);
            } else {
                resolve();
            }
        }

        requestAnimationFrame(tick);
    });
}

function setupFlowerParallax() {
    if (prefersReducedMotion || window.innerWidth < 820) return;

    const corners = document.querySelectorAll(".flower-corner");
    if (!corners.length) return;

    let mouseX = 0;
    let mouseY = 0;
    let frame = null;

    function update() {
        const x = (mouseX / window.innerWidth - 0.5) * 8;
        const y = (mouseY / window.innerHeight - 0.5) * 8;

        corners.forEach((corner, index) => {
            const direction = index % 2 === 0 ? 1 : -1;
            corner.style.translate = `${x * direction}px ${y * direction}px`;
        });

        frame = null;
    }

    window.addEventListener("mousemove", (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;

        if (!frame) {
            frame = requestAnimationFrame(update);
        }
    }, { passive: true });
}

function setupMusic() {
    if (!els.audio || !els.playButton) return;

    els.audio.volume = 0.50;
    els.volumeInput.value = "50";

    // Loop button
    const loopBtn = document.getElementById("loopButton");
    let loopEnabled = false;

    if (loopBtn) {
        loopBtn.addEventListener("click", () => {
            loopEnabled = !loopEnabled;
            els.audio.loop = loopEnabled;
            loopBtn.classList.toggle("is-active", loopEnabled);
            loopBtn.setAttribute("aria-label", loopEnabled ? "Disable loop" : "Enable loop");
        });
    }

    // Play button — bloom ring + toggle
    els.playButton.addEventListener("click", (event) => {
        createRipple(els.playButton, event);
        // Bloom ring effect
        els.playButton.classList.remove("bloom-ring");
        void els.playButton.offsetWidth; // reflow to restart animation
        els.playButton.classList.add("bloom-ring");
        window.setTimeout(() => els.playButton.classList.remove("bloom-ring"), 650);
        toggleMusic();
    });

    els.volumeInput.addEventListener("input", () => {
        els.audio.volume = Number(els.volumeInput.value) / 100;
    });

    els.progressInput.addEventListener("input", () => {
        if (!Number.isFinite(els.audio.duration)) return;
        els.audio.currentTime = (Number(els.progressInput.value) / 100) * els.audio.duration;
    });

    els.audio.addEventListener("loadedmetadata", () => {
        els.durationTime.textContent = formatTime(els.audio.duration);
    });

    els.audio.addEventListener("timeupdate", () => {
        if (!Number.isFinite(els.audio.duration)) return;
        const progress = (els.audio.currentTime / els.audio.duration) * 100;
        els.progressInput.value = String(progress);
        els.currentTime.textContent = formatTime(els.audio.currentTime);
    });

    // #10 — Graceful replay after song ends (3s silence then fade back in)
    els.audio.addEventListener("ended", () => {
        if (loopEnabled) return; // native loop handles it
        els.musicPlayer.classList.remove("is-playing");
        els.playButton.setAttribute("aria-label", "Play music");

        window.setTimeout(() => {
            if (els.audio.paused) {
                els.audio.currentTime = 0;
                els.audio.volume = 0;
                els.audio.play()
                    .then(() => fadeAudioVolume(Number(els.volumeInput.value) / 100, 3000))
                    .catch(() => {});
            }
        }, 3000);
    });

    els.audio.addEventListener("play", () => {
        state.musicEverPlayed = true;
        els.musicPlayer.classList.add("is-playing");
        els.playButton.setAttribute("aria-label", "Pause music");
        // #9 — hide tap hint
        hideTapHint();
        // #7 — mood shift
        document.body.classList.add("music-playing");
    });

    els.audio.addEventListener("pause", () => {
        els.musicPlayer.classList.remove("is-playing");
        els.playButton.setAttribute("aria-label", "Play music");
        // #7 — revert mood
        document.body.classList.remove("music-playing");
    });
}

// #9 — Show tap hint when autoplay is blocked on mobile
function showTapHint() {
    const hint = document.getElementById("musicTapHint");
    if (hint) hint.classList.add("is-visible");
}

function hideTapHint() {
    const hint = document.getElementById("musicTapHint");
    if (hint) hint.classList.remove("is-visible");
}

function toggleMusic() {
    if (!els.audio) return;

    if (els.audio.paused) {
        els.audio.play().catch(() => {});
    } else {
        els.audio.pause();
    }
}

async function openLetter(event) {
    if (state.transitionRunning || state.opened) return;

    state.transitionRunning = true;
    state.opened = true;
    state.letterReadProgress = 0;
    state.finalChapterReached = false;
    state.finalChapterInView = false;
    state.finalChapterEntryAt = 0;

    createRipple(els.openButton, event);
    els.openingBloom.classList.add("is-active");
    createOpeningBurst();

    await wait(prefersReducedMotion ? 80 : 760);

    els.hero.classList.add("is-leaving");
    els.letter.classList.add("is-visible");

    await wait(prefersReducedMotion ? 40 : 680);

    els.letter.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
    });

    await wait(prefersReducedMotion ? 60 : 1100);

    els.hero.setAttribute("aria-hidden", "true");
    els.openingBloom.classList.remove("is-active");
    state.transitionRunning = false;
}

function closeLetter() {
    // #6 — Fade out audio gently instead of hard stop
    if (els.audio && !els.audio.paused) {
        fadeAudioVolume(0, 1800).then?.(() => {});
        window.setTimeout(() => {
            if (!els.audio.paused) els.audio.pause();
            els.audio.volume = Number(els.volumeInput.value) / 100;
        }, 1900);
    }

    state.opened = false;
    state.progressBloomed = false;
    state.finalChapterActive = false;
    state.letterReadProgress = 0;
    state.finalChapterReached = false;
    state.finalChapterInView = false;
    state.finalChapterMusicAttempted = false; // allow replay if reopened
    document.body.classList.remove("final-chapter");
    document.body.classList.remove("music-playing");
    els.hero.classList.remove("is-leaving");
    els.hero.removeAttribute("aria-hidden");
    els.letter.classList.remove("is-visible");
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
}

function init() {
    setupPetals();
    setupScrollPetals();
    setupReveals();
    setupSignatureBloom();
    setupScrollProgress();
    setupFlowerParallax();
    setupMusic();
    setupReadingIntentAutoplay();
    setupCursorPetalTrail();
    setupFlowerCards();
    setupFloralDividers();
    setupPetalRainButton();
    setupMarginBuds();
    setupAmbientGlow();
    setupClosingMoment();
    setupGoldenHour();
    setupConfetti();

    els.openButton?.addEventListener("click", openLetter);
    els.closeButton?.addEventListener("click", closeLetter);
    setupFinalChapterBtn();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}

// ─────────────────────────────────────────────
// CURSOR PETAL TRAIL  (desktop) / SCROLL PETALS (mobile)
// ─────────────────────────────────────────────
function setupCursorPetalTrail() {
    if (prefersReducedMotion) return;

    const isTouchDevice = window.matchMedia("(hover: none)").matches;

    if (isTouchDevice) {
        // On mobile: spawn flower emojis while finger scrolls — works on both pages
        const emojis = ["🌸", "🌷", "🌺", "🌼", "🌹"];
        let lastTouchY = 0;
        let isTouching = false;
        let spawnInterval = null;

        function spawnScrollPetal() {
            const el = document.createElement("div");
            el.className = "cursor-petal";
            el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

            // Random position across the visible viewport width and height
            const vx = 8 + Math.random() * 84; // 8–92% viewport width
            const vy = 10 + Math.random() * 75; // 10–85% viewport height

            el.style.left = `${(vx / 100) * window.innerWidth}px`;
            el.style.top = `${(vy / 100) * window.innerHeight}px`;
            el.style.setProperty("--cp-size", `${1 + Math.random() * 0.8}rem`);
            el.style.setProperty("--cp-rot", `${Math.random() * 360}deg`);
            el.style.setProperty("--cp-dy", `${-(1.8 + Math.random() * 2.2)}rem`);
            el.style.setProperty("--cp-dur", `${750 + Math.random() * 450}ms`);
            document.body.appendChild(el);
            window.setTimeout(() => el.remove(), 1250);
        }

        document.addEventListener("touchstart", (e) => {
            isTouching = true;
            lastTouchY = e.touches[0]?.clientY ?? 0;
        }, { passive: true });

        document.addEventListener("touchmove", (e) => {
            if (!isTouching) return;
            const touch = e.touches[0];
            if (!touch) return;

            const dy = Math.abs(touch.clientY - lastTouchY);
            lastTouchY = touch.clientY;

            // Only spawn if finger is actually moving
            if (dy < 4) return;

            // Clear existing interval and restart — gives a "while moving" feel
            if (!spawnInterval) {
                spawnScrollPetal(); // immediate first petal
                spawnInterval = window.setInterval(spawnScrollPetal, 180);
            }
        }, { passive: true });

        document.addEventListener("touchend", () => {
            isTouching = false;
            if (spawnInterval) {
                clearInterval(spawnInterval);
                spawnInterval = null;
            }
        }, { passive: true });

        document.addEventListener("touchcancel", () => {
            isTouching = false;
            if (spawnInterval) {
                clearInterval(spawnInterval);
                spawnInterval = null;
            }
        }, { passive: true });

        return;
    }

    // Desktop: follow the mouse cursor
    const petalEmojis = ["🌸", "🌷", "🌺", "🌼", "🌹", "✿"];
    let lastX = 0;
    let lastY = 0;
    let lastPetalTime = 0;
    const throttleMs = 80;

    document.addEventListener("mousemove", (e) => {
        const now = performance.now();
        if (now - lastPetalTime < throttleMs) return;

        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        const speed = Math.sqrt(dx * dx + dy * dy);

        if (speed < 8) return;

        lastX = e.clientX;
        lastY = e.clientY;
        lastPetalTime = now;

        const petal = document.createElement("div");
        petal.className = "cursor-petal";
        petal.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];

        const size = 0.7 + Math.random() * 0.7;
        const rot = Math.random() * 360;
        const dy2 = -(1.2 + Math.random() * 2);
        const dur = 700 + Math.random() * 500;

        petal.style.left = `${e.clientX}px`;
        petal.style.top = `${e.clientY}px`;
        petal.style.setProperty("--cp-size", `${size}rem`);
        petal.style.setProperty("--cp-rot", `${rot}deg`);
        petal.style.setProperty("--cp-dy", `${dy2}rem`);
        petal.style.setProperty("--cp-dur", `${dur}ms`);

        document.body.appendChild(petal);
        window.setTimeout(() => petal.remove(), dur + 50);
    }, { passive: true });
}

// ─────────────────────────────────────────────
// FLOWER CARDS — 3D TILT + STAGGERED ENTRANCE
// ─────────────────────────────────────────────
function setupFlowerCards() {
    const cards = document.querySelectorAll(".flower-card");
    if (!cards.length) return;

    const isTouchDevice = window.matchMedia("(hover: none)").matches;

    // Staggered entrance — must re-observe after the letter section becomes visible
    // because cards start inside display:none and IntersectionObserver won't fire
    function observeCards() {
        const entranceObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("card-visible");
                entranceObserver.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });

        cards.forEach((card) => {
            // Already visible — add immediately
            if (card.classList.contains("card-visible")) return;
            entranceObserver.observe(card);
        });
    }

    // Hook into the open button to start observing once letter is shown
    const openBtn = document.getElementById("openButton");
    if (openBtn) {
        openBtn.addEventListener("click", () => {
            // Wait for the letter section transition (≈1600ms total)
            window.setTimeout(observeCards, 1200);
        }, { once: true });
    }

    // Fallback — also observe after a short delay in case letter was already open
    window.setTimeout(observeCards, 500);

    // ── Mobile: tap burst (flower emoji flies up on tap) ──
    if (isTouchDevice) {
        cards.forEach((card) => {
            card.addEventListener("touchend", (e) => {
                const touch = e.changedTouches[0];
                if (!touch) return;
                spawnTapFlower(touch.clientX, touch.clientY);
            }, { passive: true });
        });
        return; // skip 3D tilt on touch devices
    }

    // ── Desktop: 3D tilt on mousemove ──
    if (prefersReducedMotion) return;

    cards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) / (rect.width / 2);
            const dy = (e.clientY - cy) / (rect.height / 2);
            const tiltX = -dy * 9;
            const tiltY = dx * 9;
            card.style.transform = `translateY(-0.8rem) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
        }, { passive: true });

        card.addEventListener("mouseleave", () => {
            // Let CSS transition handle the reset
            card.style.transform = "";
        }, { passive: true });
    });
}

// Spawn a floating flower emoji on tap (mobile delight)
function spawnTapFlower(x, y) {
    if (prefersReducedMotion) return;
    const emojis = ["🌸", "🌷", "🌺", "🌼", "🌹"];
    const el = document.createElement("div");
    el.className = "cursor-petal";
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.setProperty("--cp-size", "1.4rem");
    el.style.setProperty("--cp-rot", `${Math.random() * 40 - 20}deg`);
    el.style.setProperty("--cp-dy", `-${2.5 + Math.random() * 1.5}rem`);
    el.style.setProperty("--cp-dur", "900ms");
    document.body.appendChild(el);
    window.setTimeout(() => el.remove(), 960);
}

// ─────────────────────────────────────────────
// FLORAL VINE DIVIDERS — trigger bloom on scroll
// ─────────────────────────────────────────────
function setupFloralDividers() {
    const dividers = document.querySelectorAll(".floral-divider");
    if (!dividers.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("divider-visible");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.4 });

    dividers.forEach((d) => observer.observe(d));
}

// ─────────────────────────────────────────────
// #4 — PETAL RAIN BUTTON
// ─────────────────────────────────────────────
function setupPetalRainButton() {
    const btn = document.getElementById("petalRainBtn");
    if (!btn || prefersReducedMotion) return;

    function triggerPetalRain() {
        const count = window.innerWidth < 600 ? 22 : 38;
        for (let i = 0; i < count; i++) {
            window.setTimeout(() => {
                createPetal({
                    x: Math.random() * window.innerWidth,
                    y: "-6vh",
                    size: 8 + Math.random() * 14,
                    drift: (Math.random() - 0.45) * (window.innerWidth < 760 ? 80 : 160),
                    duration: 4500 + Math.random() * 5000,
                    opacity: 0.28 + Math.random() * 0.3
                });
            }, i * 60);
        }

        // Bounce the button
        btn.style.transform = "scale(0.82)";
        window.setTimeout(() => { btn.style.transform = ""; }, 200);
    }

    btn.addEventListener("click", triggerPetalRain);
    btn.addEventListener("touchend", (e) => {
        e.preventDefault();
        triggerPetalRain();
    });
}

// ─────────────────────────────────────────────
// #3 — MARGIN BUDS REVEAL ON SCROLL
// ─────────────────────────────────────────────
function setupMarginBuds() {
    const buds = document.querySelectorAll(".margin-bud");
    if (!buds.length) return;

    // Reveal buds one by one as the letter body scrolls into view
    const letterBody = document.querySelector(".letter-body");
    if (!letterBody) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            // Stagger bud reveals
            buds.forEach((bud, i) => {
                window.setTimeout(() => {
                    bud.classList.add("bud-visible");
                }, i * 280);
            });
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.1 });

    observer.observe(letterBody);
}

// ─────────────────────────────────────────────
// #8 — AMBIENT SCROLL GLOW DRIFT
// Moves the CSS custom properties --glow-x / --glow-y
// based on scroll position so the bg gradient shifts
// ─────────────────────────────────────────────
function setupAmbientGlow() {
    // CSS @property isn't universally supported — we drive it via inline style on body instead
    let ticking = false;

    function updateGlow() {
        const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        const progress = window.scrollY / max; // 0 → 1

        // Smoothly interpolate glow position
        const gx = 18 + progress * 60; // 18% → 78%
        const gy = 6 + progress * 14;  // 6%  → 20%

        document.body.style.setProperty("--scroll-glow-x", `${gx.toFixed(1)}%`);
        document.body.style.setProperty("--scroll-glow-y", `${gy.toFixed(1)}%`);
        ticking = false;
    }

    window.addEventListener("scroll", () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(updateGlow);
    }, { passive: true });

    updateGlow();
}

// ─────────────────────────────────────────────
// GRATITUDE SCENE — SVG + Web Animations API
// Full sequence: walk-in → hand on heart →
// salute → whole-body bow → smile → sparkles
// → text fade in
// ─────────────────────────────────────────────
function setupGratitudeScene() {
    const scene = document.getElementById("gratitudeScene");
    if (!scene || prefersReducedMotion) {
        // reduced motion: just show everything immediately
        const svg = document.getElementById("gSvg");
        const txt = document.getElementById("gText");
        const spr = document.getElementById("gSparkles");
        if (svg) { svg.style.transform = "translateX(0)"; svg.style.opacity = "1"; }
        if (txt) { txt.style.opacity = "1"; txt.style.transform = "none"; }
        if (spr) { spr.setAttribute("opacity", "1"); }
        return;
    }

    let played = false;

    function runScene() {
        if (played) return;
        played = true;

        const svg       = document.getElementById("gSvg");
        const charGrp   = document.getElementById("gCharSvg");
        const headGrp   = document.getElementById("gHeadGroup");
        const armR      = document.getElementById("gArmR");
        const foreR     = document.getElementById("gForeR");
        const legL      = document.getElementById("gLegL");
        const legR      = document.getElementById("gLegR");
        const smile     = document.getElementById("gSmile");
        const eyeL      = document.getElementById("eyeL");
        const eyeR      = document.getElementById("eyeR");
        const sparkles  = document.getElementById("gSparkles");
        const sparks    = scene.querySelectorAll(".spark");
        const txt       = document.getElementById("gText");

        if (!svg || !charGrp) return;

        const ease    = "cubic-bezier(0.4, 0, 0.2, 1)";
        const easeOut = "cubic-bezier(0.2, 0.8, 0.2, 1)";
        const spring  = "cubic-bezier(0.34, 1.56, 0.64, 1)";

        // ── STEP 1: Walk in from left (0 → 1400ms) ──
        svg.animate([
            { transform: "translateX(-110vw)", opacity: 0 },
            { transform: "translateX(-80vw)",  opacity: 1, offset: 0.1 },
            { transform: "translateX(-50vw) translateY(-4px)", offset: 0.3 },
            { transform: "translateX(-25vw) translateY(3px)",  offset: 0.5 },
            { transform: "translateX(-10vw) translateY(-3px)", offset: 0.7 },
            { transform: "translateX(-2vw)  translateY(2px)",  offset: 0.85 },
            { transform: "translateX(0)     translateY(0)",    opacity: 1 }
        ], { duration: 1600, easing: ease, fill: "forwards" });

        // walking leg swing during walk-in
        legL.animate([
            { transform: "rotate(-10deg)", transformOrigin: "100px 228px" },
            { transform: "rotate(10deg)",  transformOrigin: "100px 228px" },
            { transform: "rotate(-8deg)",  transformOrigin: "100px 228px" },
            { transform: "rotate(6deg)",   transformOrigin: "100px 228px" },
            { transform: "rotate(0deg)",   transformOrigin: "100px 228px" }
        ], { duration: 1400, easing: ease, fill: "forwards" });

        legR.animate([
            { transform: "rotate(10deg)",  transformOrigin: "100px 230px" },
            { transform: "rotate(-10deg)", transformOrigin: "100px 230px" },
            { transform: "rotate(8deg)",   transformOrigin: "100px 230px" },
            { transform: "rotate(-6deg)",  transformOrigin: "100px 230px" },
            { transform: "rotate(0deg)",   transformOrigin: "100px 230px" }
        ], { duration: 1400, easing: ease, fill: "forwards" });

        // ── STEP 2: Hand over heart (1800 → 2600ms) ──
        window.setTimeout(() => {
            armR.animate([
                { transform: "rotate(0deg)",   transformOrigin: "124px 162px" },
                { transform: "rotate(-50deg)", transformOrigin: "124px 162px" }
            ], { duration: 700, easing: spring, fill: "forwards" });

            foreR.animate([
                { transform: "rotate(0deg)",   transformOrigin: "136px 172px" },
                { transform: "rotate(20deg)",  transformOrigin: "136px 172px" }
            ], { duration: 700, easing: spring, fill: "forwards" });
        }, 1800);

        // ── STEP 3: Rise to respectful salute (3000 → 3600ms) ──
        window.setTimeout(() => {
            armR.animate([
                { transform: "rotate(-50deg)", transformOrigin: "124px 162px" },
                { transform: "rotate(-85deg)", transformOrigin: "124px 162px" }
            ], { duration: 600, easing: easeOut, fill: "forwards" });

            foreR.animate([
                { transform: "rotate(20deg)",  transformOrigin: "136px 172px" },
                { transform: "rotate(-15deg)", transformOrigin: "136px 172px" }
            ], { duration: 600, easing: easeOut, fill: "forwards" });
        }, 3000);

        // ── STEP 4: Whole-body gentle bow (3800 → 4500ms) ──
        window.setTimeout(() => {
            charGrp.animate([
                { transform: "rotate(0deg)",    transformOrigin: "100px 280px" },
                { transform: "rotate(12deg)",   transformOrigin: "100px 280px", offset: 0.6 },
                { transform: "rotate(10deg)",   transformOrigin: "100px 280px" }
            ], { duration: 700, easing: easeOut, fill: "forwards" });
        }, 3800);

        // ── STEP 5: Eyes scrunch, smile widens (4200ms) ──
        window.setTimeout(() => {
            // eyes scrunch
            eyeL.animate([
                { ry: 8 }, { ry: 3 }
            ], { duration: 400, easing: easeOut, fill: "forwards" });
            eyeR.animate([
                { ry: 8 }, { ry: 3 }
            ], { duration: 400, easing: easeOut, fill: "forwards" });

            // smile widens via path morph
            smile.animate([
                { d: "path('M88 128 Q100 138 112 128')" },
                { d: "path('M83 126 Q100 142 117 126')" }
            ], { duration: 500, easing: spring, fill: "forwards" });
        }, 4200);

        // ── STEP 6: Sparkles appear (4600ms) ──
        window.setTimeout(() => {
            sparkles.animate([
                { opacity: 0 }, { opacity: 1 }
            ], { duration: 600, easing: "ease", fill: "forwards" });

            // each spark floats independently
            sparks.forEach((sp, i) => {
                sp.animate([
                    { transform: "translateY(0) scale(1)",   opacity: 0.9 },
                    { transform: "translateY(-8px) scale(1.4)", opacity: 1,  offset: 0.5 },
                    { transform: "translateY(0) scale(0.8)", opacity: 0.6 }
                ], {
                    duration: 2200 + i * 150,
                    delay: i * 120,
                    iterations: Infinity,
                    easing: "ease-in-out"
                });
            });
        }, 4600);

        // ── STEP 7: Text fades in (5200ms) ──
        window.setTimeout(() => {
            if (!txt) return;
            txt.animate([
                { opacity: 0, transform: "translateY(10px)" },
                { opacity: 1, transform: "translateY(0)" }
            ], { duration: 1000, easing: easeOut, fill: "forwards" });
        }, 5200);
    }

    // Observe and trigger once when scrolled into view
    function observeScene() {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                window.setTimeout(runScene, 300);
                obs.unobserve(scene);
            });
        }, { threshold: 0.3 });
        obs.observe(scene);
    }

    // Hook to open button + fallback
    const openBtn = document.getElementById("openButton");
    if (openBtn) {
        openBtn.addEventListener("click", () => {
            window.setTimeout(observeScene, 1400);
        }, { once: true });
    }
    window.setTimeout(observeScene, 600);
}

// ─────────────────────────────────────────────
// CLOSING MOMENT — lily bloom + handwritten line
// + section petals + wax seal
// ─────────────────────────────────────────────
function setupClosingMoment() {
    if (prefersReducedMotion) {
        document.getElementById("bloomLilyScene")?.classList.add("lily-active");
        document.getElementById("handwrittenLine")?.classList.add("hw-active");
        const seal = document.getElementById("waxSeal");
        const wrap = document.getElementById("waxSealWrapper");
        if (seal) { seal.style.transform = "scale(1)"; seal.style.opacity = "1"; }
        if (wrap) wrap.classList.add("seal-visible");
        return;
    }

    // ── All closing animations trigger when "— Atharva" signature is visible ──
    function activateAll() {
        // #2 Section petals
        document.getElementById("sectionPetals")?.classList.add("petals-active");

        // #1 Lily bloom — small delay so she sees the signature first
        window.setTimeout(() => {
            document.getElementById("bloomLilyScene")?.classList.add("lily-active");
        }, 400);

        // Handwritten line — after lily starts
        window.setTimeout(() => {
            document.getElementById("handwrittenLine")?.classList.add("hw-active");
        }, 800);

        // Wax seal — stamps in after handwritten line
        window.setTimeout(() => {
            const waxSeal = document.getElementById("waxSeal");
            const waxWrap = document.getElementById("waxSealWrapper");
            if (waxSeal) waxSeal.classList.add("seal-stamp");
            if (waxWrap) waxWrap.classList.add("seal-visible");
        }, 1400);
    }

    // Watch the signature row — when "— Atharva" enters view, fire everything
    function observeSignature() {
        const sig = document.getElementById("signatureRow");
        if (!sig) return;

        const obs = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                activateAll();
                obs.unobserve(sig);
            });
        }, { threshold: 0.6 });

        obs.observe(sig);
    }

    const openBtn = document.getElementById("openButton");
    if (openBtn) {
        openBtn.addEventListener("click", () => {
            window.setTimeout(observeSignature, 1400);
        }, { once: true });
    }
    window.setTimeout(observeSignature, 600);
}

// ─────────────────────────────────────────────
// #6 — GOLDEN HOUR BACKGROUND SHIFT
// Activates when wax seal area enters view,
// reverses when scrolled back up
// ─────────────────────────────────────────────
function setupGoldenHour() {
    const trigger = document.getElementById("waxSealWrapper");
    if (!trigger || prefersReducedMotion) return;

    function observeGolden() {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    document.body.classList.add("golden-hour");
                } else {
                    document.body.classList.remove("golden-hour");
                }
            });
        }, { threshold: 0.2 });
        obs.observe(trigger);
    }

    const openBtn = document.getElementById("openButton");
    if (openBtn) {
        openBtn.addEventListener("click", () => {
            window.setTimeout(observeGolden, 1400);
        }, { once: true });
    }
    window.setTimeout(observeGolden, 600);
}

// ─────────────────────────────────────────────
// #7 — CONFETTI BURST at the footer
// Fires once when she reaches the very end
// ─────────────────────────────────────────────
function setupConfetti() {
    const footer = document.getElementById("letterFooter");
    const layer  = document.getElementById("confettiLayer");
    if (!footer || !layer || prefersReducedMotion) return;

    const colors = [
        "#f7c5d0", "#fde9a0", "#fff",
        "#d4a8c7", "#a8d4c4", "#f9b8c4",
        "#ffe4b8", "#c8e6c9"
    ];

    function burst() {
        const count = window.innerWidth < 600 ? 40 : 70;
        for (let i = 0; i < count; i++) {
            const pc = document.createElement("div");
            pc.className = "confetti-piece";

            const isRect = Math.random() > 0.5;
            const w = 5 + Math.random() * 8;
            const h = isRect ? w * 0.4 : w;

            pc.style.setProperty("--cw", `${w}px`);
            pc.style.setProperty("--ch", `${h}px`);
            pc.style.setProperty("--cr", isRect ? "2px" : "50%");
            pc.style.setProperty("--cc", colors[Math.floor(Math.random() * colors.length)]);
            pc.style.setProperty("--cdelay", `${Math.random() * 0.6}s`);
            pc.style.setProperty("--cd", `${1.8 + Math.random() * 1.2}s`);
            pc.style.setProperty("--ce", "cubic-bezier(0.2, 0.8, 0.4, 1)");

            // Spread from centre of footer
            const angle = (Math.random() * 180) - 90; // -90 to +90 deg (upward spread)
            const dist  = 60 + Math.random() * 180;
            const dx    = Math.sin(angle * Math.PI / 180) * dist;
            const dy    = -Math.abs(Math.cos(angle * Math.PI / 180) * dist) - 40; // always goes up first

            pc.style.setProperty("--cdx", `${dx}px`);
            pc.style.setProperty("--cdy", `${dy + 200}px`); // then falls down
            pc.style.setProperty("--cdr", `${Math.random() * 720 - 360}deg`);

            // Start at random x position along footer
            pc.style.left = `${20 + Math.random() * 60}%`;
            pc.style.bottom = "10px";

            layer.appendChild(pc);
            window.setTimeout(() => pc.remove(), 3200);
        }
    }

    let fired = false;

    function observeFooter() {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting || fired) return;
                fired = true;
                window.setTimeout(burst, 300);
                obs.unobserve(footer);
            });
        }, { threshold: 0.5 });
        obs.observe(footer);
    }

    const openBtn = document.getElementById("openButton");
    if (openBtn) {
        openBtn.addEventListener("click", () => {
            window.setTimeout(observeFooter, 1400);
        }, { once: true });
    }
    window.setTimeout(observeFooter, 600);
}


// ─────────────────────────────────────────────
// FINAL CHAPTER BUTTON — ripple, petal burst, petals activation
// ─────────────────────────────────────────────
function setupFinalChapterBtn() {
    const btn  = document.getElementById("endingLaunchBtn");
    const wrap = document.getElementById("fcsBtnWrap");
    if (!btn) return;

    // Activate floating petals when section scrolls into view
    if (wrap) {
        const petalObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    wrap.classList.add("petals-active");
                } else {
                    wrap.classList.remove("petals-active");
                }
            });
        }, { threshold: 0.3 });
        petalObserver.observe(wrap);
    }

    // Ripple + petal burst on click
    btn.addEventListener("click", (e) => {
        // Ripple
        const ripple = document.createElement("span");
        ripple.className = "fcs-ripple";
        const rc  = btn.getBoundingClientRect();
        const sz  = Math.max(rc.width, rc.height) * 2.2;
        ripple.style.cssText = `width:${sz}px;height:${sz}px;left:${e.clientX - rc.left}px;top:${e.clientY - rc.top}px`;
        btn.appendChild(ripple);
        window.setTimeout(() => ripple.remove(), 750);

        // Petal burst from button centre
        if (!prefersReducedMotion) {
            const cx = rc.left + rc.width  / 2;
            const cy = rc.top  + rc.height / 2;
            const emojis = ["🌸", "🌷", "🌺", "🌼", "✦"];
            for (let i = 0; i < 10; i++) {
                window.setTimeout(() => {
                    const p   = document.createElement("div");
                    const ang = (i / 10) * Math.PI * 2 + Math.random() * 0.5;
                    const dst = 40 + Math.random() * 70;
                    p.style.cssText = `
                        position:fixed; z-index:9999; pointer-events:none;
                        font-size:${0.9 + Math.random() * 0.7}rem;
                        left:${cx}px; top:${cy}px;
                        transform:translate(-50%,-50%);
                        animation: fcsBurst 800ms ease-out forwards;
                        --bx:${Math.cos(ang) * dst}px;
                        --by:${Math.sin(ang) * dst - 30}px;`;
                    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                    document.body.appendChild(p);
                    window.setTimeout(() => p.remove(), 850);
                }, i * 40);
            }
        }
    });

    // Inject burst keyframe once
    if (!document.getElementById("fcsBurstStyle")) {
        const s = document.createElement("style");
        s.id = "fcsBurstStyle";
        s.textContent = `
            @keyframes fcsBurst {
                0%   { opacity:1; transform:translate(-50%,-50%) translate(0,0) scale(1); }
                100% { opacity:0; transform:translate(-50%,-50%) translate(var(--bx),var(--by)) scale(0.4); }
            }`;
        document.head.appendChild(s);
    }
}
