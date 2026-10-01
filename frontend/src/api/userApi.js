import axiosClient from "./axiosClient";

export const getAllUsers = () =>
  axiosClient.get("/users/allUser").then((res) => res.data);

export const updateProfile = (data) =>
  axiosClient.patch("/users/profile", data).then((res) => res.data);

export const updateProfilePic = (formData) =>
  axiosClient
    .post("/users/updateProfile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
