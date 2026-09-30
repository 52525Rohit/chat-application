import React from "react";
import useConversation from "../../store/useConversationStore";
import { getProfilePicUrl } from "../../api/axiosClient";
import { useSocketContext } from "../../context/SocketContext";
import defaultAvatar from "../../../public/user.jpg";
import { closeDrawer } from "../../utils/drawer";

function ConversationItem({ user }) {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation?.id === user.id;
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(String(user.id));

  const profilePic = getProfilePicUrl(user.profilePic) || defaultAvatar;

  return (
    <div
      className={`flex cursor-pointer items-center gap-3 border-l-4 px-4 py-3 duration-300 hover:bg-surface-2 ${
        isSelected ? "border-brand bg-brand/15" : "border-transparent"
      }`}
      onClick={() => {
        setSelectedConversation(user);
        closeDrawer();
      }}
    >
      <div className={`avatar shrink-0 ${isOnline ? "avatar-online" : "avatar-offline"}`}>
        <div className="w-11 rounded-full">
          <img src={profilePic} alt="User Profile" />
        </div>
      </div>
      <div className="min-w-0">
        <h1 className="truncate font-bold">{user.firstName}</h1>
        <span className="block truncate text-sm text-gray-400">{user.email}</span>
      </div>
    </div>
  );
}

export default ConversationItem;
