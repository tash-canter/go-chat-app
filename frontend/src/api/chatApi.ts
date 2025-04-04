export interface Conversation {
  conversationId: number;
  lastMessage: string | null;
  lastMessageAt: Date | null;
  isGroup: boolean;
  unreadCount: number;
  displayName: string;
  recipientId?: number;
}

export interface User {
  userId: number;
  username: string;
}

export const fetchUsers = async (query: string, jwt: string | null) => {
  const response = await fetch(
    `http://localhost:8080/api/searchUsers?username=${query}`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`, // Pass JWT as a Bearer token in the Authorization header
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  const data = await response.json();
  if (!Array.isArray(data.users)) {
    throw new Error("Invalid response format: expected an array of users");
  }
  const users: User[] = data.users.map((user: User) => ({
    userId: user.userId,
    username: user.username,
  }));
  return users;
};

export const addConversation = async (
  jwt: string | null,
  recipientId: number,
  setConversationId: (id: number) => void
) => {
  const response = await fetch(`http://localhost:8080/api/conversations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`, // Pass JWT as a Bearer token in the Authorization header
    },
    body: JSON.stringify({
      recipientIds: [recipientId],
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  const data = await response.json();
  setConversationId(data.conversationId);
};

export const hydrateConversations = async (
  jwt: string | null,
  setConversations: (conversations: Conversation[]) => void
) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/conversations/hydrate`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    const data = await response.json();
    const conversations: Conversation[] = data.conversations.map(
      (conv: any) => ({
        conversationId: conv.conversationId,
        lastMessage: conv.lastMessage || null,
        lastMessageAt: conv.lastMessageAt ? new Date(conv.lastMessageAt) : null,
        isGroup: conv.isGroup,
        unreadCount: conv.unreadCount,
        displayName: conv.displayName,
      })
    );
    setConversations(conversations);
  } catch (error) {
    throw new Error("Failed to fetch conversations");
  }
};
