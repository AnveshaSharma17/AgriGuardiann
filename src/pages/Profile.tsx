import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Camera, Loader2, Save, User as UserIcon, Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface UserCrop {
    id: string;
    crop_id: {
        id: string;
        name: string;
        name_hi: string | null;
    };
    stage: string;
}

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
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

            // Fetch profile
            const profileResponse = await fetch(`${API_URL}/api/user/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const profileResult = await profileResponse.json();

            // API returns { success: true, user: {...} } structure
            const userData = profileResult.user || profileResult;

            setProfileData({
                name: userData.name || "",
                email: userData.email || user.email || "",
                location: userData.location || "",
                language: userData.language || "en",
                profileImage: userData.profileImage || "",
                createdAt: userData.createdAt || ""
            });

            // Fetch user crops
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

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast({ title: "File too large", description: "Please select an image under 5MB", variant: "destructive" });
            return;
        }

        // Validate file type
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

            // Update auth context
            if (updateAuthProfile) {
                await updateAuthProfile({ profileImage: result.profileImage });
            }

            toast({ title: "Profile image updated!", description: "Your profile picture has been changed successfully." });
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
                    location: profileData.location,
                    language: profileData.language
                })
            });

            if (!response.ok) throw new Error('Failed to update profile');

            const updatedProfile = await response.json();

            // Update language if changed
            if (profileData.language !== i18n.language) {
                i18n.changeLanguage(profileData.language);
            }

            // Update auth context
            if (updateAuthProfile) {
                await updateAuthProfile({
                    name: updatedProfile.name,
                    location: updatedProfile.location,
                    language: updatedProfile.language
                });
            }

            toast({ title: "Profile updated!", description: "Your changes have been saved successfully." });
        } catch (error: any) {
            toast({ title: "Update failed", description: error.message, variant: "destructive" });
        }
        setSaving(false);
    };

    const getCropName = (crop: any) => {
        return i18n.language === 'hi' && crop.name_hi ? crop.name_hi : crop.name;
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
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
                        <Link to="/dashboard">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="font-display font-bold text-xl">{t('profile.title', 'My Profile')}</h1>
                            <p className="text-sm text-muted-foreground">{t('profile.subtitle', 'Manage your account settings')}</p>
                        </div>
                    </div>
                    <LanguageSwitcher />
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 max-w-4xl">
                <div className="grid gap-6">
                    {/* Profile Image Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('profile.profilePicture', 'Profile Picture')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-hero flex items-center justify-center">
                                        {profileData.profileImage ? (
                                            <img
                                                src={profileData.profileImage}
                                                alt={profileData.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-3xl font-bold text-primary-foreground">
                                                {profileData.name.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <label
                                        htmlFor="profile-upload"
                                        className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors"
                                    >
                                        {uploading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Camera className="w-4 h-4" />
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
                                </div>
                                <div>
                                    <p className="font-medium">{profileData.name}</p>
                                    <p className="text-sm text-muted-foreground">{profileData.email}</p>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {t('profile.uploadHint', 'Click camera icon to upload new picture')}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Profile Information Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('profile.information', 'Profile Information')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">{t('profile.name', 'Name')}</Label>
                                <Input
                                    id="name"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">{t('profile.email', 'Email Address')}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={profileData.email}
                                    disabled
                                    className="bg-muted"
                                />
                                <p className="text-xs text-muted-foreground">
                                    {t('profile.emailReadOnly', 'Email cannot be changed')}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">{t('profile.location', 'Location')}</Label>
                                <Input
                                    id="location"
                                    value={profileData.location}
                                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                                    placeholder="e.g., Punjab, India"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="language">{t('profile.language', 'Preferred Language')}</Label>
                                <Select
                                    value={profileData.language}
                                    onValueChange={(value) => setProfileData(prev => ({ ...prev, language: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>{t('profile.accountCreated', 'Account Created')}</Label>
                                <Input value={formatDate(profileData.createdAt)} disabled className="bg-muted" />
                            </div>

                            <Button
                                onClick={handleSaveProfile}
                                disabled={saving}
                                className="w-full gap-2"
                            >
                                {saving ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> {t('common.saving', 'Saving...')}</>
                                ) : (
                                    <><Save className="w-4 h-4" /> {t('profile.saveChanges', 'Save Changes')}</>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* My Crops Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Leaf className="w-5 h-5 text-primary" />
                                {t('profile.myCrops', 'My Crops')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {userCrops.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">
                                    {t('profile.noCrops', 'No crops added yet')}
                                </p>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {userCrops.map((userCrop) => (
                                        <div key={userCrop.id} className="p-4 rounded-lg bg-muted/50 border border-border">
                                            <p className="font-medium">{getCropName(userCrop.crop_id)}</p>
                                            <p className="text-xs text-muted-foreground capitalize">{userCrop.stage}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <Link to="/dashboard">
                                <Button variant="outline" className="w-full mt-4">
                                    {t('profile.manageCrops', 'Manage Crops in Dashboard')}
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default Profile;
