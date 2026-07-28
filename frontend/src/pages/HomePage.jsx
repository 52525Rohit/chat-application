import React from "react";
import Sidebar from "../features/chat/Sidebar";
import ChatWindow from "../features/chat/ChatWindow";
import useSocketMessages from "../hooks/useSocketMessages";

function HomePage() {
  useSocketMessages();

  return (
    <div className="drawer lg:drawer-open min-h-screen">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col sm:z-0 md:z-0 lg:z-50">
        <ChatWindow />
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="menu w-80 min-h-full bg-black text-base-content">
          <Sidebar />
        </ul>
      </div>
    </div>
  );
}

export default HomePage;
