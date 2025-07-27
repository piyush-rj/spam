"use client"
import { useState, useEffect } from 'react';
import { CiDark, CiLight } from "react-icons/ci";
import ToolTipComponent from '@/src/utility/ToolTipComponent';

export default function DarkModeToggle() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = window.localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark');
        } else {
            setIsDarkMode(prefersDark);
        }
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <ToolTipComponent content="Switch theme">
            <div className="">
                <button type='button'
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