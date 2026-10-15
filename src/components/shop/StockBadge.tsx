import { stockStatus } from "@/lib/store";
import { cn } from "@/lib/utils";

export function StockBadge({ stock, variant = "shop" }: { stock: number; variant?: "shop" | "admin" }) {
  const s = stockStatus(stock);
  const label =
    s === "out" ? "Out of Stock" : s === "low" ? (variant === "shop" ? `Only ${stock} left` : "Low Stock") : "In Stock";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        s === "out" && "bg-destructive/10 text-destructive",
        s === "low" && "bg-warning/15 text-warning",
        s === "in" && "bg-success/15 text-success",
      )}
    >
      {label}
    </span>
  );
}
