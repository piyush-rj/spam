"use client";
import React from 'react';
import { useSignInModal } from './landing/SignInProvider';

export interface NavbarProps {
    userName: string;
    userAvatar?: string | null;
    isAuthenticated: boolean;
}

const NavbarComponent: React.FC<NavbarProps> = ({ 
    userName, 
    userAvatar, 
    isAuthenticated 
}) => {
    const { open } = useSignInModal()

    return (
        <div className="fixed top-0 p-4 left-0 w-full z-[999]">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl pl-2 pt-2 font-bold bg-gradient-to-r from-gray-800 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                    Orbit
                </h1>
                <div className="flex items-center gap-x-4 pr-2">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-2">
                            {userAvatar && (
                                <img 
                                    src={userAvatar} 
                                    alt={userName} 
                                    className="h-8 w-8 rounded-full border border-gray-600" 
                                />
                            )}
                            <span className="text-sm font-medium pl-1">{userName}</span>
                        </div>
                    ) : (
                        <button 
                            onClick={open}
                            className="px-4 py-1 text-md font-medium text-[#000] bg-yellow-500 rounded hover:bg-yellow-600 transition"
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NavbarComponent;
