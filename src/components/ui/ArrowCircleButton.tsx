import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { arrowRotate } from "@/lib/motion";

interface ArrowCircleButtonProps {
    variant?: "default" | "highlighted";
    onClick?: () => void;
    className?: string;
    size?: "sm" | "md" | "lg";
}

export const ArrowCircleButton = ({
    variant = "default",
    onClick,
    className,
    size = "md"
}: ArrowCircleButtonProps) => {
    const sizes = {
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-12 h-12"
    };

    const iconSizes = {
        sm: "w-3 h-3",
        md: "w-4 h-4",
        lg: "w-5 h-5"
    };

    return (
        <motion.button
            initial="rest"
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={cn(
                "flex items-center justify-center rounded-full transition-all duration-200",
                sizes[size],
                variant === "default"
                    ? "bg-brand-lime text-brand-dark hover:bg-brand-lime/90"
                    : "bg-brand-dark text-white hover:bg-brand-dark/90",
                className
            )}
            aria-label="Navigate"
        >
            <motion.div variants={arrowRotate}>
                <ArrowRight className={iconSizes[size]} strokeWidth={2.5} />
            </motion.div>
        </motion.button>
    );
};
