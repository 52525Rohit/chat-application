import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import useMessages from "../../hooks/useMessages";
import Loading from "../../components/Loading";

function MessageList() {
  const { loading, messages } = useMessages();
  const lastMsgRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      lastMsgRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  return (
    <div
      className="flex-1 overflow-y-auto"
      style={{ minHeight: "calc(92vh - 8vh)" }}
    >
      {loading && <Loading />}

      {!loading &&
        messages.map((message, index) => (
          <div key={message.message_id ?? index} ref={lastMsgRef}>
            <MessageBubble message={message} />
          </div>
        ))}

      {!loading && messages.length === 0 && (
        <p className="text-center mt-[20%]">
          Say! Hi to start the conversation
        </p>
      )}
    </div>
  );
}

export default MessageList;
