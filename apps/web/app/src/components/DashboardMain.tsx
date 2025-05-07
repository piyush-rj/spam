"use client"
import { useRouter } from "next/navigation"

export function DashboardMain() {

    const router = useRouter()

    function handleClick() {
        router.push("/chat")
    }

    return <div>
        <button onClick={handleClick} className="bg-black px-3 py-1.5 rounded-md text-white">Start Chatting</button>
    </div>
}