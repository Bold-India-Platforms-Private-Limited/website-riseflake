/**
 * Prepends the app's basePath (/resume) to local absolute paths.
 * Safe to call with external URLs (http/https) or data URIs — they pass through unchanged.
 */
export const withBasePath = (src: string): string => {
  if (!src || !src.startsWith('/') || src.startsWith('/resume/')) return src;
  return `/resume${src}`;
};
