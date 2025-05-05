"use client"
import { useRouter } from "next/router"

export default function Dashboard(){
    const router = useRouter()

    return <button onClick={() => {
        router.push("./chat")
    }} className="bg-black px-3 py-2 text-white rounded">
        Chat now
    </button>
}