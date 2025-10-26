import api from "./api";

const API_URL = "user/profile/me/";

export interface Profile {
  pk?: number;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  mobile?: string;
  gender?: string;
  city_id?: string;
  address?: string;
  birthday?: string;
  link?: string;
  national_code?: string;
  sheba?: string;
}

export const getProfile = async (): Promise<Profile> => {
  const res = await api.get(API_URL);
  console.debug("[ProfileService] getProfile response", res.data);
  return res.data as Profile;
};

export const updateProfile = async (data: Profile): Promise<Profile> => {
  const res = await api.patch(API_URL, data);
  console.debug("[ProfileService] updateProfile response", res.data);
  return res.data as Profile;
};

export const patchProfile = async (data: Partial<Profile>): Promise<Profile> => {
  const res = await api.patch(API_URL, data);
  console.debug("[ProfileService] patchProfile response", res.data);
  return res.data as Profile;
};
