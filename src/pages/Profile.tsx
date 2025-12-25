import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Camera,
    Loader2,
    Save,
    User as UserIcon,
    Leaf,
    MapPin,
    Mail,
    Phone,
    Globe,
    Calendar,
    Shield,
    Sparkles,
    ChevronRight,
    Star,
    Award,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
};

interface UserCrop {
    id: string;
    crop_id: {
        id: string;
        name: string;
        name_hi: string | null;
    };
    stage: string;
}

// Crop emoji mapping
const cropEmojis: Record<string, string> = {
    'Rice': '🌾',
    'Wheat': '🌾',
    'Cotton': '🧵',
    'Sugarcane': '🎋',
    'Mustard': '🌻',
    'Potato': '🥔',
    'Tomato': '🍅',
    'Onion': '🧅',
    'Maize': '🌽',
    'Soybean': '🫘',
    'Groundnut': '🥜',
    'Chilli': '🌶️',
    'Brinjal': '🍆',
    'Cabbage': '🥬',
};

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        phone: "",
        location: "",
        language: "en",
        profileImage: "",
        createdAt: ""
    });
    const [userCrops, setUserCrops] = useState<UserCrop[]>([]);
    const { user, updateProfile: updateAuthProfile } = useAuth();
    const { toast } = useToast();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const isHindi = i18n.language === 'hi';

    const getAuthToken = () => {
        // Check direct token first (from AuthContext)
        const directToken = localStorage.getItem('token');
        if (directToken) return directToken;

        // Fallback to session object
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
        fetchProfileData();
    }, [user]);

    const fetchProfileData = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            const token = getAuthToken();

            const profileResponse = await fetch(`${API_URL}/api/user/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const profileResult = await profileResponse.json();
            const userData = profileResult.user || profileResult;

            setProfileData({
                name: userData.name || "",
                email: userData.email || user.email || "",
                phone: userData.phone || "",
                location: userData.location || "",
                language: userData.language || "en",
                profileImage: userData.profileImage || "",
                createdAt: userData.createdAt || ""
            });

            const cropsResponse = await fetch(`${API_URL}/api/user/crops`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const cropsData = await cropsResponse.json();
            setUserCrops(cropsData || []);
        } catch (error: any) {
            toast({ title: "Error loading profile", description: error.message, variant: "destructive" });
        }
        setLoading(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast({ title: "File too large", description: "Please select an image under 5MB", variant: "destructive" });
            return;
        }

        if (!file.type.startsWith('image/')) {
            toast({ title: "Invalid file type", description: "Please select an image file", variant: "destructive" });
            return;
        }

        setUploading(true);
        try {
            const token = getAuthToken();
            const formData = new FormData();
            formData.append('profileImage', file);

            const response = await fetch(`${API_URL}/api/user/profile/upload-image`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (!response.ok) throw new Error('Failed to upload image');

            const result = await response.json();
            setProfileData(prev => ({ ...prev, profileImage: result.profileImage }));

            if (updateAuthProfile) {
                await updateAuthProfile({ profileImage: result.profileImage });
            }

            toast({ title: isHindi ? "फोटो अपडेट हो गई!" : "Profile image updated!" });
        } catch (error: any) {
            toast({ title: "Upload failed", description: error.message, variant: "destructive" });
        }
        setUploading(false);
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const token = getAuthToken();
            const response = await fetch(`${API_URL}/api/user/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: profileData.name,
                    phone: profileData.phone,
                    location: profileData.location,
                    language: profileData.language
                })
            });

            if (!response.ok) throw new Error('Failed to update profile');

            const updatedProfile = await response.json();

            if (profileData.language !== i18n.language) {
                i18n.changeLanguage(profileData.language);
            }

            if (updateAuthProfile) {
                await updateAuthProfile({
                    name: updatedProfile.name,
                    location: updatedProfile.location,
                    language: updatedProfile.language
                });
            }

            toast({
                title: isHindi ? "प्रोफ़ाइल अपडेट हो गई!" : "Profile updated!",
                description: isHindi ? "आपके बदलाव सेव हो गए हैं।" : "Your changes have been saved successfully."
            });
        } catch (error: any) {
            toast({ title: "Update failed", description: error.message, variant: "destructive" });
        }
        setSaving(false);
    };

    const getCropName = (crop: any) => {
        return i18n.language === 'hi' && crop.name_hi ? crop.name_hi : crop.name;
    };

    const getCropEmoji = (cropName: string) => {
        return cropEmojis[cropName] || '🌱';
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return isHindi ? "उपलब्ध नहीं" : "N/A";
        const date = new Date(dateString);
        if (isHindi) {
            return date.toLocaleDateString('hi-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getAccountAge = (dateString: string) => {
        if (!dateString) return "";
        const created = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays < 30) return isHindi ? `${diffDays} दिन पहले` : `${diffDays} days ago`;
        if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return isHindi ? `${months} महीने पहले` : `${months} months ago`;
        }
        const years = Math.floor(diffDays / 365);
        return isHindi ? `${years} साल पहले` : `${years} years ago`;
    };

    // Get avatar gradient color based on name
    const getAvatarGradient = (name: string) => {
        const colors = [
            'from-[#B9F261] to-[#FFD24A]',
            'from-[#FFD24A] to-amber-500',
            'from-emerald-400 to-[#B9F261]',
            'from-sky-400 to-emerald-400',
            'from-violet-400 to-pink-400',
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAF4EA] flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="w-16 h-16 rounded-full border-4 border-[#B9F261] border-t-transparent animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">{isHindi ? "लोड हो रहा है..." : "Loading profile..."}</p>
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
                className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200 px-4 py-3"
            >
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard">
                            <Button variant="ghost" size="icon" className="rounded-xl">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#B9F261] to-[#FFD24A] flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-[#0B0B0B]" />
                            </div>
                            <div>
                                <h1 className="font-display font-bold text-xl text-[#0B0B0B]">
                                    {isHindi ? "मेरी प्रोफ़ाइल" : "My Profile"}
                                </h1>
                                <p className="text-sm text-gray-500">
                                    {isHindi ? "खाता सेटिंग्स प्रबंधित करें" : "Manage your account settings"}
                                </p>
                            </div>
                        </div>
                    </div>
                    <LanguageSwitcher />
                </div>
            </motion.header>

            <main className="container mx-auto px-4 py-6 max-w-4xl">
                <motion.div
                    className="grid gap-6"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Profile Hero Card */}
                    <motion.div variants={fadeInUp}>
                        <Card className="border-2 border-[#B9F261]/30 overflow-hidden bg-gradient-to-br from-[#B9F261] via-[#d4f590] to-[#FFD24A]">
                            {/* Decorative Elements */}
                            <div className="absolute inset-0 opacity-30 pointer-events-none">
                                <div className="absolute top-4 left-10 w-20 h-20 rounded-full bg-white/40" />
                                <div className="absolute bottom-10 right-20 w-32 h-32 rounded-full bg-white/30" />
                                <div className="absolute top-20 right-40 w-16 h-16 rounded-full bg-white/25" />
                                <div className="absolute bottom-4 left-1/3 w-24 h-24 rounded-full bg-yellow-300/30" />
                            </div>

                            <CardContent className="relative pt-8 pb-8">
                                {/* Profile Image */}
                                <div className="flex flex-col md:flex-row items-center md:items-center gap-6">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="relative"
                                    >
                                        <div className="w-32 h-32 rounded-2xl overflow-hidden bg-white flex items-center justify-center border-4 border-white shadow-2xl">
                                            {profileData.profileImage ? (
                                                <img
                                                    src={profileData.profileImage}
                                                    alt={profileData.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-5xl font-bold text-[#B9F261] drop-shadow-sm">
                                                    {profileData.name.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <label
                                            htmlFor="profile-upload"
                                            className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-[#0B0B0B] text-white flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors shadow-lg"
                                        >
                                            {uploading ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <Camera className="w-5 h-5" />
                                            )}
                                        </label>
                                        <input
                                            id="profile-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                        />
                                    </motion.div>

                                    <div className="flex-1 text-center md:text-left">
                                        <h2 className="text-3xl font-display font-bold text-[#0B0B0B] flex items-center justify-center md:justify-start gap-2">
                                            {profileData.name}
                                            <Sparkles className="w-6 h-6 text-amber-600" />
                                        </h2>
                                        <p className="text-[#0B0B0B]/70 flex items-center justify-center md:justify-start gap-2 mt-1">
                                            <Mail className="w-4 h-4" />
                                            {profileData.email}
                                        </p>
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-4">
                                            <Badge className="bg-white/80 text-[#0B0B0B] border border-white shadow-sm">
                                                <Award className="w-3 h-3 mr-1 text-[#B9F261]" />
                                                {isHindi ? "किसान" : "Farmer"}
                                            </Badge>
                                            {profileData.location && (
                                                <Badge className="bg-white/80 text-[#0B0B0B] border border-white shadow-sm">
                                                    <MapPin className="w-3 h-3 mr-1 text-amber-500" />
                                                    {profileData.location}
                                                </Badge>
                                            )}
                                            {profileData.createdAt && (
                                                <Badge className="bg-white/80 text-[#0B0B0B] border border-white shadow-sm">
                                                    <Calendar className="w-3 h-3 mr-1 text-emerald-500" />
                                                    {isHindi ? "सदस्य बने" : "Joined"} {getAccountAge(profileData.createdAt)}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Profile Information Card */}
                    <motion.div variants={fadeInUp}>
                        <Card className="border-2 border-gray-100">
                            <CardHeader className="bg-gradient-to-r from-[#B9F261]/10 to-[#FFD24A]/5 border-b border-gray-100">
                                <CardTitle className="flex items-center gap-2 text-[#0B0B0B]">
                                    <Shield className="w-5 h-5 text-[#B9F261]" />
                                    {isHindi ? "प्रोफ़ाइल जानकारी" : "Profile Information"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-5">
                                {/* Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="flex items-center gap-2 text-gray-700">
                                        <UserIcon className="w-4 h-4 text-gray-400" />
                                        {isHindi ? "नाम" : "Name"}
                                    </Label>
                                    <Input
                                        id="name"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder={isHindi ? "अपना नाम दर्ज करें" : "Enter your name"}
                                        className="border-gray-200 focus:border-[#B9F261] focus:ring-[#B9F261] rounded-xl h-12"
                                    />
                                </div>

                                {/* Email (Read-only) */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="flex items-center gap-2 text-gray-700">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        {isHindi ? "ईमेल पता" : "Email Address"}
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={profileData.email}
                                        disabled
                                        className="bg-gray-50 border-gray-200 rounded-xl h-12"
                                    />
                                    <p className="text-xs text-gray-400">
                                        {isHindi ? "ईमेल बदला नहीं जा सकता" : "Email cannot be changed"}
                                    </p>
                                </div>

                                {/* Phone Number - NEW FIELD */}
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="flex items-center gap-2 text-gray-700">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        {isHindi ? "फ़ोन नंबर" : "Phone Number"}
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                                        placeholder={isHindi ? "+91 98765 43210" : "+91 98765 43210"}
                                        className="border-gray-200 focus:border-[#B9F261] focus:ring-[#B9F261] rounded-xl h-12"
                                    />
                                </div>

                                {/* Location */}
                                <div className="space-y-2">
                                    <Label htmlFor="location" className="flex items-center gap-2 text-gray-700">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        {isHindi ? "स्थान" : "Location"}
                                    </Label>
                                    <Input
                                        id="location"
                                        value={profileData.location}
                                        onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                                        placeholder={isHindi ? "जैसे, पंजाब, भारत" : "e.g., Punjab, India"}
                                        className="border-gray-200 focus:border-[#B9F261] focus:ring-[#B9F261] rounded-xl h-12"
                                    />
                                </div>

                                {/* Language */}
                                <div className="space-y-2">
                                    <Label htmlFor="language" className="flex items-center gap-2 text-gray-700">
                                        <Globe className="w-4 h-4 text-gray-400" />
                                        {isHindi ? "पसंदीदा भाषा" : "Preferred Language"}
                                    </Label>
                                    <Select
                                        value={profileData.language}
                                        onValueChange={(value) => setProfileData(prev => ({ ...prev, language: value }))}
                                    >
                                        <SelectTrigger className="border-gray-200 focus:border-[#B9F261] focus:ring-[#B9F261] rounded-xl h-12">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="en">🇬🇧 English</SelectItem>
                                            <SelectItem value="hi">🇮🇳 हिंदी (Hindi)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Account Created */}
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-gray-700">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        {isHindi ? "खाता बनाया गया" : "Account Created"}
                                    </Label>
                                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#B9F261]/10 to-[#FFD24A]/5 rounded-xl border border-[#B9F261]/20">
                                        <div className="w-10 h-10 rounded-xl bg-[#B9F261]/20 flex items-center justify-center">
                                            <Star className="w-5 h-5 text-[#B9F261]" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-[#0B0B0B]">{formatDate(profileData.createdAt)}</p>
                                            <p className="text-xs text-gray-500">{getAccountAge(profileData.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Save Button */}
                                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                                    <Button
                                        onClick={handleSaveProfile}
                                        disabled={saving}
                                        className="w-full bg-[#B9F261] hover:bg-[#a8e050] text-[#0B0B0B] rounded-full h-12 font-semibold gap-2"
                                    >
                                        {saving ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                {isHindi ? "सेव हो रहा है..." : "Saving..."}
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                {isHindi ? "बदलाव सेव करें" : "Save Changes"}
                                            </>
                                        )}
                                    </Button>
                                </motion.div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* My Crops Card */}
                    <motion.div variants={fadeInUp}>
                        <Card className="border-2 border-gray-100">
                            <CardHeader className="bg-gradient-to-r from-emerald-50 to-[#B9F261]/10 border-b border-gray-100">
                                <CardTitle className="flex items-center gap-2 text-[#0B0B0B]">
                                    <Leaf className="w-5 h-5 text-emerald-500" />
                                    {isHindi ? "मेरी फसलें" : "My Crops"}
                                    {userCrops.length > 0 && (
                                        <Badge className="bg-emerald-100 text-emerald-700 ml-2">
                                            {userCrops.length}
                                        </Badge>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {userCrops.length === 0 ? (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                            <Leaf className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-500 mb-2">
                                            {isHindi ? "अभी कोई फसल नहीं जोड़ी गई" : "No crops added yet"}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {isHindi ? "डैशबोर्ड से फसलें जोड़ें" : "Add crops from Dashboard"}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {userCrops.map((userCrop, index) => (
                                            <motion.div
                                                key={userCrop.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                whileHover={{ scale: 1.02, y: -2 }}
                                                className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-[#B9F261]/10 border-2 border-emerald-100 hover:border-[#B9F261] transition-all"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{getCropEmoji(userCrop.crop_id.name)}</span>
                                                    <div>
                                                        <p className="font-medium text-[#0B0B0B]">{getCropName(userCrop.crop_id)}</p>
                                                        <p className="text-xs text-gray-500 capitalize">{userCrop.stage}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                                <Link to="/dashboard">
                                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                                        <Button variant="outline" className="w-full mt-4 rounded-full border-2 border-[#B9F261] text-[#0B0B0B] hover:bg-[#B9F261]/10 gap-2">
                                            <Leaf className="w-4 h-4" />
                                            {isHindi ? "डैशबोर्ड में फसलें प्रबंधित करें" : "Manage Crops in Dashboard"}
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </motion.div>
                                </Link>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </main>
        </div>
    );
};

export default Profile;
