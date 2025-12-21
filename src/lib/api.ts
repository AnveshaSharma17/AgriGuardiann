import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH ====================

export const login = async (email: string, password: string) => {
  const response = await api.post("/api/auth/login", { email, password });
  return response.data;
};

export const register = async (
  email: string,
  password: string,
  name: string
) => {
  const response = await api.post("/api/auth/register", {
    email,
    password,
    name,
  });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

// ==================== CHAT CONVERSATIONS ====================

export const createConversation = async (data?: {
  title?: string;
  crop_context?: string;
  location?: string;
  language?: string;
}) => {
  const response = await api.post("/api/chat/conversations", data);
  return response.data;
};

export const getUserConversations = async (limit = 20, skip = 0) => {
  const response = await api.get("/api/chat/conversations", {
    params: { limit, skip },
  });
  return response.data;
};

export const getConversation = async (id: string) => {
  const response = await api.get(`/api/chat/conversations/${id}`);
  return response.data;
};

export const updateConversation = async (
  id: string,
  data: {
    title?: string;
    crop_context?: string;
    location?: string;
    pinned?: boolean;
  }
) => {
  const response = await api.patch(`/api/chat/conversations/${id}`, data);
  return response.data;
};

export const deleteConversation = async (id: string) => {
  const response = await api.delete(`/api/chat/conversations/${id}`);
  return response.data;
};

// ==================== CHAT MESSAGES ====================

export const sendChatMessage = async (
  message: string,
  conversationId?: string,
  context?: any
) => {
  const response = await api.post("/api/ai/chat", {
    message,
    conversation_id: conversationId,
    context,
  });
  return response.data;
};

// New streaming function for chat messages
export const sendChatMessageStream = async (
  message: string,
  conversationId: string | null,
  context: any,
  onChunk: (chunk: string) => void,
  onReplaceContent: (content: string) => void,
  onMetadata: (metadata: any) => void,
  onConversationId: (id: string) => void,
  onError: (error: string) => void,
  onDone: () => void
) => {
  const token = localStorage.getItem("token");
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  console.log("Sending stream request to:", `${API_BASE_URL}/api/ai/chat`);

  const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      message,
      conversation_id: conversationId,
      context,
    }),
  });

  console.log("Response status:", response.status);
  console.log(
    "Response headers:",
    Object.fromEntries(response.headers.entries())
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to send message");
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    throw new Error("No response body");
  }

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data.trim()) {
            console.log("Parsing SSE line:", data);
            try {
              const parsed = JSON.parse(data);
              console.log("Parsed SSE data:", parsed);

              if (parsed.type === "conversation_id") {
                onConversationId(parsed.conversation_id);
              } else if (parsed.type === "chunk") {
                onChunk(parsed.content);
              } else if (parsed.type === "replace_content") {
                onReplaceContent(parsed.content);
              } else if (parsed.type === "metadata") {
                onMetadata(parsed);
              } else if (parsed.type === "error") {
                onError(parsed.error);
              } else if (parsed.type === "done") {
                onDone();
              }
            } catch (e) {
              console.error("Failed to parse SSE data:", data, e);
            }
          }
        }
      }
    }
  } catch (error: any) {
    onError(error.message || "Stream reading failed");
  } finally {
    reader.releaseLock();
  }
};

export const saveMessage = async (
  conversationId: string,
  role: string,
  content: string,
  metadata?: any
) => {
  const response = await api.post(
    `/api/chat/conversations/${conversationId}/messages`,
    {
      role,
      content,
      metadata,
    }
  );
  return response.data;
};

// ==================== AI SERVICES ====================

export const identifyPestImage = async (imageBase64: string) => {
  const response = await api.post("/api/ai/identify-image", {
    image: imageBase64,
  });
  return response.data;
};

export const checkSymptoms = async (symptoms: any) => {
  const response = await api.post("/api/ai/check-symptoms", symptoms);
  return response.data;
};

// ==================== USER PROFILE ====================

export const getUserProfile = async () => {
  const response = await api.get("/api/user/profile");
  return response.data;
};

export const updateUserProfile = async (data: any) => {
  const response = await api.put("/api/user/profile", data);
  return response.data;
};

export default api;
