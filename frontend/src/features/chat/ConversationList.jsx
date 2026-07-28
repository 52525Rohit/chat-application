import React from "react";
import ConversationItem from "./ConversationItem";
import useGetAllUsers from "../../hooks/useGetAllUsers";
import { useAuth } from "../../context/AuthProvider";

function ConversationList() {
  const [allUsers] = useGetAllUsers();
  const [authUser] = useAuth();

  const otherUsers = allUsers.filter(
    (user) => user.email !== authUser?.employeeData?.email
  );

  return (
    <div>
      <h1 className="px-8 py-2 text-white font-semibold bg-slate-800 rounded-md">
        Messages
      </h1>
      <div
        className="py-2 flex-1 overflow-y-auto"
        style={{ maxHeight: "calc(84vh - 10vh)" }}
      >
        {otherUsers.map((user) => (
          <ConversationItem key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

export default ConversationList;
