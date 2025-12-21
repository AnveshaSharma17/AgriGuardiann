import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Calendar, AlertTriangle, MessageCircle, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

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
  const [formData, setFormData] = useState({
    pesticide_name: "",
    crop_id: "",
    dose: "",
    spray_date: new Date().toISOString().split('T')[0]
  });
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    fetchLogs();
    fetchCrops();
  }, [user]);

  const fetchLogs = async () => {
    if (!user) return;

    try {
      const token = JSON.parse(localStorage.getItem('session') || '{}').access_token;
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/spray-logs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setLogs(data || []);
    } catch (error: any) {
      toast({ title: "Error loading logs", description: error.message, variant: "destructive" });
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

  const checkForWarnings = (pesticide: string, date: string): string | null => {
    const recentLogs = logs.filter(log =>
      log.pesticide_name.toLowerCase() === pesticide.toLowerCase() &&
      new Date(log.spray_date) > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    );
    if (recentLogs.length > 0) {
      return t('sprayLog.overuseWarning');
    }
    return null;
  };

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);

    try {
      const token = JSON.parse(localStorage.getItem('session') || '{}').access_token;
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
          spray_date: formData.spray_date
        })
      });

      if (!response.ok) throw new Error('Failed to add log');

      const data = await response.json();
      setLogs([data, ...logs]);
      toast({ title: "Log added!", description: "Your spray log has been recorded." });
      setFormData({ pesticide_name: "", crop_id: "", dose: "", spray_date: new Date().toISOString().split('T')[0] });
      setShowForm(false);
    } catch (error: any) {
      toast({ title: "Error adding log", description: error.message, variant: "destructive" });
    }
    setIsSaving(false);
  };

  const handleDeleteLog = async (id: string) => {
    try {
      const token = JSON.parse(localStorage.getItem('session') || '{}').access_token;
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-border/50 px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard"><Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button></Link>
            <div>
              <h1 className="font-display font-bold text-xl">{t('sprayLog.title')}</h1>
              <p className="text-sm text-muted-foreground">{t('sprayLog.recentEntries')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button onClick={() => setShowForm(true)} className="gap-2"><Plus className="w-4 h-4" />{t('sprayLog.addEntry')}</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-3xl">
        {showForm && (
          <Card className="mb-6">
            <CardHeader><CardTitle>{t('sprayLog.addEntry')}</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleAddLog} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder={t('sprayLog.pesticideName')}
                    value={formData.pesticide_name}
                    onChange={(e) => setFormData({ ...formData, pesticide_name: e.target.value })}
                    required
                  />
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.crop_id}
                    onChange={(e) => setFormData({ ...formData, crop_id: e.target.value })}
                  >
                    <option value="">{t('sprayLog.crop')}</option>
                    {crops.map(crop => (
                      <option key={crop.id} value={crop.id}>{crop.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder={t('sprayLog.dose')}
                    value={formData.dose}
                    onChange={(e) => setFormData({ ...formData, dose: e.target.value })}
                  />
                  <Input
                    type="date"
                    value={formData.spray_date}
                    onChange={(e) => setFormData({ ...formData, spray_date: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" variant="hero" disabled={isSaving}>
                    {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {t('sprayLog.save')}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>{t('common.cancel')}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {logs.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">{t('sprayLog.noEntries')}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => {
              const warning = checkForWarnings(log.pesticide_name, log.spray_date);
              return (
                <Card key={log.id} className={warning ? "border-warning/30" : ""}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold">{log.pesticide_name}</h3>
                        <p className="text-sm text-muted-foreground">{getCropName(log.crop_id)} • {log.dose || "No dose specified"}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />{log.spray_date}
                        </div>
                        {warning && (
                          <div className="flex items-center gap-2 mt-2 text-warning text-sm">
                            <AlertTriangle className="w-4 h-4" />{warning}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteLog(log.id)}
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      <Link to="/chat">
        <button className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-primary/80 shadow-lg flex items-center justify-center text-primary-foreground hover:scale-110 transition-transform z-50">
          <MessageCircle className="w-6 h-6" />
        </button>
      </Link>
    </div>
  );
};

export default SprayLog;
