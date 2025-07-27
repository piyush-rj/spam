import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface OpacityBackgroundProps {
    children: React.ReactNode;
    className?: string;
    onBackgroundClick?: () => void;
}

export default function BlurBG({ children, className, onBackgroundClick }: OpacityBackgroundProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const handleBackgroundClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && onBackgroundClick) {
            onBackgroundClick();
        }
    };

    const backgroundElement = (
        <div
            className={cn(
                "fixed w-screen h-screen inset-0 bg-secDark backdrop-blur-[2px] flex items-center justify-center z-50",
                className
            )}
            onClick={handleBackgroundClick}

        >
            {children}
        </div>
    );

    if (!mounted) return null;
    return createPortal(backgroundElement, document.body);
}