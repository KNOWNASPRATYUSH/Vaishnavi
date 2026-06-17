/* ============================================
   Vaishnavi's Lovey-Dovey Website — script.js
   ============================================ */

// ─────────────────────────────────────────────
// 1. BACKGROUND BUBBLES
// ─────────────────────────────────────────────
(function createBubbles() {
    const container = document.getElementById('bubble-container');
    if (!container) return;

    const BUBBLE_COUNT = 18;
    const COLORS = [
        'radial-gradient(circle at 30% 30%, rgba(255,173,210,0.85), rgba(255,77,166,0.4))',
        'radial-gradient(circle at 30% 30%, rgba(210,170,255,0.85), rgba(146,84,222,0.4))',
        'radial-gradient(circle at 30% 30%, rgba(255,213,167,0.85), rgba(255,169,64,0.4))',
        'radial-gradient(circle at 30% 30%, rgba(190,220,255,0.85), rgba(100,170,255,0.4))',
    ];

    for (let i = 0; i < BUBBLE_COUNT; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bg-bubble');

        const size     = Math.random() * 120 + 40;   // 40–160 px
        const left     = Math.random() * 100;          // 0–100%
        const duration = Math.random() * 14 + 10;     // 10–24 s
        const delay    = Math.random() * 15;           // 0–15 s stagger
        const color    = COLORS[Math.floor(Math.random() * COLORS.length)];
        const blur     = size > 90 ? '12px' : '6px';

        Object.assign(bubble.style, {
            width:           `${size}px`,
            height:          `${size}px`,
            left:            `${left}vw`,
            background:      color,
            filter:          `blur(${blur})`,
            animationDuration: `${duration}s`,
            animationDelay:    `-${delay}s`,   // negative delay = start mid-animation
        });

        container.appendChild(bubble);
    }
})();


// ─────────────────────────────────────────────
// 2. SCROLL REVEAL — IntersectionObserver
// ─────────────────────────────────────────────
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stop observing once revealed (performance)
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { root: null, rootMargin: '0px', threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


// ─────────────────────────────────────────────
// 3. LIFE COUNTER — Live Tick Every Second
// ─────────────────────────────────────────────
const BIRTH_DATE = new Date('2007-08-05T00:00:00');

function calcTime() {
    const now  = new Date();
    const diff = now - BIRTH_DATE; // total ms

    // Years & months (calendar-accurate)
    let years  = now.getFullYear() - BIRTH_DATE.getFullYear();
    let months = now.getMonth()    - BIRTH_DATE.getMonth();
    if (months < 0) { years--; months += 12; }
    if (now.getDate() < BIRTH_DATE.getDate()) { months = Math.max(0, months - 1); }

    // Remaining breakdown from total ms
    const totalDays    = Math.floor(diff / 864e5);
    const totalHours   = Math.floor(diff / 36e5);
    const totalMinutes = Math.floor(diff / 6e4);
    const totalSeconds = Math.floor(diff / 1e3);

    return { years, months, totalDays, totalHours, totalMinutes, totalSeconds };
}

function setEl(id, value) {
    const el = document.getElementById(id);
    if (!el) return;

    const formatted = value.toLocaleString();
    if (el.textContent !== formatted) {
        el.textContent = formatted;
        // Micro-bounce on change
        el.classList.remove('tick');
        void el.offsetWidth; // force reflow
        el.classList.add('tick');
        setTimeout(() => el.classList.remove('tick'), 150);
    }
}

function updateCounter() {
    const { years, months, totalDays, totalHours, totalMinutes, totalSeconds } = calcTime();
    setEl('count-years',   years);
    setEl('count-months',  months);
    setEl('count-days',    totalDays);
    setEl('count-hours',   totalHours);
    setEl('count-minutes', totalMinutes);
    setEl('count-seconds', totalSeconds);
}

// Initial call + live update
updateCounter();
setInterval(updateCounter, 1000);


// ─────────────────────────────────────────────
// 4. NAVBAR — Smooth Active Section Highlight
// ─────────────────────────────────────────────
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.style.color = link.getAttribute('href') === `#${entry.target.id}`
                        ? 'var(--text-accent)'
                        : '';
                });
            }
        });
    },
    { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach(s => sectionObserver.observe(s));


// ─────────────────────────────────────────────
// 5. LOVE LETTER — Auto-save to LocalStorage
// ─────────────────────────────────────────────
const letterEl = document.getElementById('love-letter-content');

if (letterEl) {
    // Load saved letter
    const saved = localStorage.getItem('vaishnavi_love_letter');
    if (saved) letterEl.innerHTML = saved;

    // Save on input
    letterEl.addEventListener('input', () => {
        localStorage.setItem('vaishnavi_love_letter', letterEl.innerHTML);
    });
}


// ─────────────────────────────────────────────
// 6. RANDOM HEARTS — Sparkle on Click
// ─────────────────────────────────────────────
const HEARTS = ['💕', '💖', '🌸', '✨', '💗', '💝', '🌺', '💫'];

document.addEventListener('click', (e) => {
    // Don't trigger on interactive elements
    if (e.target.closest('a, button, [contenteditable]')) return;

    const heart = document.createElement('div');
    heart.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
    heart.className   = 'heart-deco';

    Object.assign(heart.style, {
        left:     `${e.clientX - 12}px`,
        top:      `${e.clientY - 12}px`,
        position: 'fixed',
        fontSize: `${Math.random() * 14 + 18}px`,
        zIndex:   '9999',
        pointerEvents: 'none',
        animationDuration: `${Math.random() * 0.5 + 0.8}s`,
    });

    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1400);
});
