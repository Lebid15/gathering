// Admin Authentication
// بيانات الأدمن الثابتة
const ADMIN_PHONE = '5443805422';
const ADMIN_PASSWORD = 'Imadelabes2025';

// عناصر الصفحة
const loginForm = document.getElementById('loginForm');
const phoneInput = document.getElementById('phoneNumber');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const alertContainer = document.getElementById('alertContainer');
const togglePasswordBtn = document.getElementById('togglePassword');
const toggleIcon = document.getElementById('toggleIcon');

// إظهار/إخفاء كلمة السر
togglePasswordBtn?.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    toggleIcon.classList.toggle('bi-eye');
    toggleIcon.classList.toggle('bi-eye-slash');
});

// عرض رسالة تنبيه
function showAlert(message, type = 'danger') {
    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}-fill"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
}

// التحقق من حالة تسجيل الدخول
function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    const currentPage = window.location.pathname.split('/').pop();
    
    if (isLoggedIn && currentPage === 'admin-login.html') {
        window.location.href = 'admin-dashboard.html';
    } else if (!isLoggedIn && currentPage === 'admin-dashboard.html') {
        window.location.href = 'admin-login.html';
    }
}

// تسجيل الدخول
loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const phone = phoneInput.value.trim();
    const password = passwordInput.value.trim();
    
    // التحقق من البيانات
    if (phone === ADMIN_PHONE && password === ADMIN_PASSWORD) {
        // حفظ حالة تسجيل الدخول
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminLoginTime', new Date().toISOString());
        
        // عرض رسالة نجاح
        showAlert('تم تسجيل الدخول بنجاح! جاري التحويل...', 'success');
        
        // الانتقال لصفحة الإدارة
        setTimeout(() => {
            window.location.href = 'admin-dashboard.html';
        }, 1000);
    } else {
        showAlert('رقم الجوال أو كلمة السر غير صحيحة!', 'danger');
        passwordInput.value = '';
    }
});

// تسجيل الخروج
function logout() {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminLoginTime');
    window.location.href = 'admin-login.html';
}

// التحقق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', checkAuthStatus);

// تصدير الدوال
window.adminAuth = {
    logout,
    checkAuthStatus,
    isLoggedIn: () => localStorage.getItem('adminLoggedIn') === 'true'
};
