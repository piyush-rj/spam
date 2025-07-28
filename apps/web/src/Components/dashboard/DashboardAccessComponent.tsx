import React from "react";

interface DashboardAccessComponentProps {
    title: string;
    logo: React.ReactNode;
    setState: () => void;
    isActive?: boolean;
}

export default function DashboardAccessComponent({
    title,
    logo,
    setState,
    isActive = false,
}: DashboardAccessComponentProps) {
    return (
        <div
            onClick={setState}
            className="flex items-center gap-5 justify-start px-6 py-3 font-sans group text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-950 rounded-lg cursor-pointer"
        >
            <span
                className={`text-[20px] ${isActive
                        ? "text-[#e5ff52d5]"
                        : "text-neutral-800 dark:text-zinc-300/90 group-hover:dark:text-[#e5ff52d5]"
                    }`}
            >
                {logo}
            </span>
            <span
                className={`text-[16px] font-medium ${isActive
                        ? "text-[#e5ff52d5]"
                        : "text-neutral-800 dark:text-zinc-300/90 group-hover:dark:text-[#e5ff52d5]"
                    }`}
            >
                {title}
            </span>
        </div>
    );
}
