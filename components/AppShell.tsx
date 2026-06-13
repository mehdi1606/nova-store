"use client";

import { usePathname } from "next/navigation";
import SmoothScroll from "./SmoothScroll";
import Cursor from "./Cursor";
import Preloader from "./Preloader";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";

/**
 * Wraps every page in the storefront chrome — smooth scroll, custom cursor,
 * preloader, header, footer, cart drawer. The /admin area is a plain tool with
 * its own layout, so the chrome is skipped there (no custom cursor hiding the
 * pointer, no preloader, no store header around the dashboard).
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <>
      <SmoothScroll />
      <Cursor />
      <Preloader />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}
