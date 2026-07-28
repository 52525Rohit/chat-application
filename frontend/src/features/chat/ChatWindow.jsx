import React, { useEffect } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import NoChatSelected from "./NoChatSelected";
import useConversation from "../../store/useConversationStore";

function ChatWindow() {
  const { selectedConversation, setSelectedConversation } = useConversation();

  useEffect(() => {
    setSelectedConversation(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full bg-slate-900 text-gray-300 z-30">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          <ChatHeader />
          <div
            className="flex-1 overflow-y-auto"
            style={{ maxHeight: "calc(92vh - 8vh)" }}
          >
            <MessageList />
          </div>
          <MessageInput />
        </>
      )}
    </div>
  );
}

export default ChatWindow;
