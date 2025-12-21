import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
  Menu,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

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

const symptomOptions = [
  { id: "yellowing", label: "Yellowing leaves", category: "Discoloration" },
  { id: "curling", label: "Curled/Distorted leaves", category: "Deformation" },
  { id: "holes", label: "Holes in leaves/stems", category: "Physical damage" },
  { id: "wilting", label: "Wilting plants", category: "Stress" },
  { id: "sticky", label: "Sticky residue (honeydew)", category: "Secretions" },
  { id: "insects", label: "Visible insects", category: "Direct observation" },
  { id: "webbing", label: "Webbing on leaves", category: "Direct observation" },
  { id: "stunted", label: "Stunted growth", category: "Growth issues" },
];

const severityOptions = ["Mild", "Moderate", "Severe"];

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
    // Reset state when switching tabs
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
      // Create preview
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

      console.log("Sending image for analysis...");

      // Call real AI API with crop and language context
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/api/ai/identify-image`,
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
      console.log("AI analysis result:", result);

      if (result.error) {
        throw new Error(result.error);
      }

      // Handle empty predictions
      if (!result.predictions || result.predictions.length === 0) {
        toast({
          title: "No Pests Detected",
          description:
            "The AI couldn't identify any pests in the image. Try uploading a clearer photo.",
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
        description: `Found ${result.predictions?.length || 0
          } potential pest(s)`,
      });
    } catch (error: any) {
      console.error("AI analysis error:", error);
      toast({
        title: "Analysis Failed",
        description:
          error.message || "Could not analyze the image. Please try again.",
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
      pest.symptoms.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesCrop = !selectedCrop || pest.crop === selectedCrop;
    return matchesSearch && matchesCrop;
  });

  const getWizardResults = () => {
    // Simple matching based on symptoms
    return mockPests.filter(
      (pest) =>
        (!selectedCrop || pest.crop === selectedCrop) &&
        selectedSymptoms.some((s) =>
          pest.symptoms.some((ps) =>
            ps
              .toLowerCase()
              .includes(
                symptomOptions.find((so) => so.id === s)?.label.toLowerCase() ||
                ""
              )
          )
        )
    );
  };

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
              <h1 className="font-display font-bold text-xl">
                {t("identify.title")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("identify.wizardDesc")}
              </p>
            </div>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button
            variant={activeTab === "wizard" ? "default" : "outline"}
            onClick={() => setTab("wizard")}
            className="gap-2 whitespace-nowrap"
          >
            <FileQuestion className="w-4 h-4" />
            {t("identify.wizard")}
          </Button>
          <Button
            variant={activeTab === "search" ? "default" : "outline"}
            onClick={() => setTab("search")}
            className="gap-2 whitespace-nowrap"
          >
            <Search className="w-4 h-4" />
            {t("identify.search")}
          </Button>
          <Button
            variant={activeTab === "ai" ? "default" : "outline"}
            onClick={() => setTab("ai")}
            className="gap-2 whitespace-nowrap"
          >
            <Camera className="w-4 h-4" />
            {t("identify.aiImage")}
          </Button>
        </div>

        {/* Wizard Tab */}
        {activeTab === "wizard" && (
          <div className="max-w-2xl mx-auto">
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${wizardStep >= step
                        ? "bg-gradient-hero text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                      }`}
                  >
                    {wizardStep > step ? <Check className="w-5 h-5" /> : step}
                  </div>
                  {step < 4 && (
                    <div
                      className={`w-12 h-1 ${wizardStep > step ? "bg-primary" : "bg-muted"
                        }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Select Crop */}
            {wizardStep === 1 && (
              <Card variant="default">
                <CardHeader>
                  <CardTitle>Select Your Crop</CardTitle>
                  <CardDescription>Which crop is affected?</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {crops.map((crop) => (
                      <button
                        key={crop}
                        onClick={() => setSelectedCrop(crop)}
                        className={`p-4 rounded-xl border-2 transition-all ${selectedCrop === crop
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                          }`}
                      >
                        <Leaf
                          className={`w-8 h-8 mx-auto mb-2 ${selectedCrop === crop
                              ? "text-primary"
                              : "text-muted-foreground"
                            }`}
                        />
                        <p className="font-medium text-sm">{crop}</p>
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button
                      variant="hero"
                      onClick={() => setWizardStep(2)}
                      disabled={!selectedCrop}
                      className="gap-2"
                    >
                      Next Step
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Select Symptoms */}
            {wizardStep === 2 && (
              <Card variant="default">
                <CardHeader>
                  <CardTitle>What symptoms do you see?</CardTitle>
                  <CardDescription>Select all that apply</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {symptomOptions.map((symptom) => (
                      <button
                        key={symptom.id}
                        onClick={() => handleSymptomToggle(symptom.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${selectedSymptoms.includes(symptom.id)
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${selectedSymptoms.includes(symptom.id)
                                ? "border-primary bg-primary"
                                : "border-muted-foreground"
                              }`}
                          >
                            {selectedSymptoms.includes(symptom.id) && (
                              <Check className="w-3 h-3 text-primary-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {symptom.label}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {symptom.category}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setWizardStep(1)}
                      className="gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </Button>
                    <Button
                      variant="hero"
                      onClick={() => setWizardStep(3)}
                      disabled={selectedSymptoms.length === 0}
                      className="gap-2"
                    >
                      Next Step
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Severity */}
            {wizardStep === 3 && (
              <Card variant="default">
                <CardHeader>
                  <CardTitle>How severe is the damage?</CardTitle>
                  <CardDescription>
                    Estimate the extent of damage to your crop
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {severityOptions.map((sev) => (
                      <button
                        key={sev}
                        onClick={() => setSeverity(sev)}
                        className={`p-6 rounded-xl border-2 transition-all ${severity === sev
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                          }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full mx-auto mb-2 ${sev === "Mild"
                              ? "bg-success"
                              : sev === "Moderate"
                                ? "bg-warning"
                                : "bg-destructive"
                            }`}
                        />
                        <p className="font-medium">{sev}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {sev === "Mild"
                            ? "<25% affected"
                            : sev === "Moderate"
                              ? "25-50% affected"
                              : ">50% affected"}
                        </p>
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setWizardStep(2)}
                      className="gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </Button>
                    <Button
                      variant="hero"
                      onClick={() => setWizardStep(4)}
                      disabled={!severity}
                      className="gap-2"
                    >
                      Get Results
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Results */}
            {wizardStep === 4 && (
              <div className="space-y-4">
                <Card variant="nature">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bug className="w-5 h-5 text-primary" />
                      Possible Pests Identified
                    </CardTitle>
                    <CardDescription>
                      Based on: {selectedCrop} with {selectedSymptoms.length}{" "}
                      symptoms ({severity} severity)
                    </CardDescription>
                  </CardHeader>
                </Card>

                {getWizardResults().length > 0 ? (
                  getWizardResults().map((pest) => (
                    <Link key={pest.id} to={`/pests/${pest.id}`}>
                      <Card
                        variant="interactive"
                        className="hover:border-primary/30"
                      >
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-display font-bold text-lg">
                                {pest.name}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                {pest.crop}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {pest.symptoms.slice(0, 3).map((symptom) => (
                                  <Badge
                                    key={symptom}
                                    variant="muted"
                                    className="text-xs"
                                  >
                                    {symptom}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <Badge
                              variant={
                                pest.severity === "High"
                                  ? "destructive"
                                  : "warning"
                              }
                            >
                              {pest.severity} Risk
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                ) : (
                  <Card variant="default">
                    <CardContent className="p-8 text-center">
                      <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No matching pests found. Try the AI image
                        identification.
                      </p>
                      <Button
                        variant="default"
                        onClick={() => setTab("ai")}
                        className="mt-4"
                      >
                        Try AI Image Analysis
                      </Button>
                    </CardContent>
                  </Card>
                )}

                <Button
                  variant="outline"
                  onClick={() => setWizardStep(1)}
                  className="w-full gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Start Over
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Search Tab */}
        {activeTab === "search" && (
          <div className="max-w-3xl mx-auto">
            <Card variant="default" className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Search pests, symptoms, or crops..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-11"
                    />
                  </div>
                  <select
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="h-11 px-4 rounded-lg border-2 border-input bg-background focus:border-primary outline-none"
                  >
                    <option value="">All Crops</option>
                    {crops.map((crop) => (
                      <option key={crop} value={crop}>
                        {crop}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {filteredPests.map((pest) => (
                <Link key={pest.id} to={`/pests/${pest.id}`}>
                  <Card variant="interactive">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Bug className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-display font-bold text-lg">
                              {pest.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              Affects: {pest.crop}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {pest.symptoms.map((symptom) => (
                                <Badge
                                  key={symptom}
                                  variant="muted"
                                  className="text-xs"
                                >
                                  {symptom}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge
                            variant={
                              pest.severity === "High"
                                ? "destructive"
                                : "warning"
                            }
                          >
                            {pest.severity}
                          </Badge>
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* AI Image Tab */}
        {activeTab === "ai" && (
          <div className="max-w-2xl mx-auto">
            <Card variant="default">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  AI Image Analysis
                </CardTitle>
                <CardDescription>
                  Upload a clear photo of the affected plant for instant pest
                  identification
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!aiResults ? (
                  <div className="space-y-6">
                    {/* Crop Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Crop Type (Optional)
                      </label>
                      <select
                        value={aiCrop}
                        onChange={(e) => setAiCrop(e.target.value)}
                        className="w-full h-11 px-4 rounded-lg border-2 border-input bg-background focus:border-primary outline-none"
                      >
                        <option value="">Auto-detect crop</option>
                        {crops.map((crop) => (
                          <option key={crop} value={crop}>
                            {crop}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Upload Area */}
                    <label
                      className={`block border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${uploadedImage
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
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
                              className="max-w-full max-h-64 mx-auto rounded-lg mb-4 object-contain"
                            />
                          )}
                          <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-2">
                            <Check className="w-6 h-6 text-success" />
                          </div>
                          <p className="font-medium">{uploadedImage.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Click to change image
                          </p>
                        </div>
                      ) : (
                        <div>
                          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                            <Upload className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <p className="font-medium">Click or drag to upload</p>
                          <p className="text-sm text-muted-foreground">
                            JPG, PNG up to 10MB
                          </p>
                        </div>
                      )}
                    </label>

                    {/* Tips */}
                    <div className="bg-muted/50 rounded-xl p-4">
                      <p className="font-medium text-sm mb-2">
                        Tips for best results:
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>
                          • Take a close-up, clear photo of the affected area
                        </li>
                        <li>
                          • Ensure good lighting (natural daylight preferred)
                        </li>
                        <li>
                          • Include both healthy and damaged parts if possible
                        </li>
                      </ul>
                    </div>

                    <Button
                      variant="hero"
                      size="lg"
                      className="w-full"
                      onClick={handleAIAnalysis}
                      disabled={!uploadedImage || isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Analyzing Image...
                        </>
                      ) : (
                        <>
                          <Camera className="w-5 h-5" />
                          Analyze Image
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Analyzed"
                          className="w-full rounded-xl max-h-64 object-contain bg-muted"
                        />
                        {aiResults.cropDetected && (
                          <Badge className="absolute top-2 right-2 bg-success">
                            {aiResults.cropDetected} detected
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Observed Symptoms */}
                    {aiResults.observedSymptoms &&
                      aiResults.observedSymptoms.length > 0 && (
                        <div className="bg-muted/50 rounded-xl p-4">
                          <p className="font-medium text-sm mb-2">
                            Observed Symptoms:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {aiResults.observedSymptoms.map(
                              (symptom: string, i: number) => (
                                <Badge key={i} variant="secondary">
                                  {symptom}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* Results */}
                    <div className="space-y-3">
                      <p className="font-medium text-sm text-muted-foreground">
                        AI Predictions:
                      </p>
                      {aiResults.predictions.map((pred: any, index: number) => (
                        <div
                          key={pred.name}
                          className={`p-4 rounded-xl border-2 ${index === 0
                              ? "border-primary bg-primary/5"
                              : "border-border"
                            }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center ${index === 0
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                                  }`}
                              >
                                <Bug className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-bold">{pred.name}</p>
                                {index === 0 && (
                                  <Badge variant="success" className="text-xs">
                                    Most likely
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="font-display font-bold text-lg">
                              {Math.round(pred.confidence * 100)}%
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {pred.symptoms.map((s: string) => (
                              <Badge
                                key={s}
                                variant="muted"
                                className="text-xs"
                              >
                                {s}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Follow-up Questions */}
                    <div className="bg-info/5 border border-info/20 rounded-xl p-4">
                      <p className="font-medium text-sm mb-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-info" />
                        Confirm symptoms to improve accuracy:
                      </p>
                      <div className="space-y-2">
                        {aiResults.followUpQuestions.map(
                          (q: string, i: number) => (
                            <label
                              key={i}
                              className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border cursor-pointer hover:border-primary/50 transition-colors"
                            >
                              <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-border text-primary"
                              />
                              <span className="text-sm">{q}</span>
                            </label>
                          )
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1"
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
                        <Button variant="hero" className="w-full">
                          View Advisory
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
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

export default Identify;
