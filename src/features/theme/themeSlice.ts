import { createSlice } from "@reduxjs/toolkit";

// تابعی برای گرفتن تم اولیه از localStorage یا پیش‌فرض سیستم
const getInitialTheme = (): "light" | "dark" => {
  if (typeof window !== "undefined" && window.localStorage) {
    const storedTheme = window.localStorage.getItem("theme");
    if (storedTheme === "dark" || storedTheme === "light") {
      return storedTheme;
    }
    // اگر تمی ذخیره نشده، از تنظیمات سیستم کاربر پیروی کن
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
  }
  return "light";
};

interface ThemeState {
  mode: "light" | "dark";
}

const initialState: ThemeState = {
  mode: getInitialTheme(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
