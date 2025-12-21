-- Create user_likes table to track likes per user per post
CREATE TABLE public.user_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Enable RLS
ALTER TABLE public.user_likes ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own likes" 
ON public.user_likes FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can add likes" 
ON public.user_likes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their likes" 
ON public.user_likes FOR DELETE 
USING (auth.uid() = user_id);