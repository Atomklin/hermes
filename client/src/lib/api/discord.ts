export const CDN_BASE_URL = "https://cdn.discordapp.com/";

export function getUserAvatarURL(id: string, avatar: string) {
  return makeURL("avatars/" + id + "/" + avatar + getExtension(avatar));
}

export function getRegimentIconURL(id: string, icon: string) {
  return makeURL("icons/" + id + "/" + icon + getExtension(icon));
}

export function getExtension(hash: string) {
  return hash.startsWith("a_") ? ".gif" : ".webp";
}

export function makeURL(pathname: string) {
  return CDN_BASE_URL + pathname + "?size=4096";
}