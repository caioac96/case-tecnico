import api from "./backend";

export const getStudents = () => api.get("/users");

export const createStudent = (data: {
    name: string;
    password: string;
}) => api.post("/users", data);

export const updateStudent = (
    id: string,
    data: { name?: string }
) => api.patch(`/users/${id}`, data);

export const deleteStudent = (id: string) =>
    api.delete(`/users/${id}`);
