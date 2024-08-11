import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="py-6">
    <div className="container mx-auto px-6 py-12 bg-white shadow-md rounded-lg font-arabic rtl ">
      <h1 className="text-3xl font-bold mb-6 text-center text-pink-600">سياسة الخصوصية</h1>
      <div className="space-y-6 leading-8 text-gray-800">
        <p>
          نرحب بكم في موقع المزرعة. نلتزم بحماية خصوصيتكم وضمان أمان بياناتكم الشخصية. 
          تُوضح هذه السياسة كيفية جمع، استخدام، وحماية المعلومات التي نقدمها.
        </p>

        <h2 className="text-2xl font-semibold text-pink-500">جمع المعلومات:</h2>
        <p>
          قد نقوم بجمع معلومات شخصية مثل الاسم، البريد الإلكتروني، والموقع الجغرافي عند التسجيل أو التواصل معنا. 
          تُستخدم هذه المعلومات فقط لتحسين خدماتنا وتلبية احتياجاتكم.
        </p>

        <h2 className="text-2xl font-semibold text-pink-500">استخدام المعلومات:</h2>
        <p>
          نستخدم المعلومات التي نجمعها لتحسين تجربة المستخدم وتقديم محتوى مخصص بناءً على اهتماماتكم. 
          لن نقوم بمشاركة هذه المعلومات مع أطراف ثالثة دون موافقتكم.
        </p>

        <h2 className="text-2xl font-semibold text-pink-500">حماية المعلومات:</h2>
        <p>
          نحن نتخذ إجراءات أمنية قوية لحماية بياناتكم الشخصية من الوصول غير المصرح به أو التعديل أو الإفشاء. 
          نستخدم تقنيات تشفير متقدمة لضمان أمان بياناتكم.
        </p>

        <h2 className="text-2xl font-semibold text-pink-500">حقوق المستخدم:</h2>
        <p>
          يحق لكم طلب الوصول إلى معلوماتكم الشخصية أو تعديلها أو حذفها في أي وقت. 
          إذا كان لديكم أي استفسارات أو طلبات بخصوص بياناتكم، يرجى التواصل معنا.
        </p>

        <h2 className="text-2xl font-semibold text-pink-500">تحديثات السياسة:</h2>
        <p>
          قد نقوم بتحديث سياسة الخصوصية من وقت لآخر لتعكس التغييرات في ممارساتنا أو لأسباب قانونية. 
          سنقوم بنشر أي تغييرات على هذه الصفحة.
        </p>

        <p className="text-sm text-gray-600 text-center mt-8">
          تاريخ آخر تحديث: 10/8/2024
        </p>
      </div>
      <div className="mt-8 text-center">
          <Link to="/" className="inline-block px-8 py-4 bg-pink-600 text-white font-semibold rounded-lg shadow-md hover:bg-pink-700 transition duration-300 ease-in-out">
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
    </div>
    </div>
  );
};

export default PrivacyPolicy;
