// Home Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    animateStats();
});

// تحريك الأرقام
function animateStats() {
    const stats = [
        { id: 'stat1', target: 5000, suffix: '+' },
        { id: 'stat2', target: 15, suffix: '' },
        { id: 'stat3', target: 100, suffix: '+' },
        { id: 'stat4', target: 95, suffix: '%' }
    ];
    
    stats.forEach(stat => {
        const element = document.getElementById(stat.id);
        if (element) {
            animateValue(element, 0, stat.target, 2000, stat.suffix);
        }
    });
}

// تأثير العد التصاعدي
function animateValue(element, start, end, duration, suffix = '') {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = end + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}
