"use client"
import { useSession } from "next-auth/react";
import NavbarComponent from "./NavbarComponent";

export default function NavbarMain(){
    const { data: session, status } = useSession();

    const userName = session?.user.fullName || "guest";
    const isAuthenticated = status === "authenticated"


    return <NavbarComponent userName={userName} isAuthenticated={isAuthenticated} />
}