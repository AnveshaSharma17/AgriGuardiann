import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    AlertTriangle,
    Cloud,
    MapPin,
    Calendar,
    Bug,
    Droplets,
    Wind,
    Sun,
    CloudRain,
    CloudSnow,
    CloudLightning,
    Cloudy,
    MessageCircle,
    Loader2,
    RefreshCw,
    Leaf,
    Thermometer,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Animation Variants
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
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

interface WeatherCurrent {
    temp: number;
    humidity: number;
    wind: number;
    condition: string;
    description?: string;
}

interface ForecastDay {
    day: string;
    condition: string;
    high: number;
    low: number;
    humidity: number;
    pestRisk: string;
}

interface Alert {
    id?: number;
    type: 'pest' | 'weather' | 'disease';
    severity: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    crop: string;
    location?: string;
    date: string;
    actions: string[];
}

// Weather-based styling
const getWeatherStyles = (condition: string) => {
    const c = condition.toLowerCase();

    if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) {
        return {
            gradient: 'from-slate-500 via-blue-600 to-indigo-700',
            iconBg: 'bg-blue-500',
            icon: CloudRain,
            textColor: 'text-white',
            pattern: 'rain'
        };
    }
    if (c.includes('thunder') || c.includes('storm')) {
        return {
            gradient: 'from-slate-700 via-purple-800 to-slate-900',
            iconBg: 'bg-purple-500',
            icon: CloudLightning,
            textColor: 'text-white',
            pattern: 'storm'
        };
    }
    if (c.includes('snow') || c.includes('ice') || c.includes('frost')) {
        return {
            gradient: 'from-sky-300 via-blue-200 to-white',
            iconBg: 'bg-sky-400',
            icon: CloudSnow,
            textColor: 'text-slate-800',
            pattern: 'snow'
        };
    }
    if (c.includes('cloud') || c.includes('overcast') || c.includes('mist') || c.includes('fog')) {
        return {
            gradient: 'from-slate-400 via-gray-300 to-slate-200',
            iconBg: 'bg-slate-500',
            icon: Cloudy,
            textColor: 'text-slate-800',
            pattern: 'cloudy'
        };
    }
    if (c.includes('clear') || c.includes('sunny')) {
        return {
            gradient: 'from-amber-400 via-orange-400 to-yellow-300',
            iconBg: 'bg-amber-500',
            icon: Sun,
            textColor: 'text-slate-900',
            pattern: 'sunny'
        };
    }
    // Default mild/partly cloudy
    return {
        gradient: 'from-sky-400 via-blue-300 to-cyan-200',
        iconBg: 'bg-sky-500',
        icon: Cloud,
        textColor: 'text-slate-800',
        pattern: 'default'
    };
};

const Alerts = () => {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [location, setLocation] = useState('Loading...');
    const [weatherData, setWeatherData] = useState<{
        current: WeatherCurrent;
        forecast: ForecastDay[];
    }>({
        current: { temp: 0, humidity: 0, wind: 0, condition: 'Loading...' },
        forecast: []
    });
    const [alerts, setAlerts] = useState<Alert[]>([]);

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

    useEffect(() => {
        fetchAlertData();
    }, []);

    const fetchAlertData = async () => {
        try {
            const token = getAuthToken();
            if (!token) {
                toast({
                    title: "Authentication required",
                    description: "Please login to view personalized alerts",
                    variant: "destructive"
                });
                return;
            }

            const response = await fetch(`${API_URL}/api/alerts/ai-alerts`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch alerts');
            }

            const data = await response.json();

            if (data.success) {
                setLocation(data.location || 'Unknown');
                setWeatherData({
                    current: data.weather || { temp: 0, humidity: 0, wind: 0, condition: 'Unknown' },
                    forecast: data.forecast || []
                });
                setAlerts(data.alerts || []);
            }
        } catch (error: any) {
            console.error('Fetch alerts error:', error);
            toast({
                title: "Error loading alerts",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchAlertData();
        toast({
            title: "Alerts refreshed",
            description: "Latest weather and pest alerts loaded"
        });
    };

    const getSeverityStyles = (severity: string) => {
        switch (severity) {
            case "high":
                return {
                    bg: "bg-red-50 border-red-200",
                    iconBg: "bg-red-100",
                    iconColor: "text-red-600",
                    badge: "bg-red-100 text-red-700",
                    label: t('alerts.high', 'High Risk')
                };
            case "medium":
                return {
                    bg: "bg-orange-50 border-orange-200",
                    iconBg: "bg-orange-100",
                    iconColor: "text-orange-600",
                    badge: "bg-orange-100 text-orange-700",
                    label: t('alerts.medium', 'Medium Risk')
                };
            default:
                return {
                    bg: "bg-emerald-50 border-emerald-200",
                    iconBg: "bg-emerald-100",
                    iconColor: "text-emerald-600",
                    badge: "bg-emerald-100 text-emerald-700",
                    label: t('alerts.low', 'Low Risk')
                };
        }
    };

    const currentWeatherStyle = getWeatherStyles(weatherData.current.condition);
    const WeatherIcon = currentWeatherStyle.icon;

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAF4EA] flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                >
                    <div className="w-16 h-16 rounded-full border-4 border-[#B9F261] border-t-transparent animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Loading weather and alerts...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAF4EA]">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4"
            >
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-gray-100">
                                    <ArrowLeft className="w-5 h-5 text-[#0B0B0B]" />
                                </Button>
                            </motion.div>
                        </Link>
                        <div>
                            <h1 className="font-display font-bold text-2xl text-[#0B0B0B]">
                                {t('alerts.title', 'Pest Alerts & Warnings')}
                            </h1>
                            <p className="text-sm text-gray-500">
                                {t('alerts.weatherWarning', 'Weather-Based Recommendations')}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="rounded-xl hover:bg-gray-100"
                            >
                                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                            </Button>
                        </motion.div>
                        <LanguageSwitcher />
                    </div>
                </div>
            </motion.header>

            <main className="container mx-auto px-6 py-8 max-w-4xl">
                {/* Weather Overview - Dynamic Colors */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="border-0 shadow-xl mb-8 overflow-hidden">
                        <CardHeader className={`bg-gradient-to-r ${currentWeatherStyle.gradient} pb-4 relative overflow-hidden`}>
                            {/* Weather Pattern Background */}
                            <div className="absolute inset-0 opacity-20">
                                {currentWeatherStyle.pattern === 'rain' && (
                                    <div className="absolute inset-0" style={{
                                        backgroundImage: 'repeating-linear-gradient(transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 12px)',
                                        transform: 'rotate(-15deg) scale(2)'
                                    }} />
                                )}
                                {currentWeatherStyle.pattern === 'sunny' && (
                                    <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/30 blur-3xl" />
                                )}
                                {currentWeatherStyle.pattern === 'cloudy' && (
                                    <>
                                        <div className="absolute top-0 right-10 w-40 h-20 rounded-full bg-white/40 blur-2xl" />
                                        <div className="absolute bottom-0 left-10 w-60 h-24 rounded-full bg-white/30 blur-2xl" />
                                    </>
                                )}
                            </div>

                            <CardTitle className={`text-base flex items-center gap-2 ${currentWeatherStyle.textColor} relative z-10`}>
                                <div className={`w-10 h-10 rounded-xl ${currentWeatherStyle.iconBg} flex items-center justify-center shadow-lg`}>
                                    <Cloud className="w-5 h-5 text-white" />
                                </div>
                                Weather & Pest Risk Forecast
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5">
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-4 gap-4"
                                variants={staggerContainer}
                                initial="hidden"
                                animate="visible"
                            >
                                {/* Current Weather - Dynamic */}
                                <motion.div
                                    variants={scaleIn}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className={`p-5 rounded-2xl bg-gradient-to-br ${currentWeatherStyle.gradient} relative overflow-hidden shadow-lg`}
                                >
                                    {/* Pattern overlay */}
                                    <div className="absolute inset-0 opacity-20">
                                        {currentWeatherStyle.pattern === 'sunny' && (
                                            <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-white blur-2xl" />
                                        )}
                                        {currentWeatherStyle.pattern === 'rain' && (
                                            <div className="absolute inset-0" style={{
                                                backgroundImage: 'repeating-linear-gradient(transparent, transparent 8px, rgba(255,255,255,0.15) 8px, rgba(255,255,255,0.15) 10px)',
                                                transform: 'rotate(-20deg) scale(2)'
                                            }} />
                                        )}
                                        {currentWeatherStyle.pattern === 'cloudy' && (
                                            <div className="absolute top-0 right-0 w-20 h-12 rounded-full bg-white/40 blur-xl" />
                                        )}
                                    </div>

                                    <div className="relative z-10">
                                        <p className={`text-sm ${currentWeatherStyle.textColor} opacity-80 mb-1 font-medium`}>Now</p>
                                        <div className="flex items-center gap-3 mb-2">
                                            <WeatherIcon className={`w-10 h-10 ${currentWeatherStyle.textColor}`} />
                                            <p className={`text-4xl font-display font-bold ${currentWeatherStyle.textColor}`}>
                                                {weatherData.current.temp}°C
                                            </p>
                                        </div>
                                        <p className={`text-sm ${currentWeatherStyle.textColor} opacity-80 mb-3`}>
                                            {weatherData.current.condition}
                                        </p>
                                        <div className="space-y-2">
                                            <div className={`flex items-center gap-2 text-sm ${currentWeatherStyle.textColor} opacity-80`}>
                                                <Droplets className="w-4 h-4" />
                                                {weatherData.current.humidity}% Humidity
                                            </div>
                                            <div className={`flex items-center gap-2 text-sm ${currentWeatherStyle.textColor} opacity-80`}>
                                                <Wind className="w-4 h-4" />
                                                {weatherData.current.wind} km/h Wind
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Forecast Days - Separate Cards */}
                                {weatherData.forecast.length > 0 ? (
                                    weatherData.forecast.slice(0, 3).map((day, index) => {
                                        const dayStyle = getWeatherStyles(day.condition);
                                        const DayIcon = dayStyle.icon;

                                        return (
                                            <motion.div
                                                key={day.day}
                                                variants={scaleIn}
                                                whileHover={{ y: -5, scale: 1.02 }}
                                                className={`p-5 rounded-2xl bg-gradient-to-br ${dayStyle.gradient} relative overflow-hidden shadow-lg`}
                                            >
                                                {/* Weather pattern overlay */}
                                                <div className="absolute inset-0 opacity-15">
                                                    {dayStyle.pattern === 'sunny' && (
                                                        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white blur-2xl" />
                                                    )}
                                                    {dayStyle.pattern === 'rain' && (
                                                        <div className="absolute inset-0" style={{
                                                            backgroundImage: 'repeating-linear-gradient(transparent, transparent 6px, rgba(255,255,255,0.2) 6px, rgba(255,255,255,0.2) 8px)',
                                                            transform: 'rotate(-20deg) scale(2)'
                                                        }} />
                                                    )}
                                                    {dayStyle.pattern === 'cloudy' && (
                                                        <>
                                                            <div className="absolute top-2 right-2 w-16 h-8 rounded-full bg-white/50 blur-xl" />
                                                            <div className="absolute bottom-4 left-2 w-12 h-6 rounded-full bg-white/30 blur-lg" />
                                                        </>
                                                    )}
                                                    {dayStyle.pattern === 'snow' && (
                                                        <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
                                                    )}
                                                </div>

                                                <div className="relative z-10">
                                                    <p className={`text-sm ${dayStyle.textColor} opacity-80 mb-2 font-medium`}>{day.day}</p>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-10 h-10 rounded-xl bg-white/30 backdrop-blur-sm flex items-center justify-center">
                                                            <DayIcon className={`w-5 h-5 ${dayStyle.textColor}`} />
                                                        </div>
                                                        <span className={`text-xl font-bold ${dayStyle.textColor}`}>{day.high}°/{day.low}°</span>
                                                    </div>
                                                    <p className={`text-sm ${dayStyle.textColor} opacity-80 mb-3`}>{day.condition}</p>
                                                    <Badge className={
                                                        day.pestRisk === "High"
                                                            ? "bg-white/90 text-red-700"
                                                            : day.pestRisk === "Medium"
                                                                ? "bg-white/90 text-orange-700"
                                                                : "bg-white/90 text-emerald-700"
                                                    }>
                                                        Pest Risk: {day.pestRisk}
                                                    </Badge>
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                ) : (
                                    <div className="col-span-3 flex items-center justify-center p-8 text-gray-400 bg-white rounded-2xl">
                                        <p>Forecast data unavailable</p>
                                    </div>
                                )}
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Location */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-2 text-sm text-gray-500 mb-6"
                >
                    <MapPin className="w-4 h-4" />
                    Showing alerts for: <span className="font-semibold text-[#0B0B0B]">{location}</span>
                </motion.div>

                {/* Alerts List */}
                <motion.div
                    className="space-y-4"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    {alerts.length > 0 ? (
                        alerts.map((alert, index) => {
                            const styles = getSeverityStyles(alert.severity);
                            return (
                                <motion.div key={alert.id || index} variants={scaleIn}>
                                    <motion.div whileHover={{ y: -3 }}>
                                        <Card className={`${styles.bg} border-2 overflow-hidden`}>
                                            <CardContent className="p-5">
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-12 h-12 rounded-xl ${styles.iconBg} flex items-center justify-center flex-shrink-0`}>
                                                        {alert.type === "pest" ? (
                                                            <Bug className={`${styles.iconColor} w-6 h-6`} />
                                                        ) : alert.type === "disease" ? (
                                                            <Leaf className={`${styles.iconColor} w-6 h-6`} />
                                                        ) : (
                                                            <Cloud className={`${styles.iconColor} w-6 h-6`} />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-3 mb-2">
                                                            <h3 className="font-display font-bold text-lg text-[#0B0B0B]">{alert.title}</h3>
                                                            <Badge className={`${styles.badge} capitalize flex-shrink-0`}>
                                                                {styles.label}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-3">{alert.description}</p>

                                                        <div className="flex flex-wrap gap-2 mb-4">
                                                            <Badge className="bg-white/80 text-[#0B0B0B] gap-1 border border-gray-200">
                                                                {alert.type === "pest" ? <Bug className="w-3 h-3" /> : <Leaf className="w-3 h-3" />}
                                                                {alert.crop}
                                                            </Badge>
                                                            <Badge className="bg-gray-100 text-gray-600 gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {alert.date}
                                                            </Badge>
                                                        </div>

                                                        {/* Recommended Actions */}
                                                        {alert.actions && alert.actions.length > 0 && (
                                                            <div className="bg-white/60 rounded-xl p-4 border border-gray-100">
                                                                <p className="font-semibold text-sm text-[#0B0B0B] mb-2 flex items-center gap-2">
                                                                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                                                                    Recommended Actions:
                                                                </p>
                                                                <ul className="space-y-2">
                                                                    {alert.actions.map((action, i) => (
                                                                        <motion.li
                                                                            key={i}
                                                                            initial={{ opacity: 0, x: -10 }}
                                                                            animate={{ opacity: 1, x: 0 }}
                                                                            transition={{ delay: i * 0.1 }}
                                                                            className="text-sm text-gray-600 flex items-start gap-2"
                                                                        >
                                                                            <div className="w-1.5 h-1.5 rounded-full bg-[#B9F261] mt-2 flex-shrink-0" />
                                                                            {action}
                                                                        </motion.li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <motion.div variants={fadeInUp}>
                            <Card className="bg-white border-gray-200">
                                <CardContent className="p-12 text-center">
                                    <div className="w-20 h-20 rounded-full bg-[#B9F261]/20 flex items-center justify-center mx-auto mb-4">
                                        <Bug className="w-10 h-10 text-[#B9F261]" />
                                    </div>
                                    <p className="text-xl font-display font-bold text-[#0B0B0B]">No Active Alerts</p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        All clear! No pest or weather alerts for your region.
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </motion.div>

                {/* Alert Summary */}
                {alerts.length > 0 && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-center text-gray-500 text-sm mt-8"
                    >
                        Showing {alerts.length} active alert{alerts.length !== 1 ? 's' : ''} for your region
                    </motion.p>
                )}
            </main>

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

export default Alerts;
