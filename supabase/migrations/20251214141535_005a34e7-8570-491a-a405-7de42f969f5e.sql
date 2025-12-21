-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('farmer', 'expert', 'admin');

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  location TEXT DEFAULT 'Punjab, India',
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'farmer',
  UNIQUE (user_id, role)
);

-- Create crops table
CREATE TABLE public.crops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_hi TEXT,
  seasons TEXT[] DEFAULT '{}',
  stages TEXT[] DEFAULT ARRAY['seedling', 'vegetative', 'flowering', 'fruiting', 'harvest'],
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pests table
CREATE TABLE public.pests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_id UUID REFERENCES public.crops(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  name_hi TEXT,
  scientific_name TEXT,
  images TEXT[] DEFAULT '{}',
  symptoms TEXT[] DEFAULT '{}',
  symptoms_hi TEXT[] DEFAULT '{}',
  lifecycle TEXT,
  lifecycle_hi TEXT,
  damage TEXT,
  damage_hi TEXT,
  season TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create advisories table with IPM structure
CREATE TABLE public.advisories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pest_id UUID REFERENCES public.pests(id) ON DELETE CASCADE NOT NULL,
  prevention TEXT[] DEFAULT '{}',
  prevention_hi TEXT[] DEFAULT '{}',
  mechanical TEXT[] DEFAULT '{}',
  mechanical_hi TEXT[] DEFAULT '{}',
  biological TEXT[] DEFAULT '{}',
  biological_hi TEXT[] DEFAULT '{}',
  chemical TEXT[] DEFAULT '{}',
  chemical_hi TEXT[] DEFAULT '{}',
  dosage TEXT,
  dosage_hi TEXT,
  safety TEXT,
  safety_hi TEXT,
  notes TEXT,
  notes_hi TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pest_reports table for farmer reports
CREATE TABLE public.pest_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  crop_id UUID REFERENCES public.crops(id),
  pest_guess TEXT,
  symptoms TEXT[] DEFAULT '{}',
  severity TEXT DEFAULT 'medium',
  image_url TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create spray_logs table
CREATE TABLE public.spray_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  crop_id UUID REFERENCES public.crops(id),
  pesticide_name TEXT NOT NULL,
  dose TEXT,
  spray_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create community_posts table
CREATE TABLE public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  crop_id UUID REFERENCES public.crops(id),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  location TEXT,
  status TEXT DEFAULT 'open',
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create community_replies table
CREATE TABLE public.community_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_logs table for tracking AI usage
CREATE TABLE public.ai_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  input_summary TEXT,
  output_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create alerts table
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_hi TEXT,
  description TEXT,
  description_hi TEXT,
  risk_level TEXT DEFAULT 'medium',
  crop_id UUID REFERENCES public.crops(id),
  location TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pest_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spray_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own role" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for crops (public read)
CREATE POLICY "Anyone can view crops" ON public.crops FOR SELECT USING (true);

-- RLS Policies for pests (public read)
CREATE POLICY "Anyone can view pests" ON public.pests FOR SELECT USING (true);

-- RLS Policies for advisories (public read)
CREATE POLICY "Anyone can view advisories" ON public.advisories FOR SELECT USING (true);

-- RLS Policies for pest_reports
CREATE POLICY "Users can view their own reports" ON public.pest_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create reports" ON public.pest_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reports" ON public.pest_reports FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reports" ON public.pest_reports FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for spray_logs
CREATE POLICY "Users can view their own spray logs" ON public.spray_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create spray logs" ON public.spray_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own spray logs" ON public.spray_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own spray logs" ON public.spray_logs FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for community_posts (public read)
CREATE POLICY "Anyone can view posts" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own posts" ON public.community_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own posts" ON public.community_posts FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for community_replies (public read)
CREATE POLICY "Anyone can view replies" ON public.community_replies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create replies" ON public.community_replies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own replies" ON public.community_replies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own replies" ON public.community_replies FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for ai_logs
CREATE POLICY "Users can view their own AI logs" ON public.ai_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can create AI logs" ON public.ai_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for alerts (public read)
CREATE POLICY "Anyone can view active alerts" ON public.alerts FOR SELECT USING (is_active = true);

-- Create function for handling new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data ->> 'name', new.email));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'farmer');
  
  RETURN new;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();