
"use client" 
import localFont from "next/font/local";
import "@repo/config/styles"
import ClientProvider from "./src/ClientProvider";
import NavbarMain from "./src/components/Dashboard/landing/NavbarMain";
import { ToastContainer } from 'react-toastify';
import Providers from "./Providers";
import 'react-toastify/dist/ReactToastify.css';


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
              position="bottom-right"
              autoClose={2000}
              newestOnTop={false}
              closeOnClick
              pauseOnHover
              toastClassName="!bg-neutral-900 !text-white !rounded-lg !shadow-lg"
              className="text-sm font-medium"
            />
              {children}
          </Providers>
        </ClientProvider>
      </body>
    </html>
  );
}
