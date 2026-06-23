export interface Device {
  id: string;
  name: string;
  code: string;
  isLinked: boolean;
  status: "ONLINE" | "OFFLINE";
  lastHeartbeat: string | null;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}