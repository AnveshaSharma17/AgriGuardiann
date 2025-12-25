// Animation variants for Framer Motion
// Sunvolt-style animations: subtle, smooth, performance-optimized

export const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" as const }
    }
};

export const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.4, ease: "easeOut" as const }
    }
};

export const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.4, ease: "easeOut" as const }
    }
};

export const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

export const hoverLift = {
    rest: { y: 0, transition: { duration: 0.2, ease: "easeOut" as const } },
    hover: { y: -4, transition: { duration: 0.2, ease: "easeOut" as const } }
};

export const pressTap = {
    scale: 0.98,
    transition: { duration: 0.1 }
};

// Scroll reveal animation with viewport settings
export const scrollReveal = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" as const }
    }
};

// Card hover with lift and glow
export const cardHover = {
    rest: {
        y: 0,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.2, ease: "easeOut" as const }
    },
    hover: {
        y: -8,
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
        transition: { duration: 0.2, ease: "easeOut" as const }
    }
};

// Arrow rotation for arrow-circle buttons
export const arrowRotate = {
    rest: { rotate: 0 },
    hover: { rotate: -45, transition: { duration: 0.3, ease: "easeOut" as const } }
};

// Viewport settings for scroll animations
export const viewportSettings = {
    once: true,
    amount: 0.3,
    margin: "-50px"
};

// Reduced motion check
export const prefersReducedMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Safe animation wrapper
export const safeAnimate = (variants: any) => {
    if (prefersReducedMotion()) {
        return {
            hidden: {},
            visible: {}
        };
    }
    return variants;
};
