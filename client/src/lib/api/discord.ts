export const CDN_BASE_URL = "https://cdn.discordapp.com/";

export function getUserAvatarURL(id: string, avatar: string) {
  const extension = avatar.startsWith("a_") ? ".gif" : ".webp";
  return CDN_BASE_URL + "avatars/" + id + "/" + avatar + extension + "?size=64";
}