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
      <h2 className="px-4 pb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
        Messages
      </h2>
      <div className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2 py-1">
        {otherUsers.map((user) => (
          <ConversationItem key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

export default ConversationList;
