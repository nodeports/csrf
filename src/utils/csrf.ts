import { doubleCsrf, DoubleCsrfCookieOptions } from "csrf-csrf";

const csrfSecret = process.env.CSRF_SECRET || "app-csrf-secret";
const cookieOptions: DoubleCsrfCookieOptions = {
  maxAge: 24 * 60 * 60 * 1000,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

export const { doubleCsrfProtection, generateToken } = doubleCsrf({
  size: 64,
  getSecret: () => csrfSecret,
  cookieName: "csrf-token",
  cookieOptions,
});
