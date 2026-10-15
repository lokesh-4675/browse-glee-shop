import { useState } from "react";
import { AlertTriangle, Boxes, IndianRupee, Package, Pencil, Plus, Trash2, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { inr, stockStatus, useStore, type Product } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ProductFormModal } from "./ProductFormModal";
import { StockBadge } from "./StockBadge";

export function InventoryPanel() {
  const { products, deleteProduct } = useStore();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [toDelete, setToDelete] = useState<Product | null>(null);

  const low = products.filter((p) => stockStatus(p.stock) === "low");
  const stats = [
    { label: "Total Products", value: products.length, icon: Package },
    { label: "Total Stock Units", value: products.reduce((s, p) => s + p.stock, 0), icon: Boxes },
    { label: "Low Stock Items", value: low.length, icon: TrendingDown },
    { label: "Total Inventory Value", value: inr(products.reduce((s, p) => s + p.price * p.stock, 0)), icon: IndianRupee },
  ];

  return (
    <section id="inventory" className="scroll-mt-16 bg-muted/50 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
          <Button onClick={() => { setEditing(null); setFormOpen(true); }} className="transition-transform hover:scale-105">
            <Plus className="mr-1 h-4 w-4" /> Add Product
          </Button>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-soft transition-shadow hover:shadow-lift">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="h-6 w-6" /></span>
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {low.length > 0 && (
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
            <p><span className="font-semibold">Low stock warning:</span> {low.map((p) => `${p.name} (${p.stock})`).join(", ")}</p>
          </div>
        )}

        <div className="overflow-x-auto rounded-2xl border bg-card shadow-soft">
          <Table className="min-w-[760px]">
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead><TableHead>Name</TableHead><TableHead>Category</TableHead>
                <TableHead>Price (₹)</TableHead><TableHead>Stock Quantity</TableHead><TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id} className={cn(stockStatus(p.stock) === "low" && "bg-warning/10 hover:bg-warning/15")}>
                  <TableCell><img src={p.image} alt={p.name} className="h-11 w-11 rounded-lg object-cover" /></TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell>{inr(p.price)}</TableCell>
                  <TableCell>{p.stock}</TableCell>
                  <TableCell><StockBadge stock={p.stock} variant="admin" /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditing(p); setFormOpen(true); }}><Pencil className="mr-1 h-3.5 w-3.5" />Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => setToDelete(p)}><Trash2 className="mr-1 h-3.5 w-3.5" />Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow><TableCell colSpan={7} className="py-10 text-center text-muted-foreground">No products yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <ProductFormModal open={formOpen} onOpenChange={setFormOpen} product={editing} />
      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>"{toDelete?.name}" will be permanently removed from your store.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (toDelete) { deleteProduct(toDelete.id); toast.success("Product deleted"); } setToDelete(null); }}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
