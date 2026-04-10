// src/utils/cookies.ts
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "authToken",
  USER_PORTAL: "userPortal",
  USER_DATA: "userData",
};

export const cookieUtils = {
  get: (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift();
    }
    return undefined;
  },

  set: (name: string, value: string, days: number = 7) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
  },

  remove: (name: string) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  },

  getJSON: (name: string): any => {
    const value = cookieUtils.get(name);
    if (value) {
      try {
        return JSON.parse(decodeURIComponent(value));
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  setJSON: (name: string, value: any, days: number = 7) => {
    cookieUtils.set(name, encodeURIComponent(JSON.stringify(value)), days);
  },
};
