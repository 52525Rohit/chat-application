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
      className={`flex cursor-pointer items-center gap-3 rounded-lg border-l-4 px-3 py-2.5 duration-300 ${
        isSelected ? "border-brand bg-brand/15" : "border-transparent hover:bg-surface-2"
      }`}
      onClick={() => {
        setSelectedConversation(user);
        closeDrawer();
      }}
    >
      <div className="relative shrink-0">
        <img
          src={profilePic}
          alt="User Profile"
          className="size-11 rounded-full object-cover"
        />
        <span
          className={`absolute bottom-0 right-0 size-3 rounded-full ring-2 ring-surface ${
            isOnline ? "bg-emerald-500" : "bg-gray-500"
          }`}
        />
      </div>
      <div className="min-w-0">
        <h3 className="truncate font-semibold">{user.firstName}</h3>
        <span className="block truncate text-sm text-gray-400">{user.email}</span>
      </div>
    </div>
  );
}

export default ConversationItem;
