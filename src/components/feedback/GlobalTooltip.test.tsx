import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import GlobalTooltip from "./GlobalTooltip";

afterEach(cleanup);

describe("GlobalTooltip", () => {
  it("substitui o title nativo por um tooltip visual e restaura ao sair", () => {
    render(
      <>
        <button type="button" title="Duplicar mídia">
          Duplicar
        </button>
        <GlobalTooltip />
      </>,
    );

    const button = screen.getByRole("button", { name: "Duplicar" });

    fireEvent.pointerOver(button);

    expect(screen.getByRole("tooltip")).toHaveTextContent("Duplicar mídia");
    expect(button).not.toHaveAttribute("title");
    expect(button).toHaveAttribute("aria-describedby", screen.getByRole("tooltip").id);

    fireEvent.pointerOut(button, { relatedTarget: document.body });

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(button).toHaveAttribute("title", "Duplicar mídia");
  });

  it("também apresenta a ajuda quando o botão recebe foco", () => {
    render(
      <>
        <button type="button" title="Remover mídia">
          Remover
        </button>
        <GlobalTooltip />
      </>,
    );

    const button = screen.getByRole("button", { name: "Remover" });

    fireEvent.focusIn(button);

    expect(screen.getByRole("tooltip")).toHaveTextContent("Remover mídia");

    fireEvent.focusOut(button);

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("mantém o balão ancorado no botão correto perto da lateral", () => {
    render(
      <>
        <button type="button" title="Editar">
          Editar
        </button>
        <GlobalTooltip />
      </>,
    );

    const button = screen.getByRole("button", { name: "Editar" });
    vi.spyOn(button, "getBoundingClientRect").mockReturnValue({
      x: 900,
      y: 120,
      left: 900,
      top: 120,
      right: 940,
      bottom: 160,
      width: 40,
      height: 40,
      toJSON: () => ({}),
    });

    fireEvent.pointerOver(button);

    const tooltip = screen.getByRole("tooltip");
    expect(Number.parseFloat(tooltip.style.left)).toBeGreaterThan(850);
    expect(tooltip.style.getPropertyValue("--indoor-tooltip-arrow-left")).not.toBe("");
  });
});
