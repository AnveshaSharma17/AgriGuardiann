import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    Bug,
    Leaf,
    Droplets,
    Shield,
    Eye,
    AlertTriangle,
    Loader2,
    CheckCircle2,
    MessageCircle,
    Sparkles,
    Beaker,
    TreePine,
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
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
};

const Advisory = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { t } = useTranslation();
    const [advisory, setAdvisory] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { pestResults, imagePreview, crop } = location.state || {};

    useEffect(() => {
        if (!pestResults || !pestResults.predictions || pestResults.predictions.length === 0) {
            toast({
                title: "No pest data",
                description: "Please identify a pest first",
                variant: "destructive",
            });
            navigate("/identify");
            return;
        }
        generateAdvisory();
    }, []);

    const generateAdvisory = async () => {
        try {
            setIsLoading(true);
            const topPest = pestResults.predictions[0];

            const response = await fetch(
                `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/ai/advisory`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        pest: topPest.pestName,
                        crop: crop || pestResults.cropDetected || "unknown",
                        severity: topPest.severity || "moderate",
                        symptoms: pestResults.observedSymptoms || [],
                        confidence: topPest.confidence,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to generate advisory");
            }

            const result = await response.json();
            setAdvisory(result.advisory);
        } catch (error: any) {
            console.error("Advisory generation error:", error);
            toast({
                title: "Failed to generate advisory",
                description: error.message || "Please try again",
                variant: "destructive",
            });
            setFallbackAdvisory();
        } finally {
            setIsLoading(false);
        }
    };

    const setFallbackAdvisory = () => {
        const topPest = pestResults.predictions[0];
        setAdvisory({
            summary: `Basic management recommendations for ${topPest.pestName}. Consult with a local agricultural expert for specific advice.`,
            chemicalControl: [
                "Apply recommended insecticides as per label instructions",
                "Rotate pesticide types to prevent resistance",
                "Follow safety precautions during application",
            ],
            biologicalControl: [
                "Encourage natural predators in the field",
                "Use biological pesticides if available",
                "Maintain biodiversity in crop surroundings",
            ],
            culturalControl: [
                "Remove and destroy infected plant parts",
                "Practice crop rotation",
                "Maintain proper spacing between plants",
            ],
            prevention: [
                "Regular field monitoring and scouting",
                "Use resistant varieties when available",
                "Maintain field hygiene",
            ],
            monitoring: [
                "Inspect plants weekly for pest presence",
                "Use pheromone traps if applicable",
                "Keep records of pest populations",
            ],
        });
    };

    if (!pestResults || !pestResults.predictions || pestResults.predictions.length === 0) {
        return null;
    }

    const topPest = pestResults.predictions[0];
    const getSeverityColor = (severity: string) => {
        const sev = severity?.toLowerCase() || "moderate";
        if (sev.includes("high") || sev.includes("severe")) return "bg-red-100 text-red-700";
        if (sev.includes("medium") || sev.includes("moderate")) return "bg-orange-100 text-orange-700";
        return "bg-emerald-100 text-emerald-700";
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
                        <Link to="/identify">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-gray-100">
                                    <ArrowLeft className="w-5 h-5 text-[#0B0B0B]" />
                                </Button>
                            </motion.div>
                        </Link>
                        <div>
                            <h1 className="font-display font-bold text-2xl text-[#0B0B0B]">
                                Pest Management Advisory
                            </h1>
                            <p className="text-sm text-gray-500">
                                AI-Powered Recommendations
                            </p>
                        </div>
                    </div>
                    <LanguageSwitcher />
                </div>
            </motion.header>

            <main className="container mx-auto px-6 py-8 max-w-5xl">
                {/* Pest Info Card - Hero Style */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="bg-gradient-to-br from-[#B9F261] via-[#a8e050] to-[#FFD24A] border-0 shadow-xl mb-8 overflow-hidden relative">
                        {/* Decorative elements */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/20 blur-2xl" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-[#FFD24A]/30 blur-xl" />

                        <CardContent className="p-6 relative z-10">
                            <div className="flex items-start gap-6">
                                {imagePreview && (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 border-4 border-white shadow-lg"
                                    >
                                        <img
                                            src={imagePreview}
                                            alt="Identified pest"
                                            className="w-full h-full object-cover"
                                        />
                                    </motion.div>
                                )}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 rounded-xl bg-[#0B0B0B] flex items-center justify-center shadow-lg">
                                            <Bug className="w-6 h-6 text-[#FFD24A]" />
                                        </div>
                                        <h2 className="font-display font-bold text-3xl text-[#0B0B0B]">
                                            {topPest.pestName}
                                        </h2>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <Badge className="bg-[#0B0B0B] text-white px-3 py-1">
                                            {Math.round(topPest.confidence)}% Confidence
                                        </Badge>
                                        <Badge className={getSeverityColor(topPest.severity)}>
                                            {topPest.severity || "Moderate"} Severity
                                        </Badge>
                                        {pestResults.cropDetected && (
                                            <Badge className="bg-white/80 text-[#0B0B0B]">
                                                <Leaf className="w-3 h-3 mr-1" />
                                                {pestResults.cropDetected}
                                            </Badge>
                                        )}
                                    </div>
                                    {pestResults.observedSymptoms && pestResults.observedSymptoms.length > 0 && (
                                        <div className="mt-3">
                                            <p className="text-sm font-medium text-[#0B0B0B]/70 mb-2">
                                                Observed Symptoms:
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {pestResults.observedSymptoms.map((symptom: string, i: number) => (
                                                    <Badge key={i} className="bg-white/70 text-[#0B0B0B] text-xs">
                                                        {symptom}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Loading State */}
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <Card className="bg-white border-gray-200 shadow-lg mb-8">
                            <CardContent className="p-12 text-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-16 h-16 mx-auto mb-4"
                                >
                                    <div className="w-16 h-16 rounded-full border-4 border-[#B9F261] border-t-transparent animate-spin" />
                                </motion.div>
                                <p className="text-xl font-display font-bold text-[#0B0B0B]">Generating AI Advisory...</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Creating personalized recommendations for your crop
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Advisory Content */}
                {!isLoading && advisory && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        {/* Summary Card */}
                        <motion.div variants={fadeInUp}>
                            <Card className="bg-white border-gray-200 shadow-lg mb-6 overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 pb-4">
                                    <CardTitle className="flex items-center gap-2 text-[#0B0B0B]">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                                            <Sparkles className="w-5 h-5 text-white" />
                                        </div>
                                        AI Advisory Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <p className="text-[#0B0B0B] leading-relaxed text-lg">
                                        {advisory.summary}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Treatment Options Grid */}
                        <motion.div
                            className="grid md:grid-cols-3 gap-4 mb-6"
                            variants={staggerContainer}
                        >
                            {/* Chemical Control */}
                            <motion.div variants={scaleIn}>
                                <motion.div whileHover={{ y: -5 }} className="h-full">
                                    <Card className="bg-white border-gray-200 hover:border-sky-300 hover:shadow-lg transition-all h-full overflow-hidden">
                                        <CardHeader className="bg-gradient-to-br from-sky-50 to-blue-50 pb-4">
                                            <CardTitle className="flex items-center gap-2 text-lg text-[#0B0B0B]">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shadow-md">
                                                    <Beaker className="w-5 h-5 text-white" />
                                                </div>
                                                Chemical Control
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-4">
                                            <ul className="space-y-3">
                                                {advisory.chemicalControl?.map((item: string, i: number) => (
                                                    <motion.li
                                                        key={i}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        className="flex items-start gap-2 text-sm"
                                                    >
                                                        <div className="w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0" />
                                                        <span className="text-gray-700">{item}</span>
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </motion.div>

                            {/* Biological Control */}
                            <motion.div variants={scaleIn}>
                                <motion.div whileHover={{ y: -5 }} className="h-full">
                                    <Card className="bg-white border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all h-full overflow-hidden">
                                        <CardHeader className="bg-gradient-to-br from-emerald-50 to-green-50 pb-4">
                                            <CardTitle className="flex items-center gap-2 text-lg text-[#0B0B0B]">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-md">
                                                    <Bug className="w-5 h-5 text-white" />
                                                </div>
                                                Biological Control
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-4">
                                            <ul className="space-y-3">
                                                {advisory.biologicalControl?.map((item: string, i: number) => (
                                                    <motion.li
                                                        key={i}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        className="flex items-start gap-2 text-sm"
                                                    >
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                                        <span className="text-gray-700">{item}</span>
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </motion.div>

                            {/* Cultural Control */}
                            <motion.div variants={scaleIn}>
                                <motion.div whileHover={{ y: -5 }} className="h-full">
                                    <Card className="bg-white border-gray-200 hover:border-amber-300 hover:shadow-lg transition-all h-full overflow-hidden">
                                        <CardHeader className="bg-gradient-to-br from-amber-50 to-orange-50 pb-4">
                                            <CardTitle className="flex items-center gap-2 text-lg text-[#0B0B0B]">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
                                                    <TreePine className="w-5 h-5 text-white" />
                                                </div>
                                                Cultural Practices
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-4">
                                            <ul className="space-y-3">
                                                {advisory.culturalControl?.map((item: string, i: number) => (
                                                    <motion.li
                                                        key={i}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        className="flex items-start gap-2 text-sm"
                                                    >
                                                        <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                                                        <span className="text-gray-700">{item}</span>
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </motion.div>
                        </motion.div>

                        {/* Prevention & Monitoring */}
                        <motion.div
                            className="grid md:grid-cols-2 gap-4 mb-6"
                            variants={staggerContainer}
                        >
                            {/* Prevention */}
                            <motion.div variants={scaleIn}>
                                <motion.div whileHover={{ y: -3 }}>
                                    <Card className="bg-white border-gray-200 hover:shadow-lg transition-all overflow-hidden">
                                        <CardHeader className="bg-gradient-to-r from-[#B9F261]/20 to-[#FFD24A]/20 pb-4">
                                            <CardTitle className="flex items-center gap-2 text-[#0B0B0B]">
                                                <div className="w-10 h-10 rounded-xl bg-[#B9F261] flex items-center justify-center">
                                                    <Shield className="w-5 h-5 text-[#0B0B0B]" />
                                                </div>
                                                Prevention Strategies
                                            </CardTitle>
                                            <CardDescription className="text-gray-500">
                                                Proactive measures to prevent future outbreaks
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="pt-4">
                                            <ul className="space-y-3">
                                                {advisory.prevention?.map((item: string, i: number) => (
                                                    <motion.li
                                                        key={i}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        className="flex items-start gap-2 text-sm"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4 text-[#B9F261] mt-0.5 flex-shrink-0" />
                                                        <span className="text-gray-700">{item}</span>
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </motion.div>

                            {/* Monitoring */}
                            <motion.div variants={scaleIn}>
                                <motion.div whileHover={{ y: -3 }}>
                                    <Card className="bg-white border-gray-200 hover:shadow-lg transition-all overflow-hidden">
                                        <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 pb-4">
                                            <CardTitle className="flex items-center gap-2 text-[#0B0B0B]">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
                                                    <Eye className="w-5 h-5 text-white" />
                                                </div>
                                                Monitoring Guide
                                            </CardTitle>
                                            <CardDescription className="text-gray-500">
                                                Regular monitoring to detect early signs
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="pt-4">
                                            <ul className="space-y-3">
                                                {advisory.monitoring?.map((item: string, i: number) => (
                                                    <motion.li
                                                        key={i}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        className="flex items-start gap-2 text-sm"
                                                    >
                                                        <Eye className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
                                                        <span className="text-gray-700">{item}</span>
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </motion.div>
                        </motion.div>

                        {/* Alert Notice */}
                        <motion.div variants={fadeInUp}>
                            <Card className="bg-amber-50 border-amber-200 mb-6 overflow-hidden">
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-amber-800">Important Notice</p>
                                            <p className="text-sm text-amber-700 mt-1">
                                                This advisory is AI-generated and should be used as a guide. Always consult with local agricultural extension officers or certified agronomists for specific recommendations tailored to your region and conditions.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div variants={fadeInUp} className="flex gap-4">
                            <Link to="/identify" className="flex-1">
                                <Button variant="outline" className="w-full rounded-full border-gray-200 h-12">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Identification
                                </Button>
                            </Link>
                            <Link to="/chat" className="flex-1">
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button className="w-full bg-[#B9F261] text-[#0B0B0B] hover:bg-[#a8e050] rounded-full font-semibold h-12">
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        Ask AI More Questions
                                    </Button>
                                </motion.div>
                            </Link>
                        </motion.div>
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

export default Advisory;
