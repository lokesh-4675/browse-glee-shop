import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, useStore } from "@/lib/store";
import { ProductCard } from "./ProductCard";

export function ProductGrid() {
  const { products } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const list = useMemo(
    () =>
      products.filter(
        (p) => (cat === "All" || p.category === cat) && p.name.toLowerCase().includes(q.trim().toLowerCase()),
      ),
    [products, q, cat],
  );

  return (
    <div id="products" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Our Products</h2>
          <p className="text-muted-foreground">{list.length} items</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search products..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9 sm:w-64" />
          </div>
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger className="sm:w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["All", ...CATEGORIES].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      {list.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">No products match your search.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
