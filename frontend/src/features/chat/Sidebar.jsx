import React from "react";
import { BsChat } from "react-icons/bs";
import SearchBar from "./SearchBar";
import ConversationList from "./ConversationList";
import LogoutButton from "./LogoutButton";

function Sidebar() {
  return (
    <div className="flex h-full w-full flex-col border-r border-surface-2 bg-surface text-white">
      <div className="flex shrink-0 items-center justify-center gap-2.5 px-4 pt-4">
        <span className="flex size-9 items-center justify-center rounded-xl border-2 border-brand text-brand shadow-[0_0_12px_rgba(255,90,31,0.4)]">
          <BsChat size={17} />
        </span>
        <h1 className="text-xl font-bold">
          Chat<span className="text-brand">App</span>
        </h1>
      </div>
      <SearchBar />
      <ConversationList />
      <LogoutButton />
    </div>
  );
}

export default Sidebar;
