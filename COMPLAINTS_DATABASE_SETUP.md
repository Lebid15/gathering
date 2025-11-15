# إعداد قاعدة بيانات الشكاوى

## 1. إنشاء جدول الشكاوى

قم بتنفيذ هذا الأمر SQL في Supabase SQL Editor:

```sql
CREATE TABLE complaints (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    type TEXT NOT NULL CHECK (type IN ('complaint', 'suggestion', 'inquiry', 'other')),
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 2. تفعيل Row Level Security

```sql
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
```

## 3. إنشاء السياسات (Policies)

### سياسة السماح بإضافة شكوى للجميع
```sql
CREATE POLICY "Allow public to insert complaints"
ON complaints
FOR INSERT
TO public
WITH CHECK (true);
```

### سياسة السماح بقراءة الشكاوى للجميع (للإدارة)
```sql
CREATE POLICY "Allow public to read complaints"
ON complaints
FOR SELECT
TO public
USING (true);
```

### سياسة السماح بحذف الشكاوى للجميع (للإدارة)
```sql
CREATE POLICY "Allow public to delete complaints"
ON complaints
FOR DELETE
TO public
USING (true);
```

## ملاحظات

- الجدول يدعم أربعة أنواع من الرسائل: شكوى، اقتراح، استفسار، أخرى
- رقم الهاتف اختياري (nullable)
- السياسات مفتوحة للجميع لأن المصادقة مبنية على localStorage وليس Supabase Auth
- في الإنتاج، يُنصح بتحسين السياسات لتقييد الحذف على الإداريين فقط
