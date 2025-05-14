"use client"
import NavbarComponent from "./NavbarComponent";
import { useSession } from "next-auth/react";

export default function NavbarMain(){
    const { status } = useSession()
    const isAuthenticated = status === "authenticated"


    return <NavbarComponent isAuthenticated={isAuthenticated} />
}