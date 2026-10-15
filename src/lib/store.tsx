import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Category = "Electronics" | "Fashion" | "Accessories" | "Home";
export const CATEGORIES: Category[] = ["Electronics", "Fashion", "Accessories", "Home"];
export const LOW_STOCK = 5;

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  stock: number;
  image: string;
}
export interface CartItem {
  productId: string;
  qty: number;
}

const u = (id: string) => `https://images.unsplash.com/${id}?w=600&q=80&auto=format&fit=crop`;
export const SAMPLE: Product[] = [
  { id: "1", name: "Wireless Headphones", category: "Electronics", price: 2499, stock: 15, image: u("photo-1505740420928-5e560c06d30e") },
  { id: "2", name: "Smart Watch", category: "Electronics", price: 3999, stock: 8, image: u("photo-1523275335684-37898b6baf30") },
  { id: "3", name: "Bluetooth Speaker", category: "Electronics", price: 1799, stock: 4, image: u("photo-1608043152269-423dbba4e7e1") },
  { id: "4", name: "Leather Wallet", category: "Accessories", price: 799, stock: 20, image: u("photo-1627123424574-724758594e93") },
  { id: "5", name: "Sunglasses", category: "Accessories", price: 1299, stock: 3, image: u("photo-1572635196237-14b3f281503f") },
  { id: "6", name: "Cotton T-Shirt", category: "Fashion", price: 599, stock: 30, image: u("photo-1521572163474-6864f9cf17ab") },
  { id: "7", name: "Running Shoes", category: "Fashion", price: 2999, stock: 12, image: u("photo-1542291026-7eec264c27ff") },
  { id: "8", name: "Ceramic Coffee Mug Set", category: "Home", price: 899, stock: 0, image: u("photo-1514228742587-6b1558fcca3d") },
];

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

interface Store {
  products: Product[];
  cart: CartItem[];
  addToCart: (id: string) => boolean;
  changeQty: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  checkout: () => void;
  saveProduct: (p: Omit<Product, "id"> & { id?: string }) => void;
  deleteProduct: (id: string) => void;
}

const Ctx = createContext<Store | null>(null);
const PK = "shopease-products";
const CK = "shopease-cart";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(SAMPLE);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const p = localStorage.getItem(PK);
      const c = localStorage.getItem(CK);
      if (p) setProducts(JSON.parse(p));
      if (c) setCart(JSON.parse(c));
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(PK, JSON.stringify(products));
    localStorage.setItem(CK, JSON.stringify(cart));
  }, [products, cart, loaded]);

  const adjustStock = (id: string, delta: number) =>
    setProducts((ps) => ps.map((p) => (p.id === id ? { ...p, stock: p.stock + delta } : p)));

  const changeQty = (id: string, delta: number) => {
    const p = products.find((x) => x.id === id);
    const item = cart.find((c) => c.productId === id);
    if (!p) return;
    if (delta > 0 && p.stock < delta) return;
    if (delta < 0 && (!item || item.qty + delta < 0)) return;
    adjustStock(id, -delta);
    setCart((cs) => {
      const existing = cs.find((c) => c.productId === id);
      if (!existing) return [...cs, { productId: id, qty: delta }];
      return cs
        .map((c) => (c.productId === id ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0);
    });
  };

  const store: Store = {
    products,
    cart,
    addToCart: (id) => {
      const p = products.find((x) => x.id === id);
      if (!p || p.stock <= 0) return false;
      changeQty(id, 1);
      return true;
    },
    changeQty,
    removeFromCart: (id) => {
      const item = cart.find((c) => c.productId === id);
      if (item) changeQty(id, -item.qty);
    },
    checkout: () => setCart([]),
    saveProduct: (data) => {
      if (data.id) {
        setProducts((ps) => ps.map((p) => (p.id === data.id ? { ...(data as Product) } : p)));
      } else {
        setProducts((ps) => [...ps, { ...data, id: crypto.randomUUID() }]);
      }
    },
    deleteProduct: (id) => {
      setProducts((ps) => ps.filter((p) => p.id !== id));
      setCart((cs) => cs.filter((c) => c.productId !== id));
    },
  };

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be used within StoreProvider");
  return s;
}

export function stockStatus(stock: number): "out" | "low" | "in" {
  if (stock <= 0) return "out";
  if (stock < LOW_STOCK) return "low";
  return "in";
}
