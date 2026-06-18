/* ================================================================
   Her Universe — script.js
   Bento Dashboard interactions, booklet flip, wax seal envelope, 
   love jar shake, polaroid previewer, bubbles, hearts, and live counter.
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
// 2. CURTAIN UNLOCK / ENTRY
// ─────────────────────────────────────────────────────────────────
const btnUnlock     = document.getElementById('btn-unlock');
const introCurtain   = document.getElementById('intro-curtain');
const mainDashboard = document.getElementById('main-dashboard');

if (btnUnlock && introCurtain && mainDashboard) {
    btnUnlock.addEventListener('click', () => {
        // Trigger heart particles from button click
        spawnHeartsAround(btnUnlock);

        introCurtain.classList.add('fade-out');
        
        setTimeout(() => {
            introCurtain.classList.add('hidden');
            mainDashboard.classList.remove('hidden');
            // Trigger bento cards entry animations if any
        }, 800);
    });
}

function spawnHeartsAround(element) {
    const rect = element.getBoundingClientRect();
    const count = 12;
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const el = document.createElement('span');
            el.textContent = ['💕', '💖', '🌸', '✨', '💗'][Math.floor(Math.random() * 5)];
            el.className = 'heart-deco';
            const size = Math.random() * 10 + 16;
            
            Object.assign(el.style, {
                left: `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 120}px`,
                top: `${rect.top + rect.height / 2 + (Math.random() - 0.5) * 40}px`,
                fontSize: `${size}px`,
                animationDuration: `${Math.random() * 0.4 + 0.8}s`
            });
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 1200);
        }, i * 30);
    }
}

// ─────────────────────────────────────────────────────────────────
// 3. WIDGET CLICKS / MODALS CONTROLLER
// ─────────────────────────────────────────────────────────────────
const widgetWho       = document.getElementById('widget-who');
const widgetJourney   = document.getElementById('widget-journey');
const widgetMoment    = document.getElementById('widget-moment');
const widgetPolaroids = document.getElementById('widget-polaroids');

const modalWho        = document.getElementById('modal-who');
const modalJourney    = document.getElementById('modal-journey');
const modalMoment     = document.getElementById('modal-moment');
const modalPolaroids  = document.getElementById('modal-polaroids');
const modalLetter     = document.getElementById('modal-letter');

function openModal(modalEl) {
    modalEl.classList.remove('hidden');
    // Force reflow
    void modalEl.offsetWidth;
    modalEl.classList.add('visible');
}

function closeModal(modalEl) {
    modalEl.classList.remove('visible');
    setTimeout(() => {
        modalEl.classList.add('hidden');
    }, 400);
}

// Attach widget click triggers
if (widgetWho && modalWho) {
    widgetWho.addEventListener('click', () => {
        openModal(modalWho);
        initBook();
    });
}
if (widgetJourney && modalJourney) {
    widgetJourney.addEventListener('click', () => {
        openModal(modalJourney);
        // Reset scroll position of journey timeline
        const filmWrap = document.getElementById('journey-film-wrap');
        if (filmWrap) filmWrap.scrollLeft = 0;
    });
}
if (widgetMoment && modalMoment) {
    widgetMoment.addEventListener('click', () => openModal(modalMoment));
}
if (widgetPolaroids && modalPolaroids) {
    widgetPolaroids.addEventListener('click', () => openModal(modalPolaroids));
}

// Global modal close buttons
document.querySelectorAll('.modal-overlay .btn-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal-overlay');
        if (modal) {
            closeModal(modal);
            // Specific resets
            if (modal.id === 'modal-letter') {
                const waxSeal = document.getElementById('wax-seal');
                if (waxSeal) waxSeal.classList.remove('broken');
            }
        }
    });
});

// Close modal on background click
document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
            if (modal.id === 'modal-letter') {
                const waxSeal = document.getElementById('wax-seal');
                if (waxSeal) waxSeal.classList.remove('broken');
            }
        }
    });
});


// ─────────────────────────────────────────────────────────────────
// 4. TWO-PAGE BOOK SPREAD — 3D PAGE FLIP SYSTEM
// ─────────────────────────────────────────────────────────────────

const BOOK_PAGES = [
    { type: 'cover',   emoji: '🎀', title: 'Who She Is',        subtitle: 'A folder of wonderful traits & memories' },
    { type: 'note', color: 'pink',     emoji: '🎂', title: 'August 5, 2007',     text: 'She came into this world on August 5, 2007. The world got significantly cuter that day and nobody even announced it.' },
    { type: 'note', color: 'lavender', emoji: '😊', title: 'Her Smile',          text: "Her smile is honestly unfair. Like it should be regulated. One second you're fine, then she smiles and suddenly nothing else matters." },
    { type: 'note', color: 'peach',    emoji: '🤪', title: 'Silly & Smart',      text: "She is a dangerous mix of silly and smart. You'll be laughing with her and then realise she just said something actually really deep." },
    { type: 'note', color: 'pink',     emoji: '💪', title: 'Quiet Strength',     text: "She handles things quietly. No drama, no breakdown — she just figures it out. And it amazes me every single time." },
    { type: 'note', color: 'lavender', emoji: '🌙', title: 'Feels Like Home',    text: "Being around her just feels like home. Safe. Warm. Like everything is going to be absolutely fine." },
    { type: 'note', color: 'peach',    emoji: '✨', title: 'Big Dreams',         text: "She has big, brilliant dreams. On the days she doubts herself — those are the days I'm most certain she'll conquer everything." },
    { type: 'note', color: 'pink',     emoji: '🌸', title: 'Soft Heart',         text: "She has the softest heart. The way she cares for people — genuinely, deeply — makes the world a better place just by her existing in it." },
    { type: 'note', color: 'lavender', emoji: '🎀', title: 'Uniquely Vaishnavi', text: "She doesn't even know how rare she is. That's the most Vaishnavi thing about her." },
    { type: 'back',    emoji: '💕', title: 'To be continued...', text: 'Every page of her story is better than the last.' },
];

let bookLeftIdx   = -1;   // -1 = blank left page
let bookRightIdx  = 0;    // 0  = cover
let bookAnimating = false;

/** Build an HTML string for a single book page */
function renderBookPage(idx) {
    if (idx < 0) {
        return `<div class="page-blank"><span class="page-blank-emoji">🌸</span></div>`;
    }
    const p = BOOK_PAGES[idx];
    if (!p) return '';

    if (p.type === 'cover') {
        return `
          <div class="page-cover">
            <span class="page-cover-emoji">${p.emoji}</span>
            <h2>${p.title}</h2>
            <p>${p.subtitle}</p>
            <span class="flip-hint">Click Next to open →</span>
          </div>`;
    }
    if (p.type === 'back') {
        return `
          <div class="page-back-cover">
            <span style="font-size:3rem">${p.emoji}</span>
            <h3 style="font-family:'Pacifico',cursive;font-size:1.5rem;color:var(--text-dark)">${p.title}</h3>
            <p style="font-size:0.9rem;color:var(--text-med);line-height:1.7;max-width:200px">${p.text}</p>
          </div>`;
    }
    // Regular sticky note page
    return `
      <div class="book-sticky ${p.color}">
        <span class="book-sticky-icon">${p.emoji}</span>
        <h3>${p.title}</h3>
        <p>${p.text}</p>
      </div>`;
}

function updateBookPanels() {
    const leftInner  = document.getElementById('left-page-inner');
    const rightInner = document.getElementById('right-page-inner');
    const leftNum    = document.getElementById('left-page-num');
    const rightNum   = document.getElementById('right-page-num');

    if (leftInner)  leftInner.innerHTML  = renderBookPage(bookLeftIdx);
    if (rightInner) rightInner.innerHTML = renderBookPage(bookRightIdx);
    if (leftNum)    leftNum.textContent  = bookLeftIdx > 0 ? `${bookLeftIdx}` : '';
    if (rightNum)   rightNum.textContent = bookRightIdx > 0 ? `${bookRightIdx}` : '';

    updateBookUI();
}

function updateBookUI() {
    const dotsEl  = document.getElementById('book-dots');
    const prevBtn = document.getElementById('btn-page-prev');
    const nextBtn = document.getElementById('btn-page-next');

    const totalSpreads = Math.ceil((BOOK_PAGES.length + 1) / 2);
    const currentSpread = bookRightIdx === 0 ? 0 : Math.floor((bookRightIdx + 1) / 2);

    if (dotsEl) {
        dotsEl.innerHTML = '';
        for (let i = 0; i < totalSpreads; i++) {
            const dot = document.createElement('div');
            dot.className = 'book-dot' + (i === currentSpread ? ' active' : '');
            dotsEl.appendChild(dot);
        }
    }

    if (prevBtn) prevBtn.disabled = bookLeftIdx < 0;
    if (nextBtn) nextBtn.disabled = bookRightIdx >= BOOK_PAGES.length - 1;
}

function runFlip(forward) {
    if (bookAnimating) return;
    if (forward  && bookRightIdx >= BOOK_PAGES.length - 1) return;
    if (!forward && bookLeftIdx < 0) return;

    bookAnimating = true;

    const flipper      = document.getElementById('page-flipper');
    const flipperFront = document.getElementById('flipper-front');
    const flipperBack  = document.getElementById('flipper-back');
    const leftInner    = document.getElementById('left-page-inner');
    const rightInner   = document.getElementById('right-page-inner');
    if (!flipper || !flipperFront || !flipperBack) { bookAnimating = false; return; }

    if (forward) {
        // Flipper covers the RIGHT panel, rotates toward the left (spine)
        flipper.style.left         = 'auto';
        flipper.style.right        = '0';
        flipper.style.width        = window.innerWidth <= 680 ? '100%' : '50%';
        flipper.style.transformOrigin = 'left center';

        // Front face = current right page content
        flipperFront.style.borderRadius = window.innerWidth <= 680 ? '18px' : '0 18px 18px 0';
        flipperFront.innerHTML = rightInner.innerHTML;

        // Back face = what the right page looks like from the back (blank/warm gradient)
        flipperBack.style.borderRadius  = window.innerWidth <= 680 ? '18px' : '18px 0 0 18px';
        flipperBack.innerHTML = '';
    } else {
        // Flipper covers the LEFT panel, rotates toward the right
        flipper.style.right        = 'auto';
        flipper.style.left         = '0';
        flipper.style.width        = window.innerWidth <= 680 ? '100%' : '50%';
        flipper.style.transformOrigin = 'right center';

        // Front face = current left page content
        flipperFront.style.borderRadius = window.innerWidth <= 680 ? '18px' : '18px 0 0 18px';
        flipperFront.innerHTML = leftInner.innerHTML;

        // Back face blank
        flipperBack.style.borderRadius  = window.innerWidth <= 680 ? '18px' : '0 18px 18px 0';
        flipperBack.innerHTML = '';
    }

    // Show the flipper
    flipper.style.transform  = 'rotateY(0deg)';
    flipper.style.transition = 'none';
    flipper.classList.add('is-flipping');

    // Update the underlying panels at the midpoint (page is edge-on / invisible)
    setTimeout(() => {
        if (forward) {
            bookLeftIdx  = bookRightIdx;
            bookRightIdx = bookRightIdx + 1;
        } else {
            bookRightIdx = bookLeftIdx;
            bookLeftIdx  = bookLeftIdx - 1;
        }
        leftInner.innerHTML  = renderBookPage(bookLeftIdx);
        rightInner.innerHTML = renderBookPage(bookRightIdx);
        document.getElementById('left-page-num').textContent  = bookLeftIdx > 0  ? `${bookLeftIdx}` : '';
        document.getElementById('right-page-num').textContent = bookRightIdx > 0 ? `${bookRightIdx}` : '';
        updateBookUI();
    }, 350);

    // Kick off the CSS rotation
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            flipper.style.transition = 'transform 0.7s cubic-bezier(0.645, 0.045, 0.355, 1)';
            flipper.style.transform  = forward ? 'rotateY(-180deg)' : 'rotateY(180deg)';
        });
    });

    // After animation completes — hide flipper and reset
    setTimeout(() => {
        flipper.classList.remove('is-flipping');
        flipper.style.transition = 'none';
        flipper.style.transform  = 'rotateY(0deg)';
        bookAnimating = false;
    }, 780);
}

function initBook() {
    bookLeftIdx  = -1;
    bookRightIdx = 0;
    bookAnimating = false;
    updateBookPanels();
}

const btnPrevPage = document.getElementById('btn-page-prev');
const btnNextPage = document.getElementById('btn-page-next');
if (btnNextPage) btnNextPage.addEventListener('click', () => runFlip(true));
if (btnPrevPage) btnPrevPage.addEventListener('click', () => runFlip(false));

// ─────────────────────────────────────────────────────────────────
// 5. WAX SEAL & ENVELOPE INTERACTION
// ─────────────────────────────────────────────────────────────────
const waxSeal        = document.getElementById('wax-seal');
const widgetEnvelope = document.getElementById('widget-envelope');

if (waxSeal && modalLetter) {
    waxSeal.addEventListener('click', (e) => {
        e.stopPropagation(); // Avoid triggering container clicks
        
        // Break seal animation
        waxSeal.classList.add('broken');
        
        // After seal breaks, zoom open the love letter modal
        setTimeout(() => {
            openModal(modalLetter);
        }, 700);
    });
}

if (widgetEnvelope && modalLetter) {
    widgetEnvelope.addEventListener('click', () => {
        openModal(modalLetter);
    });
}

// ─────────────────────────────────────────────────────────────────
// 6. COMPLIMENT LOVE JAR
// ─────────────────────────────────────────────────────────────────
const jarGraphic       = document.getElementById('love-jar-click');
const complimentBubble = document.getElementById('compliment-bubble');
const complimentText   = document.getElementById('compliment-text');

const COMPLIMENTS = [
    "Your smile can literally light up the darkest rooms. ☀️",
    "You have this quiet strength that is so inspiring. 💪",
    "You make the most ordinary moments feel like a movie scene. 🎬",
    "The way you care about others makes the world a better place. 🌸",
    "You are my favorite person to laugh with. 😂",
    "You're a dangerous mix of incredibly smart and adorably silly. 🤪",
    "No matter how busy the day is, talking to you feels like coming home. 🌙",
    "I believe in your dreams even more than you do. You'll conquer everything! 🌟",
    "You don't even realize how rare and special you are. 🎀",
    "My favorite place in the world is right next to you. 💕",
    "You are, hands down, the most magical person I know. ✨",
    "Your kindness is soft but it changes everything around you. 🌺"
];

let jarShakeTimeout;

if (jarGraphic && complimentBubble && complimentText) {
    jarGraphic.addEventListener('click', (e) => {
        e.stopPropagation();

        // Shake animation
        jarGraphic.classList.remove('shake');
        void jarGraphic.offsetWidth; // Reflow
        jarGraphic.classList.add('shake');

        // Spawn little rising hearts from the jar coordinates
        const rect = jarGraphic.getBoundingClientRect();
        for (let i = 0; i < 6; i++) {
            const h = document.createElement('span');
            h.textContent = ['💖', '🌸', '✨', '💕'][Math.floor(Math.random() * 4)];
            h.className = 'heart-deco';
            const size = Math.random() * 8 + 14;
            Object.assign(h.style, {
                left: `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 40}px`,
                top: `${rect.top}px`,
                fontSize: `${size}px`,
                animationDuration: `${Math.random() * 0.4 + 0.8}s`
            });
            document.body.appendChild(h);
            setTimeout(() => h.remove(), 1200);
        }

        // Show a random compliment in the speech bubble
        const randomCompliment = COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];
        complimentText.textContent = randomCompliment;
        
        complimentBubble.classList.remove('hidden');
        
        clearTimeout(jarShakeTimeout);
        jarShakeTimeout = setTimeout(() => {
            jarGraphic.classList.remove('shake');
        }, 400);
    });
}

// ─────────────────────────────────────────────────────────────────
// 7. POLAROIDS GALLERY & PREVIEW
// ─────────────────────────────────────────────────────────────────
const photoPreviewer        = document.getElementById('photo-previewer');
const previewerImg          = document.getElementById('previewer-img');
const previewerPlaceholder  = document.getElementById('previewer-placeholder');
const previewerCaption      = document.getElementById('previewer-caption');
const btnPreviewClose       = document.querySelector('.photo-preview-overlay .btn-preview-close');

function previewPolaroid(polaroidEl) {
    const img = polaroidEl.querySelector('img');
    const placeholder = polaroidEl.querySelector('.img-placeholder');
    const caption = polaroidEl.querySelector('.polaroid-caption');

    if (img && img.src) {
        previewerImg.src = img.src;
        previewerImg.classList.remove('hidden');
        previewerPlaceholder.classList.add('hidden');
    } else {
        // Use placeholder content (emojis)
        previewerImg.classList.add('hidden');
        previewerPlaceholder.classList.remove('hidden');
        const icon = placeholder ? placeholder.querySelector('.ph-icon').textContent : '📸';
        previewerPlaceholder.querySelector('.ph-icon').textContent = icon;
    }

    previewerCaption.textContent = caption ? caption.textContent : 'Memory 🤍';
    
    photoPreviewer.classList.remove('hidden');
    void photoPreviewer.offsetWidth;
    photoPreviewer.classList.add('visible');
}

document.querySelectorAll('.polaroid').forEach(pol => {
    pol.addEventListener('click', (e) => {
        e.stopPropagation();
        previewPolaroid(pol);
    });
});

if (photoPreviewer) {
    photoPreviewer.addEventListener('click', (e) => {
        if (e.target === photoPreviewer || e.target.classList.contains('btn-preview-close')) {
            photoPreviewer.classList.remove('visible');
            setTimeout(() => photoPreviewer.classList.add('hidden'), 300);
        }
    });
}

// ─────────────────────────────────────────────────────────────────
// 8. FILM STRIP TIMELINE MOUSE & TOUCH DRAG
// ─────────────────────────────────────────────────────────────────
const filmWrap = document.getElementById('journey-film-wrap');

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

    filmWrap.addEventListener('touchstart', e => {
        const touch = e.touches[0];
        isDown  = true;
        filmWrap.classList.add('active');
        startX  = touch.pageX - filmWrap.offsetLeft;
        scrollL = filmWrap.scrollLeft;
    });
    filmWrap.addEventListener('touchend', () => { isDown = false; filmWrap.classList.remove('active'); });
    filmWrap.addEventListener('touchcancel', () => { isDown = false; filmWrap.classList.remove('active'); });
    filmWrap.addEventListener('touchmove', e => {
        if (!isDown) return;
        const touch = e.touches[0];
        const x    = touch.pageX - filmWrap.offsetLeft;
        const walk = (x - startX) * 1.5;
        filmWrap.scrollLeft = scrollL - walk;
    });
}

// ─────────────────────────────────────────────────────────────────
// 9. LIFE COUNTER — Live Tick Every Second
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
// 10. LOVE LETTER — Auto-save to localStorage
// ─────────────────────────────────────────────────────────────────
const letterEl = document.getElementById('love-letter-content');

if (letterEl) {
    const STORAGE_KEY = 'vaishnavi_love_letter_v2';
    
    // Default starting content if empty
    const defaultLetter = `Dear Vaishnavi,

I just wanted to make this little corner of the internet for you. 

You make my life so much brighter, and this is my small way of keeping all those memories, traits, and milestones safe.

Feel free to write your own notes or edit this letter whenever you want. It's our space.

Love,
Me 💕`;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        letterEl.innerHTML = saved;
    } else {
        letterEl.innerHTML = defaultLetter.replace(/\n/g, '<br>');
    }

    letterEl.addEventListener('input', () => {
        localStorage.setItem(STORAGE_KEY, letterEl.innerHTML);
    });
}

// ─────────────────────────────────────────────────────────────────
// 11. CLICK-TO-SPAWN FLOATING HEARTS
// ─────────────────────────────────────────────────────────────────
const HEARTS = ['💕', '💖', '🌸', '✨', '💗', '💝', '🌺', '💫', '🎀'];

document.addEventListener('click', e => {
    // Skip interactive elements
    if (e.target.closest('button, a, [contenteditable], input, textarea, .bento-card, .polaroid')) return;

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
// 12. KEYBOARD NAVIGATION
// ─────────────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
    // Skip if typing in the letter
    if (document.activeElement === letterEl) return;

    // Flip book pages if the Who She Is modal is open
    if (modalWho && modalWho.classList.contains('visible')) {
        if (e.key === 'ArrowRight') runFlip(true);
        if (e.key === 'ArrowLeft')  runFlip(false);
    }
});
