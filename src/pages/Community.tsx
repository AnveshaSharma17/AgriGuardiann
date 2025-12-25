import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Plus,
  MessageCircle,
  ThumbsUp,
  MapPin,
  CheckCircle,
  Loader2,
  Send,
  X,
  Trash2,
  Users,
  TrendingUp,
  Clock,
  Leaf,
  User,
  Heart,
  Reply,
  MoreHorizontal,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
};

interface Post {
  id: string;
  _id?: string;
  title: string;
  description: string | null;
  location: string | null;
  status: string | null;
  upvotes: number | null;
  crop_id: string | { id: string; name: string } | null;
  user_id: string | { _id?: string; id?: string; name?: string; location?: string };
  created_at: string;
  reply_count?: number;
  has_liked?: boolean;
}

interface Reply {
  id: string;
  _id?: string;
  message: string;
  user_id: string | { _id?: string; id?: string; name?: string; location?: string };
  created_at: string;
}

interface Crop {
  id: string;
  name: string;
}

// Helper to get author name from populated user_id
const getAuthorName = (userId: string | { _id?: string; id?: string; name?: string } | null | undefined): string | null => {
  if (!userId) return null;
  if (typeof userId === 'object' && userId.name) {
    return userId.name;
  }
  return null;
};

// Helper to get user ID string from user_id
const getUserIdString = (userId: string | { _id?: string; id?: string } | null | undefined): string | null => {
  if (!userId) return null;
  if (typeof userId === 'string') return userId;
  return userId._id || userId.id || null;
};

// Avatar colors based on first letter
const getAvatarColor = (name: string) => {
  const colors = [
    'from-[#B9F261] to-[#a8e050]',
    'from-[#FFD24A] to-amber-500',
    'from-sky-400 to-blue-500',
    'from-emerald-400 to-green-500',
    'from-violet-400 to-purple-500',
    'from-rose-400 to-pink-500',
    'from-orange-400 to-red-400',
    'from-cyan-400 to-teal-500',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const Community = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replies, setReplies] = useState<Record<string, Reply[]>>({});
  const [replyText, setReplyText] = useState("");
  const [formData, setFormData] = useState({ title: "", description: "", location: "", crop_id: "" });
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation();

  const getAuthToken = () => {
    const session = localStorage.getItem('session');
    if (session) {
      try {
        return JSON.parse(session).access_token;
      } catch {
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    fetchPosts();
    fetchCrops();
  }, [user]);

  const fetchPosts = async () => {
    try {
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      const token = getAuthToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_URL}/api/community/posts`, { headers });
      const data = await response.json();
      setPosts(data || []);
    } catch (error: any) {
      toast({ title: "Error loading posts", description: error.message, variant: "destructive" });
    }
    setIsLoading(false);
  };

  const fetchCrops = async () => {
    try {
      const response = await fetch(`${API_URL}/api/crops`);
      const data = await response.json();
      setCrops(data || []);
    } catch (error) {
      console.error('Error fetching crops:', error);
    }
  };

  const fetchReplies = async (postId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/community/posts/${postId}/replies`);
      const data = await response.json();
      setReplies(prev => ({ ...prev, [postId]: data || [] }));
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  const getCropName = (cropId: string | { id: string; name: string } | null) => {
    if (!cropId) return null;
    // If crop_id is already populated as object with name
    if (typeof cropId === 'object' && cropId.name) {
      return cropId.name;
    }
    // Otherwise look it up in crops array
    if (typeof cropId === 'string') {
      return crops.find(c => c.id === cropId)?.name || null;
    }
    return null;
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Please login", description: "You need to be logged in to create a post.", variant: "destructive" });
      return;
    }

    setIsSaving(true);

    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/api/community/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description || null,
          location: formData.location || user?.location || null,
          crop_id: formData.crop_id || null
        })
      });

      if (!response.ok) throw new Error('Failed to create post');

      const data = await response.json();
      setPosts([{ ...data, author_name: user?.name || 'You' }, ...posts]);
      toast({ title: "Post created!", description: "Your question has been posted." });
      setFormData({ title: "", description: "", location: "", crop_id: "" });
      setShowForm(false);
    } catch (error: any) {
      toast({ title: "Error creating post", description: error.message, variant: "destructive" });
    }
    setIsSaving(false);
  };

  const handleToggleLike = async (postId: string) => {
    if (!user) {
      toast({ title: "Please login", description: "You need to be logged in to like a post.", variant: "destructive" });
      return;
    }

    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/api/community/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to toggle like');

      const result = await response.json();

      setPosts(posts.map(p => p.id === postId ? {
        ...p,
        upvotes: result.upvotes,
        has_liked: result.liked
      } : p));
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleAddReply = async (postId: string) => {
    if (!user || !replyText.trim()) return;

    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/api/community/posts/${postId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: replyText.trim() })
      });

      if (!response.ok) throw new Error('Failed to add reply');

      const data = await response.json();
      const newReply: Reply = { ...data, author_name: user?.name || "You" };
      setReplies(prev => ({ ...prev, [postId]: [...(prev[postId] || []), newReply] }));

      setPosts(posts.map(p => p.id === postId ? {
        ...p,
        reply_count: (p.reply_count || 0) + 1
      } : p));

      setReplyText("");
      setReplyingTo(null);
      toast({ title: "Reply added!" });
    } catch (error: any) {
      toast({ title: "Error adding reply", description: error.message, variant: "destructive" });
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm(t('community.confirmDelete', 'Are you sure you want to delete this post?'))) {
      return;
    }

    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/api/community/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete post');

      setPosts(posts.filter(p => p.id !== postId));
      toast({ title: "Post deleted!", description: "Your post has been removed." });
    } catch (error: any) {
      toast({ title: "Error deleting post", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteReply = async (postId: string, replyId: string) => {
    if (!window.confirm(t('community.confirmDeleteReply', 'Are you sure you want to delete this reply?'))) {
      return;
    }

    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/api/community/posts/${postId}/replies/${replyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete reply');

      setReplies(prev => ({
        ...prev,
        [postId]: (prev[postId] || []).filter(r => r.id !== replyId)
      }));

      setPosts(posts.map(p => p.id === postId ? {
        ...p,
        reply_count: Math.max((p.reply_count || 0) - 1, 0)
      } : p));

      toast({ title: "Reply deleted!", description: "Your reply has been removed." });
    } catch (error: any) {
      toast({ title: "Error deleting reply", description: error.message, variant: "destructive" });
    }
  };

  const toggleReplies = (postId: string) => {
    if (selectedPost === postId) {
      setSelectedPost(null);
    } else {
      setSelectedPost(postId);
      if (!replies[postId]) {
        fetchReplies(postId);
      }
    }
  };

  // Stats
  const totalPosts = posts.length;
  const totalReplies = posts.reduce((acc, p) => acc + (p.reply_count || 0), 0);
  const solvedCount = posts.filter(p => p.status === 'solved').length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF4EA] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-full border-4 border-[#B9F261] border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading community posts...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF4EA]">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4"
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-gray-100">
                  <ArrowLeft className="w-5 h-5 text-[#0B0B0B]" />
                </Button>
              </motion.div>
            </Link>
            <div>
              <h1 className="font-display font-bold text-2xl text-[#0B0B0B]">{t('community.title')}</h1>
              <p className="text-sm text-gray-500">Connect, share, and learn from fellow farmers</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => setShowForm(true)}
                className="gap-2 bg-[#B9F261] text-[#0B0B0B] hover:bg-[#a8e050] rounded-full font-semibold px-5"
              >
                <Plus className="w-4 h-4" />{t('community.newPost')}
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-3 gap-4 mb-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={scaleIn}>
            <Card className="bg-gradient-to-br from-[#B9F261] to-[#a8e050] border-0 shadow-lg">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0B0B0B]/10 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-[#0B0B0B]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#0B0B0B]">{totalPosts}</p>
                  <p className="text-xs text-[#0B0B0B]/70">Discussions</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={scaleIn}>
            <Card className="bg-gradient-to-br from-[#FFD24A] to-amber-400 border-0 shadow-lg">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0B0B0B]/10 flex items-center justify-center">
                  <Reply className="w-5 h-5 text-[#0B0B0B]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#0B0B0B]">{totalReplies}</p>
                  <p className="text-xs text-[#0B0B0B]/70">Replies</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={scaleIn}>
            <Card className="bg-gradient-to-br from-emerald-400 to-green-500 border-0 shadow-lg">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{solvedCount}</p>
                  <p className="text-xs text-white/80">Solved</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Create Post Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="bg-white border-gray-200 shadow-xl mb-6 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-[#B9F261]/20 to-[#FFD24A]/20 pb-4 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg text-[#0B0B0B] flex items-center gap-2">
                    <Plus className="w-5 h-5 text-[#B9F261]" />
                    {t('community.askQuestion')}
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setShowForm(false)} className="rounded-full">
                    <X className="w-5 h-5" />
                  </Button>
                </CardHeader>
                <CardContent className="p-6">
                  {/* User info */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(user?.name || 'U')} flex items-center justify-center text-white font-bold`}>
                      {(user?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-[#0B0B0B]">{user?.name || 'Anonymous'}</p>
                      <p className="text-xs text-gray-500">Posting as you</p>
                    </div>
                  </div>

                  <form onSubmit={handleCreatePost} className="space-y-4">
                    <div>
                      <Input
                        placeholder={t('community.postTitle')}
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        className="rounded-xl border-gray-200 focus:border-[#B9F261] text-lg font-medium"
                      />
                    </div>
                    <Textarea
                      placeholder={t('community.postDescription')}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="rounded-xl border-gray-200 focus:border-[#B9F261]"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Related Crop</label>
                        <select
                          className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[#B9F261] outline-none"
                          value={formData.crop_id}
                          onChange={(e) => setFormData({ ...formData, crop_id: e.target.value })}
                        >
                          <option value="">{t('community.selectCrop')}</option>
                          {crops.map(crop => (
                            <option key={crop.id} value={crop.id}>{crop.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Your Location</label>
                        <Input
                          placeholder="e.g., Punjab, India"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="rounded-xl border-gray-200 focus:border-[#B9F261]"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                        <Button type="submit" disabled={isSaving} className="w-full bg-[#B9F261] text-[#0B0B0B] hover:bg-[#a8e050] rounded-full font-semibold h-11">
                          {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                          {t('community.submit')}
                        </Button>
                      </motion.div>
                      <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="rounded-full border-gray-200 px-6">
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Posts List */}
        {posts.length === 0 ? (
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="py-16 text-center">
                <div className="w-20 h-20 rounded-full bg-[#B9F261]/20 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-[#B9F261]" />
                </div>
                <p className="text-xl font-display font-bold text-[#0B0B0B]">No Discussions Yet</p>
                <p className="text-gray-500 mt-2">{t('community.noPosts')}</p>
                <Button
                  onClick={() => setShowForm(true)}
                  className="mt-4 bg-[#B9F261] text-[#0B0B0B] hover:bg-[#a8e050] rounded-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Start the first discussion
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-4"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {posts.map((post) => {
              // Get user ID as string for comparison
              const postUserId = getUserIdString(post.user_id);

              // Check if current user owns this post
              const isOwnPost = user && postUserId && postUserId === user.id;

              // Get author name from populated user_id or fallback
              const authorName = getAuthorName(post.user_id) || (isOwnPost ? 'You' : 'Community Member');
              const avatarColor = getAvatarColor(authorName);

              return (
                <motion.div key={post.id || post._id} variants={scaleIn}>
                  <motion.div whileHover={{ y: -3 }}>
                    <Card className={`border-2 transition-all overflow-hidden ${isOwnPost
                      ? 'bg-gradient-to-br from-[#B9F261]/10 to-[#FFD24A]/5 border-[#B9F261]/50 hover:border-[#B9F261]'
                      : 'bg-white border-gray-100 hover:border-[#B9F261]'
                      }`}>
                      <CardContent className="p-5">
                        {/* Post Header with Avatar */}
                        <div className="flex items-start gap-4 mb-4">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                            {authorName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-semibold text-[#0B0B0B]">{authorName}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  <span>{formatTimeAgo(post.created_at)}</span>
                                  {post.location && (
                                    <>
                                      <span>•</span>
                                      <MapPin className="w-3 h-3" />
                                      <span>{post.location}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {post.status === "solved" && (
                                  <Badge className="bg-emerald-100 text-emerald-700 gap-1">
                                    <CheckCircle className="w-3 h-3" />{t('community.solved')}
                                  </Badge>
                                )}
                                {isOwnPost && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeletePost(post.id || post._id!)}
                                    className="h-8 w-8 rounded-full hover:bg-red-50 hover:text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Post Content */}
                        <div className="ml-16">
                          <h3 className="font-bold text-lg text-[#0B0B0B] mb-2">{post.title}</h3>
                          {post.description && (
                            <p className="text-gray-600 mb-3 leading-relaxed">{post.description}</p>
                          )}

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {getCropName(post.crop_id) && (
                              <Badge className="bg-emerald-100 text-emerald-700 gap-1">
                                <Leaf className="w-3 h-3" />
                                {getCropName(post.crop_id)}
                              </Badge>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleToggleLike(post.id)}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${post.has_liked
                                ? 'bg-rose-100 text-rose-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-500'
                                }`}
                            >
                              <Heart className={`w-4 h-4 ${post.has_liked ? 'fill-current' : ''}`} />
                              <span className="text-sm font-medium">{post.upvotes || 0}</span>
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => toggleReplies(post.id)}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${selectedPost === post.id
                                ? 'bg-[#B9F261]/30 text-[#0B0B0B]'
                                : 'bg-gray-100 text-gray-600 hover:bg-[#B9F261]/20'
                                }`}
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">{post.reply_count || 0} {t('community.replies')}</span>
                            </motion.button>

                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setReplyingTo(replyingTo === post.id ? null : post.id);
                                  if (selectedPost !== post.id) {
                                    setSelectedPost(post.id);
                                    if (!replies[post.id]) fetchReplies(post.id);
                                  }
                                }}
                                className="text-sm rounded-full bg-[#B9F261] text-[#0B0B0B] hover:bg-[#a8e050] px-4"
                              >
                                <Reply className="w-4 h-4 mr-1" />
                                Reply
                              </Button>
                            </motion.div>
                          </div>
                        </div>

                        {/* Reply Input */}
                        <AnimatePresence>
                          {replyingTo === post.id && user && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="ml-16 mt-4 pt-4 border-t border-gray-100"
                            >
                              <div className="flex gap-3">
                                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarColor(user?.name || 'U')} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                                  {(user?.name || 'U').charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 flex gap-2">
                                  <Input
                                    placeholder={t('community.writeReply', 'Write a reply...')}
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddReply(post.id)}
                                    autoFocus
                                    className="rounded-full border-gray-200 focus:border-[#B9F261]"
                                  />
                                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                      size="icon"
                                      onClick={() => handleAddReply(post.id)}
                                      className="rounded-full bg-[#B9F261] text-[#0B0B0B] hover:bg-[#a8e050]"
                                    >
                                      <Send className="w-4 h-4" />
                                    </Button>
                                  </motion.div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Replies List */}
                        <AnimatePresence>
                          {selectedPost === post.id && replies[post.id] && replies[post.id].length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="ml-16 mt-4 pt-4 border-t border-gray-100 space-y-3"
                            >
                              {replies[post.id].map((reply, index) => {
                                // Get user ID string for comparison
                                const replyUserId = getUserIdString(reply.user_id);

                                // Check if current user owns this reply
                                const isOwnReply = user && replyUserId && replyUserId === user.id;

                                // Get author name from populated user_id or fallback
                                const replyAuthor = getAuthorName(reply.user_id) || (isOwnReply ? 'You' : 'Community Member');
                                const replyAvatarColor = getAvatarColor(replyAuthor);

                                return (
                                  <motion.div
                                    key={reply.id || reply._id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`flex gap-3 p-3 rounded-xl transition-colors ${isOwnReply
                                      ? 'bg-gradient-to-r from-[#B9F261]/20 to-[#FFD24A]/10 border border-[#B9F261]/30'
                                      : 'bg-gray-50 hover:bg-gray-100'
                                      }`}
                                  >
                                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${replyAvatarColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                                      {replyAuthor.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <p className="font-medium text-sm text-[#0B0B0B]">
                                            {replyAuthor}
                                            {isOwnReply && <span className="ml-1 text-xs text-[#B9F261]">• You</span>}
                                          </p>
                                          <span className="text-xs text-gray-400">{formatTimeAgo(reply.created_at)}</span>
                                        </div>
                                        {isOwnReply && (
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteReply(post.id || post._id!, reply.id || reply._id!)}
                                            className="h-6 w-6 rounded-full hover:bg-red-100 hover:text-red-600"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </Button>
                                        )}
                                      </div>
                                      <p className="text-sm text-gray-600 mt-1">{reply.message}</p>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </main>

      {/* Floating Chat Button */}
      <Link to="/chat">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#B9F261] shadow-lg flex items-center justify-center text-[#0B0B0B] z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      </Link>
    </div>
  );
};

export default Community;
