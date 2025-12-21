import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Index = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Camera,
      title: "AI Pest Detection",
      description: "Upload crop images and get instant AI-powered pest identification with 90%+ accuracy.",
    },
    {
      icon: Shield,
      title: "Smart Advisories",
      description: "Receive personalized treatment plans following IPM principles for sustainable farming.",
    },
    {
      icon: Zap,
      title: "Real-time Alerts",
      description: "Weather-based pest risk alerts help you take preventive action before damage occurs.",
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
    "🌾 AgriTech", "🌱 FarmSmart", "🍃 CropGuard", "🌿 GreenHarvest",
    "🌻 SunFields", "🌾 AgriTech", "🌱 FarmSmart", "🍃 CropGuard"
  ];

  const tags = [
    "AI-Powered", "Sustainable", "Farmer-Friendly", "Accurate",
    "Real-time", "Multilingual", "Expert-Backed", "Free"
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl">KrishiRakshak</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
              <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</a>
            </div>

            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <Link to="/login">
                <Button variant="outline" size="sm" className="hidden sm:flex rounded-full px-5">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="rounded-full px-5 gap-2 bg-[#c8e64a] text-black hover:bg-[#b8d63a]">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
            <Leaf className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Pest Management</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6 max-w-4xl mx-auto">
            Smart Pest Protection
            <br />
            <span className="text-[#c8e64a]">for Modern Agriculture</span>
          </h1>

          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Identify pests instantly with AI, get expert advisories, and protect your crops with data-driven decisions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/register">
              <Button size="lg" className="rounded-full px-8 py-6 text-lg gap-2 bg-[#c8e64a] text-black hover:bg-[#b8d63a]">
                Start Free Assessment <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-lg gap-2 border-white/30 text-white hover:bg-white/10">
                See How It Works <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#c8e64a]" />
              <span>Reduce crop losses</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#c8e64a]" />
              <span>Sustainable farming</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#c8e64a]" />
              <span>Expert AI guidance</span>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm border-t border-white/10">
          <div className="container mx-auto px-6 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white text-center">
              {stats.map((stat, index) => (
                <div key={index}>
                  <p className="text-3xl md:text-4xl font-display font-bold text-[#c8e64a]">{stat.value}</p>
                  <p className="text-sm text-white/70">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-8 bg-muted/30 border-y border-border/50 overflow-hidden">
        <div className="container mx-auto px-6">
          <p className="text-center text-sm text-muted-foreground mb-6">
            Trusted by <span className="text-foreground font-medium">leading agricultural organizations</span>
          </p>
          <div className="flex animate-scroll">
            {[...trustedLogos, ...trustedLogos].map((logo, index) => (
              <div key={index} className="flex-shrink-0 mx-8 text-xl font-display font-bold text-muted-foreground/50 hover:text-foreground transition-colors">
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Leaf className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">What We Do</span>
              </div>

              <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-6">
                Protecting Farms with
                <br />
                <span className="text-primary">Intelligent AI Solutions</span>
              </h2>

              <div className="flex flex-wrap gap-2 mb-8">
                {tags.map((tag, index) => (
                  <span key={index} className="px-4 py-2 rounded-full bg-muted border border-border text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              <Link to="/register">
                <Button size="lg" className="rounded-full px-8 gap-2 bg-[#c8e64a] text-black hover:bg-[#b8d63a]">
                  Start Free Assessment <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            <div>
              <h3 className="font-display text-2xl md:text-3xl font-bold leading-tight mb-6">
                We're helping farmers identify and manage pests with AI-powered solutions that save crops and increase yield.
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Our mission is simple: to make expert pest management accessible to every farmer. We use advanced AI to analyze crop images, identify pests with high accuracy, and provide Integrated Pest Management (IPM) recommendations.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                From small family farms to large agricultural operations, our solutions scale with your needs. We bring AI-powered protection straight to your fields—empowering you to grow sustainably, today and for generations to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Our Features</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Powerful Tools for Farmers
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to protect your crops and maximize yield with intelligent pest management.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-3xl bg-[#1a2e1a] text-white hover:bg-[#243524] transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#c8e64a]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-[#c8e64a]" />
                </div>
                <h3 className="font-display text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Bug className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Our Process</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get pest identification and expert recommendations in three simple steps.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {processSteps.map((item, index) => (
              <div key={index} className="flex gap-8 mb-12 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center text-lg font-bold text-muted-foreground">
                    {item.step}
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="w-0.5 h-24 bg-muted-foreground/20 mt-4" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#0a0a0a] text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-8">
              Ready to Protect
              <br />
              Your Crops with AI?
            </h2>
            <Link to="/register">
              <Button size="lg" className="rounded-full px-8 py-6 text-lg gap-2 bg-[#c8e64a] text-black hover:bg-[#b8d63a]">
                Start Free Assessment <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-[#0a0a0a] text-white border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Logo & Description */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#c8e64a] flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-black" />
                </div>
                <span className="font-display font-bold text-xl">KrishiRakshak</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                AI-powered pest management for smarter, sustainable farming.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-medium mb-4">Links</h4>
              <ul className="space-y-3 text-white/60">
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              </ul>
            </div>

            {/* Socials */}
            <div>
              <h4 className="font-medium mb-4">Socials</h4>
              <ul className="space-y-3 text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-medium mb-4">Subscribe Newsletter</h4>
              <p className="text-white/60 text-sm mb-4">Sign up to get updates & news.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#c8e64a]"
                />
                <Button className="rounded-full px-6 bg-white text-black hover:bg-white/90">
                  Submit
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid md:grid-cols-3 gap-6 pt-8 border-t border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-white/60">Phone No:</p>
                <p className="font-medium">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-white/60">Email Address:</p>
                <p className="font-medium">support@krishirakshak.in</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-white/60">Location:</p>
                <p className="font-medium">New Delhi, India</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 pt-8 border-t border-white/10">
            <p className="text-white/40 text-sm">
              © 2025 KrishiRakshak. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Chat Button */}
      <Link to="/chat">
        <button className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#c8e64a] shadow-lg flex items-center justify-center text-black hover:scale-110 transition-transform z-50">
          <MessageCircle className="w-6 h-6" />
        </button>
      </Link>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Index;
