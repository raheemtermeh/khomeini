// src/pages/CafeInfo.tsx

import { useEffect, useState, useRef } from "react";
// فرض می‌کنیم سرویس‌ها اکنون به .ts تغییر یافته و Type Safe هستند
import { getCafes, createCafe } from "../services/CafeService";
import LocationPicker from "../components/profileComponents/LocationPicker";
import {
  FiEdit,
  FiCoffee,
  FiPlus,
  FiMapPin,
  FiX,
  FiPhone,
  FiClock,
  FiStar,
  FiChevronDown,
} from "react-icons/fi";
import { IoIosRefresh } from "react-icons/io";

// ✅ تعریف مجدد LocationPickerProps برای رفع خطای TS2322 در خط 375
interface LocationPickerProps {
  onLocationSelect: (loc: {
    lat: number;
    lng: number;
    address: string;
  }) => void;
  initialLat?: number; // باید در اینجا باشد
  initialLng?: number; // باید در اینجا باشد
  currentLocation?: string;
}

// ✅ Type Assertion برای کامپوننت LocationPicker
// فرض می‌کنیم LocationPicker به درستی این پراپ‌ها را می‌پذیرد
const TypedLocationPicker = LocationPicker as React.FC<LocationPickerProps>;

// ساختار داده‌ها (بدون تغییر)
interface GalleryData {
  id: number;
  image: string;
  alt: string;
}

interface Cafe {
  pk: number;
  name: string;
  phone: string;
  latitude: number;
  longitude: number;
  open_hours: { mon_fri: string };
  status: string;
  type: string;
  cm_count: number;
  point_avg: number;
  slug: string;
  gallery: number[];
  gallery_data?: GalleryData[];
  address?: string;
}

interface UploadedImage {
  id: number;
  image: string;
  file?: File;
  alt?: string;
}

const toEnglishDigits = (str: string) => {
  if (!str) return str;
  return str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());
};

const CafeInfo = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [expandedCafePk, setExpandedCafePk] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    latitude: 0,
    longitude: 0,
    address: "",
    open_hours: "09:00-22:00",
    status: "a",
    type: "c",
    slug: "",
  });

  const fetchCafes = async () => {
    setLoading(true);
    try {
      const data = await getCafes({ status: "a" });
      setCafes(data.results || []);
      setError(null);
    } catch (err) {
      setError("خطا در دریافت لیست کافه‌ها.");
      setTimeout(() => {
        if (errorRef.current) {
          errorRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCafes();
  }, []);

  const handleLocationSelect = (loc: {
    lat: number;
    lng: number;
    address: string;
  }) => {
    setFormData({
      ...formData,
      latitude: loc.lat,
      longitude: loc.lng,
      address: loc.address,
    });
  };

  const uploadImageToCafe = async (imgFile: File): Promise<any> => {
    const form = new FormData();
    form.append("file", imgFile);
    form.append("obj", "true");
    form.append("model_path", "venues.models.Branch");
    form.append("object_id", "");
    form.append("alt", "cafe image");
    form.append("des_img", "Cafe photo");

    const token = localStorage.getItem("accessToken");

    const res = await fetch(
      "https://fz-backoffice.linooxel.com/api/img/upload-image/",
      {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: form,
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        `خطا در آپلود تصویر: ${res.status} ${
          errorData.detail || JSON.stringify(errorData)
        }`
      );
    }
    const data = await res.json();
    if (!data.img) {
      throw new Error("آبجکت 'img' از سرور دریافت نشد.");
    }
    return data.img;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const selected = Array.from(files);
    if (images.length + selected.length > 10) {
      alert("حداکثر ۱۰ تصویر مجاز است.");
      return;
    }

    const previews = selected.map((file) => ({
      id: Math.random(),
      image: URL.createObjectURL(file),
      file,
    }));

    setImages((prev) => [...prev, ...previews]);
  };

  const removeImage = (id: number) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleEdit = (cafe: Cafe) => {
    setSelectedCafe(cafe);
    setExpandedCafePk(null);
    setFormData({
      name: cafe.name,
      phone: cafe.phone,
      latitude: cafe.latitude,
      longitude: cafe.longitude,
      address: cafe.address || "",
      open_hours: cafe.open_hours.mon_fri || "09:00-22:00",
      status: cafe.status,
      type: cafe.type,
      slug: cafe.slug,
    });
    setImages(
      (cafe.gallery_data || []).map((img: any) => ({
        id: img.id,
        image: img.image,
        file: undefined,
        alt: img.alt,
      }))
    );
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleCancel = () => {
    setSelectedCafe(null);
    setExpandedCafePk(null);
    setFormData({
      name: "",
      phone: "",
      latitude: 0,
      longitude: 0,
      address: "",
      open_hours: "09:00-22:00",
      status: "a",
      type: "c",
      slug: "",
    });
    setImages([]);
  };

  const toggleExpand = (pk: number) => {
    setExpandedCafePk(pk === expandedCafePk ? null : pk);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);

    const finalSlug =
      formData.slug ||
      formData.name.toLowerCase().replace(/\s+/g, "-").substring(0, 50);

    const imagesToUpload = images.filter((img) => img.file);
    const existingImageIds = images
      .filter((img) => !img.file)
      .map((img) => img.id);

    if (imagesToUpload.length === 0 && existingImageIds.length === 0) {
      setError("❌ لطفاً حداقل یک تصویر انتخاب کنید.");
      setFormLoading(false);
      return;
    }

    try {
      const newImageIds = await Promise.all(
        imagesToUpload.map(async (img) => {
          const uploadResult = await uploadImageToCafe(img.file!);
          return uploadResult.id;
        })
      );

      const allImageIds = [...existingImageIds, ...newImageIds];

      const payload = {
        name: formData.name,
        phone: formData.phone,
        latitude: parseFloat(formData.latitude.toFixed(6)),
        longitude: parseFloat(formData.longitude.toFixed(6)),
        open_hours: { mon_fri: formData.open_hours },
        status: formData.status,
        type: formData.type,
        slug: finalSlug,
        gallery: allImageIds,
        address: formData.address || null,
      };

      if (selectedCafe) {
        // await updateCafe(selectedCafe.pk, payload);
        console.log(`بروزرسانی کافه با PK: ${selectedCafe.pk}`, payload);
      } else {
        // ✅ استفاده از createCafe که اکنون تایپ شده است (CafeService.ts)
        await createCafe(payload as any);
        console.log("کافه جدید با موفقیت ایجاد شد.", payload);
      }

      fetchCafes();
      handleCancel();
    } catch (err: any) {
      console.error("خطا در handleSubmit:", err);
      setError(`خطا در ذخیره اطلاعات: ${err.message || "خطای ناشناخته"}`);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-[#0f172a] dark:to-[#111827] px-4 py-10 dark:text-white">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* --- Header --- */}
        <div className="text-center pb-8">
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-600 dark:from-teal-300 dark:to-indigo-500 transition-colors duration-500 tracking-wider">
            مدیریت شعب کافه ☕
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-400 mt-2 font-light">
            کنترل کامل بر افزودن و بروزرسانی اطلاعات مکان‌ها
          </p>
        </div>

        {/* --- Error Message --- */}
        {error && (
          <div
            ref={errorRef}
            className="bg-red-500/10 border border-red-500 text-red-300 p-4 rounded-xl shadow-lg **text-right** animate-pulse"
          >
            ❌ {error}
          </div>
        )}

        {/* --- Form Section --- */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-8 bg-white/50 dark:bg-gray-800/80 backdrop-blur-md p-8 rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.2)] dark:shadow-[0_20px_50px_rgba(200,_200,_200,_0.1)] transition-all duration-500 border border-white/10 dark:border-gray-700/50"
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white border-b pb-3 border-teal-500/50 **text-right**">
            {selectedCafe
              ? `ویرایش کافه: ${selectedCafe.name}`
              : "افزودن کافه جدید"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 **text-right**">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                نام کافه
              </label>
              <input
                type="text"
                placeholder="نام کافه"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all duration-300 text-gray-900 dark:text-white **text-right**"
              />
            </div>

            <div className="md:col-span-1 **text-right**">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                شماره تماس
              </label>
              <input
                type="text"
                placeholder="شماره تماس"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
                className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all duration-300 text-gray-900 dark:text-white **text-right**"
              />
            </div>

            <div className="md:col-span-1 **text-right**">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                ساعت کاری (مثلاً 09:00-22:00)
              </label>
              <input
                type="text"
                placeholder="ساعت کاری (مثلاً 09:00-22:00)"
                value={formData.open_hours}
                onChange={(e) => {
                  const englishValue = toEnglishDigits(e.target.value);
                  setFormData({ ...formData, open_hours: englishValue });
                }}
                className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all duration-300 text-gray-900 dark:text-white **text-right**"
              />
            </div>
          </div>

          <div className="space-y-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700">
            <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center **flex-row-reverse** **justify-start**">
              موقعیت مکانی <FiMapPin className="**mr-2** text-teal-500" />
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400 **text-right**">
              **آدرس انتخاب شده:**{" "}
              {formData.address || "موقعیت روی نقشه انتخاب نشده است."}
              <span className="text-xs text-gray-500 dark:text-gray-500 **mr-2**">
                (Lat: {formData.latitude.toFixed(4)}, Lng:{" "}
                {formData.longitude.toFixed(4)})
              </span>
            </p>

            {/* ✅ استفاده از TypedLocationPicker برای اعمال پراپ‌های صحیح */}
            <TypedLocationPicker
              onLocationSelect={handleLocationSelect}
              initialLat={selectedCafe?.latitude}
              initialLng={selectedCafe?.longitude}
            />
          </div>

          <div>
            <label className="block mb-4 font-semibold text-gray-800 dark:text-gray-200 text-lg **text-right**">
              تصاویر کافه (حداکثر ۱۰ عدد)
            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-600 dark:text-gray-300 file:mr-4 file:py-3 file:px-5
          file:rounded-full file:border-0 file:text-sm file:font-semibold
          file:bg-teal-500 file:text-white hover:file:bg-teal-600 transition-all duration-300 cursor-pointer shadow-md"
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-6">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="relative group transform hover:scale-105 transition-transform duration-300 shadow-lg rounded-xl overflow-hidden"
                >
                  <img
                    src={img.image}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    className="absolute top-1 **left-1** bg-red-600/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-700 focus:outline-none"
                    aria-label="حذف تصویر"
                  >
                    <FiX className="w-4 h-4" />
                  </button>

                  {img.file && (
                    <span className="absolute bottom-0 **right-0** bg-blue-500 text-white text-xs px-2 py-0.5 rounded-tl-lg">
                      جدید
                    </span>
                  )}

                  {!img.file && (
                    <span className="absolute bottom-0 **right-0** bg-green-500 text-white text-xs px-2 py-0.5 rounded-tl-lg">
                      موجود
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 **flex-row-reverse**">
            <button
              type="submit"
              disabled={formLoading}
              className={`flex-1 flex justify-center items-center py-4 text-white rounded-xl shadow-lg font-bold transition-all duration-300 transform ${
                formLoading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-teal-600 hover:bg-teal-700 hover:scale-[1.02] active:scale-100"
              }`}
            >
              {formLoading ? (
                <>
                  <IoIosRefresh className="animate-spin ml-2 text-xl" /> در حال
                  ذخیره...
                </>
              ) : selectedCafe ? (
                <>
                  <FiEdit className="ml-2 text-lg" />
                  بروزرسانی
                </>
              ) : (
                <>
                  <FiPlus className="ml-2 text-xl" /> افزودن کافه
                </>
              )}
            </button>

            {selectedCafe && (
              <button
                type="button"
                onClick={handleCancel}
                className="sm:w-1/4 py-4 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 hover:scale-[1.02] font-semibold"
              >
                انصراف
              </button>
            )}
          </div>
        </form>

        {/* --- Cafe List Section --- */}
        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 pt-8 border-t border-gray-300 dark:border-gray-700 **text-right**">
          لیست کافه‌های فعال
        </h2>

        <div
          className="space-y-5 **animate-fadeIn**"
          style={{ animationDelay: "0.3s" }}
        >
          {loading ? (
            <p className="text-center text-xl text-teal-500 animate-pulse">
              <FiCoffee className="inline-block **ml-2**" /> در حال دریافت لیست
              کافه‌ها...
            </p>
          ) : cafes.length === 0 ? (
            <p className="text-center text-gray-400 p-5 border border-dashed border-gray-500 rounded-xl">
              ❌ هیچ کافه‌ای ثبت نشده است.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cafes.map((cafe) => {
                const isExpanded = cafe.pk === expandedCafePk;

                return (
                  <div
                    key={cafe.pk}
                    className={`
                                            relative overflow-hidden
                                            bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm 
                                            rounded-2xl shadow-xl
                                            border-t-4 border-teal-500
                                            ${
                                              !isExpanded
                                                ? "transform hover:scale-[1.02] hover:shadow-teal-500/50"
                                                : "scale-[1.01] shadow-2xl ring-2 ring-teal-500/50"
                                            }
                                            transition-all duration-300 ease-in-out
                                        `}
                  >
                    {/* Content - 1. اطلاعات اصلی */}
                    <div className="relative p-6 space-y-4 text-right">
                      <h3 className="font-extrabold text-2xl text-gray-900 dark:text-white flex items-center **flex-row-reverse** **justify-start**">
                        {cafe.name}
                        <FiCoffee className="**mr-2** text-teal-600 dark:text-teal-400" />
                      </h3>

                      <div className="space-y-2 text-sm">
                        {/* Phone */}
                        <div className="text-gray-700 dark:text-gray-300 flex items-center **flex-row-reverse** **justify-start**">
                          <FiPhone className="**mr-2** text-indigo-500" />
                          <span className="font-semibold **ml-2**">تماس:</span>
                          <a
                            href={`tel:${cafe.phone}`}
                            className="hover:text-teal-500 transition-colors"
                          >
                            {cafe.phone}
                          </a>
                        </div>

                        {/* Open Hours */}
                        <div className="text-gray-700 dark:text-gray-300 flex items-center **flex-row-reverse** **justify-start**">
                          <FiClock className="**mr-2** text-yellow-600" />
                          <span className="font-semibold **ml-2**">
                            ساعت کاری:
                          </span>
                          {cafe.open_hours.mon_fri}
                        </div>

                        {/* Rating/Comments */}
                        <div className="text-gray-700 dark:text-gray-300 flex items-center **flex-row-reverse** **justify-start**">
                          <FiStar className="**mr-2** text-yellow-500" />
                          <span className="font-semibold **ml-2**">
                            امتیاز:
                          </span>
                          <span className="font-bold text-lg text-yellow-500 **ml-1**">
                            {cafe.point_avg}
                          </span>{" "}
                          ({cafe.cm_count} نظر)
                        </div>

                        <p className="text-xs text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-300 dark:border-gray-700/50">
                          شناسه: **{cafe.slug}** | PK: **{cafe.pk}**
                        </p>
                      </div>

                      {/* دکمه نمایش/بستن جزئیات */}
                      <div className="pt-4">
                        <button
                          onClick={() => toggleExpand(cafe.pk)}
                          className={`w-full py-2 rounded-lg text-sm font-bold transition-colors duration-200 flex items-center justify-center 
                                                            ${
                                                              isExpanded
                                                                ? "bg-teal-600 text-white hover:bg-teal-700"
                                                                : "bg-teal-600/10 text-teal-600 hover:bg-teal-600/20 dark:bg-gray-700/80 dark:text-teal-400"
                                                            }`}
                        >
                          {isExpanded ? "بستن جزئیات" : "مشاهده جزئیات بیشتر"}
                          <FiChevronDown
                            className={`w-4 h-4 mr-1 transition-transform duration-300 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Content - 2. جزئیات گسترش یافته */}
                    {isExpanded && (
                      <div
                        className="relative p-6 pt-0 space-y-4 text-right animate-slideDown"
                        style={{ animationDuration: "0.3s" }}
                      >
                        <div className="border-t border-gray-300 dark:border-gray-700 pt-4 space-y-3">
                          <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                            جزئیات موقعیت
                          </h4>

                          {/* مختصات */}
                          <div className="text-gray-600 dark:text-gray-400 flex items-center **flex-row-reverse** **justify-start** text-sm">
                            <FiMapPin className="**mr-2** text-blue-500" />
                            <span className="font-semibold **ml-2**">
                              مختصات جغرافیایی:
                            </span>
                            {cafe.latitude.toFixed(6)},{" "}
                            {cafe.longitude.toFixed(6)}
                          </div>
                        </div>

                        {/* دکمه‌های اکشن */}
                        <div className="flex gap-3 pt-4 border-t border-gray-300 dark:border-gray-700">
                          {/* دکمه ویرایش */}
                          <button
                            onClick={() => handleEdit(cafe)}
                            className="flex-1 py-2.5 flex items-center justify-center bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 font-semibold text-sm"
                          >
                            ویرایش <FiEdit className="**mr-2**" />
                          </button>

                          {/* دکمه نقشه */}
                          <a
                            href={`http://googleusercontent.com/maps.google.com/6?q=${cafe.latitude},${cafe.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2.5 flex items-center justify-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold text-sm"
                          >
                            نقشه <FiMapPin className="**mr-2**" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CafeInfo;
