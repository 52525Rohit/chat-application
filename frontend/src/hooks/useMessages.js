import { useEffect, useState } from "react";
import useConversation from "../store/useConversationStore";
import { getMessages } from "../api/messageApi";

const useMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessage, selectedConversation } = useConversation();

  useEffect(() => {
    if (!selectedConversation?.id) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const data = await getMessages(selectedConversation.id);
        setMessage(data.messages || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedConversation, setMessage]);

  return { loading, messages };
};

export default useMessages;
