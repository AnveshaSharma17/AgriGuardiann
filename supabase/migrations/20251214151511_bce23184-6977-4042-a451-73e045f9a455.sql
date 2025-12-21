-- Create user_crops table to store farmers' selected crops
CREATE TABLE public.user_crops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  crop_id UUID NOT NULL REFERENCES public.crops(id) ON DELETE CASCADE,
  stage TEXT NOT NULL DEFAULT 'seedling',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, crop_id)
);

-- Enable RLS
ALTER TABLE public.user_crops ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own crops" 
ON public.user_crops 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own crops" 
ON public.user_crops 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own crops" 
ON public.user_crops 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own crops" 
ON public.user_crops 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_user_crops_updated_at
BEFORE UPDATE ON public.user_crops
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();