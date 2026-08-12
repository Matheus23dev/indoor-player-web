import instance from "../../../../services/axios";

import type { AuditLogsQuery, AuditLogsResponse } from "../types/audit-log.types";

export async function getAuditLogs(query: AuditLogsQuery) {
  const response = await instance.get<AuditLogsResponse>("/audit-logs", {
    params: query,
  });

  return response.data;
}
