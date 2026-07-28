import axiosClient from "./axiosClient";

export const login = (credentials) =>
  axiosClient.post("/auth/login", credentials).then((res) => res.data);

export const register = (payload) =>
  axiosClient.post("/auth/register", payload).then((res) => res.data);
