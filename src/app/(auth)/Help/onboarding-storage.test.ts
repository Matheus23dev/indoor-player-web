import { describe, expect, it } from "vitest";

import { hasCompletedOnboarding, markOnboardingCompleted } from "./onboarding-storage";

function createMemoryStorage(): Storage {
  const values = new Map<string, string>();

  return {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()][index] ?? null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, value),
  };
}

describe("onboardingStorage", () => {
  it("registra a conclusão separadamente para cada usuário", () => {
    const storage = createMemoryStorage();

    expect(hasCompletedOnboarding("user-1", storage)).toBe(false);

    markOnboardingCompleted("user-1", storage);

    expect(hasCompletedOnboarding("user-1", storage)).toBe(true);
    expect(hasCompletedOnboarding("user-2", storage)).toBe(false);
  });

  it("não bloqueia o sistema quando o armazenamento está indisponível", () => {
    const blockedStorage = {
      getItem: () => {
        throw new Error("storage unavailable");
      },
      setItem: () => {
        throw new Error("storage unavailable");
      },
    } as unknown as Storage;

    expect(hasCompletedOnboarding("user-1", blockedStorage)).toBe(false);
    expect(() => markOnboardingCompleted("user-1", blockedStorage)).not.toThrow();
  });
});
