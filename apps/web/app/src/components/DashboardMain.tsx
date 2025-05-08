"use client"
import { useRouter } from "next/navigation"
import { DotBackgroundDemo } from "./background/Background"
import DashboardHeroSection from "./Dashboard/DashboardHeroSection"

export function DashboardMain() {

    const router = useRouter()

    function handleClick() {
        router.push("/chat")
    }

    return <div className="min-h-screen w-full">
        <DashboardHeroSection/>
        Go around orbits but you'd never find the end
        <button onClick={handleClick} className="bg-black px-3 py-1.5 rounded-md text-white">Start Chatting</button>
    </div>
}