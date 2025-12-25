import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/motion";
import { ReactNode } from "react";

interface SectionProps {
    children: ReactNode;
    className?: string;
    background?: "white" | "cream" | "dark";
    animate?: boolean;
}

export const Section = ({
    children,
    className,
    background = "white",
    animate = true
}: SectionProps) => {
    const backgrounds = {
        white: "bg-white",
        cream: "bg-brand-cream",
        dark: "bg-brand-dark text-white"
    };

    const Component = animate ? motion.section : "section";
    const animationProps = animate ? {
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, amount: 0.2, margin: "-50px" },
        variants: {
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0.0, 0.2, 1] } }
        }
    } : {};

    return (
        <Component
            className={cn(
                "py-16 md:py-24 lg:py-32",
                backgrounds[background],
                className
            )}
            {...animationProps}
        >
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                {children}
            </div>
        </Component>
    );
};
