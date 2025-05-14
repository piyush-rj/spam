"use client";

import React, { useState, useEffect, useRef } from 'react';
import SignIn from '../../../../auth/signin/page';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { useSessionStore } from '../../../../recoil/atoms/atom';


export interface NavbarProps {
    userName?: string;
    userAvatar?: string | null;
    isAuthenticated: boolean;
}

const NavbarComponent: React.FC<NavbarProps> = ({
    userName,
    userAvatar,
    isAuthenticated,
}) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
    const { session } = useSessionStore()
    const router = useRouter();

    console.log(session)

    const name = userName || session?.user?.name;
    const avatar = session?.user?.image;

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }
        if (dropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownOpen]);

    function handleLogoClick(){
        router.push("/")
    }

    return (
        <>
            <div className="fixed top-0 p-3 py-5 px-8 left-0 w-full z-[999] bg-opacity-80 backdrop-blur-md ">
                <div className="flex h-full items-center justify-between">
                    <div onClick={handleLogoClick} className="flex justify-center items-center cursor-pointer space-x-2">
                        <div className="w-[25px] h-[25px] rounded-full flex items-center justify-center -mr-1">
                        <span className="text-black font-bold">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="url(#gradientStroke)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-orbit-icon lucide-orbit"
                            >
                                <defs>
                                <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#a855f7" />
                                    <stop offset="100%" stopColor="#22d3ee" />
                                </linearGradient>
                                </defs>
                                <path d="M20.341 6.484A10 10 0 0 1 10.266 21.85" />
                                <path d="M3.659 17.516A10 10 0 0 1 13.74 2.152" />
                                <circle cx="12" cy="12" r="3" />
                                <circle cx="19" cy="5" r="2" />
                                <circle cx="5" cy="19" r="2" />
                            </svg>
                            </span>

                        </div>
                        <span className="text-[#e4e4e4] text-3xl tracking-wider font-bold ">rbit</span>
                    </div>
                    <div className="flex items-center gap-x-4 pr-2">
                        {isAuthenticated ? (
                            <div className="relative flex items-center gap-2" ref={dropdownRef}>
                                {avatar && (
                                    <img
                                        src={avatar}
                                        alt={name}
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="h-[35px] w-[35px] rounded-full border border-black cursor-pointer"
                                    />
                                )}
                                {/* <span className="text-[16px] font-medium pl-1 text-white">{session.user.name}</span> */}

                                {dropdownOpen && (
                                    <div className="absolute flex justify-center items-center mt-[100px] bg-[#141414] text-yellow-500 shadow-lg rounded-md w-32  z-[1000] border border-gray-800">
                                        <button
                                            className="w-full text-left px-4 py-2 hover:text-red-500 transition-all transform duration-200"
                                            onClick={() => {
                                                setConfirmLogoutOpen(true);
                                                setDropdownOpen(false);
                                            }}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={() => setMenuOpen(true)}
                                className="px-5 py-1.5 text-md font-medium text-[#000000] bg-gradient-to-r from-purple-500 to-cyan-500 rounded-md hover:brightness-110 hover:scale-105"
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {menuOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-[#141414] bg-opacity-60 z-[998]">
                    <div className="relative z-50">
                        <SignIn />
                        <button
                            onClick={() => setMenuOpen(false)}
                            className="absolute top-2 right-2 text-white bg-gray-800 hover:bg-gray-700 rounded-full px-3 py-1"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {confirmLogoutOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-[#141414] bg-opacity-70 z-[1001]">
                    <div className="bg-[#141414] rounded-md p-9 shadow-xl text-center w-[90%] max-w-sm border border-gray-800">
                        <p className="text-lg font-medium text-[#e4e4e4] mb-4">
                            Are you sure you want to <span className='text-red-400'>logout?</span>
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                className="px-4 py-1.5 bg-gray-800 rounded hover:bg-gray-700 hover:text-gray-300  transition-all transform duration-200"
                                onClick={() => setConfirmLogoutOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-1.5 bg-red-600 text-[#fff] rounded hover:bg-red-700 hover:text-gray-300 transition-all transform duration-200"
                                onClick={() => {
                                    signOut({ callbackUrl: "/" });
                                    setConfirmLogoutOpen(false);
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default NavbarComponent;
