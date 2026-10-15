import { ShoppingCart, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

export const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export function Navbar({ onCart }: { onCart: () => void }) {
  const { cart } = useStore();
  const count = cart.reduce((s, c) => s + c.qty, 0);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <button onClick={() => scrollTo("shop")} className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-hero text-primary-foreground">
            <Store className="h-5 w-5" />
          </span>
          ShopEase
        </button>
        <div className="flex items-center gap-1 sm:gap-4">
          <Button variant="ghost" onClick={() => scrollTo("shop")}>Shop</Button>
          <Button variant="ghost" onClick={() => scrollTo("inventory")}>Inventory</Button>
          <Button variant="outline" size="icon" className="relative" onClick={onCart} aria-label="Open cart">
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-xs font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Button>
        </div>
      </nav>
    </header>
  );
}
