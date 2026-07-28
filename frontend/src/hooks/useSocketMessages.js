import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../store/useConversationStore";
import Notifications from "../components/Notifications";
import { getProfilePicUrl } from "../api/axiosClient";
import sound from "../assets/notification.mp3";

const useSocketMessages = () => {
  const { socket } = useSocketContext();
  const {
    setMessage,
    selectedConversation,
    updateMessage,
    markMessagesReadFrom,
    setTypingUserId,
  } = useConversation();

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (!msg) return;

      const {
        sender_id,
        receiver_id,
        message_content,
        images_url,
        message_id,
        timestamp,
        first_Name,
        last_Name,
        profilePic,
      } = msg;

      const isSameConversation =
        selectedConversation?.id != null &&
        Number(sender_id) === Number(selectedConversation.id);

      if (isSameConversation) {
        const newMessageData = {
          sender_id,
          receiver_id,
          message_content,
          images_url,
          message_id,
          timestamp,
          is_read: false,
          is_edited: false,
          is_deleted: false,
        };

        setMessage((prevMessages) => [...prevMessages, newMessageData]);

        setTimeout(() => {
          try {
            new Audio(sound).play();
          } catch (err) {
            console.error("Audio playback failed", err);
          }
        }, 2000);
      } else {
        if (Notification.permission === "granted") {
          const notify = new Notification(`${first_Name} ${last_Name}`, {
            body: message_content,
            icon: getProfilePicUrl(profilePic),
          });

          notify.onclick = () => {
            window.focus();
            notify.close();
          };
        }

        Notifications({ message_content, first_Name, last_Name, profilePic });
      }
    };

    const handleMessagesRead = ({ readerId }) => {
      markMessagesReadFrom(readerId);
    };

    const handleMessageEdited = (messageData) => {
      updateMessage(messageData.message_id, messageData);
    };

    const handleMessageDeleted = ({ message_id }) => {
      updateMessage(message_id, {
        is_deleted: true,
        message_content: null,
        images_url: null,
      });
    };

    const handleTyping = ({ from }) => {
      if (Number(from) === Number(selectedConversation?.id)) {
        setTypingUserId(from);
      }
    };

    const handleStopTyping = ({ from }) => {
      if (Number(from) === Number(selectedConversation?.id)) {
        setTypingUserId(null);
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messagesRead", handleMessagesRead);
    socket.on("messageEdited", handleMessageEdited);
    socket.on("messageDeleted", handleMessageDeleted);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messagesRead", handleMessagesRead);
      socket.off("messageEdited", handleMessageEdited);
      socket.off("messageDeleted", handleMessageDeleted);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [socket, setMessage, selectedConversation, updateMessage, markMessagesReadFrom, setTypingUserId]);
};

export default useSocketMessages;
