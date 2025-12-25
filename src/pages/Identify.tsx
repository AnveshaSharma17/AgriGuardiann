import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Leaf,
  Bug,
  Search,
  Camera,
  FileQuestion,
  ChevronRight,
  ChevronLeft,
  Upload,
  Check,
  ArrowLeft,
  AlertCircle,
  Loader2,
  MessageCircle,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

// Mock pest data
const mockPests = [
  {
    id: 1,
    name: "Aphids",
    crop: "Wheat",
    symptoms: ["Yellowing leaves", "Curled leaves", "Sticky residue"],
    severity: "Medium",
  },
  {
    id: 2,
    name: "Whitefly",
    crop: "Cotton",
    symptoms: ["White insects on leaves", "Yellowing", "Honeydew"],
    severity: "High",
  },
  {
    id: 3,
    name: "Stem Borer",
    crop: "Rice",
    symptoms: ["Dead heart", "White head", "Holes in stem"],
    severity: "High",
  },
  {
    id: 4,
    name: "Thrips",
    crop: "Cotton",
    symptoms: ["Silvery patches", "Leaf curling", "Stunted growth"],
    severity: "Medium",
  },
  {
    id: 5,
    name: "Brown Plant Hopper",
    crop: "Rice",
    symptoms: ["Hopperburn", "Yellowing", "Wilting"],
    severity: "High",
  },
];

const crops = ["Wheat", "Rice", "Cotton", "Tomato", "Maize", "Sugarcane"];

const cropColors: { [key: string]: string } = {
  "Wheat": "from-amber-400 to-orange-500",
  "Rice": "from-emerald-400 to-teal-500",
  "Cotton": "from-sky-400 to-blue-500",
  "Tomato": "from-red-400 to-rose-500",
  "Maize": "from-yellow-400 to-amber-500",
  "Sugarcane": "from-lime-400 to-green-500",
};

const symptomOptions = [
  { id: "yellowing", label: "Yellowing leaves", category: "Discoloration", icon: "🍂" },
  { id: "curling", label: "Curled/Distorted leaves", category: "Deformation", icon: "🌀" },
  { id: "holes", label: "Holes in leaves/stems", category: "Physical damage", icon: "🕳️" },
  { id: "wilting", label: "Wilting plants", category: "Stress", icon: "🥀" },
  { id: "sticky", label: "Sticky residue (honeydew)", category: "Secretions", icon: "💧" },
  { id: "insects", label: "Visible insects", category: "Direct observation", icon: "🐛" },
  { id: "webbing", label: "Webbing on leaves", category: "Direct observation", icon: "🕸️" },
  { id: "stunted", label: "Stunted growth", category: "Growth issues", icon: "📉" },
];

const severityOptions = [
  { level: "Mild", color: "from-emerald-400 to-green-500", percentage: "<25% affected" },
  { level: "Moderate", color: "from-amber-400 to-orange-500", percentage: "25-50% affected" },
  { level: "Severe", color: "from-red-400 to-rose-500", percentage: ">50% affected" },
];

const Identify = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "wizard";
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResults, setAiResults] = useState<any>(null);
  const [aiCrop, setAiCrop] = useState("");
  const { toast } = useToast();
  const { t, i18n } = useTranslation();

  const setTab = (tab: string) => {
    setSearchParams({ tab });
    setWizardStep(1);
    setSelectedCrop("");
    setSelectedSymptoms([]);
    setSeverity("");
    setAiResults(null);
    setUploadedImage(null);
  };

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId)
        ? prev.filter((s) => s !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIAnalysis = async () => {
    if (!uploadedImage) {
      toast({
        title: "No image selected",
        description: "Please upload an image first.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const { fileToBase64 } = await import("@/lib/fileUtils");
      const base64Image = await fileToBase64(uploadedImage);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/ai/identify-image`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            image: base64Image,
            crop: aiCrop || undefined,
            language: i18n.language,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to analyze image");
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      if (!result.predictions || result.predictions.length === 0) {
        toast({
          title: "No Pests Detected",
          description: "The AI couldn't identify any pests in the image. Try uploading a clearer photo.",
          variant: "default",
        });
        setAiResults({
          predictions: [],
          observedSymptoms: result.observedSymptoms || [],
          followUpQuestions: [],
          cropDetected: result.cropDetected,
        });
        return;
      }

      setAiResults({
        predictions: result.predictions || [],
        observedSymptoms: result.observedSymptoms || [],
        followUpQuestions: result.followUpQuestions || [],
        cropDetected: result.cropDetected,
      });

      toast({
        title: "Analysis Complete",
        description: `Found ${result.predictions?.length || 0} potential pest(s)`,
      });
    } catch (error: any) {
      console.error("AI analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Could not analyze the image. Please try again.",
        variant: "destructive",
      });
      setAiResults(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredPests = mockPests.filter((pest) => {
    const matchesSearch =
      pest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pest.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pest.symptoms.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCrop = !selectedCrop || pest.crop === selectedCrop;
    return matchesSearch && matchesCrop;
  });

  const getWizardResults = () => {
    return mockPests.filter(
      (pest) =>
        (!selectedCrop || pest.crop === selectedCrop) &&
        selectedSymptoms.some((s) =>
          pest.symptoms.some((ps) =>
            ps.toLowerCase().includes(
              symptomOptions.find((so) => so.id === s)?.label.toLowerCase() || ""
            )
          )
        )
    );
  };

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
                {t("identify.title")}
              </h1>
              <p className="text-sm text-gray-500">
                {t("identify.wizardDesc")}
              </p>
            </div>
          </div>
          <LanguageSwitcher />
        </div>
      </motion.header>

      <main className="container mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-3 mb-8 overflow-x-auto pb-2"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setTab("wizard")}
            className={`flex items-center gap-2 px-5 py-3 rounded-full font-semibold transition-all ${activeTab === "wizard"
                ? "bg-[#B9F261] text-[#0B0B0B] shadow-lg"
                : "bg-white border border-gray-200 text-gray-600 hover:border-[#B9F261]"
              }`}
          >
            <FileQuestion className="w-5 h-5" />
            {t("identify.wizard")}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setTab("search")}
            className={`flex items-center gap-2 px-5 py-3 rounded-full font-semibold transition-all ${activeTab === "search"
                ? "bg-[#B9F261] text-[#0B0B0B] shadow-lg"
                : "bg-white border border-gray-200 text-gray-600 hover:border-[#B9F261]"
              }`}
          >
            <Search className="w-5 h-5" />
            {t("identify.search")}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setTab("ai")}
            className={`flex items-center gap-2 px-5 py-3 rounded-full font-semibold transition-all ${activeTab === "ai"
                ? "bg-[#B9F261] text-[#0B0B0B] shadow-lg"
                : "bg-white border border-gray-200 text-gray-600 hover:border-[#B9F261]"
              }`}
          >
            <Camera className="w-5 h-5" />
            {t("identify.aiImage")}
          </motion.button>
        </motion.div>

        {/* Wizard Tab */}
        {activeTab === "wizard" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto"
          >
            {/* Progress Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center mb-8"
            >
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: step * 0.1 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${wizardStep >= step
                        ? "bg-gradient-to-br from-[#B9F261] to-[#FFD24A] text-[#0B0B0B] shadow-lg"
                        : "bg-white border-2 border-gray-200 text-gray-400"
                      }`}
                  >
                    {wizardStep > step ? <Check className="w-6 h-6" /> : step}
                  </motion.div>
                  {step < 4 && (
                    <div className={`w-16 h-1 rounded-full ${wizardStep > step ? "bg-[#B9F261]" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </motion.div>

            {/* Step 1: Select Crop */}
            {wizardStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="bg-white border-gray-200 shadow-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-[#B9F261]/20 to-[#FFD24A]/20 pb-6">
                    <CardTitle className="text-2xl text-[#0B0B0B]">Select Your Crop</CardTitle>
                    <CardDescription className="text-gray-600">Which crop is affected?</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <motion.div
                      className="grid grid-cols-2 md:grid-cols-3 gap-4"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      {crops.map((crop) => (
                        <motion.button
                          key={crop}
                          variants={scaleIn}
                          whileHover={{ scale: 1.05, y: -5 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedCrop(crop)}
                          className={`p-5 rounded-2xl border-2 transition-all ${selectedCrop === crop
                              ? "border-[#B9F261] bg-[#B9F261]/10 shadow-lg"
                              : "border-gray-200 hover:border-[#B9F261]/50 bg-white"
                            }`}
                        >
                          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cropColors[crop]} flex items-center justify-center mx-auto mb-3 shadow-md`}>
                            <Leaf className="w-7 h-7 text-white" />
                          </div>
                          <p className="font-semibold text-[#0B0B0B]">{crop}</p>
                        </motion.button>
                      ))}
                    </motion.div>
                    <div className="flex justify-end mt-6">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={() => setWizardStep(2)}
                          disabled={!selectedCrop}
                          className="gap-2 bg-[#B9F261] text-[#0B0B0B] hover:bg-[#a8e050] rounded-full px-6 font-semibold"
                        >
                          Next Step
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Select Symptoms */}
            {wizardStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="bg-white border-gray-200 shadow-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-[#FFD24A]/20 to-orange-200/20 pb-6">
                    <CardTitle className="text-2xl text-[#0B0B0B]">What symptoms do you see?</CardTitle>
                    <CardDescription className="text-gray-600">Select all that apply</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 gap-3"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      {symptomOptions.map((symptom) => (
                        <motion.button
                          key={symptom.id}
                          variants={scaleIn}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSymptomToggle(symptom.id)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${selectedSymptoms.includes(symptom.id)
                              ? "border-[#B9F261] bg-[#B9F261]/10"
                              : "border-gray-200 hover:border-[#B9F261]/50 bg-white"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{symptom.icon}</span>
                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${selectedSymptoms.includes(symptom.id)
                                ? "border-[#B9F261] bg-[#B9F261]"
                                : "border-gray-300"
                              }`}>
                              {selectedSymptoms.includes(symptom.id) && (
                                <Check className="w-3 h-3 text-[#0B0B0B]" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-[#0B0B0B]">{symptom.label}</p>
                              <p className="text-xs text-gray-500">{symptom.category}</p>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </motion.div>
                    <div className="flex justify-between mt-6">
                      <Button
                        variant="outline"
                        onClick={() => setWizardStep(1)}
                        className="gap-2 rounded-full border-gray-200"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                      </Button>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={() => setWizardStep(3)}
                          disabled={selectedSymptoms.length === 0}
                          className="gap-2 bg-[#B9F261] text-[#0B0B0B] hover:bg-[#a8e050] rounded-full px-6 font-semibold"
                        >
                          Next Step
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Severity */}
            {wizardStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="bg-white border-gray-200 shadow-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-orange-200/20 to-red-200/20 pb-6">
                    <CardTitle className="text-2xl text-[#0B0B0B]">How severe is the damage?</CardTitle>
                    <CardDescription className="text-gray-600">Estimate the extent of damage to your crop</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <motion.div
                      className="grid grid-cols-3 gap-4"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      {severityOptions.map((sev) => (
                        <motion.button
                          key={sev.level}
                          variants={scaleIn}
                          whileHover={{ scale: 1.05, y: -5 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSeverity(sev.level)}
                          className={`p-6 rounded-2xl border-2 transition-all ${severity === sev.level
                              ? "border-[#B9F261] bg-[#B9F261]/10 shadow-lg"
                              : "border-gray-200 hover:border-[#B9F261]/50 bg-white"
                            }`}
                        >
                          <div className={`w-8 h-8 rounded-full mx-auto mb-3 bg-gradient-to-br ${sev.color}`} />
                          <p className="font-bold text-[#0B0B0B]">{sev.level}</p>
                          <p className="text-xs text-gray-500 mt-1">{sev.percentage}</p>
                        </motion.button>
                      ))}
                    </motion.div>
                    <div className="flex justify-between mt-6">
                      <Button
                        variant="outline"
                        onClick={() => setWizardStep(2)}
                        className="gap-2 rounded-full border-gray-200"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                      </Button>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={() => setWizardStep(4)}
                          disabled={!severity}
                          className="gap-2 bg-[#B9F261] text-[#0B0B0B] hover:bg-[#a8e050] rounded-full px-6 font-semibold"
                        >
                          Get Results
                          <Sparkles className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 4: Results */}
            {wizardStep === 4 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <Card className="bg-gradient-to-br from-[#B9F261] to-[#FFD24A] border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#0B0B0B]">
                      <Target className="w-6 h-6" />
                      Possible Pests Identified
                    </CardTitle>
                    <CardDescription className="text-[#0B0B0B]/70">
                      Based on: {selectedCrop} with {selectedSymptoms.length} symptoms ({severity} severity)
                    </CardDescription>
                  </CardHeader>
                </Card>

                <motion.div
                  className="space-y-3"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {getWizardResults().length > 0 ? (
                    getWizardResults().map((pest) => (
                      <motion.div key={pest.id} variants={scaleIn}>
                        <Link to={`/pests/${pest.id}`}>
                          <motion.div
                            whileHover={{ y: -5, scale: 1.01 }}
                            className="bg-white rounded-2xl p-5 border border-gray-200 hover:border-[#B9F261] hover:shadow-lg transition-all"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B9F261] to-[#FFD24A] flex items-center justify-center">
                                  <Bug className="w-6 h-6 text-[#0B0B0B]" />
                                </div>
                                <div>
                                  <h3 className="font-display font-bold text-lg text-[#0B0B0B]">{pest.name}</h3>
                                  <p className="text-sm text-gray-500 mb-2">{pest.crop}</p>
                                  <div className="flex flex-wrap gap-2">
                                    {pest.symptoms.slice(0, 3).map((symptom) => (
                                      <Badge key={symptom} className="bg-gray-100 text-gray-700 text-xs">
                                        {symptom}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <Badge className={pest.severity === "High" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}>
                                {pest.severity} Risk
                              </Badge>
                            </div>
                          </motion.div>
                        </Link>
                      </motion.div>
                    ))
                  ) : (
                    <Card className="bg-white border-gray-200">
                      <CardContent className="p-8 text-center">
                        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No matching pests found. Try the AI image identification.</p>
                        <Button
                          onClick={() => setTab("ai")}
                          className="mt-4 bg-[#B9F261] text-[#0B0B0B] hover:bg-[#a8e050] rounded-full"
                        >
                          Try AI Image Analysis
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>

                <Button
                  variant="outline"
                  onClick={() => setWizardStep(1)}
                  className="w-full gap-2 rounded-full border-gray-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Start Over
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Search Tab */}
        {activeTab === "search" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto"
          >
            <Card className="bg-white border-gray-200 shadow-lg mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Search pests, symptoms, or crops..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-12 rounded-xl border-gray-200 focus:border-[#B9F261] bg-gray-50"
                    />
                  </div>
                  <select
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="h-12 px-4 rounded-xl border-2 border-gray-200 bg-white focus:border-[#B9F261] outline-none"
                  >
                    <option value="">All Crops</option>
                    {crops.map((crop) => (
                      <option key={crop} value={crop}>{crop}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            <motion.div
              className="space-y-3"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {filteredPests.map((pest, index) => (
                <motion.div key={pest.id} variants={scaleIn}>
                  <Link to={`/pests/${pest.id}`}>
                    <motion.div
                      whileHover={{ y: -5, scale: 1.01 }}
                      className="bg-white rounded-2xl p-5 border border-gray-200 hover:border-[#B9F261] hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cropColors[pest.crop] || "from-gray-400 to-gray-500"} flex items-center justify-center`}>
                            <Bug className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h3 className="font-display font-bold text-lg text-[#0B0B0B]">{pest.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">Affects: {pest.crop}</p>
                            <div className="flex flex-wrap gap-2">
                              {pest.symptoms.map((symptom) => (
                                <Badge key={symptom} className="bg-gray-100 text-gray-700 text-xs">
                                  {symptom}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={pest.severity === "High" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}>
                            {pest.severity}
                          </Badge>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* AI Image Tab */}
        {activeTab === "ai" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="bg-white border-gray-200 shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#B9F261]/20 via-[#FFD24A]/20 to-orange-200/20 pb-6">
                <CardTitle className="flex items-center gap-2 text-2xl text-[#0B0B0B]">
                  <Zap className="w-6 h-6 text-[#FFD24A]" />
                  AI Image Analysis
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Upload a clear photo of the affected plant for instant pest identification
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {!aiResults ? (
                  <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {/* Crop Selection */}
                    <div>
                      <label className="block text-sm font-medium text-[#0B0B0B] mb-2">
                        Crop Type (Optional)
                      </label>
                      <select
                        value={aiCrop}
                        onChange={(e) => setAiCrop(e.target.value)}
                        className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 bg-white focus:border-[#B9F261] outline-none"
                      >
                        <option value="">Auto-detect crop</option>
                        {crops.map((crop) => (
                          <option key={crop} value={crop}>{crop}</option>
                        ))}
                      </select>
                    </div>

                    {/* Upload Area */}
                    <motion.label
                      whileHover={{ scale: 1.01 }}
                      className={`block border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${uploadedImage
                          ? "border-[#B9F261] bg-[#B9F261]/5"
                          : "border-gray-300 hover:border-[#B9F261]/50"
                        }`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      {uploadedImage ? (
                        <div>
                          {imagePreview && (
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="max-w-full max-h-64 mx-auto rounded-xl mb-4 object-contain"
                            />
                          )}
                          <div className="w-12 h-12 rounded-full bg-[#B9F261] flex items-center justify-center mx-auto mb-2">
                            <Check className="w-6 h-6 text-[#0B0B0B]" />
                          </div>
                          <p className="font-medium text-[#0B0B0B]">{uploadedImage.name}</p>
                          <p className="text-sm text-gray-500">Click to change image</p>
                        </div>
                      ) : (
                        <div>
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#B9F261] to-[#FFD24A] flex items-center justify-center mx-auto mb-4">
                            <Upload className="w-8 h-8 text-[#0B0B0B]" />
                          </div>
                          <p className="font-medium text-[#0B0B0B]">Click or drag to upload</p>
                          <p className="text-sm text-gray-500">JPG, PNG up to 10MB</p>
                        </div>
                      )}
                    </motion.label>

                    {/* Tips */}
                    <div className="bg-[#FAF4EA] rounded-xl p-4 border border-[#B9F261]/20">
                      <p className="font-medium text-sm text-[#0B0B0B] mb-2">Tips for best results:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Take a close-up, clear photo of the affected area</li>
                        <li>• Ensure good lighting (natural daylight preferred)</li>
                        <li>• Include both healthy and damaged parts if possible</li>
                      </ul>
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        size="lg"
                        className="w-full bg-gradient-to-r from-[#B9F261] to-[#FFD24A] text-[#0B0B0B] hover:opacity-90 rounded-full font-bold text-lg h-14"
                        onClick={handleAIAnalysis}
                        disabled={!uploadedImage || isAnalyzing}
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            Analyzing Image...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Analyze Image
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Analyzed"
                          className="w-full rounded-xl max-h-64 object-contain bg-gray-50"
                        />
                        {aiResults.cropDetected && (
                          <Badge className="absolute top-2 right-2 bg-[#B9F261] text-[#0B0B0B]">
                            {aiResults.cropDetected} detected
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Observed Symptoms */}
                    {aiResults.observedSymptoms && aiResults.observedSymptoms.length > 0 && (
                      <div className="bg-[#FAF4EA] rounded-xl p-4">
                        <p className="font-medium text-sm text-[#0B0B0B] mb-2">Observed Symptoms:</p>
                        <div className="flex flex-wrap gap-2">
                          {aiResults.observedSymptoms.map((symptom: string, i: number) => (
                            <Badge key={i} className="bg-white text-gray-700 border border-gray-200">
                              {symptom}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Results */}
                    <div className="space-y-3">
                      <p className="font-medium text-sm text-gray-500">AI Predictions:</p>
                      {aiResults.predictions.map((pred: any, index: number) => (
                        <motion.div
                          key={pred.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 rounded-xl border-2 ${index === 0
                              ? "border-[#B9F261] bg-[#B9F261]/5"
                              : "border-gray-200 bg-white"
                            }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${index === 0
                                  ? "bg-[#B9F261] text-[#0B0B0B]"
                                  : "bg-gray-100 text-gray-500"
                                }`}>
                                <Bug className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-bold text-[#0B0B0B]">{pred.name}</p>
                                {index === 0 && (
                                  <Badge className="bg-[#B9F261] text-[#0B0B0B] text-xs">Most likely</Badge>
                                )}
                              </div>
                            </div>
                            <p className="font-display font-bold text-xl text-[#0B0B0B]">
                              {Math.round(pred.confidence * 100)}%
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {pred.symptoms.map((s: string) => (
                              <Badge key={s} className="bg-gray-100 text-gray-600 text-xs">
                                {s}
                              </Badge>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Follow-up Questions */}
                    {aiResults.followUpQuestions && aiResults.followUpQuestions.length > 0 && (
                      <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
                        <p className="font-medium text-sm text-sky-800 mb-3 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Confirm symptoms to improve accuracy:
                        </p>
                        <div className="space-y-2">
                          {aiResults.followUpQuestions.map((q: string, i: number) => (
                            <label
                              key={i}
                              className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 cursor-pointer hover:border-[#B9F261] transition-colors"
                            >
                              <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                              <span className="text-sm text-[#0B0B0B]">{q}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 rounded-full border-gray-200"
                        onClick={() => {
                          setAiResults(null);
                          setUploadedImage(null);
                          setImagePreview(null);
                        }}
                      >
                        Upload New Image
                      </Button>
                      <Link
                        to="/advisory"
                        state={{
                          pestResults: aiResults,
                          imagePreview: imagePreview,
                          crop: aiCrop
                        }}
                        className="flex-1"
                      >
                        <Button className="w-full bg-[#B9F261] text-[#0B0B0B] hover:bg-[#a8e050] rounded-full font-semibold">
                          View Advisory
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
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

export default Identify;
