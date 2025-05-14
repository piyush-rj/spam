
"use client" 
import localFont from "next/font/local";
import "@repo/config/styles"
import ClientProvider from "./src/ClientProvider";
import NavbarMain from "./src/components/Dashboard/landing/NavbarMain";
import { ToastContainer } from 'react-toastify';
import Providers from "./Providers";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { userSessionAtom } from "./zustand/atoms/zustand";
import { useSession } from "next-auth/react";
import { CustomSession } from "./api/auth/[...nextauth]/options";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ClientProvider>
          <Providers>
            <NavbarMain/>
              <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnHover
              />
              {children}
          </Providers>
        </ClientProvider>
      </body>
    </html>
  );
}
