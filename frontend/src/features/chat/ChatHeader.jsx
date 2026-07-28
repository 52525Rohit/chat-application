import React from "react";
import { CiMenuFries } from "react-icons/ci";
import useConversation from "../../store/useConversationStore";
import { useSocketContext } from "../../context/SocketContext";
import { getProfilePicUrl } from "../../api/axiosClient";
import defaultAvatar from "../../../public/user.jpg";

function ChatHeader() {
  const { selectedConversation } = useConversation();
  const { onlineUsers } = useSocketContext();

  const isOnline = onlineUsers.includes(String(selectedConversation.id));
  const profilePic =
    getProfilePicUrl(selectedConversation?.profilePic) || defaultAvatar;

  return (
    <div className="relative flex items-center h-[8%] justify-center gap-4 bg-slate-700 hover:bg-slate-500 duration-300 rounded-md">
      <label
        htmlFor="my-drawer-2"
        className="btn btn-ghost drawer-button lg:hidden absolute left-5"
      >
        <CiMenuFries className="text-white text-xl" />
      </label>
      <div className="relative flex items-center h-[8%] justify-center gap-4">
        <div className="flex space-x-3 items-center justify-center h-[8vh]">
          <div className="avatar">
            <div className="w-16 rounded-full">
              <img src={profilePic} alt="User Profile" />
            </div>
          </div>
          <div>
            <h2 className="relative right-6 bottom-3">
              {isOnline ? "🟢" : "🔴"}
            </h2>
          </div>
        </div>
        <div className="relative right-9">
          <h1 className="text-xl">{selectedConversation?.firstName}</h1>
          <span className="text-sm">{isOnline ? "Online" : "Offline"}</span>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
