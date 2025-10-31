import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface HeroProps {
  onGetStarted?: () => void;
  onOrderNow?: () => void;
  onAddToCart?: (item: CartItem) => void;
}

type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: string;
};

type CartItem = MenuItem & { qty: number };

const SAMPLE_ITEMS: MenuItem[] = [
  { id: "vwrap", name: "Veg Wrap", price: 99, category: "Food" },
  { id: "coffee", name: "Cold Coffee", price: 79, category: "Drinks" },
  { id: "chips", name: "Potato Chips", price: 45, category: "Snacks" },
  { id: "milk", name: "Dairy Milk 1L", price: 89, category: "Groceries" },
];

export default function Hero({ onGetStarted, onOrderNow, onAddToCart }: HeroProps) {
  const navigate = useNavigate();
  const categories = useMemo(() => ["All", "Groceries", "Food", "Snacks", "Drinks", "Medicine"], []);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem("bb_cart");
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch (e) {
      return [];
    }
  });
  const [toast, setToast] = useState<string | null>(null);
  const [isBrowseOpen, setIsBrowseOpen] = useState(false);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("bb_cart", JSON.stringify(cart));
    } catch (e) {
      /* ignore */
    }
  }, [cart]);

  // keyboard shortcut: G -> Get Started, O -> Order Now
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "g") onGetStarted?.();
      if (e.key.toLowerCase() === "o") {
        if (onOrderNow) onOrderNow();
        else handleNavigateToCart();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onGetStarted, onOrderNow]);

  const filtered = useMemo(() => {
    if (activeCategory === "All") return SAMPLE_ITEMS;
    return SAMPLE_ITEMS.filter((i) => i.category === activeCategory);
  }, [activeCategory]);

  function handleAddToCart(item: MenuItem) {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === item.id);
      let next: CartItem[];
      if (exists) {
        next = prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + 1 } : p));
      } else {
        next = [...prev, { ...item, qty: 1 }];
      }
      return next;
    });

    // notify parent if provided
    onAddToCart?.({ ...item, qty: 1 });

    // small toast
    setToast(`${item.name} added to cart`);
    window.setTimeout(() => setToast(null), 1600);
  }

  function handleNavigateToCart() {
    // prefer parent handler if provided
    if (onOrderNow) return onOrderNow();
    // otherwise use react-router navigation to /cart
    navigate("/cart");
  }

  function handleRemoveFromCart(id: string) {
    setCart((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--bg)] text-white">
      {/* Animated background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--primary)]/20 rounded-full blur-[180px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-[var(--primary-hover)]/20 rounded-full blur-[180px] animate-pulse delay-700" />
      </div>

      <main className="relative z-10 grid max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 lg:py-36 grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* LEFT SIDE */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center lg:text-left">
          {/* Logo */}
          <div className="flex justify-center lg:justify-start mb-6">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full blur-2xl bg-blue-500/40 animate-pulse" />
              <img src="/logo.png" alt="BluBlu logo" className="relative w-20 h-20 object-contain rounded-xl drop-shadow-[0_0_25px_rgba(0,153,255,0.5)]" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-4 text-[var(--text-2)]">
            Campus delivery, <br />
            <span className="bg-gradient-to-r from-primary to-brand-cyan bg-clip-text text-transparent">lightning fast ⚡</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-300 max-w-xl mx-auto lg:mx-0 mb-6 font-light leading-relaxed">
            Get your food, groceries & essentials delivered to your room in minutes — built for campus life, inspired by Blinkit.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={onGetStarted} className="bg-gradient-to-r from-primary to-brand-cyan text-white px-8 py-3 rounded-full text-lg font-semibold shadow-[0_0_20px_rgba(0,115,230,0.5)] hover:shadow-[0_0_35px_rgba(0,179,230,0.8)] transition-all">
              Get Started
            </motion.button>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleNavigateToCart} className="border border-[var(--border)] bg-white/5 px-8 py-3 rounded-full text-lg font-medium text-[var(--text-2)] hover:bg-[var(--primary)]/10 backdrop-blur-sm transition-all">
              Order Now
            </motion.button>
          </div>

          {/* Quick Categories */}
          <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} aria-pressed={activeCategory === cat} className={`px-4 py-2 rounded-full text-sm font-medium border transition backdrop-blur-sm ${activeCategory === cat ? 'bg-gradient-to-r from-primary to-brand-cyan text-white shadow-[0_0_15px_rgba(0,115,230,0.25)] border-transparent' : 'bg-[var(--primary)]/10 text-[var(--text-2)] border border-[var(--border)] hover:bg-[var(--primary)]/20'}`}>
                {cat}
              </button>
            ))}
          </div>

          {/* mini cart summary */}
          <div className="mt-6 flex items-center gap-3 justify-center lg:justify-start">
            <div className="text-sm text-gray-300">Cart:</div>
            <div className="bg-[#071022] px-3 py-1 rounded-full border border-blue-500/10 text-sm font-medium">{cart.reduce((s, i) => s + i.qty, 0)} items • ₹{cart.reduce((s, i) => s + i.qty * i.price, 0)}</div>
            <button onClick={() => setCart([])} className="text-xs text-cyan-300 underline">Clear</button>
          </div>
        </motion.div>

        {/* RIGHT SIDE CARD (interactive) */}
        <motion.div initial={{ opacity: 0, scale: 0.9, x: 50 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="flex justify-center lg:justify-end">
          <div className="w-full max-w-sm bg-gradient-to-br from-[#0e1524] to-[#0a0f1c] backdrop-blur-xl rounded-3xl border border-blue-500/20 shadow-[0_0_35px_rgba(0,150,255,0.2)] overflow-hidden transform transition-transform duration-300 hover:-translate-y-1">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-700 to-cyan-500 px-5 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 rounded-lg p-2">
                  <img src="/logo.png" alt="BluBlu small" className="w-6 h-6 object-contain" />
                </div>
                <div>
                  <div className="font-bold">BluBlu</div>
                  <div className="text-xs text-white/80">Campus Delivery</div>
                </div>
              </div>
              <div className="text-sm bg-white/20 px-3 py-1 rounded-full">10–25 min</div>
            </div>

            {/* Body */}
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-[var(--text-3)] font-medium">Popular Near You</div>
                <div className="text-sm font-medium text-[var(--icon-primary)] cursor-pointer hover:underline">See All</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {filtered.slice(0, 4).map((item) => (
                  <motion.div key={item.id} whileHover={{ y: -6 }} className="bg-[var(--card)] rounded-xl p-3 text-center border border-[var(--border)] hover:border-[var(--primary-hover)]/40 transition transform">
                    <div className="text-sm mt-2 font-semibold text-white">{item.name}</div>
                    <div className="text-xs text-[var(--text-3)]">₹{item.price}</div>
                    <div className="mt-3 flex items-center justify-center gap-2">
                      <button onClick={() => handleAddToCart(item)} className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-primary to-brand-cyan shadow-[0_0_12px_rgba(0,115,230,0.15)]">
                        + Add
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Toast */}
      {toast && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed left-1/2 transform -translate-x-1/2 bottom-8 z-50 bg-[#031226] px-4 py-2 rounded-full border border-blue-500/10 shadow-[0_10px_30px_rgba(2,12,45,0.6)]">
          {toast}
        </motion.div>
      )}
    </section>
  );
}
