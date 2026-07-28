import React from "react";
import useConversation from "../../store/useConversationStore";
import { getProfilePicUrl } from "../../api/axiosClient";
import { useSocketContext } from "../../context/SocketContext";
import defaultAvatar from "../../../public/user.jpg";

function ConversationItem({ user }) {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation?.id === user.id;
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(String(user.id));

  const profilePic = getProfilePicUrl(user.profilePic) || defaultAvatar;

  return (
    <div
      className={`hover:bg-slate-600 duration-300 ${
        isSelected ? "bg-slate-700" : ""
      }`}
      onClick={() => setSelectedConversation(user)}
    >
      <div className="flex space-x-4 px-6 py-6 hover:bg-slate-500 duration-300 cursor-pointer">
        <div>
          <div className="avatar">
            <div className="w-12 rounded-full">
              <img src={profilePic} alt="User Profile" />
            </div>
            <div>
              <h2>{isOnline ? "🟢" : "🔴"}</h2>
            </div>
          </div>
        </div>
        <div>
          <h1 className="font-bold">{user.firstName}</h1>
          <span>{user.email}</span>
        </div>
      </div>
    </div>
  );
}

export default ConversationItem;
