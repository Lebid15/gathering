// API Functions for Supabase

// اسم الجدول في Supabase
const MEMBERS_TABLE = 'members';

// جلب جميع الأعضاء
async function getAllMembers() {
    try {
        const { data, error } = await window.supabaseClient
            .from(MEMBERS_TABLE)
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching members:', error);
        return { success: false, error: error.message };
    }
}

// جلب الأعضاء المرئيين فقط
async function getVisibleMembers() {
    try {
        const { data, error } = await window.supabaseClient
            .from(MEMBERS_TABLE)
            .select('*')
            .eq('is_visible', true)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching visible members:', error);
        return { success: false, error: error.message };
    }
}

// جلب عضو واحد بالـ ID
async function getMemberById(id) {
    try {
        const { data, error } = await window.supabaseClient
            .from(MEMBERS_TABLE)
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching member:', error);
        return { success: false, error: error.message };
    }
}

// إضافة عضو جديد
async function addMember(memberData) {
    try {
        const { data, error } = await window.supabaseClient
            .from(MEMBERS_TABLE)
            .insert([memberData])
            .select();
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error adding member:', error);
        return { success: false, error: error.message };
    }
}

// تحديث بيانات عضو
async function updateMember(id, memberData) {
    try {
        const { data, error } = await window.supabaseClient
            .from(MEMBERS_TABLE)
            .update(memberData)
            .eq('id', id)
            .select();
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error updating member:', error);
        return { success: false, error: error.message };
    }
}

// حذف عضو
async function deleteMember(id) {
    try {
        const { error } = await window.supabaseClient
            .from(MEMBERS_TABLE)
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error deleting member:', error);
        return { success: false, error: error.message };
    }
}

// تبديل حالة الرؤية (إخفاء/إظهار)
async function toggleMemberVisibility(id, currentVisibility) {
    try {
        const { data, error } = await window.supabaseClient
            .from(MEMBERS_TABLE)
            .update({ is_visible: !currentVisibility })
            .eq('id', id)
            .select();
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error toggling visibility:', error);
        return { success: false, error: error.message };
    }
}

// الحصول على إحصائيات
async function getStatistics() {
    try {
        const { data: allMembers, error: allError } = await window.supabaseClient
            .from(MEMBERS_TABLE)
            .select('id, is_visible');
        
        if (allError) throw allError;
        
        const total = allMembers.length;
        const visible = allMembers.filter(m => m.is_visible).length;
        const hidden = total - visible;
        
        return {
            success: true,
            data: { total, visible, hidden }
        };
    } catch (error) {
        console.error('Error fetching statistics:', error);
        return { success: false, error: error.message };
    }
}

// تصدير الدوال
window.membersAPI = {
    getAllMembers,
    getVisibleMembers,
    getMemberById,
    addMember,
    updateMember,
    deleteMember,
    toggleMemberVisibility,
    getStatistics
};
