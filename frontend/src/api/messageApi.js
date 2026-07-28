import axiosClient from "./axiosClient";

export const getMessages = (receiverId, { before, limit = 30 } = {}) =>
  axiosClient
    .get(`/messages/${receiverId}`, { params: { before, limit } })
    .then((res) => res.data);

export const sendMessage = (formData) =>
  axiosClient
    .post("/messages", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);

export const editMessage = (messageId, messageContent) =>
  axiosClient
    .patch(`/messages/${messageId}`, { message_content: messageContent })
    .then((res) => res.data);

export const deleteMessage = (messageId) =>
  axiosClient.delete(`/messages/${messageId}`).then((res) => res.data);
