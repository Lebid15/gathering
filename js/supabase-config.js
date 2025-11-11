// Supabase Configuration
// يرجى استبدال هذه القيم بقيم مشروعك في Supabase

const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // مثال: https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // مفتاح Anon/Public

// إنشاء كلاينت Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// تصدير للاستخدام في ملفات أخرى
window.supabaseClient = supabase;

console.log('Supabase initialized successfully');
