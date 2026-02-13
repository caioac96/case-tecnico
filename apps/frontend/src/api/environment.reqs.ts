import api from "./backend";

export const getEnvironments = () => api.get("/environments");

export const createEnvironment = (data: {
    description: string;
    occupancyLimit?: number;
}) => api.post("/environments", data);

export const updateEnvironment = (
    id: string,
    data: { description?: string }
) => api.patch(`/environments/${id}`, data);

export const deleteEnvironment = (id: string) =>
    api.delete(`/environments/${id}`);
