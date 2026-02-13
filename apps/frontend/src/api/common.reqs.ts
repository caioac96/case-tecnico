import api from "./backend";

export interface CheckinOutResponse {
    success: boolean;
    message: string;
    userRegister: string;
    environmentId: string
}

export const checkin = (
    register: string,
    password: string,
    environmentId: string
) => api.post<CheckinOutResponse>("/checkin", { register, password, environmentId });

export const checkout = (
    register: string,
    password: string,
    environmentId: string
) => api.post<CheckinOutResponse>("/checkout", { register, password, environmentId });