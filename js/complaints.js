// Complaints Page JavaScript

const complaintForm = document.getElementById('complaintForm');
const alertContainer = document.getElementById('alertContainer');
const successMessage = document.getElementById('successMessage');
const submitBtn = document.getElementById('submitBtn');

// تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    complaintForm.addEventListener('submit', handleSubmitComplaint);
});

// إرسال الشكوى
async function handleSubmitComplaint(e) {
    e.preventDefault();
    
    // تعطيل الزر
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> جاري الإرسال...';
    
    const complaintData = {
        full_name: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim() || null,
        type: document.getElementById('type').value,
        subject: document.getElementById('subject').value.trim(),
        message: document.getElementById('message').value.trim()
    };
    
    try {
        const result = await window.complaintsAPI.addComplaint(complaintData);
        
        if (result.success) {
            // إخفاء النموذج
            complaintForm.classList.add('d-none');
            // عرض رسالة النجاح
            successMessage.classList.remove('d-none');
            // مسح الحقول
            complaintForm.reset();
        } else {
            showAlert('حدث خطأ أثناء إرسال الرسالة: ' + result.error, 'danger');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى', 'danger');
    } finally {
        // إعادة تفعيل الزر
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-send-fill me-2"></i> إرسال الرسالة';
    }
}

// عرض تنبيه
function showAlert(message, type) {
    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    setTimeout(() => {
        alertContainer.innerHTML = '';
    }, 5000);
}
