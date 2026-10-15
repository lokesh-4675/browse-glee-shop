import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { StoreProvider } from "@/lib/store";
import { Navbar } from "@/components/shop/Navbar";
import { Hero } from "@/components/shop/Hero";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { InventoryPanel } from "@/components/shop/InventoryPanel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ShopEase — Shop Smart. Live Better." },
      { name: "description", content: "ShopEase storefront with electronics, fashion, accessories and home goods, plus live inventory management." },
      { property: "og:title", content: "ShopEase — Shop Smart. Live Better." },
      { property: "og:description", content: "Shop electronics, fashion and home essentials with live inventory management." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [cartOpen, setCartOpen] = useState(false);
  return (
    <StoreProvider>
      <Navbar onCart={() => setCartOpen(true)} />
      <main>
        <section id="shop" className="scroll-mt-16">
          <Hero />
          <ProductGrid />
        </section>
        <InventoryPanel />
      </main>
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ShopEase. All rights reserved.
      </footer>
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      <Toaster position="top-center" richColors />
    </StoreProvider>
  );
}
