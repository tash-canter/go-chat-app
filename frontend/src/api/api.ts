type AuthCredentials = {
  username: string;
  password: string;
};

type AuthResponse = {
  username: string;
  userID: number;
};

export const registerUser = async (
  credentials: AuthCredentials
): Promise<AuthResponse> => {
  const response = await fetch("http://localhost:8080/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Registration failed! Please check your credentials.");
  }

  return response.json();
};

export const loginUser = async (
  credentials: AuthCredentials
): Promise<AuthResponse> => {
  const response = await fetch("http://localhost:8080/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Login failed! Please check your credentials.");
  }

  return response.json();
};

export const fetchMessages = async (recipientId: number | null) => {
  if (!recipientId) return [];

  try {
    const response = await fetch(
      `http://localhost:8080/api/hydratePrivateMessages?recipient_id=${recipientId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }

    const data = await response.json();
    return data.privateMessages || [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export const fetchUsers = async (query: string) => {
  const response = await fetch(
    `http://localhost:8080/api/searchUsers?username=${query}`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
};
