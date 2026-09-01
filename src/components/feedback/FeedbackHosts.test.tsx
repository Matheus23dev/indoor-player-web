import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { appAlert, type AppAlertResult } from "@/lib/alert";
import { appToast } from "@/lib/toast";
import AlertHost from "./AlertHost";
import ToastViewport from "./ToastViewport";

afterEach(cleanup);

describe("AlertHost", () => {
  it("confirma uma ação usando o modal próprio do projeto", async () => {
    const user = userEvent.setup();
    let resultPromise!: Promise<AppAlertResult>;

    render(<AlertHost />);

    act(() => {
      resultPromise = appAlert.fire({
        icon: "warning",
        title: "Remover mídia?",
        text: "Esta ação não poderá ser desfeita.",
        showCancelButton: true,
        confirmButtonText: "Sim, remover",
        customClass: { confirmButton: "indoor-swal-danger" },
      });
    });

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sim, remover" })).toHaveClass("indoor-alert-danger");

    await user.click(screen.getByRole("button", { name: "Sim, remover" }));

    await expect(resultPromise).resolves.toEqual({
      isConfirmed: true,
      isDismissed: false,
    });
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("retorna cancelamento sem executar a confirmação", async () => {
    const user = userEvent.setup();
    let resultPromise!: Promise<AppAlertResult>;

    render(<AlertHost />);

    act(() => {
      resultPromise = appAlert.fire({
        icon: "question",
        title: "Continuar?",
        showCancelButton: true,
      });
    });

    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    await expect(resultPromise).resolves.toEqual({
      isConfirmed: false,
      isDismissed: true,
      dismiss: "cancel",
    });
  });
});

describe("ToastViewport", () => {
  it("exibe e permite fechar uma notificação própria", async () => {
    const user = userEvent.setup();

    render(<ToastViewport />);

    act(() => {
      appToast.success("Playlist atualizada", { duration: 10_000 });
    });

    expect(screen.getByRole("status")).toHaveTextContent("Playlist atualizada");

    await user.click(screen.getByRole("button", { name: "Fechar notificação" }));

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
