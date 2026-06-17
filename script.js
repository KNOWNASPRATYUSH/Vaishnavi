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
            // Optional: unobserve if you only want the animation to happen once
            // observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el);
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
    
    // Total seconds
    const totalSeconds = Math.floor(diffMs / 1000);
    
    // Update DOM elements safely
    const yearsEl = document.getElementById('count-years');
    const daysEl = document.getElementById('count-days');
    const hoursEl = document.getElementById('count-hours');
    const minsEl = document.getElementById('count-minutes');
    const secsEl = document.getElementById('count-seconds');

    if(yearsEl) yearsEl.textContent = years;
    if(daysEl) daysEl.textContent = totalDays.toLocaleString();
    if(hoursEl) hoursEl.textContent = totalHours.toLocaleString();
    if(minsEl) minsEl.textContent = totalMinutes.toLocaleString();
    if(secsEl) secsEl.textContent = totalSeconds.toLocaleString();
}

// Initial call and set interval for every second
updateLifeCounter();
setInterval(updateLifeCounter, 1000);
