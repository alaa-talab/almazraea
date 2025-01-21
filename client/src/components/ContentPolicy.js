import React from 'react';
import { Link } from 'react-router-dom';

const ContentPolicy = () => {
  return (
    <div className="py-6">
    <div className="container mx-auto px-6 py-12 bg-white shadow-md rounded-lg font-arabic rtl">
      <h1 className="text-3xl font-bold mb-6 text-center text-pink-600">سياسة المحتوى</h1>
      <div className="space-y-6 leading-8 text-gray-800">
        <p>
          نرحب بكم في موقع المزرعة. تهدف سياسة المحتوى هذه إلى توضيح الإرشادات والقواعد التي يجب اتباعها لضمان تقديم محتوى آمن ومحترم لجميع المستخدمين.
        </p>

        <h2 className="text-2xl font-semibold text-pink-500">إرشادات المحتوى:</h2>
        <p>
          يجب أن يكون المحتوى الذي يتم نشره على موقعنا قانونياً، محترماً، وخالياً من أي نوع من الإساءة أو التحريض. 
          يُحظر نشر أي محتوى يحتوي على عنف، كراهية، تمييز، أو تهديدات.
        </p>

        <h2 className="text-2xl font-semibold text-pink-500">المسؤولية:</h2>
        <p>
          يتحمل المستخدمون مسؤولية المحتوى الذي يقومون بنشره. نحن نحتفظ بالحق في إزالة أي محتوى ينتهك هذه السياسة 
          أو يعرض الآخرين للخطر.
        </p>

        <h2 className="text-2xl font-semibold text-pink-500">التعديلات:</h2>
        <p>
          قد نقوم بتعديل هذه السياسة من وقت لآخر لضمان الحفاظ على بيئة آمنة ومشجعة للتفاعل بين المستخدمين. 
          سنقوم بإعلامكم بأي تغييرات من خلال تحديث هذه الصفحة.
        </p>

        <h2 className="text-2xl font-semibold text-pink-500">حقوق الملكية الفكرية:</h2>
        <p>
          يجب على المستخدمين احترام حقوق الملكية الفكرية للآخرين. يُحظر نشر أو مشاركة محتوى يخالف حقوق النشر أو العلامات التجارية.
        </p>

        <h2 className="text-2xl font-semibold text-pink-500">التبليغ عن الانتهاكات:</h2>
        <p>
          إذا لاحظتم أي محتوى ينتهك هذه السياسة، يرجى التواصل معنا فوراً عبر وسائل الاتصال المتاحة على الموقع.
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

export default ContentPolicy;
