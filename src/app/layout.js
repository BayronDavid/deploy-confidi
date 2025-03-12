import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { isAuthEnabled } from "@/lib/auth";
import { ScrollProvider } from "@/context/ScrollContext";
import Header from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Confidi",
  description: "Confidi landing page",
};

// Componente que decide condicionalmente envolver con AuthProvider
function OptionalAuthProvider({ children }) {
  return isAuthEnabled ? <AuthProvider>{children}</AuthProvider> : children;
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={isAuthEnabled}
        className={inter.className}
      >
        <OptionalAuthProvider>
          <ScrollProvider>
            <Header />
            <div className="app-container">
              {children}
            </div>
          </ScrollProvider>
        </OptionalAuthProvider>
      </body>
    </html>
  );
}
