import { useState, useRef, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
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
  Leaf,
  Wheat,
  Sun,
  Droplets,
  Shield,
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

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
};

const slideIn = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
};

// Quick action suggestions for Indian farmers
const quickActions = [
  { icon: "🐛", label: "Pest Identification", labelHi: "कीट पहचान", query: "Help me identify a pest on my crops" },
  { icon: "🌾", label: "Crop Disease", labelHi: "फसल रोग", query: "My plants have yellow leaves, what could be wrong?" },
  { icon: "💊", label: "Treatment Advice", labelHi: "उपचार सलाह", query: "What is the best organic treatment for aphids?" },
  { icon: "📅", label: "Spray Schedule", labelHi: "छिड़काव अनुसूची", query: "When should I spray pesticides on my wheat crop?" },
  { icon: "🌧️", label: "Weather & Pests", labelHi: "मौसम और कीट", query: "How does monsoon affect pest activity?" },
  { icon: "🔬", label: "IPM Methods", labelHi: "आईपीएम विधियाँ", query: "Explain Integrated Pest Management for rice" },
];

const Chat = () => {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [editingConversationId, setEditingConversationId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isHindi = i18n.language === 'hi';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    const chatId = searchParams.get("id");
    if (chatId && chatId !== currentConversationId) {
      loadConversation(chatId);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!openMenuId) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".menu-button") && !target.closest(".menu-dropdown")) {
        closeMenu();
      }
    };

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
      setConversations(data.conversations || []);

      const chatId = searchParams.get("id");
      if (chatId) {
        await loadConversation(chatId);
      } else if (data.conversations && data.conversations.length > 0 && !currentConversationId) {
        await loadConversation(data.conversations[0].id);
      } else if (!data.conversations || data.conversations.length === 0) {
        setMessages([{
          id: "welcome",
          role: "assistant",
          content: isHindi
            ? "🙏 नमस्ते! मैं **कृषि रक्षक AI** हूं, भारतीय किसानों के लिए आपका कृषि सहायक।\n\nमैं मदद कर सकता हूं:\n- 🐛 कीट पहचान\n- 🌾 फसल रोग निदान\n- 💊 उपचार सलाह\n- 📅 छिड़काव अनुसूची\n\nआप हिंदी या English में पूछ सकते हैं!"
            : "🙏 Namaste! I'm **KrishiRakshak AI**, your agricultural assistant for Indian farmers.\n\nI can help with:\n- 🐛 Pest identification\n- 🌾 Crop disease diagnosis\n- 💊 Treatment advice (IPM approach)\n- 📅 Spray scheduling\n\nआप हिंदी में भी पूछ सकते हैं!",
          followUpQuestions: [
            isHindi ? "मेरी फसल पर कीट हैं, मदद करें" : "Help identify pests on my wheat crop",
            isHindi ? "जैविक उपचार बताएं" : "What are organic pest control options?",
            isHindi ? "IPM क्या है?" : "Explain Integrated Pest Management",
          ],
        }]);
      }
    } catch (error: any) {
      setMessages([{
        id: "welcome",
        role: "assistant",
        content: isHindi
          ? "🙏 नमस्ते! मैं कृषि रक्षक AI हूं। आपकी क्या मदद करूं?"
          : "🙏 Namaste! I'm KrishiRakshak AI. How can I help you today?",
        followUpQuestions: [
          isHindi ? "कीट पहचान में मदद करें" : "Help me identify a pest",
          isHindi ? "उपचार सलाह दें" : "Suggest treatment options",
        ],
      }]);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const loadConversation = async (id: string) => {
    setIsLoadingMessages(true);
    try {
      const data = await getConversation(id);
      setCurrentConversationId(id);
      setSearchParams({ id });

      const formattedMessages: Message[] = (data.messages || []).map((msg: any) => ({
        id: msg.id || msg._id,
        role: msg.role,
        content: msg.content,
        likelyPests: msg.metadata?.likelyPests || [],
        actions: msg.metadata?.actions || [],
        warnings: msg.metadata?.warnings || [],
        followUpQuestions: msg.metadata?.followUpQuestions || [],
        created_at: msg.created_at,
      }));

      setMessages(formattedMessages);
    } catch (error) {
      setSendError("Failed to load conversation. Please try again.");
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleNewConversation = async () => {
    setIsCreatingConversation(true);
    try {
      const data = await createConversation({ language: i18n.language });
      setCurrentConversationId(data.conversation.id);
      setSearchParams({ id: data.conversation.id });

      setMessages([{
        id: "welcome",
        role: "assistant",
        content: isHindi
          ? "🙏 नई बातचीत शुरू! मैं कृषि रक्षक AI हूं। आपकी क्या मदद करूं?"
          : "🙏 New conversation started! I'm KrishiRakshak AI. How can I help you?",
        followUpQuestions: [
          isHindi ? "कीट की पहचान करें" : "Identify a pest for me",
          isHindi ? "फसल रोग के बारे में पूछें" : "Ask about crop diseases",
        ],
      }]);
      await loadConversations();
    } catch (error) {
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

      await sendChatMessageStream(
        currentInput,
        currentConversationId,
        context,
        (chunk: string) => {
          streamedContent += chunk;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempAssistantId ? { ...msg, content: streamedContent } : msg
            )
          );
        },
        (content: string) => {
          streamedContent = content;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempAssistantId ? { ...msg, content: content } : msg
            )
          );
        },
        (metadata: any) => {
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
        (convId: string) => {
          if (!currentConversationId) {
            setCurrentConversationId(convId);
            setSearchParams({ id: convId });
            loadConversations();
          }
        },
        (error: string) => {
          setSendError(error);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempAssistantId
                ? {
                  ...msg,
                  content: isHindi
                    ? `माफ करें, कुछ समस्या हुई। कृपया पुनः प्रयास करें।`
                    : `I'm having trouble connecting. Please try again.`,
                }
                : msg
            )
          );
        },
        () => {
          setIsLoading(false);
        }
      );
    } catch (error: any) {
      const errorMsg = error.message || "Failed to send message";
      setSendError(errorMsg);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempAssistantId
            ? {
              ...msg,
              content: isHindi
                ? `माफ करें, कुछ समस्या हुई। पुनः प्रयास करें।`
                : `Sorry, something went wrong. Please try again.`,
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

  const handleQuickAction = (query: string) => {
    setInput(query);
  };

  const handleDeleteConversation = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!confirm(isHindi ? "क्या आप इस बातचीत को हटाना चाहते हैं?" : "Delete this conversation?")) return;

    closeMenu();

    try {
      await deleteConversation(id);
      const remainingConversations = conversations.filter((conv) => conv.id !== id);
      setConversations(remainingConversations);

      if (currentConversationId === id) {
        if (remainingConversations.length > 0) {
          await loadConversation(remainingConversations[0].id);
        } else {
          setCurrentConversationId(null);
          setSearchParams({});
          setMessages([{
            id: "welcome",
            role: "assistant",
            content: isHindi ? "🙏 नमस्ते! नई बातचीत शुरू करें।" : "🙏 Namaste! Start a new conversation.",
            followUpQuestions: [],
          }]);
        }
      }
    } catch (error: any) {
      alert(error.response?.data?.error || error.message || "Failed to delete");
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
        prev.map((conv) => (conv.id === id ? { ...conv, title: editingTitle } : conv))
      );
      setEditingConversationId(null);
      setEditingTitle("");
    } catch (error) {
      alert("Failed to update conversation title.");
    }
  };

  const handleCancelEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    setEditingConversationId(null);
    setEditingTitle("");
  };

  const handleTogglePin = async (conv: Conversation, event: React.MouseEvent) => {
    event.stopPropagation();
    closeMenu();

    try {
      await updateConversation(conv.id, { pinned: !conv.pinned } as any);
      setConversations((prev) => {
        const updated = prev.map((c) =>
          c.id === conv.id ? { ...c, pinned: !c.pinned } : c
        );
        return updated.sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime();
        });
      });
    } catch (error) {
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
    <div className="h-screen flex overflow-hidden bg-[#FAF4EA]">
      {/* Conversation Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: showSidebar ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        className={`${showSidebar ? "w-80" : "w-0"} bg-white border-r border-gray-200 flex flex-col overflow-hidden absolute md:relative z-20 h-full`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-[#B9F261]/20 to-[#FFD24A]/10">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleNewConversation}
              disabled={isCreatingConversation}
              className="w-full bg-[#B9F261] text-[#0B0B0B] hover:bg-[#a8e050] rounded-full font-semibold gap-2 h-11"
            >
              {isCreatingConversation ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isHindi ? "बना रहे हैं..." : "Creating..."}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  {isHindi ? "नई बातचीत" : "New Chat"}
                </>
              )}
            </Button>
          </motion.div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-3">
          {isLoadingConversations ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-[#B9F261]" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-[#B9F261]/20 flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-8 h-8 text-[#B9F261]" />
              </div>
              <p className="text-gray-500 text-sm">
                {isHindi ? "कोई बातचीत नहीं है।" : "No conversations yet."}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                {isHindi ? "नई चैट शुरू करें!" : "Start a new chat!"}
              </p>
            </div>
          ) : (
            conversations.map((conv) => (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative group mb-2"
              >
                <div
                  onClick={(e) => {
                    if (editingConversationId === conv.id) return;
                    const target = e.target as HTMLElement;
                    if (target.closest(".menu-button") || target.closest(".menu-dropdown")) return;
                    loadConversation(conv.id);
                  }}
                  className={`w-full text-left p-3 rounded-xl hover:bg-[#B9F261]/10 transition-all cursor-pointer ${currentConversationId === conv.id
                      ? "bg-[#B9F261]/20 border-2 border-[#B9F261]"
                      : "border-2 border-transparent"
                    }`}
                >
                  <div className="flex items-start gap-2">
                    <div className="flex items-center gap-1">
                      {conv.pinned && <Pin className="h-3 w-3 text-[#B9F261] fill-[#B9F261]" />}
                      <MessageSquare className="h-4 w-4 mt-1 flex-shrink-0 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      {editingConversationId === conv.id ? (
                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                          <Input
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            className="h-7 text-sm rounded-lg"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveEdit(conv.id, e as any);
                              if (e.key === "Escape") handleCancelEdit(e as any);
                            }}
                          />
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={(e) => handleSaveEdit(conv.id, e)}>✓</Button>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={handleCancelEdit}>✕</Button>
                        </div>
                      ) : (
                        <>
                          <div className="font-medium text-sm text-[#0B0B0B] truncate">{conv.title}</div>
                          <div className="text-xs text-gray-400 mt-1">{conv.message_count} messages</div>
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
                          className="absolute right-0 top-8 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1 min-w-[140px] menu-dropdown"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button onClick={(e) => handleTogglePin(conv, e)} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                            <Pin className="h-4 w-4" />
                            {conv.pinned ? (isHindi ? "अनपिन" : "Unpin") : (isHindi ? "पिन" : "Pin")}
                          </button>
                          <button onClick={(e) => handleStartEdit(conv, e)} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                            <Edit2 className="h-4 w-4" />
                            {isHindi ? "नाम बदलें" : "Rename"}
                          </button>
                          <button onClick={(e) => handleDeleteConversation(conv.id, e)} className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2">
                            <Trash2 className="h-4 w-4" />
                            {isHindi ? "हटाएं" : "Delete"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-xl border-b border-gray-200 px-6 py-4 flex-shrink-0"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSidebar(!showSidebar)}
                className="rounded-xl"
              >
                {showSidebar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>

              <Link to="/dashboard">
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#B9F261] to-[#FFD24A] flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-[#0B0B0B]" />
                </div>
                <div>
                  <h1 className="text-xl font-display font-bold text-[#0B0B0B] flex items-center gap-2">
                    {isHindi ? "कृषि रक्षक AI" : "KrishiRakshak AI"}
                    <Sparkles className="h-4 w-4 text-[#FFD24A]" />
                  </h1>
                  <p className="text-sm text-gray-500">
                    {isHindi ? "भारतीय किसानों का कृषि सहायक" : "Agricultural Assistant for Indian Farmers"}
                  </p>
                </div>
              </div>
            </div>

            <LanguageSwitcher />
          </div>
        </motion.div>

        {/* Scrollable Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {isLoadingMessages ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full border-4 border-[#B9F261] border-t-transparent animate-spin mb-4" />
              <p className="text-gray-600 font-medium">
                {isHindi ? "लोड हो रहा है..." : "Loading conversation..."}
              </p>
            </div>
          ) : messages.length === 0 && !isLoadingConversations ? (
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="text-center py-12"
            >
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#B9F261] to-[#FFD24A] flex items-center justify-center mx-auto mb-6">
                <Leaf className="h-12 w-12 text-[#0B0B0B]" />
              </div>
              <h2 className="text-2xl font-display font-bold text-[#0B0B0B] mb-2">
                {isHindi ? "कृषि रक्षक AI में आपका स्वागत है!" : "Welcome to KrishiRakshak AI!"}
              </h2>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {isHindi
                  ? "मैं भारतीय किसानों के लिए कीट प्रबंधन और फसल सुरक्षा में विशेषज्ञ हूं।"
                  : "I specialize in pest management and crop protection for Indian farmers."}
              </p>
              <Button
                onClick={handleNewConversation}
                disabled={isCreatingConversation}
                className="bg-[#B9F261] text-[#0B0B0B] hover:bg-[#a8e050] rounded-full px-6"
              >
                {isCreatingConversation ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isHindi ? "नई चैट शुरू करें" : "Start New Chat"}
              </Button>
            </motion.div>
          ) : null}

          {/* Quick Actions - Show only when no messages or first welcome */}
          {messages.length <= 1 && messages[0]?.id === "welcome" && (
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="max-w-3xl mx-auto"
            >
              <p className="text-sm text-gray-500 text-center mb-3">
                {isHindi ? "जल्दी शुरू करें:" : "Quick actions:"}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {quickActions.map((action, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleQuickAction(action.query)}
                    className="flex items-center gap-2 p-3 rounded-xl bg-white border-2 border-gray-100 hover:border-[#B9F261] transition-all text-left"
                  >
                    <span className="text-xl">{action.icon}</span>
                    <span className="text-sm font-medium text-[#0B0B0B]">
                      {isHindi ? action.labelHi : action.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Messages */}
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#B9F261] to-[#a8e050] flex items-center justify-center flex-shrink-0">
                    <Leaf className="h-5 w-5 text-[#0B0B0B]" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl px-4 py-3 ${message.role === "user"
                      ? "bg-gradient-to-r from-[#B9F261] to-[#a8e050] text-[#0B0B0B]"
                      : "bg-white shadow-sm border border-gray-100"
                    }`}
                >
                  {message.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ node, ...props }) => <p className="leading-relaxed mb-2 last:mb-0 text-gray-700" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2 space-y-1" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2 space-y-1" {...props} />,
                          li: ({ node, ...props }) => <li className="leading-relaxed text-gray-700" {...props} />,
                          strong: ({ node, ...props }) => <strong className="font-semibold text-[#0B0B0B]" {...props} />,
                          em: ({ node, ...props }) => <em className="italic" {...props} />,
                          code: ({ node, inline, ...props }: any) =>
                            inline ? (
                              <code className="bg-[#B9F261]/20 px-1 py-0.5 rounded text-sm" {...props} />
                            ) : (
                              <code className="block bg-gray-100 p-2 rounded text-sm overflow-x-auto" {...props} />
                            ),
                          h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-2 text-[#0B0B0B]" {...props} />,
                          h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-2 text-[#0B0B0B]" {...props} />,
                          h3: ({ node, ...props }) => <h3 className="text-base font-semibold mb-1 text-[#0B0B0B]" {...props} />,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                      {isLoading && message.id === messages[messages.length - 1]?.id && (
                        <span className="inline-block w-2 h-4 bg-[#B9F261] animate-pulse ml-1"></span>
                      )}
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  )}

                  {/* Likely Pests */}
                  {message.likelyPests && message.likelyPests.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Bug className="h-4 w-4 text-amber-600" />
                        <span className="text-sm font-semibold text-gray-700">
                          {isHindi ? "संभावित कीट:" : "Likely Pests:"}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {message.likelyPests.map((pest, idx) => (
                          <Badge key={idx} className="bg-amber-100 text-amber-700 border border-amber-200">
                            {pest.name} ({Math.round(pest.confidence * 100)}%)
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {message.actions && message.actions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm font-semibold text-gray-700">
                          {isHindi ? "अनुशंसित कार्रवाई:" : "Recommended Actions:"}
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {message.actions.map((action, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                            <ChevronRight className="h-4 w-4 mt-0.5 text-[#B9F261] flex-shrink-0" />
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
                          {isHindi ? "सुरक्षा चेतावनी:" : "Safety Warnings:"}
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {message.warnings.map((warning, idx) => (
                          <li key={idx} className="text-sm text-red-600">• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Follow-up Questions */}
                  {message.followUpQuestions && message.followUpQuestions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <span className="text-sm font-semibold text-gray-700 block mb-2">
                        {isHindi ? "आगे पूछें:" : "Ask more:"}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {message.followUpQuestions.map((question, idx) => (
                          <motion.div key={idx} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuestionClick(question)}
                              className="text-xs h-auto py-1.5 px-3 rounded-full border-[#B9F261] text-[#0B0B0B] hover:bg-[#B9F261]/10"
                            >
                              {question}
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {message.role === "user" && (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD24A] to-amber-400 flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-[#0B0B0B]" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isLoading && messages.length > 0 && !messages[messages.length - 1]?.content && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#B9F261] to-[#a8e050] flex items-center justify-center">
                <Leaf className="h-5 w-5 text-[#0B0B0B]" />
              </div>
              <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
                <div className="flex gap-2 items-center">
                  <div className="w-2 h-2 bg-[#B9F261] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-[#B9F261] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-[#B9F261] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  <span className="text-sm text-gray-500 ml-2">
                    {isHindi ? "सोच रहा हूं..." : "Thinking..."}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Fixed Input Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-gray-200 bg-white/90 backdrop-blur-xl px-6 py-4 flex-shrink-0"
        >
          {sendError && (
            <div className="max-w-4xl mx-auto mb-2 p-2 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>{sendError}</span>
              <button onClick={() => setSendError(null)} className="ml-auto text-red-400 hover:text-red-600">
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
              placeholder={isHindi ? "अपना सवाल यहां लिखें... (हिंदी / English)" : "Type your question here... (English / हिंदी)"}
              className="flex-1 border-gray-200 focus:border-[#B9F261] focus:ring-[#B9F261] rounded-xl h-12"
              disabled={isLoading || isLoadingMessages}
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                disabled={!input.trim() || isLoading || isLoadingMessages}
                className="bg-[#B9F261] hover:bg-[#a8e050] text-[#0B0B0B] disabled:opacity-50 min-w-[52px] h-12 rounded-xl"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </motion.div>
          </form>
          <p className="text-xs text-gray-400 mt-2 text-center">
            {isHindi
              ? "कृषि रक्षक AI • भारतीय किसानों के लिए • IPM आधारित सलाह"
              : "KrishiRakshak AI • For Indian Farmers • IPM-based advice"}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Chat;
