import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
    XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Advisory = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { t } = useTranslation();
    const [advisory, setAdvisory] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { pestResults, imagePreview, crop } = location.state || {};

    useEffect(() => {
        // Redirect if no pest data
        if (!pestResults || !pestResults.predictions || pestResults.predictions.length === 0) {
            toast({
                title: "No pest data",
                description: "Please identify a pest first",
                variant: "destructive",
            });
            navigate("/identify");
            return;
        }

        // Generate advisory
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
            // Set fallback advisory
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
        if (sev.includes("high") || sev.includes("severe")) return "destructive";
        if (sev.includes("medium") || sev.includes("moderate")) return "warning";
        return "success";
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-30 glass border-b border-border/50 px-4 py-3">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/identify">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="font-display font-bold text-xl">
                                Pest Management Advisory
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                AI-Powered Recommendations
                            </p>
                        </div>
                    </div>
                    <LanguageSwitcher />
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 max-w-5xl">
                {/* Pest Info Card */}
                <Card variant="nature" className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-6">
                            {imagePreview && (
                                <div className="w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 border-2 border-primary/20">
                                    <img
                                        src={imagePreview}
                                        alt="Identified pest"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <Bug className="w-6 h-6 text-primary" />
                                    <h2 className="font-display font-bold text-2xl">
                                        {topPest.pestName}
                                    </h2>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <Badge variant="default">
                                        {Math.round(topPest.confidence)}% Confidence
                                    </Badge>
                                    <Badge variant={getSeverityColor(topPest.severity)}>
                                        {topPest.severity || "Moderate"} Severity
                                    </Badge>
                                    {pestResults.cropDetected && (
                                        <Badge variant="outline">
                                            <Leaf className="w-3 h-3 mr-1" />
                                            {pestResults.cropDetected}
                                        </Badge>
                                    )}
                                </div>
                                {pestResults.observedSymptoms &&
                                    pestResults.observedSymptoms.length > 0 && (
                                        <div className="mt-3">
                                            <p className="text-sm font-medium mb-2">
                                                Observed Symptoms:
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                                {pestResults.observedSymptoms.map(
                                                    (symptom: string, i: number) => (
                                                        <Badge key={i} variant="muted" className="text-xs">
                                                            {symptom}
                                                        </Badge>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Loading State */}
                {isLoading && (
                    <Card variant="default" className="mb-6">
                        <CardContent className="p-12 text-center">
                            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                            <p className="text-lg font-medium">Generating AI Advisory...</p>
                            <p className="text-sm text-muted-foreground mt-2">
                                Creating personalized recommendations
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Advisory Content */}
                {!isLoading && advisory && (
                    <>
                        {/* Summary */}
                        <Card variant="default" className="mb-6">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-success" />
                                    AI Advisory Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-foreground leading-relaxed">
                                    {advisory.summary}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Treatment Options Grid */}
                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                            {/* Chemical Control */}
                            <Card variant="interactive" className="border-2">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Droplets className="w-5 h-5 text-blue-500" />
                                        Chemical Control
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {advisory.chemicalControl?.map((item: string, i: number) => (
                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                <span className="text-blue-500 mt-1">•</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Biological Control */}
                            <Card variant="interactive" className="border-2">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Bug className="w-5 h-5 text-green-500" />
                                        Biological Control
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {advisory.biologicalControl?.map((item: string, i: number) => (
                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                <span className="text-green-500 mt-1">•</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Cultural Control */}
                            <Card variant="interactive" className="border-2">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Leaf className="w-5 h-5 text-amber-500" />
                                        Cultural Practices
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {advisory.culturalControl?.map((item: string, i: number) => (
                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                <span className="text-amber-500 mt-1">•</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Prevention & Monitoring */}
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            {/* Prevention */}
                            <Card variant="default">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-primary" />
                                        Prevention Strategies
                                    </CardTitle>
                                    <CardDescription>
                                        Proactive measures to prevent future outbreaks
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {advisory.prevention?.map((item: string, i: number) => (
                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Monitoring */}
                            <Card variant="default">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Eye className="w-5 h-5 text-primary" />
                                        Monitoring Guide
                                    </CardTitle>
                                    <CardDescription>
                                        Regular monitoring to detect early signs
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {advisory.monitoring?.map((item: string, i: number) => (
                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                <Eye className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Alert Notice */}
                        <Card variant="default" className="mb-6 border-l-4 border-l-warning">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-sm">Important Notice</p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            This advisory is AI-generated and should be used as a guide. Always consult with local agricultural extension officers or certified agronomists for specific recommendations tailored to your region and conditions.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <Link to="/identify" className="flex-1">
                                <Button variant="outline" className="w-full">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Identification
                                </Button>
                            </Link>
                            <Link to="/chat" className="flex-1">
                                <Button variant="hero" className="w-full">
                                    Ask AI More Questions
                                </Button>
                            </Link>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default Advisory;
