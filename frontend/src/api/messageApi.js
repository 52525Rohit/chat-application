import axiosClient from "./axiosClient";

export const getMessages = (receiverId) =>
  axiosClient.get(`/messages/${receiverId}`).then((res) => res.data);

export const sendMessage = (formData) =>
  axiosClient
    .post("/messages", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
