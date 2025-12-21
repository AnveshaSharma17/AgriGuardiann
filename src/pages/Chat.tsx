import { useState, useRef, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  Send,
  Bot,
  User,
  Loader2,
  Bug,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Plus,
  MessageSquare,
  Menu,
  X,
  Trash2,
  Edit2,
  Pin,
  MoreVertical,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
  sendChatMessageStream,
  getUserConversations,
  getConversation,
  createConversation,
  deleteConversation,
  updateConversation,
} from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  likelyPests?: Array<{ name: string; confidence: number }>;
  actions?: string[];
  warnings?: string[];
  followUpQuestions?: string[];
  created_at?: string;
}

interface Conversation {
  id: string;
  title: string;
  last_message_at: string;
  message_count: number;
  pinned?: boolean;
}

const Chat = () => {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [editingConversationId, setEditingConversationId] = useState<
    string | null
  >(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Handle URL parameter changes
  useEffect(() => {
    const chatId = searchParams.get("id");
    if (chatId && chatId !== currentConversationId) {
      loadConversation(chatId);
    }
  }, [searchParams]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!openMenuId) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Close if clicking outside menu button or dropdown
      if (
        !target.closest(".menu-button") &&
        !target.closest(".menu-dropdown")
      ) {
        closeMenu();
      }
    };

    // Add listener on next tick to avoid immediate triggering
    const timer = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openMenuId]);

  const loadConversations = async () => {
    setIsLoadingConversations(true);
    try {
      const data = await getUserConversations(20, 0);
      console.log("Loaded conversations:", data);
      setConversations(data.conversations || []);

      // Auto-select first conversation if available and no URL param
      const chatId = searchParams.get("id");
      if (chatId) {
        await loadConversation(chatId);
      } else if (
        data.conversations &&
        data.conversations.length > 0 &&
        !currentConversationId
      ) {
        await loadConversation(data.conversations[0].id);
      } else if (!data.conversations || data.conversations.length === 0) {
        // No conversations, show welcome message
        setMessages([
          {
            id: "welcome",
            role: "assistant",
            content: t("chat.welcome"),
            followUpQuestions: [
              t("chat.followUp1"),
              t("chat.followUp2"),
              t("chat.followUp3"),
            ],
          },
        ]);
      }
    } catch (error: any) {
      console.error("Failed to load conversations:", error);
      // Show welcome message on error
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: t("chat.welcome"),
          followUpQuestions: [
            t("chat.followUp1"),
            t("chat.followUp2"),
            t("chat.followUp3"),
          ],
        },
      ]);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const loadConversation = async (id: string) => {
    setIsLoadingMessages(true);
    try {
      console.log("Loading conversation:", id);
      const data = await getConversation(id);
      console.log("Conversation data:", data);
      setCurrentConversationId(id);

      // Update URL parameter
      setSearchParams({ id });

      // Convert messages to UI format
      const formattedMessages: Message[] = (data.messages || []).map(
        (msg: any) => ({
          id: msg.id || msg._id,
          role: msg.role,
          content: msg.content,
          likelyPests: msg.metadata?.likelyPests || [],
          actions: msg.metadata?.actions || [],
          warnings: msg.metadata?.warnings || [],
          followUpQuestions: msg.metadata?.followUpQuestions || [],
          created_at: msg.created_at,
        })
      );

      console.log("Formatted messages:", formattedMessages);
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Failed to load conversation:", error);
      setSendError("Failed to load conversation. Please try again.");
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleNewConversation = async () => {
    setIsCreatingConversation(true);
    try {
      const data = await createConversation({
        language: i18n.language,
      });
      setCurrentConversationId(data.conversation.id);

      // Update URL parameter for new conversation
      setSearchParams({ id: data.conversation.id });

      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: t("chat.welcome"),
          followUpQuestions: [
            t("chat.followUp1"),
            t("chat.followUp2"),
            t("chat.followUp3"),
          ],
        },
      ]);
      await loadConversations();
    } catch (error) {
      console.error("Failed to create conversation:", error);
      setSendError("Failed to create conversation. Please try again.");
    } finally {
      setIsCreatingConversation(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput("");
    setIsLoading(true);
    setSendError(null);

    // Create a temporary assistant message for streaming
    const tempAssistantId = (Date.now() + 1).toString();
    const tempAssistantMessage: Message = {
      id: tempAssistantId,
      role: "assistant",
      content: "",
    };
    setMessages((prev) => [...prev, tempAssistantMessage]);

    try {
      const context = {
        language: i18n.language,
        location: "Punjab, India",
      };

      let streamedContent = "";
      let receivedMetadata: any = null;

      console.log("Starting stream request...");

      await sendChatMessageStream(
        currentInput,
        currentConversationId,
        context,
        // onChunk
        (chunk: string) => {
          console.log("Received chunk:", chunk);
          streamedContent += chunk;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempAssistantId
                ? { ...msg, content: streamedContent }
                : msg
            )
          );
        },
        // onReplaceContent - Replace raw JSON with parsed reply
        (content: string) => {
          console.log("Replacing content with parsed reply:", content);
          streamedContent = content;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempAssistantId ? { ...msg, content: content } : msg
            )
          );
        },
        // onMetadata
        (metadata: any) => {
          console.log("Received metadata:", metadata);
          receivedMetadata = metadata;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempAssistantId
                ? {
                  ...msg,
                  likelyPests: metadata.likelyPests || [],
                  actions: metadata.actions || [],
                  warnings: metadata.warnings || [],
                  followUpQuestions: metadata.followUpQuestions || [],
                }
                : msg
            )
          );
        },
        // onConversationId
        (convId: string) => {
          console.log("Received conversation ID:", convId);
          if (!currentConversationId) {
            setCurrentConversationId(convId);
            setSearchParams({ id: convId });
            loadConversations(); // Refresh conversation list
          }
        },
        // onError
        (error: string) => {
          console.error("Stream error:", error);
          setSendError(error);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempAssistantId
                ? {
                  ...msg,
                  content: `I'm having trouble connecting right now. Error: ${error}. Please try again.`,
                }
                : msg
            )
          );
        },
        // onDone
        () => {
          console.log("Stream complete");
          setIsLoading(false);
        }
      );
    } catch (error: any) {
      console.error("Failed to send message:", error);

      const errorMsg = error.message || "Failed to send message";
      setSendError(errorMsg);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempAssistantId
            ? {
              ...msg,
              content: `I'm having trouble connecting right now. Error: ${errorMsg}. Please try again.`,
            }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionClick = (question: string) => {
    setInput(question);
  };

  const handleDeleteConversation = async (
    id: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    if (!confirm("Are you sure you want to delete this conversation?")) return;

    // Close menu immediately
    closeMenu();

    try {
      await deleteConversation(id);

      // Get remaining conversations
      const remainingConversations = conversations.filter(
        (conv) => conv.id !== id
      );

      // Update conversations list
      setConversations(remainingConversations);

      // If deleted conversation was current, handle navigation
      if (currentConversationId === id) {
        if (remainingConversations.length > 0) {
          // Load first available conversation
          await loadConversation(remainingConversations[0].id);
        } else {
          // No more conversations, clear and show welcome
          setCurrentConversationId(null);
          setSearchParams({});
          setMessages([
            {
              id: "welcome",
              role: "assistant",
              content: t("chat.welcome"),
              followUpQuestions: [
                t("chat.followUp1"),
                t("chat.followUp2"),
                t("chat.followUp3"),
              ],
            },
          ]);
        }
      }
    } catch (error: any) {
      console.error("Failed to delete conversation:", error);
      const errorMsg =
        error.response?.data?.error ||
        error.message ||
        "Failed to delete conversation. Please try again.";
      alert(errorMsg);
    }
  };

  const handleStartEdit = (conv: Conversation, event: React.MouseEvent) => {
    event.stopPropagation();
    closeMenu();
    setEditingConversationId(conv.id);
    setEditingTitle(conv.title);
  };

  const handleSaveEdit = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!editingTitle.trim()) return;

    try {
      await updateConversation(id, { title: editingTitle });
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === id ? { ...conv, title: editingTitle } : conv
        )
      );
      setEditingConversationId(null);
      setEditingTitle("");
    } catch (error) {
      console.error("Failed to update conversation:", error);
      alert("Failed to update conversation title.");
    }
  };

  const handleCancelEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    setEditingConversationId(null);
    setEditingTitle("");
  };

  const handleTogglePin = async (
    conv: Conversation,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    closeMenu();

    try {
      await updateConversation(conv.id, { pinned: !conv.pinned } as any);
      setConversations((prev) => {
        const updated = prev.map((c) =>
          c.id === conv.id ? { ...c, pinned: !c.pinned } : c
        );
        // Sort: pinned first, then by last_message_at
        return updated.sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return (
            new Date(b.last_message_at).getTime() -
            new Date(a.last_message_at).getTime()
          );
        });
      });
    } catch (error) {
      console.error("Failed to toggle pin:", error);
      alert("Failed to pin/unpin conversation.");
    }
  };

  const toggleMenu = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenMenuId((prevId) => (prevId === id ? null : id));
  };

  const closeMenu = () => {
    setOpenMenuId(null);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Conversation Sidebar */}
      <div
        className={`${showSidebar ? "w-80" : "w-0"
          } transition-all duration-300 bg-card border-r border-border flex flex-col overflow-hidden`}
      >
        <div className="p-4 border-b border-border">
          <Button
            onClick={handleNewConversation}
            disabled={isCreatingConversation}
            className="w-full bg-[#c8e64a] text-black hover:bg-[#b8d63a] disabled:opacity-50"
          >
            {isCreatingConversation ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                New Chat
              </>
            )}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {isLoadingConversations ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              No conversations yet.
              <br />
              Start a new chat!
            </div>
          ) : (
            conversations.map((conv) => (
              <div key={conv.id} className="relative group mb-2">
                <div
                  onClick={(e) => {
                    // Only load if not editing this conversation
                    if (editingConversationId === conv.id) {
                      return;
                    }
                    // Don't trigger if clicking menu button or menu itself
                    const target = e.target as HTMLElement;
                    if (
                      target.closest(".menu-button") ||
                      target.closest(".menu-dropdown")
                    ) {
                      return;
                    }
                    loadConversation(conv.id);
                  }}
                  className={`w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer ${currentConversationId === conv.id
                      ? "bg-green-50 border border-green-200"
                      : "border border-transparent"
                    }`}
                >
                  <div className="flex items-start gap-2">
                    <div className="flex items-center gap-1">
                      {conv.pinned && (
                        <Pin className="h-3 w-3 text-green-600 fill-green-600" />
                      )}
                      <MessageSquare className="h-4 w-4 mt-1 flex-shrink-0 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      {editingConversationId === conv.id ? (
                        <div
                          className="flex gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Input
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            className="h-7 text-sm"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter")
                                handleSaveEdit(conv.id, e as any);
                              if (e.key === "Escape")
                                handleCancelEdit(e as any);
                            }}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={(e) => handleSaveEdit(conv.id, e)}
                          >
                            ✓
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={handleCancelEdit}
                          >
                            ✕
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="font-medium text-sm text-gray-900 truncate">
                            {conv.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {conv.message_count} messages
                          </div>
                        </>
                      )}
                    </div>
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity menu-button"
                        onClick={(e) => toggleMenu(conv.id, e)}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                      {openMenuId === conv.id && (
                        <div
                          className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 min-w-[140px] menu-dropdown"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => handleTogglePin(conv, e)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Pin className="h-4 w-4" />
                            {conv.pinned ? "Unpin" : "Pin"}
                          </button>
                          <button
                            onClick={(e) => handleStartEdit(conv, e)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Edit2 className="h-4 w-4" />
                            Rename
                          </button>
                          <button
                            onClick={(e) =>
                              handleDeleteConversation(conv.id, e)
                            }
                            className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                {showSidebar ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>

              <Link to="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Bot className="h-6 w-6 text-green-600" />
                  {t("chat.title")}
                </h1>
                <p className="text-sm text-gray-500">{t("chat.subtitle")}</p>
              </div>
            </div>

            <LanguageSwitcher />
          </div>
        </div>

        {/* Scrollable Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {isLoadingMessages ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-green-600 animate-spin mb-4" />
              <p className="text-gray-600 font-medium">
                Loading conversation...
              </p>
              <p className="text-gray-400 text-sm mt-1">Please wait</p>
            </div>
          ) : messages.length === 0 && !isLoadingConversations ? (
            <div className="text-center py-12">
              <Bot className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">
                Start a conversation with your AI farming assistant
              </p>
              <Button
                onClick={handleNewConversation}
                disabled={isCreatingConversation}
                className="bg-green-600 hover:bg-green-700"
              >
                {isCreatingConversation ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Start New Chat"
                )}
              </Button>
            </div>
          ) : null}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 animate-fade-in ${message.role === "user" ? "justify-end" : "justify-start"
                }`}
            >
              {message.role === "assistant" && (
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-5 w-5 text-green-600" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl px-4 py-3 ${message.role === "user"
                    ? "bg-green-600 text-white"
                    : "bg-white shadow-sm border border-gray-100"
                  }`}
              >
                {message.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none prose-green">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ node, ...props }) => (
                          <p
                            className="leading-relaxed mb-2 last:mb-0"
                            {...props}
                          />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul
                            className="list-disc ml-4 mb-2 space-y-1"
                            {...props}
                          />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol
                            className="list-decimal ml-4 mb-2 space-y-1"
                            {...props}
                          />
                        ),
                        li: ({ node, ...props }) => (
                          <li className="leading-relaxed" {...props} />
                        ),
                        strong: ({ node, ...props }) => (
                          <strong
                            className="font-semibold text-gray-900"
                            {...props}
                          />
                        ),
                        em: ({ node, ...props }) => (
                          <em className="italic" {...props} />
                        ),
                        code: ({ node, inline, ...props }: any) =>
                          inline ? (
                            <code
                              className="bg-gray-100 px-1 py-0.5 rounded text-sm"
                              {...props}
                            />
                          ) : (
                            <code
                              className="block bg-gray-100 p-2 rounded text-sm overflow-x-auto"
                              {...props}
                            />
                          ),
                        h1: ({ node, ...props }) => (
                          <h1 className="text-xl font-bold mb-2" {...props} />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2 className="text-lg font-bold mb-2" {...props} />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3
                            className="text-base font-semibold mb-1"
                            {...props}
                          />
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                    {isLoading &&
                      message.id === messages[messages.length - 1]?.id && (
                        <span className="inline-block w-2 h-4 bg-green-600 animate-pulse ml-1"></span>
                      )}
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                )}

                {/* Likely Pests */}
                {message.likelyPests && message.likelyPests.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Bug className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-semibold text-gray-700">
                        {t("chat.likelyPests")}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {message.likelyPests.map((pest, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="bg-orange-50 text-orange-700 border border-orange-200"
                        >
                          {pest.name} ({Math.round(pest.confidence * 100)}%)
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                {message.actions && message.actions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-semibold text-gray-700">
                        {t("chat.recommendedActions")}
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {message.actions.map((action, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-600 flex items-start gap-2"
                        >
                          <ChevronRight className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Warnings */}
                {message.warnings && message.warnings.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-red-100">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-semibold text-red-700">
                        {t("chat.safetyWarnings")}
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {message.warnings.map((warning, idx) => (
                        <li key={idx} className="text-sm text-red-600">
                          • {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Follow-up Questions */}
                {message.followUpQuestions &&
                  message.followUpQuestions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <span className="text-sm font-semibold text-gray-700 block mb-2">
                        {t("chat.suggestedQuestions")}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {message.followUpQuestions.map((question, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuestionClick(question)}
                            className="text-xs h-auto py-1.5 px-3"
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {message.role === "user" && (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
              )}
            </div>
          ))}

          {isLoading &&
            messages.length > 0 &&
            !messages[messages.length - 1]?.content && (
              <div className="flex gap-4 animate-fade-in">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-green-600" />
                </div>
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex gap-2 items-center">
                    <div
                      className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                    <span className="text-sm text-gray-500 ml-2">
                      AI is thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}

          <div ref={messagesEndRef} />
        </div>

        {/* Fixed Input Footer */}
        <div className="border-t border-gray-200 bg-white px-6 py-4 flex-shrink-0">
          {sendError && (
            <div className="max-w-4xl mx-auto mb-2 p-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>{sendError}</span>
              <button
                onClick={() => setSendError(null)}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-3 max-w-4xl mx-auto"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("chat.inputPlaceholder")}
              className="flex-1 border-gray-300 focus:border-green-500 focus:ring-green-500"
              disabled={isLoading || isLoadingMessages}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading || isLoadingMessages}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 min-w-[44px]"
              title={isLoading ? "Sending message..." : "Send message"}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-2 text-center">
            {t("chat.disclaimer")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
