import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import useGetAllUsers from "../../hooks/useGetAllUsers";
import useConversation from "../../store/useConversationStore";
import { getProfilePicUrl } from "../../api/axiosClient";
import defaultAvatar from "../../../public/user.jpg";
import { closeDrawer } from "../../utils/drawer";

function SearchBar() {
  const [search, setSearch] = useState("");
  const [allUsers] = useGetAllUsers();
  const { setSelectedConversation } = useConversation();

  const filteredUsers = allUsers.filter((user) =>
    user.firstName?.toLowerCase().startsWith(search.toLowerCase()),
  );

  return (
    <div className="relative z-50 shrink-0 px-3 py-3">
      <form onSubmit={(e) => e.preventDefault()}>
        <label className="flex items-center gap-2 rounded-lg border border-surface-2 bg-base px-3 py-2.5 focus-within:border-brand">
          <FaSearch className="shrink-0 text-gray-400" />
          <input
            type="text"
            className="min-w-0 grow bg-transparent outline-none"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        {search && (
          <ul className="absolute inset-x-3 top-full mt-1 max-h-72 overflow-y-auto rounded-lg bg-surface-2 shadow-lg">
            {filteredUsers.length === 0 && (
              <li className="p-3 text-sm text-gray-400">No users found</li>
            )}
            {filteredUsers.map((user) => (
              <li
                key={user.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-surface-3"
                onClick={() => {
                  setSelectedConversation(user);
                  setSearch("");
                  closeDrawer();
                }}
              >
                <img
                  className="size-10 shrink-0 rounded-full object-cover"
                  src={getProfilePicUrl(user.profilePic) || defaultAvatar}
                  alt="Profile"
                />
                <span className="truncate">{user.firstName}</span>
              </li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );
}
export default SearchBar;
