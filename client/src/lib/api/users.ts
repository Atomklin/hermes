import { locale } from "svelte-i18n";
import { get, writable } from "svelte/store";

import { axiosInstance } from "../all-purpose/misc";
import { regiments, selectedRegiment } from "./regiments";

export const user = writable<UserInfo | undefined>();

export async function getUserInfo() {
  if (get(user) != null)
    return;
  
  const { data } = await axiosInstance.get("/api/users/me");
  locale.set(data.language);
  user.set(data);
}

export async function patchUserInfo(info: Pick<UserInfo, "language">) {
  const params = new URLSearchParams(info);
  await axiosInstance.patch("/api/users/me?" + params);
}

export async function logout() {
  user.set(undefined);
  regiments.set(undefined);
  selectedRegiment.set(undefined);
  await axiosInstance.post("/api/auth/logout");
}

export interface UserInfo {
  id: string;
  icon?: string;
  language: string;
  username: string;
}