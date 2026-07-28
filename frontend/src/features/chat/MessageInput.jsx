import React, { useEffect, useRef, useState } from "react";
import { IoSend, IoClose } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import { MdOutlineAttachFile } from "react-icons/md";
import toast from "react-hot-toast";
import emoji from "../../../public/emoji.png";
import { sendMessage } from "../../api/messageApi";
import useConversation from "../../store/useConversationStore";
import { useSocketContext } from "../../context/SocketContext";

const TYPING_STOP_DELAY = 2000;

function MessageInput() {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const isTypingRef = useRef(false);
  const stopTypingTimerRef = useRef(null);
  const fileInputRef = useRef(null);

  const {
    messages,
    setMessage: setMessages,
    selectedConversation,
  } = useConversation();
  const { socket } = useSocketContext();

  const stopTyping = () => {
    if (isTypingRef.current && socket && selectedConversation?.id) {
      socket.emit("stopTyping", { to: selectedConversation.id });
    }
    isTypingRef.current = false;
    clearTimeout(stopTypingTimerRef.current);
  };

  useEffect(() => {
    return () => stopTyping();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation]);

  const handleTextChange = (e) => {
    setMessage(e.target.value);

    if (!socket || !selectedConversation?.id) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socket.emit("typing", { to: selectedConversation.id });
    }

    clearTimeout(stopTypingTimerRef.current);
    stopTypingTimerRef.current = setTimeout(stopTyping, TYPING_STOP_DELAY);
  };

  const handleEmoji = (e) => {
    setMessage((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImages = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    if (!image) {
      setPreviewUrl(null);
      return undefined;
    }
    const url = URL.createObjectURL(image);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() === "" && !image) return;

    stopTyping();

    const formData = new FormData();
    formData.append("receiver_id", selectedConversation?.id);
    formData.append("message_content", message);
    if (image) formData.append("imageFile", image);

    setIsSending(true);
    try {
      const result = await sendMessage(formData);
      setMessages([...messages, result.messageData]);

      setMessage("");
      handleRemoveImage();
    } catch (error) {
      toast.error("Failed to send message");
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="shrink-0 border-t border-slate-700 bg-slate-800 px-4 py-3"
    >
      {previewUrl && (
        <div className="relative mb-2 inline-block">
          <div className="size-20 overflow-hidden rounded-lg border border-slate-700 bg-slate-900">
            <img
              src={previewUrl}
              alt="Selected attachment preview"
              className="size-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemoveImage}
            aria-label="Remove attachment"
            className="absolute -right-2 -top-2 rounded-full bg-slate-800 p-1 text-white shadow-md transition hover:bg-red-500"
          >
            <IoClose className="size-3.5" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <label className="btn btn-ghost btn-sm btn-circle cursor-pointer shrink-0">
          <MdOutlineAttachFile className="size-5 rotate-45" />
          <input
            ref={fileInputRef}
            type="file"
            name="imageFile"
            accept="image/*"
            onChange={handleImages}
            className="hidden"
          />
        </label>

        <div className="relative shrink-0">
          <img
            className="size-6 cursor-pointer"
            src={emoji}
            alt="emoji"
            onClick={() => setOpen((prev) => !prev)}
          />
          {open && (
            <div className="absolute bottom-12 left-0 z-50">
              <EmojiPicker onEmojiClick={handleEmoji} />
            </div>
          )}
        </div>

        <input
          type="text"
          placeholder={image ? "Add a caption (optional)" : "Type here"}
          value={message}
          onChange={handleTextChange}
          className="flex-1 min-w-0 rounded-full border border-slate-600 bg-slate-900 px-4 py-2.5 outline-none focus:border-blue-500"
        />

        <button
          type="submit"
          disabled={isSending}
          className="btn btn-circle btn-sm shrink-0 border-none bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          <IoSend className="text-base" />
        </button>
      </div>
    </form>
  );
}

export default MessageInput;
