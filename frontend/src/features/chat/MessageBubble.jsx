import React, { useEffect, useState } from "react";
import { ColorRing } from "react-loader-spinner";
import { MdOutlineFileDownload, MdEdit, MdDeleteOutline } from "react-icons/md";
import { RiDownloadLine } from "react-icons/ri";
import { IoCheckmark, IoCheckmarkDone, IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import { getProfilePicUrl } from "../../api/axiosClient";
import { useAuth } from "../../context/AuthProvider";
import { editMessage, deleteMessage } from "../../api/messageApi";
import useConversation from "../../store/useConversationStore";

const spinnerColors = Array(5).fill("#4239f9");

function MessageBubble({ message }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const [isImageVisible, setIsImageVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(message.message_content || "");
  const [isSaving, setIsSaving] = useState(false);
  const [authUser] = useAuth();
  const { updateMessage } = useConversation();

  const isSender = message.sender_id === authUser?.employeeData?.id;
  const chatName = isSender ? "chat-end" : "chat-start";
  const chatColor = isSender ? "bg-blue-500" : "bg-gray-600";

  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const imageUrl = getProfilePicUrl(message.images_url);

  const downloadImage = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const renderMessageContent = (content) => {
    if (!content) return "";
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return content.replace(
      urlRegex,
      (url) =>
        `<a href="${url}" target="_blank" class="text-indigo-900 underline">${url}</a>`,
    );
  };

  const revealImage = () => {
    setIsImageVisible(true);
    localStorage.setItem(`downloaded_${message.images_url}`, "true");
  };

  const openModal = (url) => {
    setSelectedImage(url);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage("");
  };

  const startEditing = () => {
    setEditValue(message.message_content || "");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const saveEdit = async () => {
    if (!editValue.trim() || editValue === message.message_content) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      const result = await editMessage(message.message_id, editValue.trim());
      updateMessage(message.message_id, result.messageData);
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to edit message");
      console.error("Error editing message:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this message?")) return;

    try {
      await deleteMessage(message.message_id);
      updateMessage(message.message_id, {
        is_deleted: true,
        message_content: null,
        images_url: null,
      });
    } catch (error) {
      toast.error("Failed to delete message");
      console.error("Error deleting message:", error);
    }
  };

  useEffect(() => {
    setIsImageVisible(
      !!localStorage.getItem(`downloaded_${message.images_url}`),
    );
  }, [message.images_url]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isModalOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  return (
    <>
      <div className="px-4 py-1 group">
        <div className={`chat ${isSender ? chatName : "chat-start"}`}>
          <div
            className={`chat-bubble ${isSender ? chatColor : "bg-gray-600"} relative`}
          >
            {isSender && !message.is_deleted && (
              <div className="absolute -top-3 right-1 hidden group-hover:flex space-x-1 bg-slate-800 rounded-full px-1.5 py-0.5">
                <MdEdit
                  className="size-4 text-gray-200 cursor-pointer hover:text-white"
                  onClick={startEditing}
                />
                <MdDeleteOutline
                  className="size-4 text-gray-200 cursor-pointer hover:text-red-400"
                  onClick={handleDelete}
                />
              </div>
            )}

            {isLoading && (
              <ColorRing
                visible
                height="30"
                width="30"
                ariaLabel="color-ring-loading"
                colors={spinnerColors}
              />
            )}

            {message.is_deleted ? (
              <p className="italic text-gray-300">This message was deleted</p>
            ) : isEditing ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit();
                    if (e.key === "Escape") cancelEditing();
                  }}
                  autoFocus
                  disabled={isSaving}
                  className="text-black rounded px-2 py-1 text-sm"
                />
                <IoCheckmark
                  className="size-5 cursor-pointer hover:text-green-300"
                  onClick={saveEdit}
                />
                <IoClose
                  className="size-5 cursor-pointer hover:text-red-300"
                  onClick={cancelEditing}
                />
              </div>
            ) : (
              <div
                className="text-white"
                dangerouslySetInnerHTML={{
                  __html: renderMessageContent(message?.message_content || ""),
                }}
              />
            )}

            {!message.is_deleted && message.images_url && (
              <div className="relative w-40 h-50 rounded-lg border border-zinc-700 flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt="Sent"
                  className={`w-full h-full object-cover rounded-lg transition ${
                    isSender || isImageVisible ? "blur-none" : "blur-md"
                  }`}
                  onClick={() => openModal(imageUrl)}
                />
                {!isSender && !isImageVisible && (
                  <MdOutlineFileDownload
                    className="absolute text-white text-3xl cursor-pointer"
                    onClick={revealImage}
                  />
                )}
              </div>
            )}

            {!isSender && !message.is_deleted && message.images_url && (
              <RiDownloadLine
                className="size-6 text-white"
                onClick={() => downloadImage(imageUrl)}
              />
            )}
          </div>
          <div className="chat-footer flex items-center gap-1">
            {message.is_edited && !message.is_deleted && (
              <span className="italic">edited</span>
            )}
            <span>{formattedTime}</span>
            {isSender && !message.is_deleted && (
              <span className={message.is_read ? "text-blue-400" : ""}>
                {message.is_read ? (
                  <IoCheckmarkDone className="inline size-4" />
                ) : (
                  <IoCheckmark className="inline size-4" />
                )}
              </span>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Preview"
              className="max-h-[90vh] max-w-[90vw] w-auto h-auto rounded-lg object-contain shadow-2xl"
            />

            <div className="absolute right-2 top-2 flex gap-2">
              <button
                type="button"
                onClick={() => downloadImage(selectedImage)}
                aria-label="Download image"
                className="rounded-full bg-black/60 p-2 text-white transition hover:bg-black/80"
              >
                <RiDownloadLine className="size-4" />
              </button>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close preview"
                className="rounded-full bg-black/60 p-2 text-white transition hover:bg-black/80"
              >
                <IoClose className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MessageBubble;
