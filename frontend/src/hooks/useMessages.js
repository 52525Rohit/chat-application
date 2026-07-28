import { useCallback, useEffect, useState } from "react";
import useConversation from "../store/useConversationStore";
import { getMessages } from "../api/messageApi";

const useMessages = () => {
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const {
    messages,
    setMessage,
    prependMessages,
    selectedConversation,
    hasMore,
    setHasMore,
  } = useConversation();

  useEffect(() => {
    if (!selectedConversation?.id) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const data = await getMessages(selectedConversation.id);
        setMessage(data.messages || []);
        setHasMore(Boolean(data.hasMore));
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedConversation, setMessage, setHasMore]);

  const loadOlder = useCallback(async () => {
    if (!selectedConversation?.id || loadingMore || !hasMore) return;
    const oldestId = messages[0]?.message_id;
    if (!oldestId) return;

    setLoadingMore(true);
    try {
      const data = await getMessages(selectedConversation.id, { before: oldestId });
      prependMessages(data.messages || []);
      setHasMore(Boolean(data.hasMore));
    } catch (error) {
      console.error("Error fetching older messages:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [selectedConversation, loadingMore, hasMore, messages, prependMessages, setHasMore]);

  return { loading, messages, loadingMore, hasMore, loadOlder };
};

export default useMessages;
