"use client";

import { CiDark, CiLight } from "react-icons/ci";
import ToolTipComponent from "@/src/utility/ToolTipComponent";
import { useThemeMode } from "@/src/store/useThemeStore"; // update path

export default function DarkModeToggle() {
    const { theme, setTheme } = useThemeMode();

    const isDarkMode = theme === "dark" || (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    const toggleTheme = () => {
        setTheme(isDarkMode ? "light" : "dark");
    };

    return (
        <ToolTipComponent content="Switch theme">
            <div className="">
                <button
                    type="button"
                    onClick={toggleTheme}
                    className="flex items-center gap-2 px-3 py-2 dark:bg-transparent bg-light-bas rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                    {isDarkMode ? (
                        <CiLight className="text-xl" />
                    ) : (
                        <CiDark className="text-lg text-black" />
                    )}
                </button>
            </div>
        </ToolTipComponent>
    );
}
