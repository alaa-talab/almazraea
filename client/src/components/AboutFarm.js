import React from 'react';
import { Link } from 'react-router-dom';

const AboutFarm = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 font-arabic rtl">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-pink-600">عن المزرعة</h1>
        
        <p className="text-lg text-gray-800 mb-6 leading-relaxed">
          مرحبًا بكم في موقع المزرعة في الأردن، وجهتكم الأولى للبحث عن المزارع المثالية في جميع أنحاء المملكة الأردنية.
          نحن هنا لنساعدك في العثور على المزرعة التي تناسب احتياجاتك، سواء كنت تبحث عن مكان هادئ في جبال عجلون أو شواطئ العقبة الساحرة.
        </p>
        <p className="text-lg text-gray-800 mb-6 leading-relaxed">
          استعرض مجموعة متنوعة من المزارع في المواقع المختلفة مثل عمان، جرش، عجلون، العقبة، الجوفة، والأغوار. من خلال موقعنا، يمكنك البحث عن المزارع التي توفر المناظر الطبيعية الخلابة والبيئة المثالية للاسترخاء.
        </p>
        <p className="text-lg text-gray-800 mb-6 leading-relaxed">
          سواء كنت ترغب في قضاء عطلة عائلية أو إقامة مناسبة خاصة، نحن نقدم لك أفضل الخيارات لتلبية احتياجاتك. استمتع بتجربة استثنائية في قلب الطبيعة.
        </p>
        <p className="text-lg text-gray-800 mb-6 leading-relaxed">
          بالإضافة إلى ذلك، يمكنك الإعلان عن مزرعتك بسهولة ومشاركة صورها مع الآخرين. نوفر لك أدوات سهلة الاستخدام لتسويق مزرعتك وزيادة جاذبيتها للزوار.
        </p>
        <p className="text-lg text-gray-800 mb-6 leading-relaxed">
          هدفنا هو تسهيل عملية البحث والإعلان لتجربة مريحة وسهلة. ابحث الآن عن المزرعة المناسبة لك في الأردن واستمتع بوقت ممتع في الطبيعة.
        </p>
        
        {/* Image Gallery */}
        <div className="my-8">
          <h2 className="text-2xl font-bold text-pink-600 mb-4">استكشف المزارع</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="overflow-hidden rounded-lg shadow-lg">
              <img
                src="https://res.cloudinary.com/dvcfefmys/image/upload/v1723296750/Gemini_Generated_Image_jb0kohjb0kohjb0k_ylyhdz.jpg"
                alt="Farm Image 1"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-lg shadow-lg">
              <img
                src="https://res.cloudinary.com/dvcfefmys/image/upload/v1723296750/Gemini_Generated_Image_jb0kojjb0kojjb0k_dsvfqu.jpg"
                alt="Farm Image 2"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-lg shadow-lg">
              <img
                src="https://res.cloudinary.com/dvcfefmys/image/upload/v1723296750/Gemini_Generated_Image_p81z3fp81z3fp81z_zdb8ql.jpg"
                alt="Farm Image 3"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
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

export default AboutFarm;
