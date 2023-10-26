import { atom } from "nanostores";

export interface UserData {
  permissions: number;
  language: string;
  username: string;
}

export const user = atom<UserData | undefined>();


export interface RegimentData {
  name: string;
  icon?: string;
}

export const regiment = atom<RegimentData | undefined>();