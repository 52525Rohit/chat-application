import React from "react";
import { TbMenu2 } from "react-icons/tb";
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
    <div className="flex h-16 w-full shrink-0 items-center gap-3 border-b border-surface-2 bg-surface px-4">
      <label
        htmlFor="my-drawer-2"
        aria-label="Open chats"
        className="drawer-button flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-surface-3 bg-base text-brand transition hover:border-brand active:scale-95 lg:hidden"
      >
        <TbMenu2 className="size-5" />
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
