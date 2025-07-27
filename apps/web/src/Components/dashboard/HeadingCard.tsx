"use client"
import { useUserSessionStore } from "../../store/useUserSessionStore"

interface HeadingCardProps {
    title: string | undefined | null,
    content?: string
}

export default function HeadingCard() {
    const { session } = useUserSessionStore();

    return (
        <div className="w-full flex justify-center braniella-font tracking-wider py-4 items-center text-2xl dark:text-[#e2e2e2] text-black">
            Welcome, {session?.user.name?.split(" ")[0]}
        </div>
    )
}