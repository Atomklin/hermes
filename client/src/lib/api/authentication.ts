import axios from "axios";
import { writable } from "svelte/store";

const axiosInstance = axios.create({
  withCredentials: true
});

export interface UserInfo {
  permissions: number;
  language: string;
  username: string;
}

export const user = writable<UserInfo | undefined>();

export async function getUserInfo() {
  const { data } = await axiosInstance.get("/api/auth/userinfo");
  return data as UserInfo;
}