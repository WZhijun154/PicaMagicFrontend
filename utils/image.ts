export function getUrlFromBase64(base64: string): string {
  return `data:image/png;base64,${base64}`;
}