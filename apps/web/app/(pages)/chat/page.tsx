"use client"

import CreateGroup from "@/app/src/components/Chat/CreateGroup"
import { useRouter } from "next/navigation"
import { useSessionStore } from "../../zustand/atoms/zustand"

export default function Chat () {

  const { session } = useSessionStore()

  return <div className="bg-[#141414] min-h-screen w-full pt-[80px]">
    chatpage
    <p>{JSON.stringify(session)}</p>
    <CreateGroup/>
  </div>
}