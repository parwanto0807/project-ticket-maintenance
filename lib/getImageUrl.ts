// lib/getImageUrl.ts
export const getImageUrl = (url: string): string => {
    if (process.env.NODE_ENV === 'development' && url.startsWith('/uploads/')) {
      return `https://solusiit.net${url}`;
    }
    return url;
  };
  