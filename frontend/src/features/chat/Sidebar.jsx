import React from "react";
import SearchBar from "./SearchBar";
import ConversationList from "./ConversationList";
import LogoutButton from "./LogoutButton";

function Sidebar() {
  return (
    <div className="w-full bg-black text-white">
      <SearchBar />

      <div
        className="flex-1 overflow-y-auto"
        style={{ minHeight: "calc(84vh - 10vh)" }}
      >
        <ConversationList />
      </div>
      <LogoutButton />
    </div>
  );
}

export default Sidebar;
