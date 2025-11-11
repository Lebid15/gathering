// Registration Page JavaScript

const registerForm = document.getElementById('registerForm');
const submitBtn = document.getElementById('submitBtn');
const alertContainer = document.getElementById('alertContainer');
const successMessage = document.getElementById('successMessage');

// عرض رسالة
function showAlert(message, type = 'danger') {
    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}-fill me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    alertContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// التحقق من صحة البيانات
function validateForm() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const memberType = document.getElementById('memberType').value;
    const city = document.getElementById('city').value.trim();
    const agreeTerms = document.getElementById('agreeTerms').checked;

    if (!firstName || !lastName) {
        showAlert('الرجاء إدخال الاسم الكامل');
        return false;
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        showAlert('الرجاء إدخال بريد إلكتروني صحيح');
        return false;
    }

    if (!phone || !/^\d{9,10}$/.test(phone)) {
        showAlert('الرجاء إدخال رقم جوال صحيح (9-10 أرقام)');
        return false;
    }

    if (!memberType) {
        showAlert('الرجاء اختيار نوع العضوية');
        return false;
    }

    if (!city) {
        showAlert('الرجاء إدخال المدينة');
        return false;
    }

    if (!agreeTerms) {
        showAlert('يجب الموافقة على أهداف ومبادئ التجمع');
        return false;
    }

    return true;
}

// إرسال النموذج
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    // جمع البيانات
    const formData = {
        first_name: document.getElementById('firstName').value.trim(),
        last_name: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone_primary: '+963' + document.getElementById('phone').value.trim(),
        city: document.getElementById('city').value.trim(),
        member_type: document.getElementById('memberType').value,
        degree: document.getElementById('degree').value,
        specialization: document.getElementById('specialization').value.trim(),
        university: document.getElementById('university').value.trim(),
        graduation_year: document.getElementById('graduationYear').value,
        current_job: document.getElementById('currentJob').value.trim(),
        expertise: document.getElementById('expertise').value.trim(),
        is_visible: false, // المسجلون الجدد مخفيون حتى الموافقة
        created_at: new Date().toISOString()
    };

    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> جاري الإرسال...';

        // إرسال البيانات إلى Supabase
        const result = await window.membersAPI.addMember(formData);

        if (result.success) {
            registerForm.classList.add('d-none');
            successMessage.classList.remove('d-none');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            showAlert('حدث خطأ أثناء إرسال الطلب. الرجاء المحاولة لاحقاً.', 'danger');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i> إرسال الطلب';
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('حدث خطأ غير متوقع. الرجاء المحاولة لاحقاً.', 'danger');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i> إرسال الطلب';
    }
});

// تفعيل/تعطيل حقول حسب نوع العضوية
document.getElementById('memberType').addEventListener('change', (e) => {
    const degree = document.getElementById('degree');
    const specialization = document.getElementById('specialization');
    const university = document.getElementById('university');
    const graduationYear = document.getElementById('graduationYear');

    if (e.target.value === 'student') {
        degree.value = '';
        graduationYear.value = '';
        degree.disabled = true;
        graduationYear.disabled = true;
    } else {
        degree.disabled = false;
        graduationYear.disabled = false;
    }
});
