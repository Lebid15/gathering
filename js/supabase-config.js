// Supabase Configuration
// يرجى استبدال هذه القيم بقيم مشروعك في Supabase

const SUPABASE_URL = 'https://ejutjjezoubpwhhbhrtp.supabase.co'; // مثال: https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqdXRqamV6b3VicHdoaGJocnRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4OTgyODIsImV4cCI6MjA3ODQ3NDI4Mn0.AeUJczjHMcrUDEB1ryM-TZxdnWbA7AhfLiBMEgwUZR0'; // مفتاح Anon/Public

// إنشاء كلاينت Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// تصدير للاستخدام في ملفات أخرى
window.supabaseClient = supabase;

console.log('Supabase initialized successfully');
