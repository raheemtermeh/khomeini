// src/services/captchaService.ts
import axios from "axios";

const API_URL = "https://fz-backoffice.linooxel.com/api/user";

export const generateCaptcha = async () => {
  try {
    const res = await axios.get(`${API_URL}/generate-captcha`);
    return res.data;
  } catch (error: any) {
    console.error("Captcha API Error:", error.response || error.message);
    throw error;
  }
};
