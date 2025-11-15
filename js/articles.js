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
    col.className = 'col-12';
    
    const date = new Date(article.created_at).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // اختصار المحتوى
    const shortContent = article.content.length > 200 
        ? article.content.substring(0, 200) + '...' 
        : article.content;
    
    col.innerHTML = `
        <div class="card shadow-sm border-0 rounded-4 overflow-hidden hover-lift mb-4">
            <div class="card-body p-4">
                <div class="text-center mb-3">
                    <h4 class="card-title fw-bold text-primary mb-3">${article.title}</h4>
                    <div class="d-flex justify-content-center align-items-center gap-4 text-muted small mb-3">
                        <span><i class="bi bi-person-fill me-1"></i> ${article.author}</span>
                        <span><i class="bi bi-calendar3 me-1"></i> ${date}</span>
                    </div>
                </div>
                <p class="card-text text-muted text-center mb-4" style="line-height: 1.8;">${shortContent}</p>
                <div class="text-center">
                    <button class="btn btn-primary" onclick="showArticleModal('${article.id}')">
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
                            <div class="d-flex justify-content-center align-items-center gap-4 text-muted mb-4">
                                <span><i class="bi bi-person-fill me-2"></i> ${article.author}</span>
                                <span><i class="bi bi-calendar3 me-2"></i> ${date}</span>
                            </div>
                            <div class="article-content text-center" style="white-space: pre-wrap; line-height: 2;">
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
