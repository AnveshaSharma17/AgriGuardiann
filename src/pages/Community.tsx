import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, MessageCircle, ThumbsUp, MapPin, CheckCircle, Loader2, Send, X, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Post {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  status: string | null;
  upvotes: number | null;
  crop_id: string | null;
  user_id: string;
  created_at: string;
  reply_count?: number;
  has_liked?: boolean;
}

interface Reply {
  id: string;
  message: string;
  user_id: string;
  created_at: string;
  author_name?: string;
}

interface Crop {
  id: string;
  name: string;
}

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
  const { user, profile } = useAuth();
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

  const getCropName = (cropId: string | null) => {
    if (!cropId) return null;
    return crops.find(c => c.id === cropId)?.name;
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
          location: formData.location || profile?.location || null,
          crop_id: formData.crop_id || null
        })
      });

      if (!response.ok) throw new Error('Failed to create post');

      const data = await response.json();
      setPosts([data, ...posts]);
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

      // Update post with new like state
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
      const newReply: Reply = { ...data, author_name: profile?.name || "You" };
      setReplies(prev => ({ ...prev, [postId]: [...(prev[postId] || []), newReply] }));

      // Update reply count in post
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

      // Remove reply from local state
      setReplies(prev => ({
        ...prev,
        [postId]: (prev[postId] || []).filter(r => r.id !== replyId)
      }));

      // Update reply count
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-border/50 px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard"><Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button></Link>
            <div>
              <h1 className="font-display font-bold text-xl">{t('community.title')}</h1>
              <p className="text-sm text-muted-foreground">{t('landing.features.community.description')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button onClick={() => setShowForm(true)} className="gap-2"><Plus className="w-4 h-4" />{t('community.newPost')}</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-3xl">
        {showForm && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">{t('community.askQuestion')}</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}><X className="w-4 h-4" /></Button>
              </div>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <Input
                  placeholder={t('community.postTitle')}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <Textarea
                  placeholder={t('community.postDescription')}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
                <div className="grid grid-cols-2 gap-4">
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.crop_id}
                    onChange={(e) => setFormData({ ...formData, crop_id: e.target.value })}
                  >
                    <option value="">{t('community.selectCrop')}</option>
                    {crops.map(crop => (
                      <option key={crop.id} value={crop.id}>{crop.name}</option>
                    ))}
                  </select>
                  <Input
                    placeholder={t('common.location', 'Location (e.g., Punjab)')}
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <Button type="submit" variant="hero" disabled={isSaving} className="w-full">
                  {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {t('community.submit')}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {posts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">{t('community.noPosts')}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} variant="interactive">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold">{post.title}</h3>
                    <div className="flex items-center gap-2">
                      {post.status === "solved" && <Badge variant="success" className="gap-1"><CheckCircle className="w-3 h-3" />{t('community.solved')}</Badge>}
                      {user && post.user_id && (
                        (typeof post.user_id === 'string' && post.user_id === user.id) ||
                        (typeof post.user_id === 'object' && (post.user_id as any).id === user.id)
                      ) && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeletePost(post.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                    </div>
                  </div>
                  {post.description && <p className="text-sm text-muted-foreground mb-3">{post.description}</p>}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {getCropName(post.crop_id) && <Badge variant="outline">{getCropName(post.crop_id)}</Badge>}
                    {post.location && <Badge variant="muted" className="gap-1"><MapPin className="w-3 h-3" />{post.location}</Badge>}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <button
                      onClick={() => handleToggleLike(post.id)}
                      className={`flex items-center gap-1 transition-colors ${post.has_liked ? 'text-primary' : 'hover:text-primary'}`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${post.has_liked ? 'fill-current' : ''}`} />
                      {post.upvotes || 0}
                    </button>
                    <button
                      onClick={() => toggleReplies(post.id)}
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {post.reply_count || 0} {t('community.replies')}
                    </button>
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
                      className="text-sm h-auto py-1 px-2"
                    >
                      <Send className="w-3 h-3 mr-1" />
                      {t('community.reply', 'Reply')}
                    </Button>
                  </div>

                  {/* Reply input */}
                  {replyingTo === post.id && user && (
                    <div className="mt-4 pt-4 border-t border-border flex gap-2">
                      <Input
                        placeholder={t('community.writeReply', 'Write a reply...')}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddReply(post.id)}
                        autoFocus
                      />
                      <Button size="icon" onClick={() => handleAddReply(post.id)}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {/* Replies list */}
                  {selectedPost === post.id && replies[post.id] && replies[post.id].length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border space-y-3">
                      {replies[post.id].map(reply => (
                        <div key={reply.id} className="bg-muted/50 rounded-lg p-3 flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{reply.author_name || "Anonymous"}</p>
                            <p className="text-sm text-muted-foreground">{reply.message}</p>
                          </div>
                          {user && reply.user_id && (
                            (typeof reply.user_id === 'string' && reply.user_id === user.id) ||
                            (typeof reply.user_id === 'object' && (reply.user_id as any).id === user.id)
                          ) && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteReply(post.id, reply.id)}
                                className="h-7 w-7 text-destructive hover:text-destructive ml-2"
                                title="Delete reply"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Link to="/chat">
        <button className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-primary/80 shadow-lg flex items-center justify-center text-primary-foreground hover:scale-110 transition-transform z-50">
          <MessageCircle className="w-6 h-6" />
        </button>
      </Link>
    </div>
  );
};

export default Community;
