import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Plus,
  Calendar,
  AlertTriangle,
  MessageCircle,
  Trash2,
  Loader2,
  Droplets,
  Leaf,
  Clock,
  ChevronLeft,
  ChevronRight,
  Beaker,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

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
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
};

interface SprayLogEntry {
  id: string;
  pesticide_name: string;
  dose: string | null;
  spray_date: string;
  crop_id: string | null;
  notes: string | null;
}

interface Crop {
  id: string;
  name: string;
}

const SprayLog = () => {
  const [logs, setLogs] = useState<SprayLogEntry[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [formData, setFormData] = useState({
    pesticide_name: "",
    crop_id: "",
    dose: "",
    spray_date: new Date().toISOString().split('T')[0],
    notes: ""
  });
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    fetchLogs();
    fetchCrops();
  }, [user]);

  // Helper to get auth token
  const getAuthToken = () => {
    const directToken = localStorage.getItem('token');
    if (directToken) return directToken;
    const session = localStorage.getItem('session');
    if (session) {
      try { return JSON.parse(session).access_token; } catch { return null; }
    }
    return null;
  };

  const fetchLogs = async () => {
    if (!user) return;

    const token = getAuthToken();
    if (!token) {
      console.warn('No auth token - user may not be logged in');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/spray-logs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      // Ensure data is an array
      setLogs(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Error fetching spray logs:', error);
      toast({ title: "Error loading logs", description: error.message, variant: "destructive" });
      setLogs([]);
    }
    setIsLoading(false);
  };

  const fetchCrops = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/crops`);
      const data = await response.json();
      setCrops(data || []);
    } catch (error) {
      console.error('Error fetching crops:', error);
    }
  };

  const getCropName = (cropId: string | null) => {
    if (!cropId) return "Unknown";
    return crops.find(c => c.id === cropId)?.name || "Unknown";
  };

  const checkForWarnings = (currentLogId: string, pesticide: string, date: string): string | null => {
    const currentLogDate = new Date(date);
    const fourteenDaysBeforeCurrentLog = new Date(currentLogDate.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Find OTHER logs (not this one) with the same pesticide that were sprayed within 14 days BEFORE this log's date
    const recentPriorLogs = logs.filter(log =>
      log.id !== currentLogId && // Exclude current log
      log.pesticide_name.toLowerCase() === pesticide.toLowerCase() &&
      new Date(log.spray_date) >= fourteenDaysBeforeCurrentLog &&
      new Date(log.spray_date) < currentLogDate // Only logs BEFORE this one
    );

    if (recentPriorLogs.length > 0) {
      const lastUseDate = new Date(recentPriorLogs[0].spray_date);
      const daysSinceLastUse = Math.floor((currentLogDate.getTime() - lastUseDate.getTime()) / (1000 * 60 * 60 * 24));
      return `Same pesticide was used ${daysSinceLastUse} day${daysSinceLastUse !== 1 ? 's' : ''} ago. Consider rotating to prevent resistance.`;
    }
    return null;
  };

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);

    try {
      const token = getAuthToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/spray-logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pesticide_name: formData.pesticide_name,
          crop_id: formData.crop_id || null,
          dose: formData.dose || null,
          spray_date: formData.spray_date,
          notes: formData.notes || null
        })
      });

      if (!response.ok) throw new Error('Failed to add log');

      const data = await response.json();
      setLogs([data, ...logs]);
      toast({ title: "Log added!", description: "Your spray log has been recorded." });
      setFormData({ pesticide_name: "", crop_id: "", dose: "", spray_date: new Date().toISOString().split('T')[0], notes: "" });
      setShowForm(false);
    } catch (error: any) {
      toast({ title: "Error adding log", description: error.message, variant: "destructive" });
    }
    setIsSaving(false);
  };

  const handleDeleteLog = async (id: string) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/spray-logs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete log');

      setLogs(logs.filter(log => log.id !== id));
      toast({ title: "Log deleted", description: "Spray log has been removed." });
    } catch (error: any) {
      toast({ title: "Error deleting log", description: error.message, variant: "destructive" });
    }
  };

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    return { daysInMonth, startingDay };
  };

  const getLogsForDate = (date: string) => {
    return logs.filter(log => log.spray_date.split('T')[0] === date);
  };

  const formatDateForCalendar = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Stats
  const thisMonthLogs = logs.filter(log => {
    const logDate = new Date(log.spray_date);
    return logDate.getMonth() === currentMonth.getMonth() && logDate.getFullYear() === currentMonth.getFullYear();
  });

  const uniquePesticides = [...new Set(logs.map(l => l.pesticide_name))];
  const uniqueCrops = [...new Set(logs.map(l => l.crop_id).filter(Boolean))];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF4EA] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-full border-4 border-[#B9F261] border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading spray logs...</p>
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
              <h1 className="font-display font-bold text-2xl text-[#0B0B0B]">{t('sprayLog.title')}</h1>
              <p className="text-sm text-gray-500">{t('sprayLog.recentEntries')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => setShowForm(true)}
                className="gap-2 bg-[#B9F261] text-[#0B0B0B] hover:bg-[#a8e050] rounded-full font-semibold px-5"
              >
                <Plus className="w-4 h-4" />{t('sprayLog.addEntry')}
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={scaleIn}>
            <Card className="bg-gradient-to-br from-[#B9F261] to-[#a8e050] border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#0B0B0B]/70 text-sm">Total Entries</p>
                    <p className="text-3xl font-display font-bold text-[#0B0B0B]">{logs.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[#0B0B0B]/10 flex items-center justify-center">
                    <Droplets className="w-6 h-6 text-[#0B0B0B]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={scaleIn}>
            <Card className="bg-gradient-to-br from-[#FFD24A] to-amber-400 border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#0B0B0B]/70 text-sm">This Month</p>
                    <p className="text-3xl font-display font-bold text-[#0B0B0B]">{thisMonthLogs.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[#0B0B0B]/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-[#0B0B0B]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={scaleIn}>
            <Card className="bg-gradient-to-br from-sky-400 to-blue-500 border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Pesticides Used</p>
                    <p className="text-3xl font-display font-bold text-white">{uniquePesticides.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <Beaker className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={scaleIn}>
            <Card className="bg-gradient-to-br from-emerald-400 to-green-500 border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Crops Treated</p>
                    <p className="text-3xl font-display font-bold text-white">{uniqueCrops.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Interactive Calendar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="bg-white border-gray-200 shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#B9F261]/20 to-[#FFD24A]/20 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-[#0B0B0B] flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#B9F261]" />
                    Spray Calendar
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</p>
              </CardHeader>
              <CardContent className="p-4">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-center text-xs font-medium text-gray-400 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty cells for days before month starts */}
                  {Array.from({ length: startingDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}

                  {/* Days of month */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = formatDateForCalendar(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                    const dayLogs = getLogsForDate(dateStr);
                    const hasLogs = dayLogs.length > 0;
                    const isToday = dateStr === new Date().toISOString().split('T')[0];
                    const isSelected = dateStr === selectedDate;

                    return (
                      <motion.button
                        key={day}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                        className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm relative transition-all ${isSelected
                          ? 'bg-[#B9F261] text-[#0B0B0B] font-bold shadow-md'
                          : isToday
                            ? 'bg-[#0B0B0B] text-white font-medium'
                            : hasLogs
                              ? 'bg-[#B9F261]/20 text-[#0B0B0B] hover:bg-[#B9F261]/40'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                      >
                        {day}
                        {hasLogs && !isSelected && (
                          <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#B9F261]" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Selected date logs */}
                <AnimatePresence>
                  {selectedDate && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-gray-100"
                    >
                      <p className="text-sm font-medium text-[#0B0B0B] mb-2">
                        {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                      {getLogsForDate(selectedDate).length > 0 ? (
                        <div className="space-y-2">
                          {getLogsForDate(selectedDate).map(log => (
                            <div key={log.id} className="p-2 rounded-lg bg-[#B9F261]/10 text-sm">
                              <p className="font-medium text-[#0B0B0B]">{log.pesticide_name}</p>
                              <p className="text-gray-500 text-xs">{getCropName(log.crop_id)} • {log.dose || 'No dose'}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400">No sprays on this day</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Legend */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-[#0B0B0B]" />
                    <span>Today</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-[#B9F261]/30" />
                    <span>Has sprays</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Logs List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            {/* Add Form Modal */}
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="bg-white border-gray-200 shadow-xl mb-6 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-[#B9F261]/20 to-[#FFD24A]/20 pb-4 flex flex-row items-center justify-between">
                      <CardTitle className="text-lg text-[#0B0B0B]">{t('sprayLog.addEntry')}</CardTitle>
                      <Button variant="ghost" size="icon" onClick={() => setShowForm(false)} className="rounded-full">
                        <X className="w-5 h-5" />
                      </Button>
                    </CardHeader>
                    <CardContent className="p-6">
                      <form onSubmit={handleAddLog} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-[#0B0B0B] mb-1">Pesticide Name *</label>
                            <Input
                              placeholder="e.g., Neem Oil, Chlorpyrifos"
                              value={formData.pesticide_name}
                              onChange={(e) => setFormData({ ...formData, pesticide_name: e.target.value })}
                              required
                              className="rounded-xl border-gray-200 focus:border-[#B9F261]"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#0B0B0B] mb-1">Crop</label>
                            <select
                              className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[#B9F261] outline-none"
                              value={formData.crop_id}
                              onChange={(e) => setFormData({ ...formData, crop_id: e.target.value })}
                            >
                              <option value="">Select crop</option>
                              {crops.map(crop => (
                                <option key={crop.id} value={crop.id}>{crop.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-[#0B0B0B] mb-1">Dose/Concentration</label>
                            <Input
                              placeholder="e.g., 2ml/L, 500g/acre"
                              value={formData.dose}
                              onChange={(e) => setFormData({ ...formData, dose: e.target.value })}
                              className="rounded-xl border-gray-200 focus:border-[#B9F261]"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#0B0B0B] mb-1">Spray Date *</label>
                            <Input
                              type="date"
                              value={formData.spray_date}
                              onChange={(e) => setFormData({ ...formData, spray_date: e.target.value })}
                              required
                              className="rounded-xl border-gray-200 focus:border-[#B9F261]"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#0B0B0B] mb-1">Notes</label>
                          <Input
                            placeholder="Additional notes (weather conditions, coverage area, etc.)"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="rounded-xl border-gray-200 focus:border-[#B9F261]"
                          />
                        </div>
                        <div className="flex gap-3 pt-2">
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button type="submit" disabled={isSaving} className="bg-[#B9F261] text-[#0B0B0B] hover:bg-[#a8e050] rounded-full px-6 font-semibold">
                              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                              {t('sprayLog.save')}
                            </Button>
                          </motion.div>
                          <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="rounded-full border-gray-200">
                            {t('common.cancel')}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Logs */}
            {logs.length === 0 ? (
              <Card className="bg-white border-gray-200 shadow-lg">
                <CardContent className="py-16 text-center">
                  <div className="w-20 h-20 rounded-full bg-[#B9F261]/20 flex items-center justify-center mx-auto mb-4">
                    <Droplets className="w-10 h-10 text-[#B9F261]" />
                  </div>
                  <p className="text-xl font-display font-bold text-[#0B0B0B]">No Spray Logs Yet</p>
                  <p className="text-gray-500 mt-2">{t('sprayLog.noEntries')}</p>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="mt-4 bg-[#B9F261] text-[#0B0B0B] hover:bg-[#a8e050] rounded-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Entry
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <motion.div
                className="space-y-3"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-semibold text-[#0B0B0B]">Recent Entries</h2>
                  <Badge className="bg-gray-100 text-gray-600">{logs.length} total</Badge>
                </div>

                {logs.map((log) => {
                  const warning = checkForWarnings(log.id, log.pesticide_name, log.spray_date);
                  const logDate = new Date(log.spray_date);
                  const daysSince = Math.floor((Date.now() - logDate.getTime()) / (1000 * 60 * 60 * 24));

                  return (
                    <motion.div key={log.id} variants={scaleIn}>
                      <motion.div whileHover={{ y: -3 }}>
                        <Card className={`bg-white border-2 transition-all ${warning ? "border-amber-200" : "border-gray-100 hover:border-[#B9F261]"}`}>
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${warning ? 'bg-amber-100' : 'bg-[#B9F261]/20'
                                  }`}>
                                  <Droplets className={`w-6 h-6 ${warning ? 'text-amber-600' : 'text-[#0B0B0B]'}`} />
                                </div>
                                <div>
                                  <h3 className="font-bold text-lg text-[#0B0B0B]">{log.pesticide_name}</h3>
                                  <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <Badge className="bg-emerald-100 text-emerald-700 gap-1">
                                      <Leaf className="w-3 h-3" />
                                      {getCropName(log.crop_id)}
                                    </Badge>
                                    {log.dose && (
                                      <Badge className="bg-sky-100 text-sky-700 gap-1">
                                        <Target className="w-3 h-3" />
                                        {log.dose}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-4 h-4" />
                                      {logDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      {daysSince === 0 ? 'Today' : daysSince === 1 ? '1 day ago' : `${daysSince} days ago`}
                                    </div>
                                  </div>
                                  {warning && (
                                    <div className="flex items-center gap-2 mt-3 p-2 rounded-lg bg-amber-50 border border-amber-200">
                                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                                      <span className="text-sm text-amber-700">{warning}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteLog(log.id)}
                                className="rounded-full hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </motion.div>
        </div>
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

export default SprayLog;
