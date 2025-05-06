"use client"
import { useRouter } from "next/navigation"

export default function Main(){
    const router = useRouter()

    return <button onClick={() => {
        router.push("./chat")
    }} className="bg-black px-3 py-2 text-white rounded">
        Chat now
    </button>
}