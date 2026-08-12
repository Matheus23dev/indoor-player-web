import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { Device } from "../types/device";
import { DeviceCard } from "./DeviceCard";

vi.mock("./DevicePreview", () => ({
  DevicePreview: () => <div>Prévia</div>,
}));

afterEach(cleanup);

const device = {
  id: "device-1",
  name: "TV Recepção",
  code: "ABC123",
  isLinked: true,
  status: "ONLINE",
  lastHeartbeat: "2026-08-12T12:00:00.000Z",
  preview: {},
} as Device;

describe("DeviceCard logs access", () => {
  it("shows the logs action when it is authorized", () => {
    render(<DeviceCard device={device} onLogs={vi.fn()} onUnlink={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Logs" })).toBeInTheDocument();
  });

  it("hides the logs action when it is not authorized", () => {
    render(<DeviceCard device={device} onUnlink={vi.fn()} />);

    expect(screen.queryByRole("button", { name: "Logs" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Desvincular" })).toBeInTheDocument();
  });
});
