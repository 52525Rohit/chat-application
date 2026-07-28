import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthProvider";
import { API_URL } from "../api/axiosClient";
import { getToken } from "../utils/authStorage";

const socketContext = createContext();

export const useSocketContext = () => {
  return useContext(socketContext);
};

const SOCKET_URL = API_URL.replace(/\/api\/?$/, "");

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [authUser] = useAuth();

  useEffect(() => {
    const token = getToken();
    if (!authUser?.employeeData?.id || !token) {
      setSocket((prev) => {
        prev?.close();
        return null;
      });
      return;
    }

    const newSocket = io(SOCKET_URL, {
      auth: { token },
    });
    setSocket(newSocket);
    newSocket.on("getOnlineUsers", (users) => setOnlineUsers(users));
    newSocket.on("connect_error", (err) =>
      console.error("Socket connection failed:", err.message)
    );

    return () => newSocket.close();
  }, [authUser]);

  return (
    <socketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </socketContext.Provider>
  );
};
