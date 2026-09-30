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
    <div className="flex min-h-0 flex-1 flex-col">
      <h1 className="mx-3 rounded-md bg-surface-2 px-4 py-2 font-semibold text-white">
        Messages
      </h1>
      <div className="min-h-0 flex-1 overflow-y-auto py-2">
        {otherUsers.map((user) => (
          <ConversationItem key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

export default ConversationList;
