import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, useInView, useAnimation, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
  ArrowRight,
  Leaf,
  Bug,
  Camera,
  MessageCircle,
  Shield,
  Zap,
  Users,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Star,
  Award,
  TrendingUp,
  Globe,
  ChevronDown,
  Play,
  Linkedin,
  Twitter,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const fadeInDown = {
  hidden: { opacity: 0, y: -40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

// Counter Component for animated numbers
const AnimatedCounter = ({ value, suffix = "", duration = 2 }: { value: number; suffix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * value));
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const Index = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Camera,
      title: "AI Pest Detection",
      description: "Upload crop images and get instant AI-powered pest identification with 90%+ accuracy.",
      highlighted: false,
    },
    {
      icon: Shield,
      title: "Smart Advisories",
      description: "Receive personalized treatment plans following IPM principles for sustainable farming.",
      highlighted: true,
    },
    {
      icon: Zap,
      title: "Real-time Alerts",
      description: "Weather-based pest risk alerts help you take preventive action before damage occurs.",
      highlighted: false,
    },
  ];

  const moreFeatures = [
    {
      icon: Bug,
      title: "Pest Library",
      description: "Access comprehensive database of 500+ pests with detailed identification guides.",
    },
    {
      icon: Globe,
      title: "Multi-language Support",
      description: "Available in Hindi, English, and regional languages for all Indian farmers.",
    },
    {
      icon: TrendingUp,
      title: "Yield Analytics",
      description: "Track your crop health and predict yield improvements with AI insights.",
    },
    {
      icon: Users,
      title: "Expert Community",
      description: "Connect with agricultural experts and fellow farmers for peer support.",
    },
    {
      icon: Award,
      title: "Certified Solutions",
      description: "All recommendations follow government-approved IPM guidelines.",
    },
    {
      icon: MessageCircle,
      title: "24/7 AI Chat",
      description: "Get instant answers to your farming queries anytime, anywhere.",
    },
  ];

  const processSteps = [
    {
      step: 1,
      icon: Camera,
      title: "Upload Image",
      description: "Take a photo of affected crops or describe symptoms using our guided wizard.",
    },
    {
      step: 2,
      icon: Bug,
      title: "AI Analysis",
      description: "Our AI analyzes the image to identify pests with confidence scores and symptoms.",
    },
    {
      step: 3,
      icon: Shield,
      title: "Get Advisory",
      description: "Receive detailed IPM-based treatment recommendations tailored to your crop.",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Farmers Helped" },
    { value: "50,000+", label: "Pests Identified" },
    { value: "95%", label: "Accuracy Rate" },
    { value: "24/7", label: "AI Support" },
  ];

  const trustedLogos = [
    { icon: "🌾", name: "AgriTech" },
    { icon: "🌱", name: "FarmSmart" },
    { icon: "🍃", name: "CropGuard" },
    { icon: "🌿", name: "GreenHarvest" },
    { icon: "🌻", name: "SunFields" },
    { icon: "🌾", name: "AgriTech" },
    { icon: "🌱", name: "FarmSmart" },
    { icon: "🍃", name: "CropGuard" },
  ];

  const benefits = [
    "From consultation to installation, we're connected throughout the process.",
    "Over a decade of agricultural AI expertise applied to every project.",
    "We work with reliable technology and sustainable farming practices.",
    "Our team follows strict safety and quality standards.",
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Wheat Farmer, Punjab",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      quote: "KrishiRakshak saved my entire wheat crop from a pest outbreak. The AI identified the problem before it spread!",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      role: "Cotton Farmer, Gujarat",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      quote: "The real-time alerts helped me take preventive action. My yield increased by 30% this season.",
      rating: 5,
    },
    {
      name: "Amit Patel",
      role: "Rice Farmer, Bihar",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      quote: "Easy to use, accurate results. This is exactly what Indian farmers needed.",
      rating: 5,
    },
  ];

  const teamMembers = [
    {
      name: "Dr. Ananya Verma",
      role: "Co-Founder & CEO",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
      bio: "Former ICAR scientist with 15+ years in agricultural research. PhD in Entomology.",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Vikram Singh",
      role: "CTO & AI Lead",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
      bio: "Ex-Google ML engineer. Built AI systems processing 10M+ images daily.",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Meera Krishnan",
      role: "Head of Agriculture",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
      bio: "Agricultural extension expert. Worked with 50,000+ farmers across India.",
      linkedin: "#",
      twitter: "#",
    },
  ];

  const faqs = [
    {
      question: "How accurate is the AI pest detection?",
      answer: "Our AI achieves 95%+ accuracy on common agricultural pests. The system continuously learns from new data to improve detection rates.",
    },
    {
      question: "What crops does KrishiRakshak support?",
      answer: "We support all major Indian crops including wheat, rice, cotton, sugarcane, vegetables, and fruits. New crops are added regularly.",
    },
    {
      question: "Is there a mobile app available?",
      answer: "Yes! Our mobile app is available for both Android and iOS, allowing you to identify pests directly from the field.",
    },
    {
      question: "How do I get started?",
      answer: "Simply register for a free account, upload an image of your affected crop, and get instant AI-powered recommendations.",
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden font-sans">
      {/* Navigation - Transparent Glassmorphic Style */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center relative">
                <svg viewBox="0 0 40 40" className="w-10 h-10">
                  {/* Sun rays */}
                  <line x1="20" y1="4" x2="20" y2="10" stroke="#FFD24A" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="32" y1="10" x2="28" y2="14" stroke="#FFD24A" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="36" y1="22" x2="30" y2="22" stroke="#FFD24A" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="8" y1="10" x2="12" y2="14" stroke="#FFD24A" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="4" y1="22" x2="10" y2="22" stroke="#FFD24A" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Sun body */}
                  <circle cx="20" cy="22" r="10" fill="#FFD24A" />
                  {/* Leaf */}
                  <path d="M16 28 Q20 20 28 22 Q24 30 16 28" fill="#4a7c4a" />
                </svg>
              </div>
              <span className="font-display font-bold text-xl text-white">KrishiRakshak</span>
            </Link>

            {/* Center Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <motion.a
                href="#"
                className="text-sm font-medium text-[#FFD24A] transition-colors"
                whileHover={{ y: -2 }}
              >
                Home
              </motion.a>
              <motion.a
                href="#about"
                className="text-sm font-medium text-white hover:text-[#FFD24A] transition-colors"
                whileHover={{ y: -2 }}
              >
                About
              </motion.a>
              <motion.a
                href="#features"
                className="text-sm font-medium text-white hover:text-[#FFD24A] transition-colors"
                whileHover={{ y: -2 }}
              >
                Features
              </motion.a>
              <motion.a
                href="#how-it-works"
                className="text-sm font-medium text-white hover:text-[#FFD24A] transition-colors"
                whileHover={{ y: -2 }}
              >
                How It Works
              </motion.a>
              <motion.a
                href="#team"
                className="text-sm font-medium text-white hover:text-[#FFD24A] transition-colors"
                whileHover={{ y: -2 }}
              >
                Team
              </motion.a>
              <Link to="/contact" className="text-sm font-medium text-white hover:text-[#FFD24A] transition-colors">
                Contact
              </Link>
            </div>

            {/* Right Side - CTA */}
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B9F261] text-[#0B0B0B] font-medium text-sm hover:bg-[#a8e050] transition-all shadow-lg"
                >
                  Sign In
                  <div className="w-6 h-6 rounded-full bg-[#0B0B0B] flex items-center justify-center">
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </div>
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Full Width Background Image */}
      <section className="relative flex items-center" style={{ minHeight: '100vh' }}>
        {/* Full Background Image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B]/80 via-[#0B0B0B]/60 to-transparent z-0" />

        <div className="relative z-10 container mx-auto px-6 py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              {/* Rating Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3 mb-6"
              >
                <span className="text-white font-bold">5</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FFD24A] text-[#FFD24A]" />
                  ))}
                </div>
                <span className="text-sm font-medium text-white/80">100+ Reviews</span>
              </motion.div>

              {/* Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 text-white"
              >
                Smart Pest Solutions for
                <br />
                <em className="font-normal italic">Homes &amp; Farms</em>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-lg text-white/70 max-w-md mb-8 leading-relaxed"
              >
                KrishiRakshak delivers AI-powered pest identification and management solutions for farms and gardens. Easy setup, lasting results.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap gap-4"
              >
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 px-8 py-4 rounded-full bg-[#B9F261] text-[#0B0B0B] font-semibold text-base hover:bg-[#a8e050] transition-all shadow-lg shadow-[#B9F261]/30"
                  >
                    Get Started
                    <div className="w-7 h-7 rounded-full bg-[#0B0B0B] flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </motion.button>
                </Link>
                <a href="#features">
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-8 py-4 rounded-full bg-transparent border-2 border-white/30 text-white font-semibold text-base transition-all"
                  >
                    View Features
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </motion.button>
                </a>
              </motion.div>
            </div>

            {/* Right Side - Floating Chips */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="hidden lg:flex flex-col items-end gap-4"
            >
              {["25-Year Panel Warranty", "Certified Installers", "Free Energy Consultation"].map((chip, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                  className="px-5 py-3 rounded-full border border-white/30 bg-white/5 backdrop-blur-sm text-sm font-medium text-white flex items-center gap-2"
                >
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <ArrowRight className="w-3 h-3 text-white" />
                  </div>
                  {chip}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#0B0B0B] border-t border-white/10">
        <div className="container mx-auto px-6">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp} className="text-center">
              <p className="text-2xl md:text-4xl font-display font-bold text-[#B9F261]">
                <AnimatedCounter value={10000} suffix="+" />
              </p>
              <p className="text-sm text-white/60 mt-1">Farmers Helped</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="text-center">
              <p className="text-2xl md:text-4xl font-display font-bold text-[#B9F261]">
                <AnimatedCounter value={50000} suffix="+" />
              </p>
              <p className="text-sm text-white/60 mt-1">Pests Identified</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="text-center">
              <p className="text-2xl md:text-4xl font-display font-bold text-[#B9F261]">
                <AnimatedCounter value={95} suffix="%" />
              </p>
              <p className="text-sm text-white/60 mt-1">Accuracy Rate</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="text-center">
              <p className="text-2xl md:text-4xl font-display font-bold text-[#B9F261]">24/7</p>
              <p className="text-sm text-white/60 mt-1">AI Support</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trusted By Section - Scrolling Animation */}
      <section className="py-16 bg-[#0B0B0B] overflow-hidden relative">
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(#FAF4EA 1px, transparent 1px), linear-gradient(90deg, #FAF4EA 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
        <div className="container mx-auto px-6 mb-10 relative z-10">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#B9F261]"></div>
            <span className="text-[#B9F261] text-sm font-medium uppercase tracking-widest">Partners</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#B9F261]"></div>
          </div>
          <h3 className="text-center text-2xl md:text-3xl font-display font-bold text-white">
            Trusted by Top Agriculture Leaders
          </h3>
        </div>
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0B0B0B] to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0B0B0B] to-transparent z-10"></div>
          <div className="flex animate-scroll">
            {[...trustedLogos, ...trustedLogos, ...trustedLogos, ...trustedLogos].map((logo, index) => (
              <div key={index} className="flex-shrink-0 mx-12 flex items-center gap-3 group">
                <div className="w-12 h-12 rounded-xl bg-[#B9F261]/10 border border-[#B9F261]/20 flex items-center justify-center group-hover:bg-[#B9F261]/20 transition-colors">
                  <span className="text-2xl">{logo.icon}</span>
                </div>
                <span className="font-semibold text-lg text-white/80 whitespace-nowrap group-hover:text-[#B9F261] transition-colors">{logo.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-[#FAF4EA]">
        <div className="container mx-auto px-6">
          <motion.div
            className="mb-16"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#FFD24A]"></span>
              <span className="text-sm font-medium text-gray-600">Pest &amp; Crop Solutions</span>
            </motion.div>
            <div className="grid lg:grid-cols-2 gap-8">
              <motion.h2
                variants={fadeInLeft}
                className="font-display text-4xl md:text-5xl font-bold text-[#0B0B0B]"
              >
                Pest Solutions for Every Farm
              </motion.h2>
              <motion.p
                variants={fadeInRight}
                className="text-gray-600 leading-relaxed self-center"
              >
                We provide complete pest management services for farms &amp; gardens, including identification, advisories, &amp; preventive monitoring.
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className={`p-8 rounded-2xl border transition-all duration-300 ${feature.highlighted
                  ? "bg-[#B9F261] border-[#B9F261]"
                  : "bg-white border-gray-200 shadow-sm"
                  }`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${feature.highlighted ? "bg-[#0B0B0B]/10" : "bg-[#B9F261]/10"
                  }`}>
                  <feature.icon className={`w-7 h-7 ${feature.highlighted ? "text-[#0B0B0B]" : "text-[#B9F261]"
                    }`} />
                </div>
                <h3 className={`font-display text-xl font-bold mb-3 ${feature.highlighted ? "text-[#0B0B0B]" : "text-[#0B0B0B]"
                  }`}>
                  {feature.title}
                </h3>
                <p className={`leading-relaxed mb-6 ${feature.highlighted ? "text-[#0B0B0B]/70" : "text-gray-600"
                  }`}>
                  {feature.description}
                </p>
                <motion.button
                  whileHover={{ rotate: -45 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${feature.highlighted
                    ? "bg-[#0B0B0B] text-white"
                    : "bg-[#B9F261] text-[#0B0B0B]"
                    }`}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80"
                  alt="Team working on farm"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              {/* Stat Badge */}
              <div className="absolute bottom-8 left-8 bg-[#0B0B0B]/90 backdrop-blur-sm text-white p-6 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-[#FFD24A] flex items-center justify-center">
                    <Shield className="w-6 h-6 text-[#FFD24A]" />
                  </div>
                  <div>
                    <p className="text-3xl font-display font-bold text-[#FFD24A]">12,500+</p>
                    <p className="text-sm text-white/70">Completed Projects</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#FFD24A]"></span>
                <span className="text-sm font-medium text-gray-600">About KrishiRakshak</span>
              </div>

              <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-8 text-[#0B0B0B]">
                A Team Focused on Clean Agriculture
              </h2>

              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 bg-white"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#FFD24A]/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-[#FFD24A]" />
                    </div>
                    <p className="text-gray-700 leading-relaxed">{benefit}</p>
                  </motion.div>
                ))}
              </div>

              <Link to="/register">
                <Button size="lg" className="rounded-full px-8 gap-3 bg-[#B9F261] text-[#0B0B0B] hover:bg-[#a8e050]">
                  More Details
                  <div className="w-7 h-7 rounded-full bg-[#0B0B0B] flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section >

      {/* How It Works Section - Cards */}
      < section id="how-it-works" className="py-24 bg-[#FAF4EA]" >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#FFD24A]"></span>
              <span className="text-sm font-medium text-gray-600">Our Process</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-[#0B0B0B]">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get pest identification and expert recommendations in three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {processSteps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
                className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm text-center transition-all duration-300"
              >
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-[#B9F261]/10 border border-[#B9F261]/20 flex items-center justify-center mx-auto">
                    <item.icon className="w-10 h-10 text-[#B9F261]" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#FFD24A] text-[#0B0B0B] font-bold text-sm flex items-center justify-center shadow-md">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold mb-3 text-[#0B0B0B]">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section >

      {/* More Features Section (Replacing Pricing) */}
      < section className="py-24 bg-[#0B0B0B] relative overflow-hidden" >
        {/* Grid Texture */}
        < div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(#FAF4EA 1px, transparent 1px), linear-gradient(90deg, #FAF4EA 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />

        < div className="container mx-auto px-6 relative z-10" >
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#FFD24A]"></span>
              <span className="text-sm font-medium text-gray-400">Platform Features</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-white">
              Everything You Need
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Comprehensive tools and features to protect your crops and maximize yield.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {moreFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[#B9F261]/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-[#B9F261]" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div >
      </section >

      {/* Team Section */}
      < section id="team" className="py-24 bg-white" >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#FFD24A]"></span>
              <span className="text-sm font-medium text-gray-600">Our Team</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-[#0B0B0B]">
              Meet the Experts
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our team combines deep agricultural expertise with cutting-edge AI technology.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold text-[#0B0B0B] mb-1">{member.name}</h3>
                  <p className="text-[#B9F261] font-medium text-sm mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{member.bio}</p>
                  <div className="flex gap-3">
                    <a href={member.linkedin} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#B9F261] hover:text-[#0B0B0B] transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a href={member.twitter} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#B9F261] hover:text-[#0B0B0B] transition-colors">
                      <Twitter className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section >

      {/* Testimonials Section */}
      < section className="py-24 bg-[#FAF4EA]" >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#FFD24A]"></span>
              <span className="text-sm font-medium text-gray-600">Testimonials</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-[#0B0B0B]">
              What Farmers Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from farmers who have transformed their pest management with our AI solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-2xl border border-gray-200 bg-white hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FFD24A] text-[#FFD24A]" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold text-[#0B0B0B]">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section >

      {/* FAQ Section */}
      < section className="py-24 bg-white" >
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#FFD24A]"></span>
                <span className="text-sm font-medium text-gray-600">FAQ</span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-[#0B0B0B]">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.details
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-[#FAF4EA] rounded-2xl border border-gray-200 overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-[#0B0B0B] hover:bg-[#FFD24A]/10">
                    {faq.question}
                    <ChevronDown className="w-5 h.5 text-gray-500 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.details>
              ))}
            </div>
          </div>
        </div>
      </section >

      {/* CTA Section */}
      < section className="py-24 bg-[#0B0B0B] relative overflow-hidden" >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(#FAF4EA 1px, transparent 1px), linear-gradient(90deg, #FAF4EA 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-8 text-white">
              Ready to Transform Your Farm With AI?
            </h2>
            <Link to="/register">
              <Button size="lg" className="rounded-full px-8 py-6 text-lg gap-3 bg-[#B9F261] text-[#0B0B0B] hover:bg-[#a8e050]">
                Get Free Assessment
                <div className="w-8 h-8 rounded-full bg-[#0B0B0B] flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </section >

      {/* Footer */}
      < footer className="py-16 bg-[#0B0B0B] text-white border-t border-white/10 relative overflow-hidden" >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(#FAF4EA 1px, transparent 1px), linear-gradient(90deg, #FAF4EA 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Logo & Description */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 flex items-center justify-center">
                  <svg viewBox="0 0 40 40" className="w-10 h-10">
                    <line x1="20" y1="4" x2="20" y2="10" stroke="#FFD24A" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="32" y1="10" x2="28" y2="14" stroke="#FFD24A" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="36" y1="22" x2="30" y2="22" stroke="#FFD24A" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="8" y1="10" x2="12" y2="14" stroke="#FFD24A" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="4" y1="22" x2="10" y2="22" stroke="#FFD24A" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="20" cy="22" r="10" fill="#FFD24A" />
                    <path d="M16 28 Q20 20 28 22 Q24 30 16 28" fill="#4a7c4a" />
                  </svg>
                </div>
                <span className="font-display font-bold text-xl text-white">KrishiRakshak</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                AI-powered pest management for smarter, sustainable farming. Empowering farmers with cutting-edge technology.
              </p>
              {/* Social Icons */}
              <div className="flex gap-3">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-[#B9F261] hover:text-[#0B0B0B] hover:border-[#B9F261] transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-[#B9F261] hover:text-[#0B0B0B] hover:border-[#B9F261] transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-[#B9F261] hover:text-[#0B0B0B] hover:border-[#B9F261] transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" /></svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-[#B9F261] hover:text-[#0B0B0B] hover:border-[#B9F261] transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-display font-bold text-white mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#about" className="text-white/60 hover:text-[#B9F261] transition-colors flex items-center gap-2"><ChevronRight className="w-3 h-3" />About Us</a></li>
                <li><a href="#features" className="text-white/60 hover:text-[#B9F261] transition-colors flex items-center gap-2"><ChevronRight className="w-3 h-3" />Features</a></li>
                <li><a href="#how-it-works" className="text-white/60 hover:text-[#B9F261] transition-colors flex items-center gap-2"><ChevronRight className="w-3 h-3" />How It Works</a></li>
                <li><a href="#team" className="text-white/60 hover:text-[#B9F261] transition-colors flex items-center gap-2"><ChevronRight className="w-3 h-3" />Our Team</a></li>
                <li><Link to="/contact" className="text-white/60 hover:text-[#B9F261] transition-colors flex items-center gap-2"><ChevronRight className="w-3 h-3" />Contact</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-display font-bold text-white mb-6">Services</h4>
              <ul className="space-y-3">
                <li><Link to="/identify" className="text-white/60 hover:text-[#B9F261] transition-colors flex items-center gap-2"><ChevronRight className="w-3 h-3" />Pest Detection</Link></li>
                <li><Link to="/chat" className="text-white/60 hover:text-[#B9F261] transition-colors flex items-center gap-2"><ChevronRight className="w-3 h-3" />AI Chat Assistant</Link></li>
                <li><Link to="/alerts" className="text-white/60 hover:text-[#B9F261] transition-colors flex items-center gap-2"><ChevronRight className="w-3 h-3" />Weather Alerts</Link></li>
                <li><Link to="/advisory" className="text-white/60 hover:text-[#B9F261] transition-colors flex items-center gap-2"><ChevronRight className="w-3 h-3" />Expert Advisory</Link></li>
                <li><Link to="/community" className="text-white/60 hover:text-[#B9F261] transition-colors flex items-center gap-2"><ChevronRight className="w-3 h-3" />Community</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-display font-bold text-white mb-6">Stay Updated</h4>
              <p className="text-white/60 text-sm mb-4">Subscribe to our newsletter for the latest updates on pest management.</p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#B9F261] focus:bg-white/10 transition-all"
                />
                <Button className="w-full rounded-xl py-3 bg-[#B9F261] text-[#0B0B0B] hover:bg-[#a8e050] font-semibold">
                  Subscribe Now
                </Button>
              </div>
              <p className="text-white/40 text-xs mt-3">We respect your privacy. Unsubscribe anytime.</p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white/40 text-sm">
                © 2025 KrishiRakshak. All rights reserved.
              </p>
              <div className="flex gap-6 text-white/40 text-sm">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer >

      {/* Floating Chat */}
      < Link to="/chat" >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#B9F261] shadow-lg flex items-center justify-center text-[#0B0B0B] z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      </Link >

      {/* CSS Animation for Scrolling Logos */}
      < style > {`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
          width: max-content;
        }
      `}</style >
    </div >
  );
};

export default Index;
