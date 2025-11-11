# دليل الإعداد السريع - مشروع التجمع
## Quick Setup Guide

---

## ⚡ البدء في 5 دقائق

### الخطوة 1️⃣: إعداد Supabase

1. اذهب إلى [supabase.com](https://supabase.com) وسجل دخول
2. أنشئ مشروع جديد (New Project)
3. احفظ:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon/Public Key**: `eyJhbGc...`

---

### الخطوة 2️⃣: إنشاء جدول البيانات

في Supabase → SQL Editor، قم بتنفيذ:

```sql
-- إنشاء جدول الأعضاء
CREATE TABLE members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone_primary VARCHAR(20),
    phone_primary_country_code VARCHAR(5) DEFAULT '+966',
    phone_secondary VARCHAR(20),
    phone_secondary_country_code VARCHAR(5),
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'السعودية',
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- فهارس للأداء
CREATE INDEX idx_members_name ON members(first_name, last_name);
CREATE INDEX idx_members_visible ON members(is_visible);
CREATE INDEX idx_members_created ON members(created_at DESC);

-- تفعيل Row Level Security
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- سياسة قراءة الأعضاء المرئيين
CREATE POLICY "Public can view visible members"
ON members FOR SELECT
USING (is_visible = true);

-- سياسة الإدارة الكاملة
CREATE POLICY "Enable all operations"
ON members FOR ALL
USING (true)
WITH CHECK (true);
```

---

### الخطوة 3️⃣: إضافة بيانات تجريبية (اختياري)

```sql
INSERT INTO members (first_name, last_name, email, phone_primary, city, country, is_visible)
VALUES 
    ('أحمد', 'محمد', 'ahmed@example.com', '0501234567', 'الرياض', 'السعودية', true),
    ('فاطمة', 'علي', 'fatima@example.com', '0507654321', 'جدة', 'السعودية', true),
    ('محمد', 'خالد', 'mohammed@example.com', '0509876543', 'الدمام', 'السعودية', true),
    ('سارة', 'أحمد', 'sara@example.com', '0551234567', 'مكة', 'السعودية', false);
```

---

### الخطوة 4️⃣: تحديث إعدادات المشروع

افتح ملف **`js/supabase-config.js`** وعدّل:

```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co'; // 👈 ضع الـ URL هنا
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE'; // 👈 ضع الـ Key هنا
```

**مثال:**
```javascript
const SUPABASE_URL = 'https://abcdefghijklmno.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

---

### الخطوة 5️⃣: تشغيل المشروع

#### أ) باستخدام Live Server (موصى به):
```bash
1. افتح VSCode
2. ثبت إضافة "Live Server" من Extensions
3. انقر بالزر الأيمن على index.html
4. اختر "Open with Live Server"
```

#### ب) باستخدام Python:
```bash
cd frontend/html-version
python -m http.server 8000
```
ثم افتح: `http://localhost:8000`

---

## 🎉 تم! الآن يمكنك:

### للمستخدمين:
- 🏠 الصفحة الرئيسية: `index.html`
- 👥 عرض الأعضاء: `members.html`
- ℹ️ عن المشروع: `about.html`

### للإدارة:
- 🔐 تسجيل الدخول: `admin-login.html`
  - **رقم الجوال**: `5443805422`
  - **كلمة السر**: `Imadelabes2025`
- 📊 لوحة التحكم: `admin-dashboard.html`

---

## 🔧 تخصيص بيانات الأدمن

افتح **`js/auth.js`** وعدّل:

```javascript
const ADMIN_PHONE = '5443805422';    // 👈 غيّر رقم الجوال
const ADMIN_PASSWORD = 'Imadelabes2025';  // 👈 غيّر كلمة السر
```

---

## ⚠️ ملاحظات مهمة

### ✅ افعل:
- استخدم Live Server أو HTTP Server
- تأكد من وجود اتصال بالإنترنت (لتحميل Bootstrap و Supabase)
- راجع Console في المتصفح عند وجود مشاكل

### ❌ لا تفعل:
- لا تفتح `index.html` مباشرة من المتصفح (مشاكل CORS)
- لا تنسى تحديث إعدادات Supabase
- لا تنشر المشروع ببيانات الأدمن الافتراضية!

---

## 🐛 حل المشاكل الشائعة

### 1. "Supabase is not defined"
**السبب**: لم يتم تحميل مكتبة Supabase  
**الحل**: تأكد من وجود هذا السطر في HTML:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

### 2. "Failed to fetch"
**السبب**: خطأ في إعدادات Supabase  
**الحل**: راجع `js/supabase-config.js` وتأكد من الـ URL والـ Key

### 3. "No members found"
**السبب**: لا توجد بيانات في الجدول  
**الحل**: أضف بيانات تجريبية من SQL Editor

### 4. "CORS Error"
**السبب**: فتح الملف مباشرة  
**الحل**: استخدم Live Server أو Python HTTP Server

---

## 📱 اختبار المشروع

### اختبار الصفحات العامة:
1. ✅ افتح `index.html` - يجب أن تظهر الصفحة الرئيسية
2. ✅ اضغط "الأعضاء" - يجب أن تظهر قائمة الأعضاء
3. ✅ جرب البحث عن عضو
4. ✅ افتح `about.html` - صفحة المعلومات

### اختبار لوحة الإدارة:
1. ✅ افتح `admin-login.html`
2. ✅ أدخل رقم الجوال وكلمة السر
3. ✅ يجب أن تنتقل إلى `admin-dashboard.html`
4. ✅ جرب إضافة عضو جديد
5. ✅ جرب تعديل عضو
6. ✅ جرب إخفاء/إظهار عضو
7. ✅ جرب حذف عضو
8. ✅ اضغط تسجيل خروج

---

## 🚀 النشر على الإنترنت

### على Netlify (مجاني):
```bash
1. ارفع المجلد إلى GitHub
2. اذهب إلى netlify.com
3. اضغط "New site from Git"
4. اربط GitHub واختر المستودع
5. Base directory: frontend/html-version
6. اضغط Deploy
```

### على Vercel (مجاني):
```bash
1. ارفع المجلد إلى GitHub
2. اذهب إلى vercel.com
3. اضغط "Import Project"
4. اختر المستودع
5. Root Directory: frontend/html-version
6. اضغط Deploy
```

---

## 📞 الدعم

إذا واجهت أي مشكلة:
1. افتح Console في المتصفح (F12)
2. ابحث عن رسائل الخطأ باللون الأحمر
3. راجع ملف README.md الكامل
4. تأكد من صحة إعدادات Supabase

---

## ✨ نصائح للتطوير

### إضافة حقول جديدة:
1. أضف الحقل في جدول Supabase
2. حدّث النماذج في HTML
3. حدّث `js/api.js` و `js/admin.js`

### تغيير الألوان:
- عدّل `css/styles.css`
- ابحث عن `.bg-primary` و `.text-primary`

### إضافة صفحة جديدة:
1. أنشئ ملف HTML جديد
2. انسخ الـ Navigation من أي صفحة
3. أضف السكريبتات المطلوبة

---

**بالتوفيق! 🎊**
