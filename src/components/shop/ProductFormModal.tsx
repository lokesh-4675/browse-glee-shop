import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, useStore, type Category, type Product } from "@/lib/store";

const empty = { name: "", category: "" as Category | "", price: "", stock: "", image: "" };

export function ProductFormModal({ open, onOpenChange, product }: { open: boolean; onOpenChange: (o: boolean) => void; product: Product | null }) {
  const { saveProduct } = useStore();
  const [f, setF] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setErrors({});
      setF(product ? { name: product.name, category: product.category, price: String(product.price), stock: String(product.stock), image: product.image } : empty);
    }
  }, [open, product]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!f.name.trim()) er.name = "Name is required";
    if (!f.category) er.category = "Category is required";
    if (f.price === "" || isNaN(+f.price)) er.price = "Price is required";
    else if (+f.price < 0) er.price = "Price cannot be negative";
    if (f.stock === "" || isNaN(+f.stock)) er.stock = "Stock is required";
    else if (+f.stock < 0 || !Number.isInteger(+f.stock)) er.stock = "Stock must be a whole number ≥ 0";
    if (!f.image.trim()) er.image = "Image URL is required";
    else if (!/^https?:\/\//.test(f.image.trim())) er.image = "Enter a valid URL";
    setErrors(er);
    if (Object.keys(er).length) return;
    saveProduct({ id: product?.id, name: f.name.trim(), category: f.category as Category, price: +f.price, stock: +f.stock, image: f.image.trim() });
    toast.success(product ? "Product updated" : "Product added");
    onOpenChange(false);
  };

  const field = (k: "name" | "price" | "stock" | "image", label: string, type = "text") => (
    <div className="space-y-1.5">
      <Label htmlFor={k}>{label}</Label>
      <Input id={k} type={type} min={type === "number" ? 0 : undefined} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} />
      {errors[k] && <p className="text-xs text-destructive">{errors[k]}</p>}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4" noValidate>
          {field("name", "Name")}
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={f.category} onValueChange={(v) => setF({ ...f, category: v as Category })}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {field("price", "Price (₹)", "number")}
            {field("stock", "Stock Quantity", "number")}
          </div>
          {field("image", "Image URL")}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{product ? "Save Changes" : "Add Product"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
