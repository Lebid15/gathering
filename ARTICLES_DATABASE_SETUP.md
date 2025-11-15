# SQL لإنشاء جدول المقالات في Supabase

قم بتشغيل هذا الكود SQL في Supabase SQL Editor:

```sql
-- إنشاء جدول المقالات
CREATE TABLE articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- إنشاء فهرس للبحث السريع
CREATE INDEX idx_articles_created_at ON articles(created_at DESC);

-- تفعيل Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- سياسة: السماح للجميع بقراءة المقالات
CREATE POLICY "Allow public read access" ON articles
    FOR SELECT
    USING (true);

-- سياسة: السماح للمستخدمين المصادق عليهم بالإضافة
CREATE POLICY "Allow authenticated users to insert" ON articles
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- سياسة: السماح للمستخدمين المصادق عليهم بالتحديث
CREATE POLICY "Allow authenticated users to update" ON articles
    FOR UPDATE
    USING (auth.role() = 'authenticated');

-- سياسة: السماح للمستخدمين المصادق عليهم بالحذف
CREATE POLICY "Allow authenticated users to delete" ON articles
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- إضافة trigger لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## بيانات تجريبية (اختياري)

إذا أردت إضافة بعض المقالات التجريبية:

```sql
INSERT INTO articles (title, author, content, image_url) VALUES
('مرحباً بكم في تجمع خريجي الرقة', 'إدارة التجمع', 'نرحب بكم في الموقع الرسمي لتجمع خريجي ومثقفي محافظة الرقة. نهدف من خلال هذا التجمع إلى توحيد جهود الكفاءات والخبرات لخدمة مجتمعنا وتحقيق أهدافنا المشتركة في بناء مستقبل أفضل للجميع.', null),
('أهمية التعليم في بناء المجتمع', 'د. أحمد محمد', 'التعليم هو الركيزة الأساسية لبناء أي مجتمع متقدم. من خلال التعليم الجيد، نستطيع تطوير المهارات وبناء الكفاءات التي يحتاجها مجتمعنا. في هذا المقال، نستعرض أهم التحديات والفرص في قطاع التعليم في محافظتنا الحبيبة.', null),
('دور الشباب في التنمية', 'م. فاطمة علي', 'الشباب هم عماد المستقبل وطاقة التغيير في أي مجتمع. نناقش في هذا المقال الدور المحوري الذي يلعبه الشباب في عملية التنمية المستدامة وكيف يمكن تمكينهم وتوظيف طاقاتهم بشكل فعال.', null);
```
