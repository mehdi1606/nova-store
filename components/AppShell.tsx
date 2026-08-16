"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

const SmoothScroll = dynamic(() => import("./SmoothScroll"), { ssr: false });
const Cursor = dynamic(() => import("./Cursor"), { ssr: false });
const Preloader = dynamic(() => import("./Preloader"), { ssr: false });
const CartDrawer = dynamic(() => import("./CartDrawer"), { ssr: false });

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
