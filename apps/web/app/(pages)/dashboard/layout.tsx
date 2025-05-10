import "@repo/config/styles"
import ClientProvider from "../../src/ClientProvider";
import NavbarMain from "../../src/components/Dashboard/landing/NavbarMain";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        <ClientProvider>
          <NavbarMain />
            {children}
        </ClientProvider>
      </body>
    </html>
  );
}
