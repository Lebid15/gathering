// Home Page JavaScript

document.addEventListener('DOMContentLoaded', async () => {
    await loadRealStatistics();
    animateStats();
});

// تحميل الإحصائيات الحقيقية من قاعدة البيانات
async function loadRealStatistics() {
    try {
        const result = await window.membersAPI.getStatistics();
        if (result.success) {
            // تحديث عدد الأعضاء الحقيقي
            const stat1Element = document.getElementById('stat1');
            if (stat1Element) {
                stat1Element.setAttribute('data-target', result.data.total);
            }
        }
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// تحريك الأرقام
function animateStats() {
    const stat1Element = document.getElementById('stat1');
    const stat2Element = document.getElementById('stat2');
    
    // عدد الأعضاء (من قاعدة البيانات)
    if (stat1Element) {
        const target = parseInt(stat1Element.getAttribute('data-target')) || 0;
        animateValue(stat1Element, 0, target, 2000, '');
    }
    
    // لجنة متخصصة (ثابت)
    if (stat2Element) {
        animateValue(stat2Element, 0, 15, 2000, '');
    }
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
