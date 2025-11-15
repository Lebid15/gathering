// Articles Page JavaScript

const articlesContainer = document.getElementById('articlesContainer');
const articlesLoading = document.getElementById('articlesLoading');
const noArticles = document.getElementById('noArticles');

// تحميل الصفحة
document.addEventListener('DOMContentLoaded', async () => {
    await loadArticles();
});

// تحميل المقالات
async function loadArticles() {
    try {
        articlesLoading.classList.remove('d-none');
        articlesContainer.classList.add('d-none');
        noArticles.classList.add('d-none');
        
        const result = await window.articlesAPI.getAllArticles();
        
        if (result.success && result.data.length > 0) {
            displayArticles(result.data);
            articlesContainer.classList.remove('d-none');
        } else {
            noArticles.classList.remove('d-none');
        }
    } catch (error) {
        console.error('Error loading articles:', error);
        noArticles.classList.remove('d-none');
    } finally {
        articlesLoading.classList.add('d-none');
    }
}

// عرض المقالات
function displayArticles(articles) {
    articlesContainer.innerHTML = '';
    
    articles.forEach(article => {
        const articleCard = createArticleCard(article);
        articlesContainer.appendChild(articleCard);
    });
}

// إنشاء كارد مقال
function createArticleCard(article) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';
    
    const date = new Date(article.created_at).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // اختصار المحتوى
    const shortContent = article.content.length > 150 
        ? article.content.substring(0, 150) + '...' 
        : article.content;
    
    // الصورة الافتراضية
    const imageUrl = article.image_url || 'https://via.placeholder.com/400x250?text=مقال';
    
    col.innerHTML = `
        <div class="card h-100 shadow-sm border-0 rounded-4 overflow-hidden hover-lift">
            <img src="${imageUrl}" class="card-img-top" alt="${article.title}" style="height: 200px; object-fit: cover;">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title fw-bold text-primary mb-3">${article.title}</h5>
                <p class="card-text text-muted mb-3">${shortContent}</p>
                <div class="mt-auto">
                    <div class="d-flex justify-content-between align-items-center text-muted small mb-3">
                        <span><i class="bi bi-person-fill me-1"></i> ${article.author}</span>
                        <span><i class="bi bi-calendar3 me-1"></i> ${date}</span>
                    </div>
                    <button class="btn btn-primary btn-sm w-100" onclick="showArticleModal('${article.id}')">
                        <i class="bi bi-book me-2"></i> اقرأ المزيد
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return col;
}

// عرض المقال الكامل في مودال
window.showArticleModal = async function(id) {
    const result = await window.articlesAPI.getArticleById(id);
    
    if (result.success) {
        const article = result.data;
        const date = new Date(article.created_at).toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const imageUrl = article.image_url || 'https://via.placeholder.com/800x400?text=مقال';
        
        // إنشاء المودال
        const modalHtml = `
            <div class="modal fade" id="articleModal" tabindex="-1">
                <div class="modal-dialog modal-xl modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header border-0">
                            <h5 class="modal-title fw-bold">${article.title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <img src="${imageUrl}" class="img-fluid rounded mb-4" alt="${article.title}">
                            <div class="d-flex justify-content-between align-items-center text-muted mb-4">
                                <span><i class="bi bi-person-fill me-2"></i> ${article.author}</span>
                                <span><i class="bi bi-calendar3 me-2"></i> ${date}</span>
                            </div>
                            <div class="article-content" style="white-space: pre-wrap; line-height: 1.8;">
                                ${article.content}
                            </div>
                        </div>
                        <div class="modal-footer border-0">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إغلاق</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // إزالة المودال القديم إن وجد
        const oldModal = document.getElementById('articleModal');
        if (oldModal) {
            oldModal.remove();
        }
        
        // إضافة المودال الجديد
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // عرض المودال
        const modal = new bootstrap.Modal(document.getElementById('articleModal'));
        modal.show();
        
        // إزالة المودال بعد الإغلاق
        document.getElementById('articleModal').addEventListener('hidden.bs.modal', function() {
            this.remove();
        });
    }
};

// إضافة تأثير hover للكاردات
const style = document.createElement('style');
style.textContent = `
    .hover-lift {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .hover-lift:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;
    }
`;
document.head.appendChild(style);
