// src/services/eventService.ts

// const BASE_URL = "https://fz-backoffice.linooxel.com/api/venues/event/"; // ✅ خطای TS6133 رفع شد

// ✅ تعریف اینترفیس برای eventData
interface EventPayload {
    title: string;
    description: string;
    min_players: number;
    max_players: number;
    duration: number;
    status: string;
    title_seo: string;
    description_seo: string;
    // ... سایر فیلدهای مورد نیاز
}

/**
 * ایجاد رویداد جدید
 * @param eventData - اطلاعات فرم رویداد
 * @returns {Promise<any>}
 */
// ✅ اضافه شدن تایپ برای eventData
export const createEvent = async (eventData: EventPayload) => { 
  try {
    const token = localStorage.getItem("accessToken");

    const response = await fetch(
      "https://fz-backoffice.linooxel.com/api/venues/event-branch/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(eventData),
      }
    );

    // اگر پاسخ 200/201 نباشد، خطا پرتاب شود
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "خطای ناشناخته از سرور" }));
        const error = new Error(errorData.detail || response.statusText);
        throw error;
    }

    return await response.json();
  } catch (error) {
    console.error("❌ خطا در createEvent:", error);
    throw error;
  }
};