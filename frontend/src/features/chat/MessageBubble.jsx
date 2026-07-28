import React, { useEffect, useState } from "react";
import { ColorRing } from "react-loader-spinner";
import { MdOutlineFileDownload } from "react-icons/md";
import { RiDownloadLine } from "react-icons/ri";
import { getProfilePicUrl } from "../../api/axiosClient";
import { useAuth } from "../../context/AuthProvider";

const spinnerColors = Array(5).fill("#4239f9");

function MessageBubble({ message }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const [isImageVisible, setIsImageVisible] = useState(false);
  const [authUser] = useAuth();

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
        `<a href="${url}" target="_blank" class="text-indigo-900 underline">${url}</a>`
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

  useEffect(() => {
    setIsImageVisible(!!localStorage.getItem(`downloaded_${message.images_url}`));
  }, [message.images_url]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="p-4">
        <div className={`chat ${isSender ? chatName : "chat-start"}`}>
          <div className={`chat-bubble ${isSender ? chatColor : "bg-gray-600"}`}>
            {isLoading && (
              <ColorRing
                visible
                height="30"
                width="30"
                ariaLabel="color-ring-loading"
                colors={spinnerColors}
              />
            )}
            <div
              className="text-white"
              dangerouslySetInnerHTML={{
                __html: renderMessageContent(message?.message_content || ""),
              }}
            />

            {message.images_url && (
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

            {!isSender && message.images_url && (
              <RiDownloadLine
                className="size-6 text-white"
                onClick={() => downloadImage(imageUrl)}
              />
            )}
          </div>
          <div className="chat-footer">{formattedTime}</div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-opacity-30 backdrop-blur-md"></div>
          <div className="relative">
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full max-w-3xl h-full rounded-lg"
            />
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeModal}
            >
              ❌
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default MessageBubble;
