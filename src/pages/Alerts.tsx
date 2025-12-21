import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
    ThermometerSun,
    MessageCircle,
    Loader2,
    RefreshCw,
    Leaf
} from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

            // Fetch AI-generated alerts (includes weather data)
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
                    badge: "destructive" as const,
                    bg: "bg-destructive/5 border-destructive/20",
                    icon: "text-destructive",
                    label: t('alerts.high', 'High Risk')
                };
            case "medium":
                return {
                    badge: "warning" as const,
                    bg: "bg-warning/5 border-warning/20",
                    icon: "text-warning",
                    label: t('alerts.medium', 'Medium Risk')
                };
            default:
                return {
                    badge: "success" as const,
                    bg: "bg-success/5 border-success/20",
                    icon: "text-success",
                    label: t('alerts.low', 'Low Risk')
                };
        }
    };

    const getWeatherIcon = (condition: string) => {
        const c = condition.toLowerCase();
        if (c.includes('rain') || c.includes('drizzle')) {
            return <Droplets className="w-6 h-6 text-info" />;
        }
        if (c.includes('cloud')) {
            return <Cloud className="w-6 h-6 text-muted-foreground" />;
        }
        if (c.includes('clear') || c.includes('sun')) {
            return <ThermometerSun className="w-6 h-6 text-accent" />;
        }
        return <Cloud className="w-6 h-6 text-muted-foreground" />;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading weather and alerts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-30 glass border-b border-border/50 px-4 py-3">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="font-display font-bold text-xl">{t('alerts.title', 'Pest Alerts & Warnings')}</h1>
                            <p className="text-sm text-muted-foreground">{t('alerts.weatherWarning', 'Weather-Based Recommendations')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleRefresh}
                            disabled={refreshing}
                        >
                            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                        </Button>
                        <LanguageSwitcher />
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 max-w-4xl">
                {/* Weather Overview */}
                <Card variant="nature" className="mb-6">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Cloud className="w-5 h-5 text-info" />
                            Weather & Pest Risk Forecast
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Current Weather */}
                            <div className="p-4 rounded-xl bg-background border border-border">
                                <p className="text-sm text-muted-foreground mb-1">Now</p>
                                <p className="text-3xl font-display font-bold">{weatherData.current.temp}°C</p>
                                <p className="text-sm text-muted-foreground">{weatherData.current.condition}</p>
                                <div className="mt-3 space-y-1 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Droplets className="w-4 h-4" />
                                        {weatherData.current.humidity}% Humidity
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Wind className="w-4 h-4" />
                                        {weatherData.current.wind} km/h Wind
                                    </div>
                                </div>
                            </div>

                            {/* Forecast */}
                            {weatherData.forecast.length > 0 ? (
                                weatherData.forecast.slice(0, 3).map((day) => (
                                    <div key={day.day} className="p-4 rounded-xl bg-background border border-border">
                                        <p className="text-sm text-muted-foreground mb-1">{day.day}</p>
                                        <div className="flex items-center gap-2 mb-2">
                                            {getWeatherIcon(day.condition)}
                                            <span className="font-semibold">{day.high}°/{day.low}°</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">{day.condition}</p>
                                        <Badge
                                            variant={day.pestRisk === "High" ? "destructive" : day.pestRisk === "Medium" ? "warning" : "success"}
                                            className="text-xs"
                                        >
                                            Pest Risk: {day.pestRisk}
                                        </Badge>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-3 flex items-center justify-center text-muted-foreground">
                                    <p>Forecast data unavailable</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4" />
                    Showing alerts for: <span className="font-medium text-foreground">{location}</span>
                </div>

                {/* Alerts List */}
                <div className="space-y-4">
                    {alerts.length > 0 ? (
                        alerts.map((alert, index) => {
                            const styles = getSeverityStyles(alert.severity);
                            return (
                                <Card key={alert.id || index} className={`${styles.bg} border-2`}>
                                    <CardContent className="p-5">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-10 h-10 rounded-xl ${alert.type === "pest" ? "bg-primary/10" :
                                                    alert.type === "disease" ? "bg-destructive/10" : "bg-info/10"
                                                } flex items-center justify-center flex-shrink-0`}>
                                                {alert.type === "pest" ? (
                                                    <Bug className={styles.icon + " w-5 h-5"} />
                                                ) : alert.type === "disease" ? (
                                                    <Leaf className={styles.icon + " w-5 h-5"} />
                                                ) : (
                                                    <Cloud className={styles.icon + " w-5 h-5"} />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-3 mb-2">
                                                    <h3 className="font-display font-bold">{alert.title}</h3>
                                                    <Badge variant={styles.badge} className="capitalize flex-shrink-0">
                                                        {styles.label}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>

                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    <Badge variant="outline" className="gap-1">
                                                        {alert.type === "pest" ? <Bug className="w-3 h-3" /> : <Leaf className="w-3 h-3" />}
                                                        {alert.crop}
                                                    </Badge>
                                                    <Badge variant="muted" className="gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {alert.date}
                                                    </Badge>
                                                </div>

                                                {/* Recommended Actions */}
                                                {alert.actions && alert.actions.length > 0 && (
                                                    <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                                                        <p className="font-medium text-sm mb-2 flex items-center gap-1">
                                                            <AlertTriangle className="w-4 h-4 text-warning" />
                                                            Recommended Actions:
                                                        </p>
                                                        <ul className="space-y-1">
                                                            {alert.actions.map((action, i) => (
                                                                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                                                    <span className="text-primary">•</span>
                                                                    {action}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    ) : (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <Bug className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-lg font-medium">No Active Alerts</p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    All clear! No pest or weather alerts for your region.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Alert Summary */}
                {alerts.length > 0 && (
                    <p className="text-center text-muted-foreground text-sm mt-8">
                        Showing {alerts.length} active alert{alerts.length !== 1 ? 's' : ''} for your region
                    </p>
                )}
            </main>

            {/* Floating Chat Button */}
            <Link to="/chat">
                <button className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-hero shadow-glow flex items-center justify-center text-primary-foreground hover:scale-110 transition-transform z-50">
                    <MessageCircle className="w-6 h-6" />
                </button>
            </Link>
        </div>
    );
};

export default Alerts;
