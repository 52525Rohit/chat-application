import React, { useState } from "react";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import { MdOutlineAttachFile } from "react-icons/md";
import toast from "react-hot-toast";
import emoji from "../../../public/emoji.png";
import { sendMessage } from "../../api/messageApi";
import useConversation from "../../store/useConversationStore";

function MessageInput() {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const { messages, setMessage: setMessages, selectedConversation } =
    useConversation();

  const handleEmoji = (e) => {
    setMessage((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImages = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setMessage(file.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() === "" && !image) return;

    const formData = new FormData();
    formData.append("receiver_id", selectedConversation?.id);
    formData.append("message_content", message);
    if (image) formData.append("imageFile", image);

    setIsSending(true);
    try {
      const result = await sendMessage(formData);
      setMessages([...messages, result.messageData]);

      setMessage("");
      setImage(null);
    } catch (error) {
      toast.error("Failed to send message");
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex space-x-1 h-[8vh] bg-gray-800">
        <div className="w-[70%] mx-4">
          <input
            type="text"
            placeholder="Type here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border border-gray-700 rounded-xl outline-none mt-1 px-4 py-3 w-full"
          />
        </div>

        <div className="relative top-4 h-[4vh] flex items-end justify-center cursor-pointer">
          <label className="cursor-pointer">
            <MdOutlineAttachFile className="size-6 m-4 rotate-45" />
            <input
              type="file"
              name="imageFile"
              accept="image/*"
              onChange={handleImages}
              className="hidden"
            />
          </label>
        </div>

        <div className="relative space-x-6 h-[4vh] flex items-end justify-center cursor-pointer">
          <img
            className="flex size-6 bottom-2"
            src={emoji}
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
          <EmojiPicker open={open} onEmojiClick={handleEmoji} />
        </div>
        <button type="submit" disabled={isSending}>
          <IoSend className="relative bottom-3 text-2xl flex items-center h-[8vh]" />
        </button>
      </div>
    </form>
  );
}

export default MessageInput;
