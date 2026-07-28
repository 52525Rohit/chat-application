import { useEffect, useState } from "react";
import { getAllUsers } from "../api/userApi";

function useGetAllUsers() {
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        setAllUsers(response.users || []);
      } catch (error) {
        console.error("Error in useGetAllUsers:", error);
      }
    };
    fetchUsers();
  }, []);

  return [allUsers];
}

export default useGetAllUsers;
