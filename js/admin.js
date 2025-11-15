// Admin Dashboard JavaScript

// التحقق من تسجيل الدخول
if (!window.adminAuth.isLoggedIn()) {
    window.location.href = 'admin-login.html';
}

// عناصر الصفحة
const logoutBtn = document.getElementById('logoutBtn');
const refreshBtn = document.getElementById('refreshBtn');
const searchMember = document.getElementById('searchMember');
const filterVisibility = document.getElementById('filterVisibility');
const membersTableBody = document.getElementById('membersTableBody');
const tableLoading = document.getElementById('tableLoading');
const tableWrapper = document.getElementById('tableWrapper');

// الأقسام
const membersSection = document.getElementById('membersSection');
const addSection = document.getElementById('addSection');
const statisticsSection = document.getElementById('statisticsSection');
const articlesSection = document.getElementById('articlesSection');
const addArticleSection = document.getElementById('addArticleSection');

// النماذج
const addMemberForm = document.getElementById('addMemberForm');
const editMemberForm = document.getElementById('editMemberForm');
const saveEditBtn = document.getElementById('saveEditBtn');

// المودال
const editModal = new bootstrap.Modal(document.getElementById('editModal'));

let allMembers = [];
let currentEditId = null;

// تحميل الصفحة
document.addEventListener('DOMContentLoaded', async () => {
    await loadMembers();
    await loadStatistics();
    setupEventListeners();
});

// إعداد المستمعين
function setupEventListeners() {
    // تسجيل الخروج
    logoutBtn.addEventListener('click', () => window.adminAuth.logout());
    
    // تحديث
    refreshBtn.addEventListener('click', loadMembers);
    
    // البحث والفلترة
    searchMember.addEventListener('input', filterTable);
    filterVisibility.addEventListener('change', filterTable);
    
    // التنقل بين الأقسام
    document.querySelectorAll('[data-section]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.currentTarget.dataset.section;
            showSection(section);
            
            // تحديث الأقسام النشطة
            document.querySelectorAll('[data-section]').forEach(l => l.classList.remove('active'));
            e.currentTarget.classList.add('active');
        });
    });
    
    // إضافة عضو
    addMemberForm.addEventListener('submit', handleAddMember);
    
    // تعديل عضو
    saveEditBtn.addEventListener('click', handleEditMember);
}

// عرض قسم معين
function showSection(section) {
    membersSection.classList.add('d-none');
    addSection.classList.add('d-none');
    statisticsSection.classList.add('d-none');
    articlesSection.classList.add('d-none');
    addArticleSection.classList.add('d-none');
    
    if (section === 'members') {
        membersSection.classList.remove('d-none');
    } else if (section === 'add') {
        addSection.classList.remove('d-none');
    } else if (section === 'statistics') {
        statisticsSection.classList.remove('d-none');
        loadStatistics();
    } else if (section === 'articles') {
        articlesSection.classList.remove('d-none');
        loadArticlesAdmin();
    } else if (section === 'addArticle') {
        addArticleSection.classList.remove('d-none');
    }
}

// تحميل الأعضاء
async function loadMembers() {
    try {
        tableLoading.classList.remove('d-none');
        tableWrapper.classList.add('d-none');
        
        const result = await window.membersAPI.getAllMembers();
        
        if (result.success) {
            allMembers = result.data;
            displayMembersTable(allMembers);
        }
    } catch (error) {
        console.error('Error loading members:', error);
        showAlert('حدث خطأ أثناء تحميل الأعضاء', 'danger', 'addAlertContainer');
    } finally {
        tableLoading.classList.add('d-none');
        tableWrapper.classList.remove('d-none');
    }
}

// عرض جدول الأعضاء
function displayMembersTable(members) {
    membersTableBody.innerHTML = '';
    
    if (members.length === 0) {
        membersTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4">
                    <i class="bi bi-inbox fs-1 text-muted"></i>
                    <p class="mt-2 text-muted">لا توجد أعضاء</p>
                </td>
            </tr>
        `;
        return;
    }
    
    members.forEach((member, index) => {
        const row = createMemberRow(member, index + 1);
        membersTableBody.appendChild(row);
    });
}

// إنشاء صف عضو
function createMemberRow(member, index) {
    const tr = document.createElement('tr');
    const fullName = `${member.first_name} ${member.last_name}`;
    const email = member.email || '-';
    const phone = member.phone_primary || '-';
    const city = member.city || '-';
    const visibilityBadge = member.is_visible 
        ? '<span class="badge bg-success"><i class="bi bi-eye"></i> مرئي</span>'
        : '<span class="badge bg-warning"><i class="bi bi-eye-slash"></i> مخفي</span>';
    
    tr.innerHTML = `
        <td>${index}</td>
        <td>${fullName}</td>
        <td>${email}</td>
        <td>${phone}</td>
        <td>${city}</td>
        <td>${visibilityBadge}</td>
        <td>
            <div class="btn-group btn-group-sm" role="group">
                <button class="btn btn-outline-primary" onclick="editMember('${member.id}')" title="تعديل">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-outline-warning" onclick="toggleVisibility('${member.id}', ${member.is_visible})" title="إخفاء/إظهار">
                    <i class="bi bi-eye-slash"></i>
                </button>
                <button class="btn btn-outline-danger" onclick="deleteMemberConfirm('${member.id}', '${fullName}')" title="حذف">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    return tr;
}

// فلترة الجدول
function filterTable() {
    const searchTerm = searchMember.value.trim().toLowerCase();
    const visibility = filterVisibility.value;
    
    let filtered = [...allMembers];
    
    // فلترة حسب الرؤية
    if (visibility === 'visible') {
        filtered = filtered.filter(m => m.is_visible);
    } else if (visibility === 'hidden') {
        filtered = filtered.filter(m => !m.is_visible);
    }
    
    // فلترة حسب البحث
    if (searchTerm) {
        filtered = filtered.filter(member => {
            const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
            const email = (member.email || '').toLowerCase();
            const phone = (member.phone_primary || '').toLowerCase();
            
            return fullName.includes(searchTerm) ||
                   email.includes(searchTerm) ||
                   phone.includes(searchTerm);
        });
    }
    
    displayMembersTable(filtered);
}

// إضافة عضو جديد
async function handleAddMember(e) {
    e.preventDefault();
    
    const memberData = {
        first_name: document.getElementById('addFirstName').value.trim(),
        last_name: document.getElementById('addLastName').value.trim(),
        email: document.getElementById('addEmail').value.trim() || null,
        phone_primary: document.getElementById('addPhone').value.trim() || null,
        city: document.getElementById('addCity').value.trim() || null,
        member_type: document.getElementById('addMemberType').value || null,
        degree: document.getElementById('addDegree').value || null,
        specialization: document.getElementById('addSpecialization').value.trim() || null,
        university: document.getElementById('addUniversity').value.trim() || null,
        graduation_year: document.getElementById('addGraduationYear').value ? parseInt(document.getElementById('addGraduationYear').value) : null,
        current_job: document.getElementById('addCurrentJob').value.trim() || null,
        expertise: document.getElementById('addExpertise').value.trim() || null,
        is_visible: document.getElementById('addIsVisible').checked
    };

    // التحقق من الحقول الأساسية
    if (!memberData.first_name || !memberData.last_name) {
        showAlert('يرجى إدخال الاسم الأول واسم العائلة على الأقل', 'danger', 'addAlertContainer');
        return;
    }
    
    const result = await window.membersAPI.addMember(memberData);
    
    if (result.success) {
        showAlert('تم إضافة العضو بنجاح!', 'success', 'addAlertContainer');
        addMemberForm.reset();
        document.getElementById('addIsVisible').checked = true;
        await loadMembers();
        await loadStatistics();
    } else {
        showAlert('فشل في إضافة العضو: ' + result.error, 'danger', 'addAlertContainer');
    }
}

// تعديل عضو
window.editMember = async function(id) {
    const result = await window.membersAPI.getMemberById(id);
    
    if (result.success) {
        const member = result.data;
        currentEditId = id;
        
        // المعلومات الشخصية
        document.getElementById('editMemberId').value = id;
        document.getElementById('editFirstName').value = member.first_name;
        document.getElementById('editLastName').value = member.last_name;
        document.getElementById('editEmail').value = member.email || '';
        document.getElementById('editPhone').value = member.phone_primary || '';
        
        // المعلومات الأكاديمية
        document.getElementById('editMemberType').value = member.member_type || '';
        document.getElementById('editDegree').value = member.degree || '';
        document.getElementById('editSpecialization').value = member.specialization || '';
        document.getElementById('editUniversity').value = member.university || '';
        document.getElementById('editGraduationYear').value = member.graduation_year || '';
        document.getElementById('editCity').value = member.city || '';
        
        // المعلومات المهنية
        document.getElementById('editCurrentJob').value = member.current_job || '';
        document.getElementById('editExpertise').value = member.expertise || '';
        
        // إعدادات الظهور
        document.getElementById('editIsVisible').checked = member.is_visible;
        
        editModal.show();
    }
};

// حفظ التعديلات
async function handleEditMember() {
    if (!currentEditId) return;
    
    const memberData = {
        // المعلومات الشخصية
        first_name: document.getElementById('editFirstName').value.trim(),
        last_name: document.getElementById('editLastName').value.trim(),
        email: document.getElementById('editEmail').value.trim() || null,
        phone_primary: document.getElementById('editPhone').value.trim() || null,
        
        // المعلومات الأكاديمية
        member_type: document.getElementById('editMemberType').value || null,
        degree: document.getElementById('editDegree').value || null,
        specialization: document.getElementById('editSpecialization').value.trim() || null,
        university: document.getElementById('editUniversity').value.trim() || null,
        graduation_year: document.getElementById('editGraduationYear').value ? parseInt(document.getElementById('editGraduationYear').value) : null,
        city: document.getElementById('editCity').value.trim() || null,
        
        // المعلومات المهنية
        current_job: document.getElementById('editCurrentJob').value.trim() || null,
        expertise: document.getElementById('editExpertise').value.trim() || null,
        
        // إعدادات الظهور
        is_visible: document.getElementById('editIsVisible').checked
    };
    
    const result = await window.membersAPI.updateMember(currentEditId, memberData);
    
    if (result.success) {
        showAlert('تم تحديث العضو بنجاح!', 'success', 'editAlertContainer');
        setTimeout(() => {
            editModal.hide();
            loadMembers();
            loadStatistics();
        }, 1000);
    } else {
        showAlert('فشل في تحديث العضو: ' + result.error, 'danger', 'editAlertContainer');
    }
}

// تبديل الرؤية
window.toggleVisibility = async function(id, currentVisibility) {
    const result = await window.membersAPI.toggleMemberVisibility(id, currentVisibility);
    
    if (result.success) {
        await loadMembers();
        await loadStatistics();
    } else {
        alert('فشل في تغيير حالة الرؤية');
    }
};

// حذف عضو مع التأكيد
window.deleteMemberConfirm = function(id, name) {
    if (confirm(`هل أنت متأكد من حذف العضو: ${name}؟`)) {
        deleteMemberAction(id);
    }
};

// حذف عضو
async function deleteMemberAction(id) {
    const result = await window.membersAPI.deleteMember(id);
    
    if (result.success) {
        await loadMembers();
        await loadStatistics();
    } else {
        alert('فشل في حذف العضو: ' + result.error);
    }
}

// تحميل الإحصائيات
async function loadStatistics() {
    const result = await window.membersAPI.getStatistics();
    
    if (result.success) {
        document.getElementById('statTotalMembers').textContent = result.data.total;
        document.getElementById('statVisibleMembers').textContent = result.data.visible;
        document.getElementById('statHiddenMembers').textContent = result.data.hidden;
    }
}

// عرض تنبيه
function showAlert(message, type, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

// ============ إدارة المقالات ============

let allArticles = [];
let currentEditArticleId = null;

// عناصر المقالات
const articlesTableBody = document.getElementById('articlesTableBody');
const articlesLoading = document.getElementById('articlesLoading');
const articlesTableWrapper = document.getElementById('articlesTableWrapper');
const addArticleForm = document.getElementById('addArticleForm');
const editArticleForm = document.getElementById('editArticleForm');
const saveArticleEditBtn = document.getElementById('saveArticleEditBtn');
const refreshArticlesBtn = document.getElementById('refreshArticlesBtn');

// المودال
const editArticleModal = new bootstrap.Modal(document.getElementById('editArticleModal'));

// إعداد مستمعات المقالات
if (addArticleForm) {
    addArticleForm.addEventListener('submit', handleAddArticle);
}
if (saveArticleEditBtn) {
    saveArticleEditBtn.addEventListener('click', handleEditArticle);
}
if (refreshArticlesBtn) {
    refreshArticlesBtn.addEventListener('click', loadArticlesAdmin);
}

// تحميل المقالات للإدارة
async function loadArticlesAdmin() {
    try {
        articlesLoading.classList.remove('d-none');
        articlesTableWrapper.classList.add('d-none');
        
        const result = await window.articlesAPI.getAllArticles();
        
        if (result.success) {
            allArticles = result.data;
            displayArticlesTable(allArticles);
        }
    } catch (error) {
        console.error('Error loading articles:', error);
    } finally {
        articlesLoading.classList.add('d-none');
        articlesTableWrapper.classList.remove('d-none');
    }
}

// عرض جدول المقالات
function displayArticlesTable(articles) {
    articlesTableBody.innerHTML = '';
    
    if (articles.length === 0) {
        articlesTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">
                    <i class="bi bi-inbox fs-1 text-muted"></i>
                    <p class="mt-2 text-muted">لا توجد مقالات</p>
                </td>
            </tr>
        `;
        return;
    }
    
    articles.forEach((article, index) => {
        const row = createArticleRow(article, index + 1);
        articlesTableBody.appendChild(row);
    });
}

// إنشاء صف مقال
function createArticleRow(article, index) {
    const tr = document.createElement('tr');
    const date = new Date(article.created_at).toLocaleDateString('ar-SA');
    
    tr.innerHTML = `
        <td>${index}</td>
        <td>${article.title}</td>
        <td>${article.author}</td>
        <td>${date}</td>
        <td>
            <div class="btn-group btn-group-sm" role="group">
                <button class="btn btn-outline-primary" onclick="editArticleAdmin('${article.id}')" title="تعديل">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-outline-danger" onclick="deleteArticleConfirm('${article.id}', '${article.title}')" title="حذف">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    return tr;
}

// إضافة مقال جديد
async function handleAddArticle(e) {
    e.preventDefault();
    
    const articleData = {
        title: document.getElementById('articleTitle').value.trim(),
        author: document.getElementById('articleAuthor').value.trim(),
        content: document.getElementById('articleContent').value.trim(),
        image_url: document.getElementById('articleImage').value.trim() || null
    };

    if (!articleData.title || !articleData.author || !articleData.content) {
        showAlert('يرجى إدخال جميع الحقول المطلوبة', 'danger', 'addArticleAlertContainer');
        return;
    }
    
    const result = await window.articlesAPI.addArticle(articleData);
    
    if (result.success) {
        showAlert('تم إضافة المقال بنجاح!', 'success', 'addArticleAlertContainer');
        addArticleForm.reset();
    } else {
        showAlert('فشل في إضافة المقال: ' + result.error, 'danger', 'addArticleAlertContainer');
    }
}

// تعديل مقال
window.editArticleAdmin = async function(id) {
    const result = await window.articlesAPI.getArticleById(id);
    
    if (result.success) {
        const article = result.data;
        currentEditArticleId = id;
        
        document.getElementById('editArticleId').value = id;
        document.getElementById('editArticleTitle').value = article.title;
        document.getElementById('editArticleAuthor').value = article.author;
        document.getElementById('editArticleContent').value = article.content;
        document.getElementById('editArticleImage').value = article.image_url || '';
        
        editArticleModal.show();
    }
};

// حفظ تعديلات المقال
async function handleEditArticle() {
    if (!currentEditArticleId) return;
    
    const articleData = {
        title: document.getElementById('editArticleTitle').value.trim(),
        author: document.getElementById('editArticleAuthor').value.trim(),
        content: document.getElementById('editArticleContent').value.trim(),
        image_url: document.getElementById('editArticleImage').value.trim() || null
    };
    
    const result = await window.articlesAPI.updateArticle(currentEditArticleId, articleData);
    
    if (result.success) {
        showAlert('تم تحديث المقال بنجاح!', 'success', 'editArticleAlertContainer');
        setTimeout(() => {
            editArticleModal.hide();
            loadArticlesAdmin();
        }, 1000);
    } else {
        showAlert('فشل في تحديث المقال: ' + result.error, 'danger', 'editArticleAlertContainer');
    }
}

// حذف مقال مع التأكيد
window.deleteArticleConfirm = function(id, title) {
    if (confirm(`هل أنت متأكد من حذف المقال: ${title}؟`)) {
        deleteArticleAction(id);
    }
};

// حذف مقال
async function deleteArticleAction(id) {
    const result = await window.articlesAPI.deleteArticle(id);
    
    if (result.success) {
        await loadArticlesAdmin();
    } else {
        alert('فشل في حذف المقال: ' + result.error);
    }
}
