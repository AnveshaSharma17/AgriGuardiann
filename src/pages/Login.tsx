import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Leaf, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { signIn, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: t('common.success'),
        description: "Welcome back!",
      });
      navigate('/dashboard');
    }
    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0B0B]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-3 border-[#B9F261]/30 border-t-[#B9F261] rounded-full"
        />
      </div>
    );
  }

  const benefits = [
    "AI-powered pest identification",
    "Personalized crop recommendations",
    "Real-time weather alerts",
    "Expert community support"
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image/Features */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 relative"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B]/90 via-[#0B0B0B]/70 to-[#0B0B0B]/50" />

        {/* Grid Texture */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(#FAF4EA 1px, transparent 1px), linear-gradient(90deg, #FAF4EA 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <Link to="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-12 h-12 flex items-center justify-center"
            >
              <svg viewBox="0 0 40 40" className="w-12 h-12">
                <line x1="20" y1="4" x2="20" y2="10" stroke="#FFD24A" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="32" y1="10" x2="28" y2="14" stroke="#FFD24A" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="36" y1="22" x2="30" y2="22" stroke="#FFD24A" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="8" y1="10" x2="12" y2="14" stroke="#FFD24A" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="4" y1="22" x2="10" y2="22" stroke="#FFD24A" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="20" cy="22" r="10" fill="#FFD24A" />
                <path d="M16 28 Q20 20 28 22 Q24 30 16 28" fill="#4a7c4a" />
              </svg>
            </motion.div>
            <span className="font-display font-bold text-2xl">KrishiRakshak</span>
          </Link>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={fadeInLeft}
              className="font-display text-4xl xl:text-5xl font-bold leading-tight mb-6"
            >
              Protect Your Crops<br />
              <span className="text-[#B9F261]">with AI Intelligence</span>
            </motion.h1>
            <motion.p
              variants={fadeInLeft}
              className="text-white/70 text-lg mb-8 max-w-md"
            >
              Join thousands of farmers using smart pest management to increase yield and reduce losses.
            </motion.p>
            <motion.ul variants={staggerContainer} className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  variants={fadeInUp}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-[#B9F261]/20 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-[#B9F261]" />
                  </div>
                  <span className="text-white/80">{benefit}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          <p className="text-white/40 text-sm">
            © 2025 KrishiRakshak. All rights reserved.
          </p>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#FAF4EA]"
      >
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-12 h-12 rounded-xl bg-[#B9F261] flex items-center justify-center">
              <Leaf className="w-7 h-7 text-[#0B0B0B]" />
            </div>
            <span className="font-display font-bold text-2xl text-[#0B0B0B]">KrishiRakshak</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center lg:text-left mb-8"
          >
            <h2 className="font-display text-3xl font-bold mb-2 text-[#0B0B0B]">{t('auth.welcomeBack')}</h2>
            <p className="text-gray-600">{t('auth.loginDesc')}</p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#0B0B0B]" htmlFor="email">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="farmer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 rounded-xl border-gray-200 bg-white focus:border-[#B9F261] focus:ring-[#B9F261]/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#0B0B0B]" htmlFor="password">
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-12 rounded-xl border-gray-200 bg-white focus:border-[#B9F261] focus:ring-[#B9F261]/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0B0B0B] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                className="w-full h-12 rounded-full text-base gap-2 bg-[#B9F261] text-[#0B0B0B] hover:bg-[#a8e050] font-semibold shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-[#0B0B0B]/30 border-t-[#0B0B0B] rounded-full"
                  />
                ) : (
                  <>
                    {t('auth.loginButton')}
                    <div className="w-6 h-6 rounded-full bg-[#0B0B0B] flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </>
                )}
              </Button>
            </motion.div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-600">
              {t('auth.noAccount')}{" "}
              <Link to="/register" className="text-[#0B0B0B] font-semibold hover:text-[#B9F261] transition-colors">
                {t('auth.register')}
              </Link>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 pt-8 border-t border-gray-200"
          >
            <p className="text-center text-sm text-gray-500">
              By continuing, you agree to our{" "}
              <a href="#" className="text-[#0B0B0B] hover:underline">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="text-[#0B0B0B] hover:underline">Privacy Policy</a>.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
