// Starry Background Canvas logic
const canvas = document.getElementById('galaxy-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let stars = [];

function initCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    
    stars = [];
    const numStars = Math.floor((width * height) / 4000); // Responsive star count
    
    for(let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.5 + 0.5,
            speed: Math.random() * 0.2 + 0.05,
            opacity: Math.random()
        });
    }
}

function animateStars() {
    ctx.clearRect(0, 0, width, height);
    
    stars.forEach(star => {
        // Update position (floating slowly upwards/left)
        star.y -= star.speed;
        star.x -= star.speed * 0.2;
        
        // Reset if out of bounds
        if(star.y < 0) star.y = height;
        if(star.x < 0) star.x = width;
        
        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
    });
    
    requestAnimationFrame(animateStars);
}

window.addEventListener('resize', initCanvas);
initCanvas();
animateStars();

// Intersection Observer for Scroll Animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optional: stop observing once visible if you want it to only animate once
            // observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el);
});

// Memory Galaxy Interaction
const memoryStars = document.querySelectorAll('.memory-star');
const modal = document.getElementById('memory-modal');
const closeModal = document.getElementById('close-modal');
const modalTitle = document.getElementById('modal-title');
const modalDate = document.getElementById('modal-date');
const modalDesc = document.getElementById('modal-desc');

const memoriesData = {
    "1": { title: "Our First Memory", date: "Jan 1, 2024", desc: "A beautiful placeholder for where it all began." },
    "2": { title: "That Special Day", date: "Feb 14, 2024", desc: "Placeholder description for a cherished memory." },
    "3": { title: "Laughter in the Rain", date: "April 10, 2024", desc: "An unforgettable moment we shared." },
    "4": { title: "A Midnight Conversation", date: "June 5, 2024", desc: "Talking about our dreams under the stars." },
    "5": { title: "A Beautiful Surprise", date: "August 5, 2024", desc: "Celebrating her special day together." },
    "6": { title: "A New Adventure", date: "October 12, 2024", desc: "Looking forward to what the future holds." }
};

memoryStars.forEach(star => {
    star.addEventListener('click', () => {
        const id = star.getAttribute('data-memory');
        const data = memoriesData[id];
        if(data) {
            modalTitle.textContent = data.title;
            modalDate.textContent = data.date;
            modalDesc.textContent = data.desc;
            modal.classList.add('active');
        }
    });
});

closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
});

modal.addEventListener('click', (e) => {
    if(e.target === modal) {
        modal.classList.remove('active');
    }
});

// Life Counter Logic
function updateLifeCounter() {
    // Target date: August 5, 2007
    const birthDate = new Date('2007-08-05T00:00:00');
    const now = new Date();
    
    // Total milliseconds elapsed
    const diffMs = now - birthDate;
    
    // Calculate full years accurately considering leap years
    let ageDate = new Date(diffMs); 
    let years = Math.abs(ageDate.getUTCFullYear() - 1970);
    
    // Total days
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    // Total hours
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    // Total minutes
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    
    // Update DOM (Add commas for readability)
    document.getElementById('count-years').textContent = years;
    document.getElementById('count-days').textContent = totalDays.toLocaleString();
    document.getElementById('count-hours').textContent = totalHours.toLocaleString();
    document.getElementById('count-minutes').textContent = totalMinutes.toLocaleString();
}

// Initial call and interval
updateLifeCounter();
setInterval(updateLifeCounter, 60000); // Update every minute to keep minutes accurate
