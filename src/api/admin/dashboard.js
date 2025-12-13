import { getRequest} from "../api"


export function getDashboardStats(){
    return getRequest(`/admin/dashboardstats`);
}