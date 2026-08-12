import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getAuditLogs } from "./services/audit-logs.service";
import AuditLogs from "./index";

vi.mock("./services/audit-logs.service", () => ({
  getAuditLogs: vi.fn(),
}));

const mockedGetAuditLogs = vi.mocked(getAuditLogs);

afterEach(cleanup);

describe("AuditLogs", () => {
  beforeEach(() => {
    mockedGetAuditLogs.mockResolvedValue({
      items: [
        {
          id: "log-1",
          deviceId: "11111111-1111-4111-8111-111111111111",
          message: `@ADMIN_EVENT:${JSON.stringify({
            action: "PLAYLIST_UPDATED",
            message: "Maria atualizou a playlist Institucional.",
            actor: { id: "user-1", name: "Maria" },
            entity: { id: "playlist-1", type: "PLAYLIST" },
            occurredAt: "2026-08-12T12:00:00.000Z",
          })}`,
          createdAt: "2026-08-12T12:00:01.000Z",
          device: {
            id: "11111111-1111-4111-8111-111111111111",
            name: "TV RecepÃ§Ã£o",
            code: "ABC123",
          },
        },
      ],
      pagination: { page: 1, limit: 25, total: 1, totalPages: 1 },
      filters: {
        devices: [
          {
            id: "11111111-1111-4111-8111-111111111111",
            name: "TV RecepÃ§Ã£o",
            code: "ABC123",
          },
        ],
      },
    });
  });

  it("renderiza a auditoria em tabela com os filtros principais", async () => {
    render(<AuditLogs />);

    expect(
      await screen.findByText("Maria atualizou a playlist Institucional."),
    ).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Data e hora" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "UsuÃ¡rio" })).toBeInTheDocument();
    expect(screen.getByLabelText("Buscar nos logs")).toBeInTheDocument();
    expect(screen.getByLabelText("Origem")).toBeInTheDocument();
    expect(screen.getByLabelText("Dispositivo")).toBeInTheDocument();
    expect(screen.getByLabelText("Data inicial")).toBeInTheDocument();
    expect(screen.getByLabelText("Data final")).toBeInTheDocument();
    expect(screen.getByText("Maria")).toBeInTheDocument();
    expect(screen.getByText("TV RecepÃ§Ã£o")).toBeInTheDocument();
  });

  it("envia o filtro de origem para a API", async () => {
    render(<AuditLogs />);
    await screen.findByText("Maria atualizou a playlist Institucional.");

    fireEvent.change(screen.getByLabelText("Origem"), {
      target: { value: "SYSTEM" },
    });

    await waitFor(() => {
      expect(mockedGetAuditLogs).toHaveBeenLastCalledWith(
        expect.objectContaining({ source: "SYSTEM", page: 1 }),
      );
    });
  });
});
