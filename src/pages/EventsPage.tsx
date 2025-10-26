// src/pages/EventsPage.tsx

import { useState, useEffect, useRef } from "react";
// فرض می‌کنیم CreateEventForm الآن selectedCategory?: number | null می‌پذیرد
import CreateEventForm from "../components/events/CreateEventForm"; 
import mafiaImg from "../assets/mafia.png";
import bordGame from "../assets/bordGame.png";
import footbal from "../assets/foot.png";
import image from "../assets/image24.png";
import music from "../assets/music.png";
import GroupGame from "../assets/GroupGame.png";
import sportGame from "../assets/football.png";
import readBook from "../assets/readBook.png";
import adae from "../assets/special.png";

// ✅ اضافه شدن تایپ برای props
const SuggestedCard = ({ img, title, bgColor, onClick }: { img: string | undefined, title: string, bgColor: string, onClick: () => void }) => ( 
  <div
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-6 rounded-2xl text-white ${bgColor} cursor-pointer transform hover:scale-105 transition-transform duration-300`}
  >
    {img ? (
      <img
        src={img}
        alt={title}
        className="w-12 h-12 mx-auto mb-3 object-contain"
      />
    ) : (
      <div className="text-4xl mb-3">🎲</div>
    )}
    <h4 className="font-semibold text-center">{title}</h4>
  </div>
);

const EventsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const formRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch("https://fz-backoffice.linooxel.com/api/venues/category/")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("خطا در گرفتن دسته‌بندی‌ها:", err));
  }, []);

  const handleCardClick = (id: number) => {
    setSelectedCategory(id);

    // اسکرول نرم به فرم
    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 200);
  };

  const getBgColor = (name: string) => {
    switch (name) {
      case "مافیا":
        return "bg-gradient-to-tl from-[#240B36] to-[#C31432]"; // تیره و معمایی
      case "بازی های گروهی":
        return "bg-gradient-to-tl from-[#FF9A00] to-[#FF2D55]"; // پرانرژی و سرگرم‌کننده
      case "ادایی":
        return "bg-gradient-to-tl from-[#F7971E] to-[#FFD200]"; // شاد و فان
      case "تماشای فیلم":
        return "bg-gradient-to-tl from-[#6A11CB] to-[#2575FC]"; // سینمایی و آرام
      case "تماشای مسابقات ورزشی":
        return "bg-gradient-to-tl from-[#11998E] to-[#38EF7D]"; // انرژی ورزش
      case "موسیقی زنده":
        return "bg-gradient-to-tl from-[#8E2DE2] to-[#4A00E0]"; // شبانه و موزیکال
      case "کتاب خوانی":
        return "bg-gradient-to-tl from-[#434343] to-[#00c573]"; // مینیمال و آرامش‌بخش
      default:
        return "bg-gradient-to-tl from-gray-600 to-gray-800";
    }
  };


  const getImg = (name: string) => {
    if (name === "مافیا") return mafiaImg;
    if (name === "تماشای فیلم") return image;
    if (name === "تماشای فوتبال") return footbal;
    if (name === "بازی دورهمی") return bordGame;
    if (name === "موسیقی زنده") return music;
    if (name === "بازی های گروهی") return GroupGame;
    if (name === "تماشای مسابقات ورزشی") return sportGame;
    if (name === "کتاب خوانی") return readBook;
    if (name === "ادایی") return adae;
    return undefined;
  };

  return (
    <div className="p-4 sm:p-6 space-y-10">
      {/* بخش انتخاب دسته‌بندی */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          یک دسته‌بندی انتخاب کنید
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((item) => (
            <SuggestedCard
              key={item.pk}
              title={item.name}
              bgColor={getBgColor(item.name)}
              onClick={() => handleCardClick(item.pk)}
              img={getImg(item.name)}
            />
          ))}
        </div>
      </div>

      {/* فرم ایجاد رویداد */}
      <div
        ref={formRef}
        className="transition-all duration-500 ease-in-out scroll-mt-10"
      >
        {/* ✅ selectedCategory می تواند null باشد، که در تعریف Props مجاز شد */}
        <CreateEventForm selectedCategory={selectedCategory} /> 
      </div>
    </div>
  );
};

export default EventsPage;