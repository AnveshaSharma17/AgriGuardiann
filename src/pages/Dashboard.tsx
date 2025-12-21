import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Trash2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
import { useToast } from "@/hooks/use-toast";
import LanguageSwitcher from "@/components/LanguageSwitcher";

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

const Sidebar = ({ isOpen, onClose, userName, userLocation }: {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userLocation: string;
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
    { icon: Settings, label: t('nav.settings'), href: "/settings" },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-50
        transform transition-transform duration-300 lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-sidebar-border">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-card">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg text-sidebar-foreground">KrishiRakshak</span>
            </Link>
          </div>

          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold">
                {userName.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-sidebar-foreground">{userName}</p>
                <p className="text-xs text-sidebar-foreground/60">{userLocation}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <Link
              to="/dashboard"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${location.pathname === '/dashboard'
                ? 'bg-sidebar-accent text-sidebar-primary'
                : 'text-sidebar-foreground hover:bg-sidebar-accent'
                }`}
            >
              <User className="w-5 h-5" />
              <span className="font-medium">{t('nav.dashboard')}</span>
            </Link>

            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${location.pathname === item.href
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-sidebar-border">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              {t('nav.logout')}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const userName = profile?.name || user?.email?.split('@')[0] || "Farmer";
  const userLocation = profile?.location || "India";

  useEffect(() => {
    fetchData();
  }, [user]);

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
      const userCropsResponse = await fetch(`${API_URL}/api/user/crops`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const userCropsData = await userCropsResponse.json();

      if (userCropsData && cropsData) {
        const enrichedUserCrops = userCropsData.map((uc: any) => {
          // Check if crop_id is already populated (object) or just an ID (string)
          let cropData;
          if (typeof uc.crop_id === 'object' && uc.crop_id) {
            // Already populated from backend
            cropData = uc.crop_id;
          } else {
            // Find from crops list
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

      // Fetch weather and AI alerts from the same endpoint
      try {
        const token = getAuthToken();
        const alertsResponse = await fetch(`${API_URL}/api/alerts/ai-alerts`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const alertsData = await alertsResponse.json();

        if (alertsData.success) {
          // Set weather data
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

          // Set alerts (limit to 3 for dashboard)
          const dashAlerts = (alertsData.alerts || []).slice(0, 3).map((a: any) => ({
            ...a,
            risk_level: a.severity,
            description: a.description
          }));
          setAlerts(dashAlerts);
        }
      } catch (alertError) {
        console.error('Error fetching AI alerts:', alertError);
        // Fallback to basic alerts
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
    // Remove underscores and capitalize each word
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
      color: "bg-primary/10 text-primary"
    },
    {
      title: t('nav.chat') || "AI Chatbot",
      description: "Get instant farming advice",
      icon: MessageCircle,
      href: "/chat",
      color: "bg-info/10 text-info"
    },
    {
      title: t('nav.alerts') || "View Alerts",
      description: "Check pest risk warnings",
      icon: Bell,
      href: "/alerts",
      color: "bg-warning/10 text-warning"
    },
    {
      title: t('nav.sprayLog') || "Spray Log",
      description: "Track pesticide usage",
      icon: ClipboardList,
      href: "/spray-log",
      color: "bg-success/10 text-success"
    },
    {
      title: t('nav.community') || "Community",
      description: "Connect with farmers",
      icon: Users,
      href: "/community",
      color: "bg-secondary/10 text-secondary"
    }
  ];

  const selectedCrop = crops.find(c => c.id === selectedCropId);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName={userName}
        userLocation={userLocation}
      />

      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 glass border-b border-border/50 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="font-display font-bold text-xl">{t('dashboard.greeting')}, {userName.split(' ')[0]}!</h1>
                <p className="text-sm text-muted-foreground">{t('dashboard.overview')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />

              {/* Profile Avatar Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold hover:opacity-90 transition-opacity overflow-hidden">
                    {profile?.profileImage ? (
                      <img
                        src={profile.profileImage}
                        alt={userName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{userName.charAt(0).toUpperCase()}</span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{userName}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      {t('nav.myProfile', 'My Profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('nav.logout', 'Logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="default" size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('dashboard.addCrop')}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('dashboard.addCrop')}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">{t('identify.selectCrop')}</label>
                      <Select value={selectedCropId} onValueChange={setSelectedCropId}>
                        <SelectTrigger>
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
                      <label className="text-sm font-medium mb-2 block">{t('dashboard.stage')}</label>
                      <Select value={selectedStage} onValueChange={setSelectedStage}>
                        <SelectTrigger>
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
                    <Button onClick={handleAddCrop} className="w-full" disabled={!selectedCropId}>
                      {t('dashboard.addCrop')}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-6 space-y-6">
          {/* Weather & Alerts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card variant="nature" className="lg:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Sun className="w-5 h-5 text-accent" />
                  {t('dashboard.weather')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-display font-bold">{weatherData.temp}°C</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Cloud className="w-4 h-4" />
                      {weatherData.condition}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground flex items-center gap-1 justify-end">
                      <Droplets className="w-4 h-4" />
                      {weatherData.humidity}% {t('dashboard.humidity')}
                    </p>
                  </div>
                </div>
                {weatherData.warning && (
                  <div className="mt-4 p-3 rounded-lg bg-warning/10 border border-warning/20 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-warning-foreground">{weatherData.warning}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card variant="default" className="lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Bell className="w-5 h-5 text-warning" />
                    {t('dashboard.alerts')}
                  </CardTitle>
                  <Link to="/alerts">
                    <Button variant="ghost" size="sm" className="gap-1">
                      {t('dashboard.viewAll')} <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.length === 0 ? (
                    <p className="text-muted-foreground text-sm">{t('alerts.noAlerts')}</p>
                  ) : (
                    alerts.map((alert, index) => {
                      const alertText = getAlertText(alert);
                      const riskLevel = alert.risk_level || alert.severity || 'medium';
                      const isHigh = riskLevel === 'high';
                      return (
                        <div
                          key={alert.id || index}
                          className={`p-3 rounded-lg border flex items-start gap-3 ${isHigh
                            ? 'bg-destructive/5 border-destructive/20'
                            : 'bg-warning/5 border-warning/20'
                            }`}
                        >
                          <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${isHigh ? 'text-destructive' : 'text-warning'
                            }`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{alertText.title}</p>
                            {alertText.description && (
                              <p className="text-xs text-muted-foreground mt-1">{alertText.description}</p>
                            )}
                            <Badge variant={isHigh ? 'destructive' : 'warning'} className="mt-1 capitalize">
                              {riskLevel} Risk
                            </Badge>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="font-display font-bold text-lg mb-4">{t('dashboard.quickActions')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {quickActions.map((action) => (
                <Link key={action.href} to={action.href}>
                  <Card variant="interactive" className="h-full">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-3`}>
                        <action.icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* My Crops */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg">{t('dashboard.myCrops')}</h2>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => setDialogOpen(true)}>
                <Plus className="w-4 h-4" />
                {t('dashboard.addCrop')}
              </Button>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <Card key={i} variant="feature">
                    <CardContent className="p-5 animate-pulse">
                      <div className="h-12 w-12 rounded-xl bg-muted mb-4" />
                      <div className="h-6 w-24 bg-muted rounded mb-2" />
                      <div className="h-4 w-32 bg-muted rounded mb-4" />
                      <div className="flex gap-2">
                        <div className="h-9 flex-1 bg-muted rounded" />
                        <div className="h-9 flex-1 bg-muted rounded" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : userCrops.length === 0 ? (
              <Card variant="feature">
                <CardContent className="p-8 text-center">
                  <Leaf className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">{t('common.noData')}</p>
                  <Button onClick={() => setDialogOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    {t('dashboard.addCrop')}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {userCrops.map((userCrop) => (
                  <Card key={userCrop.id} variant="feature">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center">
                          <Leaf className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="success">{t('dashboard.active')}</Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDeleteCrop(userCrop.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <h3 className="font-display font-bold text-lg mb-1">
                        {userCrop.crop ? getCropName(userCrop.crop) : 'Unknown Crop'}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {t('dashboard.stage')}: {userCrop.stage.charAt(0).toUpperCase() + userCrop.stage.slice(1)}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleViewPests(userCrop.crop_id)}
                        >
                          {t('dashboard.viewPests')}
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleIdentify(userCrop.crop_id)}
                        >
                          {t('dashboard.identify')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Pest Identification Methods */}
          <div>
            <h2 className="font-display font-bold text-lg mb-4">{t('dashboard.identifyPests')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/identify?tab=wizard">
                <Card variant="interactive" className="h-full">
                  <CardContent className="p-5">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <FileQuestion className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-bold mb-2">{t('identify.wizard')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('identify.wizardDesc')}
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/identify?tab=search">
                <Card variant="interactive" className="h-full">
                  <CardContent className="p-5">
                    <div className="w-12 h-12 rounded-xl bg-info/10 text-info flex items-center justify-center mb-4">
                      <Search className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-bold mb-2">{t('identify.search')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('identify.searchDesc')}
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/identify?tab=ai">
                <Card variant="interactive" className="h-full">
                  <CardContent className="p-5">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent-foreground flex items-center justify-center mb-4">
                      <Camera className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-bold mb-2">{t('identify.aiImage')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('identify.aiImageDesc')}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </main>
      </div>

      {/* Floating Chat Button */}
      <Link to="/chat">
        <button className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-hero shadow-glow flex items-center justify-center text-primary-foreground hover:scale-110 transition-transform z-50">
          <MessageCircle className="w-6 h-6" />
        </button>
      </Link>
    </div>
  );
};

export default Dashboard;
