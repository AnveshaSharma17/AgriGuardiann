import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Leaf, Mail, Lock, Eye, EyeOff, User, Phone, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";
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

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signUp, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    const { error } = await signUp(formData.email, formData.password, formData.name);

    if (error) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    toast({
      title: "Account created!",
      description: "Welcome to KrishiRakshak.",
    });
    navigate('/dashboard');
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

  const features = [
    "AI-powered pest identification",
    "Personalized IPM recommendations",
    "Weather-based pest risk alerts",
    "Community support from experts"
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-[#FAF4EA]"
      >
        <div className="w-full max-w-lg">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-8">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-10 h-10 flex items-center justify-center"
            >
              <svg viewBox="0 0 40 40" className="w-10 h-10">
                <line x1="20" y1="4" x2="20" y2="10" stroke="#FFD24A" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="32" y1="10" x2="28" y2="14" stroke="#FFD24A" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="36" y1="22" x2="30" y2="22" stroke="#FFD24A" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="8" y1="10" x2="12" y2="14" stroke="#FFD24A" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="4" y1="22" x2="10" y2="22" stroke="#FFD24A" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="20" cy="22" r="10" fill="#FFD24A" />
                <path d="M16 28 Q20 20 28 22 Q24 30 16 28" fill="#4a7c4a" />
              </svg>
            </motion.div>
            <span className="font-display font-bold text-xl text-[#0B0B0B]">KrishiRakshak</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl font-bold mb-2 text-[#0B0B0B]">Create Account</h1>
            <p className="text-gray-600">
              Join thousands of farmers using smart pest management
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#0B0B0B]" htmlFor="name">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    placeholder="Rajesh Kumar"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-12 h-12 rounded-xl border-gray-200 bg-white focus:border-[#B9F261] focus:ring-[#B9F261]/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#0B0B0B]" htmlFor="phone">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-12 h-12 rounded-xl border-gray-200 bg-white focus:border-[#B9F261] focus:ring-[#B9F261]/20"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#0B0B0B]" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="farmer@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-12 h-12 rounded-xl border-gray-200 bg-white focus:border-[#B9F261] focus:ring-[#B9F261]/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#0B0B0B]" htmlFor="location">
                Location (District, State)
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="location"
                  name="location"
                  placeholder="Ludhiana, Punjab"
                  value={formData.location}
                  onChange={handleChange}
                  className="pl-12 h-12 rounded-xl border-gray-200 bg-white focus:border-[#B9F261] focus:ring-[#B9F261]/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#0B0B0B]" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-12 h-12 rounded-xl border-gray-200 bg-white focus:border-[#B9F261] focus:ring-[#B9F261]/20"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#0B0B0B]" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-12 pr-12 h-12 rounded-xl border-gray-200 bg-white focus:border-[#B9F261] focus:ring-[#B9F261]/20"
                    required
                    minLength={8}
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
                    Create Account
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
            className="mt-6 text-center"
          >
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-[#0B0B0B] font-semibold hover:text-[#B9F261] transition-colors">
                Login here
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Features */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 relative"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1920&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-[#0B0B0B]/90 via-[#0B0B0B]/70 to-[#0B0B0B]/50" />

        {/* Grid Texture */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(#FAF4EA 1px, transparent 1px), linear-gradient(90deg, #FAF4EA 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />

        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-md"
          >
            <motion.h2
              variants={fadeInRight}
              className="font-display text-4xl xl:text-5xl font-bold leading-tight mb-6"
            >
              Start Protecting<br />
              Your Crops <span className="text-[#B9F261]">Today</span>
            </motion.h2>
            <motion.p
              variants={fadeInRight}
              className="text-white/70 text-lg mb-10"
            >
              Join our community of smart farmers and get access to AI-powered pest management tools.
            </motion.p>

            <motion.ul variants={staggerContainer} className="space-y-4 mb-12">
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  variants={fadeInUp}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-[#B9F261]/20 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-[#B9F261]" />
                  </div>
                  <span className="text-white/80">{feature}</span>
                </motion.li>
              ))}
            </motion.ul>

            {/* Testimonial */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.02, y: -5 }}
              className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
            >
              <p className="text-white/90 italic mb-4">
                "KrishiRakshak helped me save my entire cotton crop from a pest outbreak. The AI identified the problem before it spread!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#B9F261] flex items-center justify-center text-[#0B0B0B] font-bold text-lg">
                  S
                </div>
                <div>
                  <p className="font-semibold">Suresh Patel</p>
                  <p className="text-sm text-white/60">Cotton Farmer, Gujarat</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
