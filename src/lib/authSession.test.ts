import Cookies from "js-cookie";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  AUTH_TOKEN_COOKIE,
  AUTH_USER_COOKIE,
  clearAuthSession,
  getAuthCookieOptions,
  storeAuthToken,
  storeAuthUser,
} from "./authSession";

vi.mock("js-cookie", () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

describe("authSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses secure cookies only over HTTPS", () => {
    expect(getAuthCookieOptions("https:")).toMatchObject({
      path: "/",
      sameSite: "strict",
      secure: true,
    });
    expect(getAuthCookieOptions("http:")).toMatchObject({
      secure: false,
    });
  });

  it("stores the token and user with the same hardened options", () => {
    storeAuthToken("token-value");
    storeAuthUser('{"id":"user-1"}');

    expect(Cookies.set).toHaveBeenNthCalledWith(
      1,
      AUTH_TOKEN_COOKIE,
      "token-value",
      expect.objectContaining({ path: "/", sameSite: "strict" }),
    );
    expect(Cookies.set).toHaveBeenNthCalledWith(
      2,
      AUTH_USER_COOKIE,
      '{"id":"user-1"}',
      expect.objectContaining({ path: "/", sameSite: "strict" }),
    );
  });

  it("clears both cookies from the application root", () => {
    clearAuthSession();

    expect(Cookies.remove).toHaveBeenCalledWith(AUTH_TOKEN_COOKIE, {
      path: "/",
    });
    expect(Cookies.remove).toHaveBeenCalledWith(AUTH_USER_COOKIE, {
      path: "/",
    });
  });
});
