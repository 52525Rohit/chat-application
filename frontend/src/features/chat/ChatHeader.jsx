import React from "react";
import { CiMenuFries } from "react-icons/ci";
import useConversation from "../../store/useConversationStore";
import { useSocketContext } from "../../context/SocketContext";
import { getProfilePicUrl } from "../../api/axiosClient";
import defaultAvatar from "../../../public/user.jpg";

function ChatHeader() {
  const { selectedConversation, typingUserId } = useConversation();
  const { onlineUsers } = useSocketContext();

  const isOnline = onlineUsers.includes(String(selectedConversation.id));
  const isTyping = Number(typingUserId) === Number(selectedConversation.id);
  const profilePic =
    getProfilePicUrl(selectedConversation?.profilePic) || defaultAvatar;

  return (
    <div className="flex h-16 w-full shrink-0 items-center gap-3 border-b border-slate-700 bg-slate-800 px-4">
      <label
        htmlFor="my-drawer-2"
        className="btn btn-ghost btn-sm btn-circle drawer-button lg:hidden"
      >
        <CiMenuFries className="text-white text-xl" />
      </label>

      <div className={`avatar ${isOnline ? "avatar-online" : "avatar-offline"}`}>
        <div className="w-11 rounded-full">
          <img src={profilePic} alt={selectedConversation?.firstName || "User"} />
        </div>
      </div>

      <div className="min-w-0 leading-tight">
        <h1 className="truncate text-base font-semibold text-white">
          {selectedConversation?.firstName}
        </h1>
        <span className="text-xs text-gray-400">
          {isTyping ? "typing..." : isOnline ? "Online" : "Offline"}
        </span>
      </div>
    </div>
  );
}

export default ChatHeader;
