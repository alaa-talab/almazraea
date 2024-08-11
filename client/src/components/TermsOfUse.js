import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfUse = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-12 font-arabic rtl">
      <div className="container mx-auto px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-8">إتفاقية الاستخدام</h1>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <p className="text-gray-700 mb-6 leading-loose">
            مرحبًا بك في موقع المزرعة! استخدامك لهذا الموقع يعني موافقتك الكاملة على إتفاقية الاستخدام التالية. نرجو منك قراءتها بعناية:
          </p>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">1. مقدمة</h2>
          <p className="text-gray-700 mb-6 leading-loose">
            تضع هذه الإتفاقية الأحكام والشروط التي تحكم استخدامك لهذا الموقع. باستخدامك للموقع، فإنك توافق على الالتزام بكل ما تحتويه من بنود.
          </p>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">2. التعديلات</h2>
          <p className="text-gray-700 mb-6 leading-loose">
            نحتفظ بالحق في تعديل هذه الإتفاقية في أي وقت، وستكون التعديلات سارية بمجرد نشرها على الموقع. ننصحك بمراجعة هذه الصفحة بانتظام.
          </p>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">3. المحتوى والملكية الفكرية</h2>
          <p className="text-gray-700 mb-6 leading-loose">
            جميع المحتويات المنشورة على الموقع محمية بموجب حقوق الطبع والنشر والقوانين الأخرى. لا يجوز لك استخدام أي جزء من المحتويات لأغراض تجارية دون الحصول على إذن كتابي منا.
          </p>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">4. حدود المسؤولية</h2>
          <p className="text-gray-700 mb-6 leading-loose">
            نحن لسنا مسؤولين عن أي أضرار قد تنجم عن استخدامك لهذا الموقع. يتم تقديم المحتوى "كما هو" دون أي ضمانات.
          </p>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">5. القوانين المعمول بها</h2>
          <p className="text-gray-700 mb-6 leading-loose">
            تخضع هذه الإتفاقية وتُفسر وفقًا للقوانين المعمول بها في المملكة الأردنية الهاشمية.
          </p>
          <p className="text-gray-700 leading-loose">
            إذا كان لديك أي استفسارات حول هذه الإتفاقية، يرجى التواصل معنا عبر صفحة <Link to="/contact-us" className="text-pink-600 font-semibold hover:underline">اتصل بنا</Link>.
          </p>
        </div>
      </div>
      <div className="mt-8 text-center">
          <Link to="/" className="inline-block px-8 py-4 bg-pink-600 text-white font-semibold rounded-lg shadow-md hover:bg-pink-700 transition duration-300 ease-in-out">
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
    </div>
  );
};

export default TermsOfUse;
