import { get, writable } from "svelte/store";

import { axiosInstance } from "../all-purpose/misc";

export const regiments = writable<RegimentInfo[] | undefined>();
export const selectedRegiment = writable<RegimentInfo | undefined>();

export async function getRegiments() {
  if (get(regiments) != null)
    return;

  const { data } = await axiosInstance.get("/api/regiments/all");
  regiments.set(data);
}

export interface RegimentInfo {
  permission: number;
  icon?: string;
  name: string;
  id: string;
}
