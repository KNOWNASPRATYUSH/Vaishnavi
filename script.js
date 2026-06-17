/* ================================================================
   Her Universe — script.js
   Chapter navigation, counter, bubbles, hearts, film drag, letter
   ================================================================ */

'use strict';

// ─────────────────────────────────────────────────────────────────
// 1. BACKGROUND BUBBLES
// ─────────────────────────────────────────────────────────────────
(function spawnBubbles() {
    const container = document.getElementById('bubble-container');
    if (!container) return;

    const COLORS = [
        'radial-gradient(circle at 30% 30%, rgba(255,180,215,0.9), rgba(255,77,166,0.35))',
        'radial-gradient(circle at 30% 30%, rgba(210,178,255,0.9), rgba(146,84,222,0.35))',
        'radial-gradient(circle at 30% 30%, rgba(255,220,180,0.9), rgba(255,154,92,0.35))',
        'radial-gradient(circle at 30% 30%, rgba(180,220,255,0.9), rgba(100,170,255,0.35))',
    ];

    for (let i = 0; i < 20; i++) {
        const el  = document.createElement('div');
        el.className = 'bg-bubble';

        const size = Math.random() * 100 + 35;
        Object.assign(el.style, {
            width:             `${size}px`,
            height:            `${size}px`,
            left:              `${Math.random() * 100}vw`,
            background:        COLORS[Math.floor(Math.random() * COLORS.length)],
            filter:            `blur(${size > 80 ? 10 : 5}px)`,
            animationDuration: `${Math.random() * 14 + 10}s`,
            animationDelay:    `-${Math.random() * 18}s`,
        });

        container.appendChild(el);
    }
})();


// ─────────────────────────────────────────────────────────────────
// 2. CHAPTER NAVIGATION SYSTEM
// ─────────────────────────────────────────────────────────────────
const chapters   = Array.from(document.querySelectorAll('.chapter'));
const dockBtns   = Array.from(document.querySelectorAll('.dock-btn'));
const dock       = document.getElementById('chapter-dock');
let   activeChapter = 0;

function goToChapter(index, source) {
    if (index === activeChapter) return;

    // Transition out
    chapters[activeChapter].classList.add('hidden');

    // Transition in
    activeChapter = index;
    chapters[activeChapter].classList.remove('hidden');

    // Scroll new chapter's content back to top
    const scrollable = chapters[activeChapter].querySelector('.ch-scroll-y');
    if (scrollable) scrollable.scrollTop = 0;

    // Update dock active state
    dockBtns.forEach((btn, i) => {
        btn.classList.toggle('active', i === activeChapter);
    });

    // Hide dock on landing page, show on others
    dock.style.opacity = activeChapter === 0 ? '0' : '1';
    dock.style.pointerEvents = activeChapter === 0 ? 'none' : 'auto';

    // Trigger reveal animations for newly visible chapter
    setTimeout(() => triggerReveal(chapters[activeChapter]), 120);
}

// Dock button clicks
dockBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => goToChapter(i, 'dock'));
});

// Landing "Enter Her World" button
const btnEnter = document.getElementById('btn-enter');
if (btnEnter) {
    btnEnter.addEventListener('click', () => goToChapter(1, 'enter'));
}

// Initial state — hide dock on landing
dock.style.opacity      = '0';
dock.style.pointerEvents = 'none';
dock.style.transition   = 'opacity 0.4s ease';


// ─────────────────────────────────────────────────────────────────
// 3. SCROLL REVEAL — Per-Chapter IntersectionObserver
// ─────────────────────────────────────────────────────────────────
const observerPool = new Map(); // chapter index → observer

function triggerReveal(chapterEl) {
    const revealEls = chapterEl.querySelectorAll('.reveal-fade:not(.visible)');

    // Already-visible ones — skip
    if (!revealEls.length) return;

    const obs = new IntersectionObserver((entries, self) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                self.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.1 });

    revealEls.forEach(el => obs.observe(el));
}

// Trigger for the initial chapter (landing)
triggerReveal(chapters[0]);


// ─────────────────────────────────────────────────────────────────
// 4. LIFE COUNTER — Live Tick Every Second
// ─────────────────────────────────────────────────────────────────
const BIRTH = new Date('2007-08-05T00:00:00');

function computeTime() {
    const now  = new Date();
    const diff = now - BIRTH; // total ms

    // Calendar-accurate years + months
    let years  = now.getFullYear() - BIRTH.getFullYear();
    let months = now.getMonth()    - BIRTH.getMonth();
    if (months < 0)                        { years--;  months += 12; }
    if (now.getDate() < BIRTH.getDate())   { months = Math.max(0, months - 1); }

    const totalDays    = Math.floor(diff / 864e5);
    const totalSeconds = Math.floor(diff / 1e3);

    return { years, months, totalDays, totalSeconds };
}

function tickEl(id, newVal) {
    const el = document.getElementById(id);
    if (!el) return;
    const formatted = newVal.toLocaleString();
    if (el.textContent === formatted) return;

    el.textContent = formatted;

    // Micro-bounce
    el.classList.remove('tick');
    void el.offsetWidth; // force reflow
    el.classList.add('tick');
    clearTimeout(el._tickTimer);
    el._tickTimer = setTimeout(() => el.classList.remove('tick'), 180);
}

function updateCounter() {
    const { years, months, totalDays, totalSeconds } = computeTime();
    tickEl('count-years',   years);
    tickEl('count-months',  months);
    tickEl('count-days',    totalDays);
    tickEl('count-seconds', totalSeconds);
}

updateCounter();
setInterval(updateCounter, 1000);


// ─────────────────────────────────────────────────────────────────
// 5. FILM STRIP — Mouse Drag to Scroll (Ch. 2)
// ─────────────────────────────────────────────────────────────────
const filmWrap = document.querySelector('.film-strip-wrap');

if (filmWrap) {
    let isDown  = false;
    let startX  = 0;
    let scrollL = 0;

    filmWrap.addEventListener('mousedown', e => {
        isDown  = true;
        filmWrap.classList.add('active');
        startX  = e.pageX - filmWrap.offsetLeft;
        scrollL = filmWrap.scrollLeft;
    });

    filmWrap.addEventListener('mouseleave', () => { isDown = false; filmWrap.classList.remove('active'); });
    filmWrap.addEventListener('mouseup',    () => { isDown = false; filmWrap.classList.remove('active'); });

    filmWrap.addEventListener('mousemove', e => {
        if (!isDown) return;
        e.preventDefault();
        const x    = e.pageX - filmWrap.offsetLeft;
        const walk = (x - startX) * 1.5;
        filmWrap.scrollLeft = scrollL - walk;
    });
}


// ─────────────────────────────────────────────────────────────────
// 6. LOVE LETTER — Auto-save to localStorage
// ─────────────────────────────────────────────────────────────────
const letterEl = document.getElementById('love-letter-content');

if (letterEl) {
    const STORAGE_KEY = 'vaishnavi_love_letter_v2';
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) letterEl.innerHTML = saved;

    letterEl.addEventListener('input', () => {
        localStorage.setItem(STORAGE_KEY, letterEl.innerHTML);
    });
}


// ─────────────────────────────────────────────────────────────────
// 7. CLICK-TO-SPAWN FLOATING HEARTS
// ─────────────────────────────────────────────────────────────────
const HEARTS = ['💕', '💖', '🌸', '✨', '💗', '💝', '🌺', '💫', '🎀'];

document.addEventListener('click', e => {
    // Skip interactive elements
    if (e.target.closest('button, a, [contenteditable], input, textarea')) return;

    const el = document.createElement('span');
    el.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
    el.className   = 'heart-deco';

    const size = Math.random() * 12 + 18;
    Object.assign(el.style, {
        left:              `${e.clientX - size / 2}px`,
        top:               `${e.clientY - size / 2}px`,
        fontSize:          `${size}px`,
        animationDuration: `${Math.random() * 0.4 + 0.9}s`,
    });

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1500);
});


// ─────────────────────────────────────────────────────────────────
// 8. KEYBOARD NAVIGATION (Arrow keys / number keys)
// ─────────────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
    // Skip if user is typing in the letter
    if (document.activeElement === letterEl) return;

    if (e.key === 'ArrowRight' && activeChapter < chapters.length - 1) {
        goToChapter(activeChapter + 1, 'keyboard');
    }
    if (e.key === 'ArrowLeft' && activeChapter > 0) {
        goToChapter(activeChapter - 1, 'keyboard');
    }

    // Number keys 1–5 → chapters 0–4
    const num = parseInt(e.key);
    if (!isNaN(num) && num >= 1 && num <= 5) {
        goToChapter(num - 1, 'keyboard');
    }
});
