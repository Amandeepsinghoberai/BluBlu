// src/contexts/CartContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type CartItem = {
  id: string;
  name: string;
  price: number; // number (INR) — adjust if you use paise/smaller unit
  qty: number;
  image?: string;
};

type CartContextType = {
  cartItems: CartItem[];
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // hydrate from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem('blublu_cart');
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setCartItems(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  // persist on changes
  useEffect(() => {
    try {
      localStorage.setItem('blublu_cart', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  const addItem = (item: Omit<CartItem, 'qty'>, qty = 1) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((p) => p.id === item.id);
      if (idx === -1) {
        return [...prev, { ...item, qty }];
      } else {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
    });
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((p) => p.id !== id));
  };

  const updateQty = (id: string, qty: number) => {
    setCartItems((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, qty } : p))
        .filter((p) => p.qty > 0) // remove zero qty
    );
  };

  const clearCart = () => setCartItems([]);

  const itemCount = useMemo(() => cartItems.reduce((acc, it) => acc + it.qty, 0), [cartItems]);
  const subtotal = useMemo(() => cartItems.reduce((acc, it) => acc + it.price * it.qty, 0), [cartItems]);

  const value: CartContextType = {
    cartItems,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    itemCount,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
