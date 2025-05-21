import "@repo/config/styles"
import ClientProvider from "../../src/ClientProvider";
import NavbarMain from "../../components/Dashboard/landing/NavbarMain";
import Providers from "../../../Providers";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        <ClientProvider>
          <Providers>
            <NavbarMain />
              {children}
          </Providers>
        </ClientProvider>
      </body>
    </html>
  );
}
