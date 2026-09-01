import { useState } from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { hasCompletedOnboarding } from "../onboarding-storage";
import { OnboardingTour } from "./OnboardingTour";

describe("OnboardingTour", () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it("permite avançar e concluir a apresentação", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onTargetChange = vi.fn();

    render(
      <MemoryRouter initialEntries={["/home/dashboard"]}>
        <TourScreenFixture />
        <OnboardingTour
          open
          userId="user-1"
          userRole="OPERATOR"
          onOpenChange={onOpenChange}
          onTargetChange={onTargetChange}
        />
      </MemoryRouter>,
    );

    expect(await screen.findByText(/Conheça o fluxo do Indoor Player/)).toBeInTheDocument();
    expect(screen.getByText(/Etapa 1 de \d+/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Próximo" }));

    expect(await screen.findByText(/Veja a situação da operação/)).toBeInTheDocument();
    expect(onTargetChange).toHaveBeenCalledWith("dashboard");
    expect(screen.getByRole("button", { name: "Pular apresentação" })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    fireEvent.click(document.querySelector(".driver-overlay path") as SVGPathElement);
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByText(/Veja a situação da operação/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Pular apresentação" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(hasCompletedOnboarding("user-1")).toBe(true);
  });

  it("abre somente os modais das funções principais sem salvar dados", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/home/dashboard"]}>
        <TourScreenFixture />
        <OnboardingTour
          open
          userId="user-2"
          userRole="OPERATOR"
          onOpenChange={vi.fn()}
          onTargetChange={vi.fn()}
        />
      </MemoryRouter>,
    );

    await user.click(await screen.findByRole("button", { name: "Próximo" }));
    await screen.findByText(/Veja a situação da operação/);
    await new Promise((resolve) => window.setTimeout(resolve, 260));
    await user.click(await screen.findByRole("button", { name: "Próximo" }));
    await screen.findByText(/Organize imagens e vídeos/);
    await new Promise((resolve) => window.setTimeout(resolve, 260));
    await user.click(await screen.findByRole("button", { name: "Próximo" }));

    await waitFor(() => {
      expect(screen.getByTestId("upload-modal-example")).toBeInTheDocument();
      expect(screen.getByText(/Envie arquivos compatíveis/)).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Pular apresentação" }));
    expect(screen.queryByTestId("upload-modal-example")).not.toBeInTheDocument();
  });
});

function TourScreenFixture() {
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <div>
      <div data-help-tour="dashboard-actions">Ações do dashboard</div>
      <div data-help-tour="dashboard-overview">Indicadores do dashboard</div>
      <div data-help-tour="media-actions">Resumo de mídias</div>
      <button data-help-tour="media-upload-button" onClick={() => setUploadOpen(true)}>
        Enviar arquivos
      </button>
      {uploadOpen && (
        <div data-help-tour="media-upload-rules" data-testid="upload-modal-example">
          Regras de envio
          <button data-help-tour="media-upload-close" onClick={() => setUploadOpen(false)}>
            Fechar
          </button>
        </div>
      )}
    </div>
  );
}
