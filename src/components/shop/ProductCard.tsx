import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { inr, useStore, type Product } from "@/lib/store";
import { StockBadge } from "./StockBadge";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useStore();
  const out = product.stock <= 0;
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="aspect-square overflow-hidden bg-muted">
        <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary">{product.category}</Badge>
          <StockBadge stock={product.stock} />
        </div>
        <h3 className="font-semibold leading-tight">{product.name}</h3>
        <p className="text-xl font-bold text-primary">{inr(product.price)}</p>
        <Button
          className="mt-auto w-full transition-transform active:scale-95"
          disabled={out}
          onClick={() => addToCart(product.id) && toast.success(`${product.name} added to cart`)}
        >
          <ShoppingCart className="mr-1 h-4 w-4" /> {out ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}
