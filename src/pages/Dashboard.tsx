import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Leaf,
  Bug,
  Bell,
  MessageCircle,
  Users,
  ClipboardList,
  Search,
  Camera,
  FileQuestion,
  ChevronRight,
  Sun,
  Cloud,
  Droplets,
  AlertTriangle,
  Plus,
  LogOut,
  Settings,
  User,
  Menu,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight as ChevronRightIcon
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
import { useToast } from "@/hooks/use-toast";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
};

interface Crop {
  id: string;
  name: string;
  name_hi: string | null;
  image_url: string | null;
  stages: string[] | null;
}

interface UserCrop {
  id: string;
  crop_id: string;
  stage: string;
  is_active: boolean;
  crop?: Crop;
}

interface Alert {
  id?: string;
  type?: string;
  severity: string;
  title: string;
  title_hi?: string | null;
  description: string | null;
  description_hi?: string | null;
  risk_level?: string | null;
  crop_id?: string | null;
  crop?: string;
  date?: string;
  actions?: string[];
}

interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  wind?: number;
  warning?: string;
}

const Sidebar = ({ isOpen, onClose, userName, userLocation, userProfileImage, isCollapsed, onToggleCollapse }: {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userLocation: string;
  userProfileImage?: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}) => {
  const location = useLocation();
  const { signOut } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Bug, label: t('nav.identify'), href: "/identify" },
    { icon: Bell, label: t('nav.alerts'), href: "/alerts" },
    { icon: ClipboardList, label: t('nav.sprayLog'), href: "/spray-log" },
    { icon: Users, label: t('nav.community'), href: "/community" },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full z-50
        bg-[#0B0B0B]/95 backdrop-blur-xl border-r border-white/10
        transform transition-all duration-300 lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'w-20' : 'w-72'}
      `}>
        {/* Grid texture overlay */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#FAF4EA 1px, transparent 1px), linear-gradient(90deg, #FAF4EA 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        <div className="flex flex-col h-full relative z-10">
          {/* Logo Section */}
          <div className="p-6 border-b border-white/10">
            <Link to="/dashboard" className="flex items-center gap-3">
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
              {!isCollapsed && <span className="font-display font-bold text-xl text-white">KrishiRakshak</span>}
            </Link>

            {/* Collapse toggle button - desktop only */}
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex absolute -right-3 top-8 w-6 h-6 rounded-full bg-[#B9F261] items-center justify-center text-[#0B0B0B] hover:scale-110 transition-transform shadow-lg"
            >
              {isCollapsed ? <ChevronRightIcon className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="lg:hidden absolute top-6 right-6 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Profile */}
          <div className={`border-b border-white/10 ${isCollapsed ? 'p-4' : 'p-6'}`}>
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
              <div className={`rounded-full bg-[#B9F261] flex items-center justify-center text-[#0B0B0B] font-bold overflow-hidden ${isCollapsed ? 'w-10 h-10 text-base' : 'w-12 h-12 text-lg'}`}>
                {userProfileImage ? (
                  <img
                    src={userProfileImage}
                    alt={userName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  userName.charAt(0).toUpperCase()
                )}
              </div>
              {!isCollapsed && (
                <div>
                  <p className="font-semibold text-white">{userName}</p>
                  <p className="text-sm text-white/50">{userLocation || 'Location not set'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className={`flex-1 space-y-1 overflow-y-auto ${isCollapsed ? 'p-2' : 'p-4'}`}>
            <Link
              to="/dashboard"
              className={`flex items-center rounded-xl transition-all duration-200 ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'} ${location.pathname === '/dashboard'
                ? 'bg-[#B9F261] text-[#0B0B0B]'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              title={isCollapsed ? t('nav.dashboard') : undefined}
            >
              <User className="w-5 h-5" />
              {!isCollapsed && <span className="font-medium">{t('nav.dashboard')}</span>}
            </Link>

            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center rounded-xl transition-all duration-200 ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'} ${location.pathname === item.href
                  ? 'bg-[#B9F261] text-[#0B0B0B]'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className="w-5 h-5" />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className={`border-t border-white/10 ${isCollapsed ? 'p-2' : 'p-4'}`}>
            <div className={`rounded-xl bg-red-500/15 border border-red-500/30 ${isCollapsed ? 'p-1' : 'p-2'}`}>
              <Button
                variant="ghost"
                className={`w-full text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg h-11 ${isCollapsed ? 'justify-center px-0' : 'justify-start gap-3'}`}
                onClick={handleLogout}
                title={isCollapsed ? t('nav.logout') : undefined}
              >
                <LogOut className="w-5 h-5" />
                {!isCollapsed && t('nav.logout')}
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [userCrops, setUserCrops] = useState<UserCrop[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temp: 0,
    condition: 'Loading...',
    humidity: 0,
    warning: undefined
  });
  const [selectedCropId, setSelectedCropId] = useState<string>("");
  const [selectedStage, setSelectedStage] = useState<string>("seedling");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const userName = profile?.name || user?.name || user?.email?.split('@')[0] || "Farmer";
  const userLocation = profile?.location || user?.location || "";

  useEffect(() => {
    fetchData();
  }, [user]);

  const getAuthToken = () => {
    // Try direct token first (set by AuthContext)
    const directToken = localStorage.getItem('token');
    if (directToken) {
      return directToken;
    }
    // Fallback to session format
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

  const fetchData = async () => {
    if (!user) return;

    setLoading(true);

    try {
      // Fetch all crops
      const cropsResponse = await fetch(`${API_URL}/api/crops`);
      const cropsData = await cropsResponse.json();
      if (cropsData) setCrops(cropsData);

      // Fetch user's crops
      const token = getAuthToken();
      if (token) {
        const userCropsResponse = await fetch(`${API_URL}/api/user/crops`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (userCropsResponse.ok) {
          const userCropsData = await userCropsResponse.json();

          if (Array.isArray(userCropsData) && cropsData) {
            const enrichedUserCrops = userCropsData.map((uc: any) => {
              let cropData;
              if (typeof uc.crop_id === 'object' && uc.crop_id) {
                cropData = uc.crop_id;
              } else {
                cropData = cropsData.find((c: Crop) => c.id === uc.crop_id);
              }

              return {
                ...uc,
                crop: cropData,
                crop_id: typeof uc.crop_id === 'object' ? uc.crop_id.id : uc.crop_id
              };
            });
            setUserCrops(enrichedUserCrops);
          }
        } else {
          console.warn('Failed to fetch user crops - user may not be authenticated');
        }
      }

      // Fetch weather and AI alerts
      try {
        const token = getAuthToken();
        const alertsResponse = await fetch(`${API_URL}/api/alerts/ai-alerts`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const alertsData = await alertsResponse.json();

        if (alertsData.success) {
          if (alertsData.weather) {
            const forecast = alertsData.forecast || [];
            const rainyDays = forecast.filter((f: any) =>
              f.condition?.toLowerCase().includes('rain')
            );

            setWeatherData({
              temp: alertsData.weather.temp || 0,
              condition: alertsData.weather.condition || 'Unknown',
              humidity: alertsData.weather.humidity || 0,
              wind: alertsData.weather.wind,
              warning: rainyDays.length > 0
                ? `Rain expected ${rainyDays[0].day} - avoid spraying`
                : alertsData.weather.humidity > 70
                  ? 'High humidity - monitor for fungal diseases'
                  : undefined
            });
          }

          const dashAlerts = (alertsData.alerts || []).slice(0, 3).map((a: any) => ({
            ...a,
            risk_level: a.severity,
            description: a.description
          }));
          setAlerts(dashAlerts);
        }
      } catch (alertError) {
        console.error('Error fetching AI alerts:', alertError);
        const basicAlertsResponse = await fetch(`${API_URL}/api/alerts?is_active=true&limit=3`);
        const basicAlerts = await basicAlertsResponse.json();
        if (basicAlerts) setAlerts(basicAlerts);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    setLoading(false);
  };

  const handleAddCrop = async () => {
    if (!user || !selectedCropId) return;

    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/api/user/crops`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          crop_id: selectedCropId,
          stage: selectedStage
        })
      });

      if (!response.ok) {
        const error = await response.json();
        if (error.error && error.error.includes('duplicate')) {
          toast({ title: "Crop already added", description: "This crop is already in your list.", variant: "destructive" });
        } else {
          toast({ title: "Error adding crop", description: error.error || 'Failed to add crop', variant: "destructive" });
        }
      } else {
        toast({ title: t('common.success'), description: "Crop added successfully!" });
        setDialogOpen(false);
        setSelectedCropId("");
        setSelectedStage("seedling");
        fetchData();
      }
    } catch (error: any) {
      toast({ title: "Error adding crop", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteCrop = async (userCropId: string) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/api/user/crops/${userCropId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        toast({ title: "Error deleting crop", description: error.error || 'Failed to delete crop', variant: "destructive" });
      } else {
        toast({ title: "Crop removed" });
        fetchData();
      }
    } catch (error: any) {
      toast({ title: "Error deleting crop", description: error.message, variant: "destructive" });
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleViewPests = (cropId: string) => {
    navigate(`/identify?tab=search&crop=${cropId}`);
  };

  const handleIdentify = (cropId: string) => {
    navigate(`/identify?tab=ai&crop=${cropId}`);
  };

  const getCropName = (crop: Crop) => {
    return i18n.language === 'hi' && crop.name_hi ? crop.name_hi : crop.name;
  };

  const formatStageName = (stage: string) => {
    return stage
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getAlertText = (alert: Alert) => {
    const isHindi = i18n.language === 'hi';
    return {
      title: isHindi && alert.title_hi ? alert.title_hi : alert.title,
      description: isHindi && alert.description_hi ? alert.description_hi : alert.description
    };
  };

  const quickActions = [
    {
      title: t('dashboard.identify') || "Identify Pest",
      description: "Upload image or describe symptoms",
      icon: Bug,
      href: "/identify",
      color: "bg-[#B9F261]",
      iconColor: "text-[#0B0B0B]"
    },
    {
      title: t('nav.chat') || "AI Chatbot",
      description: "Get instant farming advice",
      icon: MessageCircle,
      href: "/chat",
      color: "bg-[#FFD24A]",
      iconColor: "text-[#0B0B0B]"
    },
    {
      title: t('nav.alerts') || "View Alerts",
      description: "Check pest risk warnings",
      icon: Bell,
      href: "/alerts",
      color: "bg-orange-400",
      iconColor: "text-[#0B0B0B]"
    },
    {
      title: t('nav.sprayLog') || "Spray Log",
      description: "Track pesticide usage",
      icon: ClipboardList,
      href: "/spray-log",
      color: "bg-emerald-400",
      iconColor: "text-[#0B0B0B]"
    },
    {
      title: t('nav.community') || "Community",
      description: "Connect with farmers",
      icon: Users,
      href: "/community",
      color: "bg-sky-400",
      iconColor: "text-[#0B0B0B]"
    }
  ];

  const selectedCrop = crops.find(c => c.id === selectedCropId);

  return (
    <div className="min-h-screen bg-[#FAF4EA]">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName={userName}
        userLocation={userLocation}
        userProfileImage={profile?.profileImage}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6 text-[#0B0B0B]" />
              </button>
              <div>
                <h1 className="font-display font-bold text-2xl text-[#0B0B0B]">{t('dashboard.greeting')}, {userName.split(' ')[0]}!</h1>
                <p className="text-sm text-gray-500">{t('dashboard.overview')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />

              {/* Profile Avatar Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full bg-[#B9F261] flex items-center justify-center text-[#0B0B0B] font-bold hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    {profile?.profileImage ? (
                      <img
                        src={profile.profileImage}
                        alt={userName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{userName.charAt(0).toUpperCase()}</span>
                    )}
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white border-gray-200">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-[#0B0B0B]">{userName}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      {t('nav.myProfile', 'My Profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('nav.logout', 'Logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="gap-2 bg-[#B9F261] text-[#0B0B0B] hover:bg-[#a8e050] rounded-full px-5 font-semibold">
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">{t('dashboard.addCrop')}</span>
                    </Button>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="bg-white border-gray-200">
                  <DialogHeader>
                    <DialogTitle className="text-[#0B0B0B]">{t('dashboard.addCrop')}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block text-[#0B0B0B]">{t('identify.selectCrop')}</label>
                      <Select value={selectedCropId} onValueChange={setSelectedCropId}>
                        <SelectTrigger className="border-gray-200 focus:border-[#B9F261]">
                          <SelectValue placeholder={t('identify.selectCrop')} />
                        </SelectTrigger>
                        <SelectContent>
                          {crops.map((crop) => (
                            <SelectItem key={crop.id} value={crop.id}>
                              {getCropName(crop)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block text-[#0B0B0B]">{t('dashboard.stage')}</label>
                      <Select value={selectedStage} onValueChange={setSelectedStage}>
                        <SelectTrigger className="border-gray-200 focus:border-[#B9F261]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(selectedCrop?.stages || ['seedling', 'vegetative', 'flowering', 'fruiting', 'harvest']).map((stage) => (
                            <SelectItem key={stage} value={stage}>
                              {formatStageName(stage)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={handleAddCrop}
                      className="w-full bg-[#B9F261] text-[#0B0B0B] hover:bg-[#a8e050] rounded-xl"
                      disabled={!selectedCropId}
                    >
                      {t('dashboard.addCrop')}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </motion.header>

        <main className="p-6 space-y-8">
          {/* Weather & Alerts Row */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Weather Card - Clickable */}
            <motion.div variants={scaleIn}>
              <Link to="/alerts">
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="cursor-pointer"
                >
                  <Card className="bg-gradient-to-br from-[#B9F261] via-[#a8e050] to-[#FFD24A] border-0 overflow-hidden relative group">
                    {/* Decorative circles */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/20 blur-xl" />
                    <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-[#FFD24A]/30 blur-lg" />
                    <div className="absolute top-1/2 right-4 w-16 h-16 rounded-full bg-white/10 blur-md" />

                    <CardHeader className="pb-2 relative z-10">
                      <CardTitle className="text-base font-semibold flex items-center justify-between text-[#0B0B0B]">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-xl bg-[#0B0B0B] flex items-center justify-center shadow-lg">
                            <Sun className="w-6 h-6 text-[#FFD24A]" />
                          </div>
                          <span>{t('dashboard.weather')}</span>
                        </div>
                        <ChevronRightIcon className="w-5 h-5 text-[#0B0B0B]/50 group-hover:translate-x-1 transition-transform" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="flex items-end justify-between mb-4">
                        <div>
                          <p className="text-5xl font-display font-bold text-[#0B0B0B]">{weatherData.temp}°C</p>
                          <p className="text-sm text-[#0B0B0B]/70 flex items-center gap-1 mt-1">
                            <Cloud className="w-4 h-4" />
                            {weatherData.condition}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 justify-end mb-1">
                            <Droplets className="w-5 h-5 text-[#0B0B0B]" />
                            <span className="text-2xl font-bold text-[#0B0B0B]">{weatherData.humidity}%</span>
                          </div>
                          <p className="text-xs text-[#0B0B0B]/60">{t('dashboard.humidity')}</p>
                        </div>
                      </div>

                      {/* Always visible status/alert card */}
                      <div className="p-3 rounded-xl bg-white/90 backdrop-blur-sm border border-white/50 flex items-start gap-2 shadow-sm">
                        <AlertTriangle className="w-4 h-4 text-[#0B0B0B] flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-[#0B0B0B]/80">
                          {weatherData.warning || 'Click to view detailed weather alerts and pest risk analysis'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            </motion.div>

            {/* Alerts Card */}
            <motion.div variants={scaleIn} className="lg:col-span-2">
              <Card className="bg-white border-gray-200 h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold flex items-center gap-2 text-[#0B0B0B]">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-orange-600" />
                      </div>
                      {t('dashboard.alerts')}
                    </CardTitle>
                    <Link to="/alerts">
                      <Button variant="ghost" size="sm" className="gap-1 text-[#0B0B0B] hover:text-[#B9F261]">
                        {t('dashboard.viewAll')} <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {alerts.length === 0 ? (
                      <p className="text-gray-500 text-sm">{t('alerts.noAlerts')}</p>
                    ) : (
                      (() => {
                        const alert = alerts[0];
                        const alertText = getAlertText(alert);
                        const riskLevel = alert.risk_level || alert.severity || 'medium';
                        const isHigh = riskLevel === 'high';
                        return (
                          <motion.div
                            key={alert.id || 0}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`p-4 rounded-xl border flex items-start gap-3 ${isHigh
                              ? 'bg-red-50 border-red-200'
                              : 'bg-orange-50 border-orange-200'
                              }`}
                          >
                            <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${isHigh ? 'text-red-600' : 'text-orange-600'
                              }`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[#0B0B0B]">{alertText.title}</p>
                              {alertText.description && (
                                <p className="text-xs text-gray-600 mt-1">{alertText.description}</p>
                              )}
                              <Badge className={`mt-2 capitalize ${isHigh ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                }`}>
                                {riskLevel} Risk
                              </Badge>
                            </div>
                          </motion.div>
                        );
                      })()
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Quick Actions */}
          <div>
            <h2 className="font-display font-bold text-xl text-[#0B0B0B] mb-4">{t('dashboard.quickActions')}</h2>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {quickActions.map((action, index) => (
                <motion.div key={action.href} variants={scaleIn}>
                  <Link to={action.href}>
                    <motion.div
                      whileHover={{ y: -5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-white rounded-2xl p-5 border border-gray-200 hover:border-[#B9F261] hover:shadow-lg transition-all h-full"
                    >
                      <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-4`}>
                        <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                      </div>
                      <h3 className="font-semibold text-sm text-[#0B0B0B] mb-1">{action.title}</h3>
                      <p className="text-xs text-gray-500">{action.description}</p>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* My Crops */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-xl text-[#0B0B0B]">{t('dashboard.myCrops')}</h2>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-gray-200 hover:border-[#B9F261] rounded-full"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="w-4 h-4" />
                {t('dashboard.addCrop')}
              </Button>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="bg-white border-gray-200">
                    <CardContent className="p-5 animate-pulse">
                      <div className="h-12 w-12 rounded-xl bg-gray-200 mb-4" />
                      <div className="h-6 w-24 bg-gray-200 rounded mb-2" />
                      <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
                      <div className="flex gap-2">
                        <div className="h-9 flex-1 bg-gray-200 rounded" />
                        <div className="h-9 flex-1 bg-gray-200 rounded" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : userCrops.length === 0 ? (
              <Card className="bg-white border-gray-200">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#B9F261]/20 flex items-center justify-center mx-auto mb-4">
                    <Leaf className="w-8 h-8 text-[#B9F261]" />
                  </div>
                  <p className="text-gray-500 mb-4">{t('common.noData')}</p>
                  <Button onClick={() => setDialogOpen(true)} className="gap-2 bg-[#B9F261] text-[#0B0B0B] hover:bg-[#a8e050] rounded-full">
                    <Plus className="w-4 h-4" />
                    {t('dashboard.addCrop')}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {userCrops.map((userCrop) => (
                  <motion.div key={userCrop.id} variants={scaleIn}>
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-2xl p-5 border border-gray-200 hover:border-[#B9F261] hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-[#B9F261] flex items-center justify-center">
                          <Leaf className="w-6 h-6 text-[#0B0B0B]" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-emerald-100 text-emerald-700">{t('dashboard.active')}</Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-red-500"
                            onClick={() => handleDeleteCrop(userCrop.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <h3 className="font-display font-bold text-lg text-[#0B0B0B] mb-1">
                        {userCrop.crop ? getCropName(userCrop.crop) : 'Unknown Crop'}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        {t('dashboard.stage')}: {userCrop.stage.charAt(0).toUpperCase() + userCrop.stage.slice(1)}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-gray-200 hover:border-[#B9F261] rounded-lg"
                          onClick={() => handleViewPests(userCrop.crop_id)}
                        >
                          {t('dashboard.viewPests')}
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-[#B9F261] text-[#0B0B0B] hover:bg-[#a8e050] rounded-lg"
                          onClick={() => handleIdentify(userCrop.crop_id)}
                        >
                          {t('dashboard.identify')}
                        </Button>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Pest Identification Methods */}
          <div>
            <h2 className="font-display font-bold text-xl text-[#0B0B0B] mb-4">{t('dashboard.identifyPests')}</h2>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={scaleIn}>
                <Link to="/identify?tab=wizard">
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-[#B9F261] hover:shadow-lg transition-all h-full"
                  >
                    <div className="w-14 h-14 rounded-xl bg-[#B9F261]/20 flex items-center justify-center mb-4">
                      <FileQuestion className="w-7 h-7 text-[#B9F261]" />
                    </div>
                    <h3 className="font-display font-bold text-[#0B0B0B] mb-2">{t('identify.wizard')}</h3>
                    <p className="text-sm text-gray-500">
                      {t('identify.wizardDesc')}
                    </p>
                  </motion.div>
                </Link>
              </motion.div>

              <motion.div variants={scaleIn}>
                <Link to="/identify?tab=search">
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-[#FFD24A] hover:shadow-lg transition-all h-full"
                  >
                    <div className="w-14 h-14 rounded-xl bg-[#FFD24A]/20 flex items-center justify-center mb-4">
                      <Search className="w-7 h-7 text-[#FFD24A]" />
                    </div>
                    <h3 className="font-display font-bold text-[#0B0B0B] mb-2">{t('identify.search')}</h3>
                    <p className="text-sm text-gray-500">
                      {t('identify.searchDesc')}
                    </p>
                  </motion.div>
                </Link>
              </motion.div>

              <motion.div variants={scaleIn}>
                <Link to="/identify?tab=ai">
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-[#0B0B0B] hover:shadow-lg transition-all h-full"
                  >
                    <div className="w-14 h-14 rounded-xl bg-[#0B0B0B]/10 flex items-center justify-center mb-4">
                      <Camera className="w-7 h-7 text-[#0B0B0B]" />
                    </div>
                    <h3 className="font-display font-bold text-[#0B0B0B] mb-2">{t('identify.aiImage')}</h3>
                    <p className="text-sm text-gray-500">
                      {t('identify.aiImageDesc')}
                    </p>
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>

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

export default Dashboard;
