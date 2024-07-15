import axios from "middleware/axios";

const createAdmin = (data) => axios.post("/admin_cms/create", data);
const listAdmin = (data, params) => axios.post("/admin_cms/search", data, { params });
const updateAdmin = (data, id) => axios.put(`/admin_cms/update/${id}`, data);
const removeAdmin = (id) => axios.delete(`/admin_cms/remove/${id}`);

export { createAdmin, listAdmin, updateAdmin, removeAdmin };
