const ONBOARDING_STORAGE_PREFIX = "indoor-player:onboarding";
export const ONBOARDING_VERSION = 4;

function getStorageKey(userId: string) {
  return `${ONBOARDING_STORAGE_PREFIX}:v${ONBOARDING_VERSION}:${userId}`;
}

export function hasCompletedOnboarding(userId: string, storage: Storage = window.localStorage) {
  try {
    return storage.getItem(getStorageKey(userId)) === "completed";
  } catch {
    return false;
  }
}

export function markOnboardingCompleted(userId: string, storage: Storage = window.localStorage) {
  try {
    storage.setItem(getStorageKey(userId), "completed");
  } catch {
    // A indisponibilidade do armazenamento não deve bloquear o uso do sistema.
  }
}
