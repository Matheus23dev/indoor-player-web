import Cookies from "js-cookie";

export const AUTH_TOKEN_COOKIE = "@TOKEN";
export const AUTH_USER_COOKIE = "user";

const AUTH_SESSION_DURATION_DAYS = 1;
const AUTH_COOKIE_PATH = "/";

export function getAuthCookieOptions(
  protocol = window.location.protocol,
): Cookies.CookieAttributes {
  return {
    expires: AUTH_SESSION_DURATION_DAYS,
    path: AUTH_COOKIE_PATH,
    sameSite: "strict",
    secure: protocol === "https:",
  };
}

export function readAuthToken() {
  return Cookies.get(AUTH_TOKEN_COOKIE) ?? null;
}

export function readAuthUser() {
  return Cookies.get(AUTH_USER_COOKIE) ?? null;
}

export function storeAuthToken(token: string) {
  Cookies.set(AUTH_TOKEN_COOKIE, token, getAuthCookieOptions());
}

export function storeAuthUser(serializedUser: string) {
  Cookies.set(AUTH_USER_COOKIE, serializedUser, getAuthCookieOptions());
}

export function clearAuthSession() {
  const options = { path: AUTH_COOKIE_PATH };

  Cookies.remove(AUTH_TOKEN_COOKIE, options);
  Cookies.remove(AUTH_USER_COOKIE, options);
}
