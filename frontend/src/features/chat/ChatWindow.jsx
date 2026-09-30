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
    <div className="flex h-full min-h-0 w-full flex-col bg-base text-gray-300">
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
