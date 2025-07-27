import React from "react";

interface DashboardAccessComponentProps {
    title: string;
    logo: React.ReactNode;
    setState: () => void;
}

export default function DashboardAccessComponent({
    title,
    logo,
    setState,
}: DashboardAccessComponentProps) {
    return (
        <div
            onClick={setState}
            className="flex items-center gap-5 justify-start px-6 py-3 font-sans text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-950 rounded-lg cursor-pointer"
        >
            <span className="text-[22px] dark:text-zinc-300/90 text-neutral-800">{logo}</span>
            <span className="text-[18px] font-medium text-neutral-800 dark:text-zinc-300/90">{title}</span>
        </div>
    );
}
