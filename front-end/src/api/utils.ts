export function getLanguageCode() {
  const currentPath = window.location.pathname;
  const pathSegments = currentPath.split("/");
  return pathSegments[1] as string;
}