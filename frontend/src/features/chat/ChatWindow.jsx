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
    <div className="flex h-screen w-full flex-col bg-slate-900 text-gray-300 z-30">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          <ChatHeader />
          <MessageList />
          <MessageInput />
        </>
      )}
    </div>
  );
}

export default ChatWindow;
