#!/bin/bash

# 🚀 Netlify Deployment Script
# هذا الملف يساعد في تفعيل النشر التلقائي على Netlify

echo "=================================="
echo "🚀 Netlify النشر التلقائي"
echo "=================================="
echo ""

# التأكد من وجود ملف netlify.toml
if [ ! -f "netlify.toml" ]; then
    echo "❌ ملف netlify.toml غير موجود!"
    exit 1
fi

echo "✅ ملف netlify.toml موجود"
echo ""

# عرض الإعدادات
echo "📋 إعدادات النشر:"
echo "  المستودع: https://github.com/you3333ef/payment-omar.git"
echo "  الفرع: main"
echo "  Build command: npm run build"
echo "  Publish directory: dist"
echo ""

# فحص حالة Git
if [ -d ".git" ]; then
    echo "✅ مستودع Git موجود"
    CURRENT_COMMIT=$(git rev-parse HEAD)
    echo "  آخر commit: $CURRENT_COMMIT"
else
    echo "❌ هذا ليس مستودع Git!"
    exit 1
fi

echo ""
echo "=================================="
echo "📌 خطوات تفعيل النشر التلقائي:"
echo "=================================="
echo ""
echo "1️⃣ اذهب إلى: https://app.netlify.com"
echo ""
echo "2️⃣ اضغط 'Add new site' → 'Import an existing project'"
echo ""
echo "3️⃣ اختر 'GitHub' واتبع التعليمات"
echo ""
echo "4️⃣ ابحث عن: payment-omar"
echo ""
echo "5️⃣ اضغط على المستودع"
echo ""
echo "6️⃣ اعدادات البناء:"
echo "   • Base directory: (اتركه فارغاً)"
echo "   • Build command: npm run build"
echo "   • Publish directory: dist"
echo "   • Production branch: main"
echo ""
echo "7️⃣ اضغط 'Deploy site'"
echo ""
echo "=================================="
echo "✅ تم الانتهاء!"
echo "=================================="
echo ""
echo "🔗 من الآن، كل git push سيقوم بنشر تلقائي!"
echo ""
echo "لتحديث الموقع:"
echo "  git add ."
echo "  git commit -m 'تحديث'"
echo "  git push origin main"
echo ""
