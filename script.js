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
// Left panel = photo (changes per page). Right panel = cycling text.
// ─────────────────────────────────────────────────────────────────

const BOOK_PAGES = [
    { type: 'cover',   emoji: '🎀', title: 'Who She Is',        subtitle: 'A folder of wonderful traits & memories', image: 'images/img3.jpg' },
    { type: 'note', color: 'pink',     emoji: '🎂', title: 'August 5, 2007',     text: 'She came into this world on August 5, 2007. The world got significantly cuter that day and nobody even announced it.', image: 'images/img1.jpg', imgPos: 'top' },
    { type: 'note', color: 'lavender', emoji: '😊', title: 'Her Smile',          text: "Her smile is honestly unfair. Like it should be regulated. One second you're fine, then she smiles and suddenly nothing else matters.", image: 'images/img8.jpg' },
    { type: 'note', color: 'peach',    emoji: '🤪', title: 'Silly & Smart',      text: "She is a dangerous mix of silly and smart. You'll be laughing with her and then realise she just said something actually really deep.", image: 'images/img6.jpg' },
    { type: 'note', color: 'pink',     emoji: '💪', title: 'Quiet Strength',     text: "She handles things quietly. No drama, no breakdown — she just figures it out. And it amazes me every single time.", image: 'images/img11.jpg' },
    { type: 'note', color: 'lavender', emoji: '🌙', title: 'Feels Like Home',    text: "Being around her just feels like home. Safe. Warm. Like everything is going to be absolutely fine.", image: 'images/img7.jpg' },
    { type: 'note', color: 'peach',    emoji: '✨', title: 'Big Dreams',         text: "She has big, brilliant dreams. On the days she doubts herself — those are the days I'm most certain she'll conquer everything.", image: 'images/img4.jpg' },
    { type: 'note', color: 'pink',     emoji: '🌸', title: 'Soft Heart',         text: "She has the softest heart. The way she cares for people — genuinely, deeply — makes the world a better place just by her existing in it.", image: 'images/img5.jpg' },
    { type: 'note', color: 'lavender', emoji: '🎀', title: 'Uniquely Vaishnavi', text: "She doesn't even know how rare she is. That's the most Vaishnavi thing about her.", image: 'images/img10.jpg' },
    { type: 'back',    emoji: '💕', title: 'To be continued...', text: 'Every page of her story is better than the last.', image: 'images/img12.png' },
];

let bookRightIdx  = 0;
let bookAnimating = false;

/** Render her photo on the LEFT panel for a specific page */
function renderLeftPhotoPanel(idx) {
    const p = BOOK_PAGES[idx];
    if (!p) return '';
    return `
      <div class="page-photo-panel">
        <div class="book-photo-wrap">
          <div class="book-hero-photo" id="book-hero-photo">
            <img src="${p.image}" alt="Vaishnavi" style="width:100%; height:100%; object-fit:cover; object-position:${p.imgPos || 'center'}; border-radius:10px;">
          </div>
          <div class="book-photo-caption">${p.title} 🌸</div>
        </div>
      </div>`;
}

/** Render page content for the RIGHT panel */
function renderBookPage(idx) {
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
    const rightNum   = document.getElementById('right-page-num');
    const leftNum    = document.getElementById('left-page-num');

    if (leftInner)  leftInner.innerHTML  = renderLeftPhotoPanel(bookRightIdx);
    if (rightInner) rightInner.innerHTML = renderBookPage(bookRightIdx);
    if (leftNum)    leftNum.textContent  = '';
    if (rightNum)   rightNum.textContent = bookRightIdx > 0 ? `${bookRightIdx}` : '';

    updateBookUI();
}

function updateBookUI() {
    const dotsEl  = document.getElementById('book-dots');
    const prevBtn = document.getElementById('btn-page-prev');
    const nextBtn = document.getElementById('btn-page-next');

    if (dotsEl) {
        dotsEl.innerHTML = '';
        for (let i = 0; i < BOOK_PAGES.length; i++) {
            const dot = document.createElement('div');
            dot.className = 'book-dot' + (i === bookRightIdx ? ' active' : '');
            dotsEl.appendChild(dot);
        }
    }

    if (prevBtn) prevBtn.disabled = bookRightIdx === 0;
    if (nextBtn) nextBtn.disabled = bookRightIdx >= BOOK_PAGES.length - 1;
}

function runFlip(forward) {
    if (bookAnimating) return;
    if (forward  && bookRightIdx >= BOOK_PAGES.length - 1) return;
    if (!forward && bookRightIdx <= 0) return;

    bookAnimating = true;

    const flipper      = document.getElementById('page-flipper');
    const flipperFront = document.getElementById('flipper-front');
    const flipperBack  = document.getElementById('flipper-back');
    const leftInner    = document.getElementById('left-page-inner');
    const rightInner   = document.getElementById('right-page-inner');
    if (!flipper || !flipperFront || !flipperBack) { bookAnimating = false; return; }

    const targetIdx = forward ? bookRightIdx + 1 : bookRightIdx - 1;

    if (forward) {
        // Flipper covers RIGHT panel → rotates left (toward spine)
        flipper.style.left         = 'auto';
        flipper.style.right        = '0';
        flipper.style.width        = '50%';
        flipper.style.transformOrigin = 'left center';

        // Front = current right page (the page being turned away)
        flipperFront.style.borderRadius = '0 18px 18px 0';
        flipperFront.innerHTML = rightInner.innerHTML;

        // Back = new photo (revealed on the left after the flip)
        flipperBack.style.borderRadius  = '18px 0 0 18px';
        flipperBack.innerHTML = renderLeftPhotoPanel(targetIdx);

    } else {
        // Flipper covers LEFT panel (photo side) → rotates right
        flipper.style.right        = 'auto';
        flipper.style.left         = '0';
        flipper.style.width        = '50%';
        flipper.style.transformOrigin = 'right center';

        // Front = current photo panel (the left side being "unflipped")
        flipperFront.style.borderRadius = '18px 0 0 18px';
        flipperFront.innerHTML = renderLeftPhotoPanel(bookRightIdx);

        // Back = new right page content (though usually it just looks like the back of the previous page)
        flipperBack.style.borderRadius  = '0 18px 18px 0';
        flipperBack.innerHTML = '';
    }

    // Show the flipper at 0deg (no animation yet)
    flipper.style.transform  = 'rotateY(0deg)';
    flipper.style.transition = 'none';
    flipper.classList.add('is-flipping');

    // At midpoint: update the underlying panels (hidden behind the turning flipper)
    setTimeout(() => {
        bookRightIdx = targetIdx;
        leftInner.innerHTML = renderLeftPhotoPanel(bookRightIdx);
        rightInner.innerHTML = renderBookPage(bookRightIdx);
        document.getElementById('right-page-num').textContent = bookRightIdx > 0 ? `${bookRightIdx}` : '';
        updateBookUI();
    }, 350);

    // Kick off the CSS 3D rotation
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            flipper.style.transition = 'transform 0.7s cubic-bezier(0.645, 0.045, 0.355, 1)';
            flipper.style.transform  = forward ? 'rotateY(-180deg)' : 'rotateY(180deg)';
        });
    });

    // After animation: hide flipper + reset
    setTimeout(() => {
        flipper.classList.remove('is-flipping');
        flipper.style.transition = 'none';
        flipper.style.transform  = 'rotateY(0deg)';
        bookAnimating = false;
    }, 780);
}

function initBook() {
    bookRightIdx  = 0;
    bookAnimating = false;
    updateBookPanels();
}

const btnPrevPage = document.getElementById('btn-page-prev');
const btnNextPage = document.getElementById('btn-page-next');

if (btnNextPage) btnNextPage.addEventListener('click', () => runFlip(true));
if (btnPrevPage) btnPrevPage.addEventListener('click', () => runFlip(false));

// ─────────────────────────────────────────────────────────────────
// SWIPE GESTURES FOR BOOK FLIPPING
// ─────────────────────────────────────────────────────────────────
const bookSpread = document.getElementById('book-spread-wrapper');
if (bookSpread) {
    let touchStartX = 0;
    let touchEndX = 0;

    bookSpread.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    bookSpread.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleBookSwipe();
    }, { passive: true });

    function handleBookSwipe() {
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 50) { // Threshold for swipe
            if (diff < 0) {
                // Swiped left -> next page
                runFlip(true);
            } else {
                // Swiped right -> previous page
                runFlip(false);
            }
        }
    }
}

// ─────────────────────────────────────────────────────────────────
// 5. WAX SEAL & ENVELOPE INTERACTION
// ─────────────────────────────────────────────────────────────────
const waxSeal        = document.getElementById('wax-seal');
const widgetEnvelope = document.getElementById('widget-envelope');

if (waxSeal && modalLetter) {
    waxSeal.addEventListener('click', (e) => {
        e.stopPropagation();
        waxSeal.classList.add('broken');
        setTimeout(() => {
            openModal(modalLetter);
            loadLetter(); // Load latest from cloud
        }, 700);
    });
}

if (widgetEnvelope && modalLetter) {
    widgetEnvelope.addEventListener('click', () => {
        openModal(modalLetter);
        loadLetter(); // Load latest from cloud
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
        previewerImg.style.display = 'block';
        previewerPlaceholder.style.display = 'none';
    } else {
        // Use placeholder content (emojis)
        previewerImg.style.display = 'none';
        previewerPlaceholder.style.display = 'flex';
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
// 10. LOVE LETTER — Firebase Cloud Sync + localStorage fallback
// ─────────────────────────────────────────────────────────────────
const FIREBASE_DB_URL = 'https://vaishnavibday-eeb65-default-rtdb.firebaseio.com'; // Firebase Realtime DB
const LETTER_ENDPOINT = `${FIREBASE_DB_URL}/vaishnavi_letter.json`;
const STORAGE_KEY     = 'vaishnavi_love_letter_v2';

const letterEl      = document.getElementById('love-letter-content');
const btnSaveLetter = document.getElementById('btn-save-letter');
const saveToast     = document.getElementById('save-toast');

const defaultLetter = `Dear Vaishnavi,

I just wanted to make this little corner of the internet for you. 

You make my life so much brighter, and this is my small way of keeping all those memories, traits, and milestones safe.

Feel free to write your own notes or edit this letter whenever you want. It's our space.

Love,
Me 💕`;

/** Load letter: cloud first, localStorage fallback */
async function loadLetter() {
    if (!letterEl) return;

    if (FIREBASE_DB_URL) {
        try {
            const res  = await fetch(LETTER_ENDPOINT);
            const data = await res.json();
            if (data && data.content) {
                letterEl.innerHTML = data.content;
                localStorage.setItem(STORAGE_KEY, data.content); // keep local in sync
                return;
            }
        } catch (e) {
            console.warn('Cloud load failed, using local:', e);
        }
    }

    // Fallback: localStorage or default
    const saved = localStorage.getItem(STORAGE_KEY);
    letterEl.innerHTML = saved ? saved : defaultLetter.replace(/\n/g, '<br>');
}

/** Save letter: cloud + localStorage */
async function saveLetter() {
    if (!letterEl) return;
    const content = letterEl.innerHTML;

    // Always save locally
    localStorage.setItem(STORAGE_KEY, content);

    if (FIREBASE_DB_URL) {
        try {
            await fetch(LETTER_ENDPOINT, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, updatedAt: Date.now() })
            });

            // Trigger Email Notification
            if (typeof emailjs !== 'undefined') {
                emailjs.send("service_2jq4x1f", "template_ihfljvi", {
                    message: "A new note was saved in the Love Letter section!"
                }).catch(err => console.warn('EmailJS error:', err));
            }
            return true; // cloud save succeeded
        } catch (e) {
            console.warn('Cloud save failed:', e);
            return false;
        }
    }
    return null; // no cloud configured
}

// Auto-save to localStorage on every keystroke (silent safety net)
if (letterEl) {
    letterEl.addEventListener('input', () => {
        localStorage.setItem(STORAGE_KEY, letterEl.innerHTML);
    });
}

// Save button: cloud + toast feedback
let toastTimer;
if (btnSaveLetter && letterEl && saveToast) {
    btnSaveLetter.addEventListener('click', async () => {
        // Show "Saving..." immediately
        saveToast.textContent = FIREBASE_DB_URL ? '⏳ Syncing...' : '⏳ Saving...';
        saveToast.classList.add('show');
        clearTimeout(toastTimer);

        const result = await saveLetter();

        if (result === true)       saveToast.textContent = '✨ Saved & Synced!';
        else if (result === false)  saveToast.textContent = '⚠️ Saved locally only';
        else                        saveToast.textContent = '✨ Saved!';

        toastTimer = setTimeout(() => saveToast.classList.remove('show'), 2800);
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

// ─────────────────────────────────────────────────────────────────
// 13. SECRET CHAT (HIDDEN)
// ─────────────────────────────────────────────────────────────────
const widgetChat = document.getElementById('widget-chat');
const pinModal = document.getElementById('pin-modal');
const pinInput = document.getElementById('pin-input');
const btnSubmitPin = document.getElementById('btn-submit-pin');
const btnClosePin = document.getElementById('btn-close-pin');
const pinError = document.getElementById('pin-error');
const secretChatModal = document.getElementById('secret-chat-modal');
const btnCloseChat = document.getElementById('btn-close-chat');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const btnSendChat = document.getElementById('btn-send-chat');
const senderToggle = document.getElementById('sender-toggle-input');
const senderLabel = document.getElementById('sender-label');
const chatCameraInput = document.getElementById('chat-camera-input');
const btnChatCamera = document.getElementById('btn-chat-camera');

let chatPollInterval;
let latestGlobalMessageTime = 0;

// Open PIN modal when clicking the chat widget
if (widgetChat) {
    widgetChat.addEventListener('click', () => {
        pinInput.value = '';
        pinError.classList.add('hidden');
        openModal(pinModal);
        setTimeout(() => pinInput.focus(), 100);
    });
}

// Verify PIN logic
function verifyPinAndOpenChat() {
    if (pinInput.value === '0517') {
        closeModal(pinModal);
        openSecretChat();
    } else {
        pinError.classList.remove('hidden');
        pinInput.value = '';
        pinInput.focus();
    }
}

if (btnSubmitPin) btnSubmitPin.addEventListener('click', verifyPinAndOpenChat);
if (pinInput) {
    pinInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') verifyPinAndOpenChat();
    });
}

function openSecretChat() {
    if (!secretChatModal) return;
    openModal(secretChatModal);
    loadChatMessages();
    // Poll every 1 second while open for live real-time sync
    clearInterval(chatPollInterval);
    chatPollInterval = setInterval(loadChatMessages, 1000);
}

// Clean up polling when closed
if (btnCloseChat) {
    btnCloseChat.addEventListener('click', () => {
        clearInterval(chatPollInterval);
    });
}

if (senderToggle) {
    senderToggle.addEventListener('change', (e) => {
        senderLabel.textContent = e.target.checked ? 'Her (Vaishnavi)' : 'Me (Pratyush)';
        lastChatDataStr = ''; // Force DOM re-render to update alignments
        loadChatMessages(); // Refresh alignment based on identity
    });
}

let lastChatDataStr = '';

async function loadChatMessages() {
    if (!FIREBASE_DB_URL || !chatMessages) return;
    try {
        const res = await fetch(`${FIREBASE_DB_URL}/secret_chat.json`);
        const data = await res.json();
        
        // Prevent re-rendering and repeating animations if nothing changed
        const dataStr = JSON.stringify(data);
        if (dataStr === lastChatDataStr) return; 
        lastChatDataStr = dataStr;
        
        renderChat(data);
    } catch (e) {
        console.warn('Chat load failed', e);
    }
}

function renderChat(data) {
    if (!chatMessages) return;
    
    // Check if user scrolled up manually before we refresh
    const isAtBottom = chatMessages.scrollHeight - chatMessages.scrollTop <= chatMessages.clientHeight + 50;

    chatMessages.innerHTML = '';
    if (!data) return;
    
    const messages = Object.values(data).sort((a, b) => a.time - b.time);
    
    // Track the time of the most recent message in the chat history
    if (messages.length > 0) {
        latestGlobalMessageTime = messages[messages.length - 1].time;
    }
    
    const currentName = senderToggle.checked ? 'Vaishnavi' : 'Pratyush';

    messages.forEach(msg => {
        const isSentByMe = msg.sender === currentName;
        
        // Wrap bubble to add sender name if it's received
        const wrap = document.createElement('div');
        wrap.className = `chat-bubble-wrap ${isSentByMe ? 'sent' : 'received'}`;
        wrap.style.display = 'flex';
        wrap.style.flexDirection = 'column';
        wrap.style.alignItems = isSentByMe ? 'flex-end' : 'flex-start';
        wrap.style.maxWidth = '75%';
        wrap.style.alignSelf = isSentByMe ? 'flex-end' : 'flex-start';

        if (!isSentByMe) {
            const nameLabel = document.createElement('span');
            nameLabel.style.fontSize = '0.7rem';
            nameLabel.style.fontWeight = 'bold';
            nameLabel.style.color = 'var(--text-med)';
            nameLabel.style.marginBottom = '2px';
            nameLabel.style.marginLeft = '4px';
            nameLabel.textContent = msg.sender;
            wrap.appendChild(nameLabel);
        }

        const b = document.createElement('div');
        b.className = `chat-bubble ${isSentByMe ? 'sent' : 'received'}`;
        // We handle alignment in the wrap now, but keep classes for styling
        b.style.maxWidth = '100%';
        b.style.alignSelf = 'auto';
        
        const date = new Date(msg.time);
        const hours = date.getHours();
        const mins = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const timeStr = `${displayHours}:${mins} ${ampm}`;
        
        const imgHtml = msg.image ? `<img src="${msg.image}" alt="Photo" onclick="window.open(this.src)" style="cursor:zoom-in;">` : '';
        
        b.innerHTML = `
            ${imgHtml}
            ${msg.text}
            <div class="chat-time">${timeStr}</div>
        `;
        wrap.appendChild(b);
        chatMessages.appendChild(wrap);
    });
    
    if (isAtBottom) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

async function sendChatMessage(overrideText = null, imageBase64 = null) {
    const text = overrideText !== null ? overrideText : chatInput.value.trim();
    
    // Only block if both text and image are empty
    if (!text && !imageBase64) return;
    if (!FIREBASE_DB_URL) return;
    
    const sender = senderToggle.checked ? 'Vaishnavi' : 'Pratyush';
    
    // Use Firebase Server Timestamp to prevent out-of-order messages from device clock differences
    const msg = { text, sender, time: { ".sv": "timestamp" } };
    if (imageBase64) msg.image = imageBase64;
    
    if (overrideText === null) chatInput.value = ''; // clear input only if typing
    
    // We removed the local hardcoded bubble so it doesn't jump sides when toggling identity.
    // Instead we rely purely on the 1-second live poll to fetch the definitive chat history immediately.
    
    try {
        await fetch(`${FIREBASE_DB_URL}/secret_chat.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(msg)
        });
        
        loadChatMessages(); // instantly refresh
        
        // Only send Email Notification if the last message was > 10 minutes ago
        const TEN_MINUTES_MS = 10 * 60 * 1000;
        const timeSinceLastMsg = Date.now() - latestGlobalMessageTime;
        
        if (typeof emailjs !== 'undefined' && timeSinceLastMsg > TEN_MINUTES_MS) {
            emailjs.send("service_2jq4x1f", "template_ihfljvi", {
                message: `New secret message from ${sender}: "${text}"`
            }).catch(err => console.warn('EmailJS error:', err));
        }
    } catch (e) {
        console.error('Failed to send msg', e);
    }
}

if (btnSendChat) btnSendChat.addEventListener('click', () => sendChatMessage());
if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
    });
}

// ─────────────────────────────────────────────────────────────────
// 14. CAMERA UPLOAD COMPRESSION & SENDING
// ─────────────────────────────────────────────────────────────────
if (btnChatCamera && chatCameraInput) {
    btnChatCamera.addEventListener('click', () => {
        chatCameraInput.click();
    });

    chatCameraInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                // Compress image with Canvas
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                const MAX_WIDTH = 800; // Cap width to save Firebase bandwidth
                let width = img.width;
                let height = img.height;
                
                if (width > MAX_WIDTH) {
                    height = Math.round((height * MAX_WIDTH) / width);
                    width = MAX_WIDTH;
                }
                
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                
                // Get compressed base64 string (60% JPEG quality)
                const base64Str = canvas.toDataURL('image/jpeg', 0.6); 
                
                sendChatMessage("📷 Sent a photo", base64Str);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
        
        // Reset input
        chatCameraInput.value = '';
    });
}
