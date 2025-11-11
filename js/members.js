// Members Page JavaScript

const membersContainer = document.getElementById('membersContainer');
const searchInput = document.getElementById('searchInput');
const loadingSpinner = document.getElementById('loadingSpinner');
const noMembersMessage = document.getElementById('noMembersMessage');

let allMembers = [];

// تحميل الصفحة
document.addEventListener('DOMContentLoaded', async () => {
    await loadMembers();
    
    // البحث
    searchInput.addEventListener('input', filterMembers);
});

// تحميل الأعضاء
async function loadMembers() {
    try {
        loadingSpinner.classList.remove('d-none');
        membersContainer.innerHTML = '';
        noMembersMessage.classList.add('d-none');
        
        const result = await window.membersAPI.getVisibleMembers();
        
        if (result.success) {
            allMembers = result.data;
            displayMembers(allMembers);
        } else {
            showNoMembers();
        }
    } catch (error) {
        console.error('Error loading members:', error);
        showNoMembers();
    } finally {
        loadingSpinner.classList.add('d-none');
    }
}

// عرض الأعضاء
function displayMembers(members) {
    if (members.length === 0) {
        showNoMembers();
        return;
    }
    
    noMembersMessage.classList.add('d-none');
    membersContainer.innerHTML = '';
    
    members.forEach(member => {
        const memberCard = createMemberCard(member);
        membersContainer.appendChild(memberCard);
    });
}

// إنشاء بطاقة عضو
function createMemberCard(member) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';
    
    const fullName = `${member.first_name} ${member.last_name}`;
    const email = member.email || 'غير متوفر';
    const phone = member.phone_primary || 'غير متوفر';
    const city = member.city || 'غير محدد';
    const country = member.country || 'غير محدد';
    
    col.innerHTML = `
        <div class="card h-100 shadow-sm member-card">
            <div class="card-body">
                <div class="text-center mb-3">
                    <div class="member-avatar bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 80px; height: 80px; font-size: 2rem;">
                        ${member.first_name.charAt(0)}${member.last_name.charAt(0)}
                    </div>
                </div>
                <h5 class="card-title text-center mb-3">${fullName}</h5>
                <div class="member-info">
                    <p class="mb-2">
                        <i class="bi bi-envelope text-primary"></i>
                        <small>${email}</small>
                    </p>
                    <p class="mb-2">
                        <i class="bi bi-phone text-success"></i>
                        <small>${phone}</small>
                    </p>
                    <p class="mb-2">
                        <i class="bi bi-geo-alt text-danger"></i>
                        <small>${city}, ${country}</small>
                    </p>
                </div>
            </div>
        </div>
    `;
    
    return col;
}

// البحث والفلترة
function filterMembers() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm === '') {
        displayMembers(allMembers);
        return;
    }
    
    const filtered = allMembers.filter(member => {
        const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
        const email = (member.email || '').toLowerCase();
        const phone = (member.phone_primary || '').toLowerCase();
        const city = (member.city || '').toLowerCase();
        
        return fullName.includes(searchTerm) ||
               email.includes(searchTerm) ||
               phone.includes(searchTerm) ||
               city.includes(searchTerm);
    });
    
    displayMembers(filtered);
}

// عرض رسالة عدم وجود أعضاء
function showNoMembers() {
    membersContainer.innerHTML = '';
    noMembersMessage.classList.remove('d-none');
}
