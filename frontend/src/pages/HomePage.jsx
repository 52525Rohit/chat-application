import React from "react";
import Sidebar from "../features/chat/Sidebar";
import ChatWindow from "../features/chat/ChatWindow";
import useSocketMessages from "../hooks/useSocketMessages";

function HomePage() {
  useSocketMessages();

  return (
    <div className="drawer lg:drawer-open h-dvh">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex h-dvh min-w-0 flex-col">
        <ChatWindow />
      </div>
      <div className="drawer-side z-40">
        <label
          htmlFor="my-drawer-2"
          aria-label="Close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="h-dvh w-[85vw] max-w-[22.5rem] bg-surface">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
