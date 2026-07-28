import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../store/useConversationStore";
import Notifications from "../components/Notifications";
import { getProfilePicUrl } from "../api/axiosClient";
import sound from "../assets/notification.mp3";

const useSocketMessages = () => {
  const { socket } = useSocketContext();
  const { setMessage, selectedConversation } = useConversation();

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

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, setMessage, selectedConversation]);
};

export default useSocketMessages;
