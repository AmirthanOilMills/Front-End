import { getRequest } from "../api";

export function getDashboardStats(month = "") {
    let query = `/admin/dashboardstats`;
    if (month) query += `?month=${month}`;
    return getRequest(query);
}