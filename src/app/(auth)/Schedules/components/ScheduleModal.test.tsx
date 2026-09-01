import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import ScheduleModal from "./ScheduleModal";

describe("ScheduleModal", () => {
  afterEach(cleanup);

  it("mantém o alvo do tour restrito ao controle de prioridade", () => {
    render(
      <ScheduleModal
        open
        saving={false}
        devices={[]}
        playlists={[]}
        onClose={vi.fn()}
        onSubmit={vi.fn().mockResolvedValue({})}
      />,
    );

    const priorityTarget = document.querySelector('[data-help-tour="schedule-modal-priority"]');

    expect(priorityTarget).toContainElement(screen.getByLabelText("Prioridade"));
    expect(priorityTarget).toHaveTextContent(
      "Em caso de disputa, agendamentos com maior prioridade têm preferência.",
    );
    expect(priorityTarget).not.toHaveTextContent("Agendamento ativo");
  });
});
