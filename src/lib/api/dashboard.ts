import api from "./client";
import { DashboardResponse, ApiResponse } from "@/types/api";

export const dashboardApi = {
  getSummary: async (): Promise<DashboardResponse> => {
    const response = await api.get<ApiResponse<DashboardResponse>>("/dashboard");
    return response.data.data;
  },
};
