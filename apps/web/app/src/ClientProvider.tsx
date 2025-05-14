"use client"

import { SessionProvider } from "next-auth/react"
import Providers from "../Providers"

export default function ClientProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <SessionProvider>
      <Providers>

        {children}
      </Providers>
    </SessionProvider>
  )
}