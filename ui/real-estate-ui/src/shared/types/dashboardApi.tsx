// src/infrastructure/api-client/dashboardApi.ts

import axios from "axios";
import type { DashboardSummaryDto } from "../../shared/types/dashboard";

export async function fetchDashboardSummary(): Promise<DashboardSummaryDto> {
  const { data } = await axios.get<DashboardSummaryDto>("https://localhost:7168/api/property/dashboard-summary");
  return data;
}
