import React from "react";
import SearchBar from "./SearchBar";
import ConversationList from "./ConversationList";
import LogoutButton from "./LogoutButton";

function Sidebar() {
  return (
    <div className="flex h-full w-full flex-col bg-surface text-white">
      <SearchBar />
      <ConversationList />
      <LogoutButton />
    </div>
  );
}

export default Sidebar;
