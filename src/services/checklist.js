import api from "../utils/api";

export const getMyChecklist = async () => {
  const response = await api.get("/checklist");
  return response.data.data;
};

export const updateMyChecklist = async (state) => {
  const response = await api.put("/checklist", { state });
  return response.data.data;
};

export const completeMyChecklist = async () => {
  const response = await api.post("/checklist/complete");
  return response.data.data;
};
