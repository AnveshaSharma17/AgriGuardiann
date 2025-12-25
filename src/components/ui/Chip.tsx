import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChipProps {
    children: React.ReactNode;
    variant?: "default" | "outlined";
    icon?: React.ReactNode;
    className?: string;
}

export const Chip = ({
    children,
    variant = "outlined",
    icon,
    className
}: ChipProps) => {
    return (
        <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                variant === "outlined"
                    ? "border-2 border-white bg-white/10 backdrop-blur-sm text-white"
                    : "bg-white text-brand-text",
                className
            )}
        >
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
        </motion.span>
    );
};
