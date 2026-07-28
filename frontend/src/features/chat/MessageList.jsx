import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import useMessages from "../../hooks/useMessages";
import Loading from "../../components/Loading";

function MessageList() {
  const { loading, messages, loadingMore, hasMore, loadOlder } = useMessages();
  const containerRef = useRef();
  const lastMsgRef = useRef();
  const prevScrollHeightRef = useRef(0);
  const isLoadingOlderRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;

    if (isLoadingOlderRef.current) {
      isLoadingOlderRef.current = false;
      if (container) {
        container.scrollTop = container.scrollHeight - prevScrollHeightRef.current;
      }
      return;
    }

    const timer = setTimeout(() => {
      lastMsgRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container || loadingMore || !hasMore) return;

    if (container.scrollTop < 80) {
      prevScrollHeightRef.current = container.scrollHeight;
      isLoadingOlderRef.current = true;
      loadOlder();
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="min-h-0 flex-1 overflow-y-auto"
    >
      {loading && <Loading />}
      {loadingMore && (
        <p className="text-center text-xs text-gray-400 py-2">
          Loading older messages...
        </p>
      )}

      {!loading &&
        messages.map((message, index) => (
          <div
            key={message.message_id ?? index}
            ref={index === messages.length - 1 ? lastMsgRef : null}
          >
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
