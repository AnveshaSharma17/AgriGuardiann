import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
    ArrowRight,
    Leaf,
    MessageCircle,
    Phone,
    Mail,
    MapPin,
    Clock,
    Send,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

// Animation Variants
const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const fadeInLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
};

const fadeInRight = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
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

const Contact = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log("Form submitted:", formData);
        alert(t('contact.form.successMessage'));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const contactInfo = [
        {
            icon: Phone,
            title: t('contact.info.callUs'),
            details: ["+91 98765 43210", "+91 12345 67890"],
            color: "bg-[#B9F261]",
        },
        {
            icon: Mail,
            title: t('contact.info.emailUs'),
            details: ["support@krishirakshak.com", "info@krishirakshak.com"],
            color: "bg-[#FFD24A]",
        },
        {
            icon: MapPin,
            title: t('contact.info.visitUs'),
            details: ["123 AgriTech Park, Sector 42", "Gurugram, Haryana 122001"],
            color: "bg-[#B9F261]",
        },
        {
            icon: Clock,
            title: t('contact.info.workingHours'),
            details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat: 10:00 AM - 4:00 PM"],
            color: "bg-[#FFD24A]",
        },
    ];

    return (
        <div className="min-h-screen bg-white overflow-x-hidden font-sans">
            {/* Navigation - Transparent Glassmorphic Style */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0B0B]/80 backdrop-blur-md border-b border-white/10">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 flex items-center justify-center relative">
                                <svg viewBox="0 0 40 40" className="w-10 h-10">
                                    <line x1="20" y1="4" x2="20" y2="10" stroke="#FFD24A" strokeWidth="2.5" strokeLinecap="round" />
                                    <line x1="32" y1="10" x2="28" y2="14" stroke="#FFD24A" strokeWidth="2.5" strokeLinecap="round" />
                                    <line x1="36" y1="22" x2="30" y2="22" stroke="#FFD24A" strokeWidth="2.5" strokeLinecap="round" />
                                    <line x1="8" y1="10" x2="12" y2="14" stroke="#FFD24A" strokeWidth="2.5" strokeLinecap="round" />
                                    <line x1="4" y1="22" x2="10" y2="22" stroke="#FFD24A" strokeWidth="2.5" strokeLinecap="round" />
                                    <circle cx="20" cy="22" r="10" fill="#FFD24A" />
                                    <path d="M16 28 Q20 20 28 22 Q24 30 16 28" fill="#4a7c4a" />
                                </svg>
                            </div>
                            <span className="font-display font-bold text-xl text-white">KrishiRakshak</span>
                        </Link>

                        {/* Center Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            <Link to="/" className="text-sm font-medium text-white hover:text-[#FFD24A] transition-colors">
                                {t('contact.nav.home')}
                            </Link>
                            <a href="/#about" className="text-sm font-medium text-white hover:text-[#FFD24A] transition-colors">
                                {t('contact.nav.about')}
                            </a>
                            <a href="/#features" className="text-sm font-medium text-white hover:text-[#FFD24A] transition-colors">
                                {t('contact.nav.features')}
                            </a>
                            <a href="/#how-it-works" className="text-sm font-medium text-white hover:text-[#FFD24A] transition-colors">
                                {t('contact.nav.howItWorks')}
                            </a>
                            <a href="/#team" className="text-sm font-medium text-white hover:text-[#FFD24A] transition-colors">
                                {t('contact.nav.team')}
                            </a>
                            <Link to="/contact" className="text-sm font-medium text-[#FFD24A] transition-colors">
                                {t('contact.nav.contact')}
                            </Link>
                        </div>

                        {/* Right Side - CTA */}
                        <div className="flex items-center gap-4">
                            <LanguageSwitcher />
                            <Link to="/register">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B9F261] text-[#0B0B0B] font-medium text-sm hover:bg-[#a8e050] transition-all shadow-lg"
                                >
                                    {t('contact.nav.getQuote')}
                                    <div className="w-6 h-6 rounded-full bg-[#0B0B0B] flex items-center justify-center">
                                        <ArrowRight className="w-3.5 h-3.5 text-white" />
                                    </div>
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-[#0B0B0B] overflow-hidden">
                {/* Grid Texture */}
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `linear-gradient(#FAF4EA 1px, transparent 1px), linear-gradient(90deg, #FAF4EA 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }}
                />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center gap-2 mb-6"
                        >
                            <span className="w-2 h-2 rounded-full bg-[#B9F261]"></span>
                            <span className="text-sm font-medium text-[#B9F261] uppercase tracking-widest">{t('contact.hero.label')}</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 text-white"
                        >
                            {t('contact.hero.title')}{" "}
                            <span className="text-[#B9F261]">{t('contact.hero.titleHighlight')}</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="text-lg text-white/70 max-w-xl leading-relaxed"
                        >
                            {t('contact.hero.description')}
                        </motion.p>
                    </div>

                    {/* Breadcrumb */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex items-center gap-2 mt-8 text-sm"
                    >
                        <Link to="/" className="text-white/60 hover:text-white transition-colors">{t('contact.hero.breadcrumbHome')}</Link>
                        <ChevronRight className="w-4 h-4 text-white/40" />
                        <span className="text-[#B9F261]">{t('contact.hero.breadcrumbContact')}</span>
                    </motion.div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-16 bg-[#FAF4EA]">
                <div className="container mx-auto px-6">
                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-32 relative z-20"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {contactInfo.map((info, index) => (
                            <motion.div
                                key={index}
                                variants={scaleIn}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center cursor-pointer"
                            >
                                <motion.div
                                    className={`w-14 h-14 ${info.color} rounded-xl flex items-center justify-center mx-auto mb-4`}
                                    whileHover={{ rotate: 10, scale: 1.1 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <info.icon className="w-7 h-7 text-[#0B0B0B]" />
                                </motion.div>
                                <h3 className="font-display font-bold text-lg text-[#0B0B0B] mb-2">{info.title}</h3>
                                {info.details.map((detail, i) => (
                                    <p key={i} className="text-gray-600 text-sm">{detail}</p>
                                ))}
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Main Content - Form & Map */}
            <section className="py-24 bg-[#FAF4EA]">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-gray-100"
                        >
                            <h2 className="font-display text-3xl font-bold text-[#0B0B0B] mb-2">{t('contact.form.title')}</h2>
                            <p className="text-gray-600 mb-8">{t('contact.form.description')}</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-[#0B0B0B] mb-2">{t('contact.form.yourName')}</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B9F261] focus:outline-none focus:ring-2 focus:ring-[#B9F261]/20 transition-all"
                                            placeholder={t('contact.form.namePlaceholder')}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#0B0B0B] mb-2">{t('contact.form.emailAddress')}</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B9F261] focus:outline-none focus:ring-2 focus:ring-[#B9F261]/20 transition-all"
                                            placeholder={t('contact.form.emailPlaceholder')}
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-[#0B0B0B] mb-2">{t('contact.form.phoneNumber')}</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B9F261] focus:outline-none focus:ring-2 focus:ring-[#B9F261]/20 transition-all"
                                            placeholder={t('contact.form.phonePlaceholder')}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#0B0B0B] mb-2">{t('contact.form.subject')}</label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B9F261] focus:outline-none focus:ring-2 focus:ring-[#B9F261]/20 transition-all"
                                        >
                                            <option value="">{t('contact.form.selectSubject')}</option>
                                            <option value="general">{t('contact.form.generalInquiry')}</option>
                                            <option value="support">{t('contact.form.technicalSupport')}</option>
                                            <option value="partnership">{t('contact.form.partnership')}</option>
                                            <option value="demo">{t('contact.form.requestDemo')}</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#0B0B0B] mb-2">{t('contact.form.yourMessage')}</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B9F261] focus:outline-none focus:ring-2 focus:ring-[#B9F261]/20 transition-all resize-none"
                                        placeholder={t('contact.form.messagePlaceholder')}
                                    />
                                </div>

                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#B9F261] text-[#0B0B0B] font-semibold text-base hover:bg-[#a8e050] transition-all shadow-lg"
                                >
                                    {t('contact.form.sendMessage')}
                                    <div className="w-7 h-7 rounded-full bg-[#0B0B0B] flex items-center justify-center">
                                        <Send className="w-4 h-4 text-white" />
                                    </div>
                                </motion.button>
                            </form>
                        </motion.div>

                        {/* Map Section */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 h-[400px]">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.83923192776!2d77.06889754725782!3d28.52758200617607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x52c2b7494e204dce!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1703380800000!5m2!1sen!2sin"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="KrishiRakshak Location"
                                />
                            </div>

                            {/* Quick Contact Card */}
                            <div className="bg-[#0B0B0B] rounded-3xl p-8 relative overflow-hidden">
                                <div
                                    className="absolute inset-0 opacity-5"
                                    style={{
                                        backgroundImage: `linear-gradient(#FAF4EA 1px, transparent 1px), linear-gradient(90deg, #FAF4EA 1px, transparent 1px)`,
                                        backgroundSize: '30px 30px'
                                    }}
                                />
                                <div className="relative z-10">
                                    <h3 className="font-display text-2xl font-bold text-white mb-4">{t('contact.quickHelp.title')}</h3>
                                    <p className="text-white/70 mb-6">{t('contact.quickHelp.description')}</p>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <a href="tel:+919876543210" className="flex-1">
                                            <motion.div
                                                whileHover={{ scale: 1.02 }}
                                                className="flex items-center gap-3 px-6 py-4 rounded-xl bg-[#B9F261] text-[#0B0B0B]"
                                            >
                                                <Phone className="w-5 h-5" />
                                                <div>
                                                    <p className="text-xs opacity-70">{t('contact.quickHelp.callNow')}</p>
                                                    <p className="font-bold">+91 98765 43210</p>
                                                </div>
                                            </motion.div>
                                        </a>
                                        <Link to="/chat" className="flex-1">
                                            <motion.div
                                                whileHover={{ scale: 1.02 }}
                                                className="flex items-center gap-3 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white"
                                            >
                                                <MessageCircle className="w-5 h-5" />
                                                <div>
                                                    <p className="text-xs opacity-70">{t('contact.quickHelp.liveChat')}</p>
                                                    <p className="font-bold">{t('contact.quickHelp.startChat')}</p>
                                                </div>
                                            </motion.div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-[#0B0B0B] relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `linear-gradient(#FAF4EA 1px, transparent 1px), linear-gradient(90deg, #FAF4EA 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }}
                />
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight mb-6 text-white">
                        {t('contact.cta.title')}
                    </h2>
                    <p className="text-white/70 max-w-2xl mx-auto mb-8">
                        {t('contact.cta.description')}
                    </p>
                    <Link to="/register">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#B9F261] text-[#0B0B0B] font-semibold text-lg hover:bg-[#a8e050] transition-all shadow-lg"
                        >
                            {t('contact.cta.button')}
                            <div className="w-8 h-8 rounded-full bg-[#0B0B0B] flex items-center justify-center">
                                <ArrowRight className="w-5 h-5 text-white" />
                            </div>
                        </motion.button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 bg-[#0B0B0B] text-white relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `linear-gradient(#FAF4EA 1px, transparent 1px), linear-gradient(90deg, #FAF4EA 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }}
                />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                        {/* Logo & Description */}
                        <div className="lg:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 flex items-center justify-center">
                                    <svg viewBox="0 0 40 40" className="w-10 h-10">
                                        <line x1="20" y1="4" x2="20" y2="10" stroke="#FFD24A" strokeWidth="2.5" strokeLinecap="round" />
                                        <line x1="32" y1="10" x2="28" y2="14" stroke="#FFD24A" strokeWidth="2.5" strokeLinecap="round" />
                                        <line x1="36" y1="22" x2="30" y2="22" stroke="#FFD24A" strokeWidth="2.5" strokeLinecap="round" />
                                        <line x1="8" y1="10" x2="12" y2="14" stroke="#FFD24A" strokeWidth="2.5" strokeLinecap="round" />
                                        <line x1="4" y1="22" x2="10" y2="22" stroke="#FFD24A" strokeWidth="2.5" strokeLinecap="round" />
                                        <circle cx="20" cy="22" r="10" fill="#FFD24A" />
                                        <path d="M16 28 Q20 20 28 22 Q24 30 16 28" fill="#4a7c4a" />
                                    </svg>
                                </div>
                                <span className="font-display font-bold text-xl text-white">KrishiRakshak</span>
                            </div>
                            <p className="text-white/60 text-sm leading-relaxed mb-6">
                                {t('landing.footer.description')}
                            </p>
                            {/* Social Icons */}
                            <div className="flex gap-3">
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-[#B9F261] hover:text-[#0B0B0B] hover:border-[#B9F261] transition-all">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                </a>
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-[#B9F261] hover:text-[#0B0B0B] hover:border-[#B9F261] transition-all">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-[#B9F261] hover:text-[#0B0B0B] hover:border-[#B9F261] transition-all">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" /></svg>
                                </a>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-[#B9F261] hover:text-[#0B0B0B] hover:border-[#B9F261] transition-all">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="font-display font-bold text-white mb-6">{t('landing.footer.quickLinks')}</h4>
                            <ul className="space-y-3">
                                <li><Link to="/" className="text-white/60 hover:text-[#B9F261] transition-colors flex items-center gap-2"><ChevronRight className="w-3 h-3" />{t('landing.nav.home')}</Link></li>
                                <li><a href="/#about" className="text-white/60 hover:text-[#B9F261] transition-colors flex items-center gap-2"><ChevronRight className="w-3 h-3" />{t('landing.footer.aboutUs')}</a></li>
                                <li><a href="/#features" className="text-white/60 hover:text-[#B9F261] transition-colors flex items-center gap-2"><ChevronRight className="w-3 h-3" />{t('landing.nav.features')}</a></li>
                                <li><a href="/#how-it-works" className="text-white/60 hover:text-[#B9F261] transition-colors flex items-center gap-2"><ChevronRight className="w-3 h-3" />{t('landing.nav.howItWorks')}</a></li>
                                <li><a href="/#team" className="text-white/60 hover:text-[#B9F261] transition-colors flex items-center gap-2"><ChevronRight className="w-3 h-3" />{t('landing.nav.team')}</a></li>
                            </ul>
                        </div>

                        {/* Services */}
                        <div>
                            <h4 className="font-display font-bold text-white mb-6">{t('landing.footer.services')}</h4>
                            <ul className="space-y-3">
                                <li><Link to="/identify" className="text-white/60 hover:text-[#B9F261] transition-colors flex items-center gap-2"><ChevronRight className="w-3 h-3" />{t('landing.footer.pestDetection')}</Link></li>
                                <li><Link to="/chat" className="text-white/60 hover:text-[#B9F261] transition-colors flex items-center gap-2"><ChevronRight className="w-3 h-3" />{t('landing.footer.aiChatAssistant')}</Link></li>
                                <li><Link to="/alerts" className="text-white/60 hover:text-[#B9F261] transition-colors flex items-center gap-2"><ChevronRight className="w-3 h-3" />{t('landing.footer.weatherAlerts')}</Link></li>
                                <li><Link to="/advisory" className="text-white/60 hover:text-[#B9F261] transition-colors flex items-center gap-2"><ChevronRight className="w-3 h-3" />{t('landing.footer.expertAdvisory')}</Link></li>
                                <li><Link to="/community" className="text-white/60 hover:text-[#B9F261] transition-colors flex items-center gap-2"><ChevronRight className="w-3 h-3" />{t('landing.footer.community')}</Link></li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h4 className="font-display font-bold text-white mb-6">{t('landing.footer.stayUpdated')}</h4>
                            <p className="text-white/60 text-sm mb-4">{t('landing.footer.newsletterDesc')}</p>
                            <div className="space-y-3">
                                <input
                                    type="email"
                                    placeholder={t('landing.footer.emailPlaceholder')}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#B9F261] focus:bg-white/10 transition-all"
                                />
                                <Button className="w-full rounded-xl py-3 bg-[#B9F261] text-[#0B0B0B] hover:bg-[#a8e050] font-semibold">
                                    {t('landing.footer.subscribeNow')}
                                </Button>
                            </div>
                            <p className="text-white/40 text-xs mt-3">{t('landing.footer.privacyNote')}</p>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-8 border-t border-white/10">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-white/40 text-sm">
                                {t('landing.footer.copyright')}
                            </p>
                            <div className="flex gap-6 text-white/40 text-sm">
                                <a href="#" className="hover:text-white transition-colors">{t('landing.footer.privacyPolicy')}</a>
                                <a href="#" className="hover:text-white transition-colors">{t('landing.footer.termsOfService')}</a>
                                <a href="#" className="hover:text-white transition-colors">{t('landing.footer.cookiePolicy')}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Floating Chat */}
            <Link to="/chat">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#B9F261] shadow-lg flex items-center justify-center text-[#0B0B0B] z-50"
                >
                    <MessageCircle className="w-6 h-6" />
                </motion.button>
            </Link>
        </div>
    );
};

export default Contact;
