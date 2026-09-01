import { describe, expect, it } from "vitest";

import { getOnboardingSteps, getVisibleHelpModules } from "./content";

describe("conteúdo da ajuda", () => {
  it("oculta funções administrativas do operador", () => {
    const moduleIds = getVisibleHelpModules("OPERATOR").map((module) => module.id);
    const tourTargets = getOnboardingSteps("OPERATOR").map((step) => step.menuTarget);

    expect(moduleIds).not.toContain("users");
    expect(moduleIds).not.toContain("audit-logs");
    expect(tourTargets).not.toContain("users");
    expect(tourTargets).not.toContain("audit-logs");
  });

  it("inclui usuários e auditoria para administradores", () => {
    const moduleIds = getVisibleHelpModules("ADMIN").map((module) => module.id);
    const tourTargets = getOnboardingSteps("ADMIN").map((step) => step.menuTarget);

    expect(moduleIds).toEqual(expect.arrayContaining(["users", "audit-logs"]));
    expect(tourTargets).toEqual(expect.arrayContaining(["users", "audit-logs"]));
  });

  it("mantém no tour somente as funções que exigem orientação", () => {
    const stepIds = getOnboardingSteps("ADMIN").map((step) => step.id);

    expect(stepIds).not.toEqual(
      expect.arrayContaining([
        "media-folder-actions",
        "media-upload-actions",
        "playlist-modal-actions",
        "bar-modal-actions",
        "device-pair-actions",
        "schedule-modal-actions",
        "user-modal-actions",
        "user-modal-identity",
        "user-modal-email",
      ]),
    );
    expect(stepIds).toEqual(
      expect.arrayContaining([
        "playlist-modal-orientation",
        "composition-video-settings",
        "bar-modal-content",
        "schedule-modal-priority",
        "user-modal-role",
        "audit-filters",
      ]),
    );
  });
});
