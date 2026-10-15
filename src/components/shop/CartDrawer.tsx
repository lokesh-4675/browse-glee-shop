import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { inr, useStore } from "@/lib/store";

export function CartDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { cart, products, changeQty, removeFromCart, checkout } = useStore();
  const items = cart
    .map((c) => ({ ...c, product: products.find((p) => p.id === c.productId)! }))
    .filter((i) => i.product);
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader><SheetTitle>Your Cart</SheetTitle></SheetHeader>
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
            <ShoppingBag className="h-12 w-12" />
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="-mx-6 flex-1 space-y-4 overflow-y-auto px-6 py-2">
              {items.map(({ product: p, qty }) => (
                <div key={p.id} className="flex gap-3 rounded-xl border p-3">
                  <img src={p.image} alt={p.name} className="h-16 w-16 rounded-lg object-cover" />
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex justify-between gap-2">
                      <p className="text-sm font-medium leading-tight">{p.name}</p>
                      <button onClick={() => removeFromCart(p.id)} aria-label="Remove" className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => changeQty(p.id, -1)}><Minus className="h-3 w-3" /></Button>
                        <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                        <Button size="icon" variant="outline" className="h-7 w-7" disabled={p.stock <= 0} onClick={() => changeQty(p.id, 1)}><Plus className="h-3 w-3" /></Button>
                      </div>
                      <span className="text-sm font-semibold">{inr(p.price * qty)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm text-muted-foreground"><span>Subtotal</span><span>{inr(subtotal)}</span></div>
              <div className="flex justify-between text-sm text-muted-foreground"><span>Shipping</span><span>Free</span></div>
              <div className="flex justify-between text-lg font-bold"><span>Grand Total</span><span>{inr(subtotal)}</span></div>
              <Button size="lg" className="mt-2 w-full" onClick={() => { checkout(); toast.success("Order placed successfully!"); onOpenChange(false); }}>
                Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
