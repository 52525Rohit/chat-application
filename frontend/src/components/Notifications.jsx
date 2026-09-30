import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { getProfilePicUrl } from "../api/axiosClient";

const profilePic = getProfilePicUrl;

const showNativeNotification = (message) => {
  if (Notification.permission === "granted") {
    const notification = new Notification(message.first_Name, {
      body: message.message_content,
      icon: profilePic(message.profilePic),
    });

    notification.onclick = () => {
      window.focus();
    };
  }
};

if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

const Notifications = (message) => {
  showNativeNotification(message);

  toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } pointer-events-auto flex w-[360px] max-w-[calc(100vw-2rem)] items-start gap-3 rounded-xl border border-brand border-l-4 bg-surface p-3.5 shadow-[0_0_18px_rgba(255,90,31,0.35)]`}
    >
      <img
        className="size-11 shrink-0 rounded-full object-cover ring-2 ring-brand/40"
        src={profilePic(message.profilePic)}
        alt=""
      />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-brand">
          New message
        </p>
        <p className="truncate text-sm font-semibold text-white">
          {message.first_Name}
        </p>
        <p className="mt-0.5 line-clamp-2 text-sm text-gray-400">
          {message.message_content || "Sent a photo"}
        </p>
      </div>
      <button
        onClick={() => toast.dismiss(t.id)}
        aria-label="Close notification"
        className="shrink-0 rounded-full p-1 text-gray-400 transition hover:bg-surface-3 hover:text-white"
      >
        <IoClose className="size-4" />
      </button>
    </div>
  ));
};

export default Notifications;
