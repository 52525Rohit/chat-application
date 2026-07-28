import { create } from "zustand";

const useConversationStore = create((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation, messages: [], hasMore: true, typingUserId: null }),

  messages: [],
  setMessage: (messages) =>
    set((state) => ({
      messages:
        typeof messages === "function" ? messages(state.messages) : messages,
    })),
  prependMessages: (olderMessages) =>
    set((state) => ({ messages: [...olderMessages, ...state.messages] })),
  updateMessage: (messageId, updates) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.message_id === messageId ? { ...message, ...updates } : message,
      ),
    })),
  markMessagesReadFrom: (readerId) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.receiver_id === readerId ? { ...message, is_read: true } : message,
      ),
    })),

  hasMore: true,
  setHasMore: (hasMore) => set({ hasMore }),

  typingUserId: null,
  setTypingUserId: (typingUserId) => set({ typingUserId }),
}));

export default useConversationStore;
