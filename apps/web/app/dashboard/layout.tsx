import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import SessionProvider from "@/src/utility/SessionProvider";
import { getServerSession } from "next-auth";
import React from "react"

interface LayoutProps {
    children: React.ReactNode
}

export default async function Layout({ children }: LayoutProps) {
    const session = await getServerSession(authOptions);
    return (
        <div>
            {children}
            <SessionProvider session={session} />
        </div>
    )
}