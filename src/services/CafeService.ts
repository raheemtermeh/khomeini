// src/services/CafeService.ts

import axios, { type AxiosRequestConfig } from "axios"; // ✅ TS1484 رفع شد

const BASE_URL = "https://fz-backoffice.linooxel.com/api/venues/branch/";

// تعریف نوع داده برای ساختار شعبه جدید
interface NewCafeData {
    name: string;
    phone: string;
    latitude: number;
    longitude: number;
    open_hours: { mon_fri: string };
    status: string;
    type: string;
    slug: string;
    gallery: number[];
    address: string | null;
}

// تعریف نوع داده برای پارامترهای جستجو
type CafeSearchParams = Record<string, any>;

const getAuthHeaders = (): AxiosRequestConfig => ({
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
    },
});

// GET لیست شعب
export const getCafes = async (params: CafeSearchParams = {}): Promise<any> => {
    const res = await axios.get(BASE_URL, {
        headers: getAuthHeaders().headers,
        params,
    });
    return res.data;
};

// POST ایجاد شعبه جدید
export const createCafe = async (data: NewCafeData): Promise<any> => {
    const res = await axios.post(BASE_URL, data, getAuthHeaders());
    return res.data;
};