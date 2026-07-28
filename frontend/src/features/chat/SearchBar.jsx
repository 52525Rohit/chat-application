import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import useGetAllUsers from "../../hooks/useGetAllUsers";
import useConversation from "../../store/useConversationStore";
import { getProfilePicUrl } from "../../api/axiosClient";
import defaultAvatar from "../../../public/user.jpg";

function SearchBar() {
  const [search, setSearch] = useState("");
  const [allUsers] = useGetAllUsers();
  const { setSelectedConversation } = useConversation();

  const filteredUsers = allUsers.filter((user) =>
    user.firstName?.toLowerCase().startsWith(search.toLowerCase()),
  );

  return (
    <div className="relative z-50 h-[10vh]">
      <div className="px-6 py-4">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex space-x-3">
            <label className="border-[1px] border-gray-700 bg-slate-900 rounded-lg p-3 flex items-center gap-2 w-[80%]">
              <input
                type="text"
                className="grow outline-none bg-transparent"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
            <button>
              <FaSearch className="text-5xl p-2 hover:bg-gray-600 rounded-full duration-300" />
            </button>
          </div>

          {search && (
            <ul className="bg-slate-800 mt-2 rounded-lg">
              {filteredUsers.map((user) => (
                <li
                  key={user.id}
                  className="flex space-x-4 p-2 hover:bg-slate-700 cursor-pointer rounded-lg z-50"
                  onClick={() => {
                    setSelectedConversation(user);
                    setSearch("");
                  }}
                >
                  <div>
                    <img
                      className="w-14 h-14 rounded-full object-cover"
                      src={getProfilePicUrl(user.profilePic) || defaultAvatar}
                      alt="Profile"
                    />
                  </div>
                  <span>{user.firstName}</span>
                </li>
              ))}
            </ul>
          )}
        </form>
      </div>
    </div>
  );
}
export default SearchBar;
