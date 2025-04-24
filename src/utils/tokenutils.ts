/* eslint-disable @typescript-eslint/no-unused-vars */
// utils/tokenUtils.ts
export const isTokenExpired = (token: string): boolean => {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const exp = decoded.exp;
      if (!exp) return true;
      return Date.now() >= exp * 1000;
    } catch (error) {
      return true; // Treat malformed token as expired
    }
  };
  