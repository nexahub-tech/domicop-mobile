import { authedRequest } from "../http";
import { transformDashboardSummary, DashboardSummary } from "../types/dashboard";

export const dashboard = {
  getSummary: async (): Promise<DashboardSummary> => {
    const raw = await authedRequest<any>("/dashboard/summary", {
      method: "GET",
    });
    return transformDashboardSummary(raw);
  },
};

export default dashboard;
