"use client"
import { useUserSessionStore } from "@/src/store/useUserSessionStore";
import Image from "next/image";

export default function NavbarNameDisplay() {
    const { session } = useUserSessionStore();

    if (!session || !session.user) return null;

    return (
        <div className="h-full w-full flex justify-center items-center dark:text-white text-black space-x-4">
            <span>Welcome, {session.user.name}</span>
            {session.user.image && (
                <span className="h-8 w-8 rounded-full border overflow-hidden relative">
                    <Image
                        src={session.user.image}
                        alt="User Avatar"
                        fill
                        className="object-cover rounded-full"
                    />
                </span>
            )}
        </div>
    );
}
