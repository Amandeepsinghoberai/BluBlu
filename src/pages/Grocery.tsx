// src/pages/Grocery.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, Search, Plus, Minus, Trash2, ShoppingCart, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

type GroceryData = {
  title: string;
  items: string[];
};

// NOTE: CartItem shape comes from CartContext (id, name, price, qty, image?)
type LocalCartItem = {
  id: string; // unique id (category||name)
  name: string;
  category: string;
  qty: number;
};

const GROCERIES: GroceryData[] = [
  {
    title: 'Grains & Cereals',
    items: [
      'Basmati Rice',
      'Sona Masoori Rice',
      'Wheat Flour (Atta)',
      'Maida (Refined Flour)',
      'Suji / Rava (Semolina)',
      'Poha (Flattened Rice)',
      'Dalia (Broken Wheat)',
    ],
  },
  {
    title: 'Pulses & Legumes',
    items: [
      'Toor Dal (Arhar Dal)',
      'Masoor Dal (Red Lentils)',
      'Moong Dal (Yellow/Green Gram)',
      'Chana Dal (Split Bengal Gram)',
      'Whole Urad Dal (Black Gram)',
      'Rajma (Kidney Beans)',
      'Kabuli Chana (Chickpeas)',
    ],
  },
  {
    title: 'Spices & Condiments',
    items: [
      'Turmeric Powder (Haldi)',
      'Red Chili Powder (Lal Mirch)',
      'Coriander Powder (Dhaniya Powder)',
      'Cumin Seeds (Jeera)',
      'Mustard Seeds (Rai/Sarson)',
      'Fenugreek Seeds (Methi)',
      'Garam Masala',
      'Asafoetida (Hing)',
      'Black Pepper (Kali Mirch)',
      'Bay Leaves (Tej Patta)',
      'Cardamom (Elaichi)',
      'Cloves (Laung)',
      'Cinnamon (Dalchini)',
      'Salt (Namak)',
    ],
  },
  {
    title: 'Dairy & Fats',
    items: [
      'Ghee (Clarified Butter)',
      'Butter',
      'Milk',
      'Curd (Dahi)',
      'Paneer (Cottage Cheese)',
    ],
  },
  {
    title: 'Other Essentials',
    items: [
      'Cooking Oil (Mustard, Groundnut, or Sunflower)',
      'Jaggery (Gur)',
      'Sugar',
      'Tea Leaves (Chai Patti)',
      'Coffee',
      'Tamarind (Imli)',
      'Pickle (Achar)',
      'Papad',
    ],
  },
];

const Grocery: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showCartMobile, setShowCartMobile] = useState(false);

  // shared cart from context
  const { cartItems, addItem, updateQty: ctxUpdateQty, removeItem, clearCart, itemCount } = useCart();

  // helpers: create the same id you previously used
  const makeId = (category: string, name: string) => `${category}||${name}`;

  // Quick derived maps for grocery UI (to show qty per grocery item)
  const cartMap = useMemo(() => {
    const m: Record<string, LocalCartItem> = {};
    for (const c of cartItems) {
      if (!c.id) continue;
      // if id follows category||name pattern, parse it, otherwise ignore for this page
      if (c.id.includes('||')) {
        const [category, ...rest] = c.id.split('||');
        const name = rest.join('||');
        m[c.id] = { id: c.id, name: c.name, category, qty: c.qty };
      }
    }
    return m;
  }, [cartItems]);

  // search/filter logic
  const filteredByQuery = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GROCERIES;
    const results: GroceryData[] = [];
    for (const cat of GROCERIES) {
      const matches = cat.items.filter((it) => it.toLowerCase().includes(q));
      if (matches.length) results.push({ title: cat.title, items: matches });
    }
    return results;
  }, [query]);

  const cartItemsLocal = useMemo(() => Object.values(cartMap), [cartMap]);
  const cartTotalItems = cartItemsLocal.reduce((s, c) => s + c.qty, 0);

  // Add to shared cart. CartContext requires a price number; groceries currently use price 0.
  const handleAddToCart = (category: string, name: string, qty = 1) => {
    const id = makeId(category, name);
    addItem({ id, name, price: 0 }, qty);
  };

  // Update quantity wrapper: ctxUpdateQty expects absolute qty
  const handleUpdateQty = (id: string, newQty: number) => {
    if (newQty <= 0) {
      removeItem(id);
    } else {
      ctxUpdateQty(id, newQty);
    }
  };

  const handleRemove = (id: string) => {
    removeItem(id);
  };

  // For printing a checkout payload (same behaviour you had)
  const checkoutPayload = () =>
    cartItemsLocal.map((c) => ({
      name: c.name,
      qty: c.qty,
      category: c.category,
    }));

  // Small UX: make the first category selected initially
  useEffect(() => {
    if (!activeCategory && GROCERIES.length > 0) {
      setActiveCategory(GROCERIES[0].title);
    }
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-[#071226] text-slate-200 pb-24">
      <div className="max-w-7xl mx-auto px-6 pt-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-300 hover:text-white"
              aria-label="Back"
            >
              <ChevronLeft size={18} /> Back
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold">Groceries</h1>
              <p className="text-slate-400 text-sm md:text-base">Select items and add them to cart for checkout.</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search groceries..."
                className="pl-10 pr-4 py-2 rounded-md bg-[#081729] border border-slate-600/40 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                aria-label="Search groceries"
              />
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            </div>

            <button
              onClick={() => window.print()}
              className="px-3 py-2 rounded-md bg-sky-600 hover:bg-sky-500 text-white text-sm flex items-center gap-2"
            >
              <ShoppingCart size={16} /> Print
            </button>

            <button
              onClick={() => setShowCartMobile((s) => !s)}
              className="px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-slate-200 flex items-center gap-2"
              aria-label="Toggle cart"
            >
              <ShoppingCart size={16} />
              <span className="text-sm">{itemCount}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-8">
          {/* Left: main list */}
          <main className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredByQuery.map((cat) => (
                <section
                  key={cat.title}
                  id={cat.title.replace(/\s+/g, '-')}
                  className="rounded-xl border border-slate-600/40 p-6 bg-gradient-to-b from-[#081729] to-transparent"
                >
                  <h2 className="text-2xl font-semibold mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-flex items-center justify-center w-11 h-11 rounded-lg border border-slate-600/40 bg-[#07192b]"
                        aria-hidden
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-sky-300">
                          <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.2" />
                          <path d="M8 9h8M8 13h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                      </span>
                      {cat.title}
                    </div>
                    <div className="text-sm text-slate-400">{cat.items.length} items</div>
                  </h2>

                  <ul className="text-slate-300/90 leading-relaxed space-y-2">
                    {cat.items.map((item) => {
                      const id = makeId(cat.title, item);
                      const inCart = cartMap[id];
                      return (
                        <li key={item} className="py-2 flex items-center justify-between gap-4 border-b border-slate-700/30 pb-2 last:border-b-0">
                          <div>
                            <div className="font-medium">{item}</div>
                            <div className="text-xs text-slate-400">{cat.title}</div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* quantity controls (if in cart) */}
                            {inCart ? (
                              <div className="inline-flex items-center gap-2 bg-[#081729] border border-slate-700 rounded-md px-2 py-1">
                                <button
                                  onClick={() => handleUpdateQty(id, inCart.qty - 1)}
                                  className="p-1 rounded text-slate-200 hover:bg-slate-700/30"
                                  aria-label={`Decrease ${item}`}
                                >
                                  <Minus size={14} />
                                </button>
                                <div className="min-w-[28px] text-center">{inCart.qty}</div>
                                <button
                                  onClick={() => handleUpdateQty(id, inCart.qty + 1)}
                                  className="p-1 rounded text-slate-200 hover:bg-slate-700/30"
                                  aria-label={`Increase ${item}`}
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            ) : null}

                            <div>
                              {!inCart ? (
                                <button
                                  onClick={() => handleAddToCart(cat.title, item, 1)}
                                  className="px-3 py-1 rounded-md bg-sky-600 hover:bg-sky-500 text-white text-sm flex items-center gap-2"
                                >
                                  <Plus size={14} /> Add
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleRemove(id)}
                                  className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-500 text-white text-sm flex items-center gap-2"
                                  aria-label={`Remove ${item}`}
                                >
                                  <X size={14} />
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>

            {filteredByQuery.length === 0 && (
              <div className="rounded-lg p-6 bg-[#081729] border border-slate-600/40">
                <p className="text-slate-300">No matches found for <span className="font-semibold">{query}</span>. Try a different search term.</p>
              </div>
            )}
          </main>

          {/* Right: sticky cart */}
          <aside className="md:sticky md:top-20 self-start">
            <div className="rounded-xl border border-slate-600/40 p-4 bg-[#07192b]">
              <h3 className="text-lg font-semibold text-slate-200 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ShoppingCart size={18} /> Your Cart
                </span>
                <span className="text-sm text-slate-400">{cartTotalItems} items</span>
              </h3>

              <div className="max-h-[52vh] overflow-auto pr-2">
                {cartItemsLocal.length === 0 ? (
                  <div className="text-slate-400 text-sm py-6">Cart is empty. Add items to start.</div>
                ) : (
                  <ul className="space-y-3">
                    {cartItemsLocal.map((ci) => (
                      <li key={ci.id} className="flex items-center justify-between gap-3 bg-[#081729] rounded-md p-3 border border-slate-700/30">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{ci.name}</div>
                          <div className="text-xs text-slate-400">{ci.category}</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateQty(ci.id, ci.qty - 1)}
                            className="p-1 rounded text-slate-200 hover:bg-slate-700/30"
                            aria-label={`Decrease ${ci.name}`}
                          >
                            <Minus size={14} />
                          </button>
                          <div className="min-w-[26px] text-center">{ci.qty}</div>
                          <button
                            onClick={() => handleUpdateQty(ci.id, ci.qty + 1)}
                            className="p-1 rounded text-slate-200 hover:bg-slate-700/30"
                            aria-label={`Increase ${ci.name}`}
                          >
                            <Plus size={14} />
                          </button>

                          <button
                            onClick={() => handleRemove(ci.id)}
                            className="ml-2 p-1 rounded text-red-400 hover:bg-red-700/10"
                            aria-label={`Remove ${ci.name}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-4 border-t border-slate-700/30 pt-4">
                {/* price is not provided — placeholder subtotal */}
                <div className="flex items-center justify-between text-slate-300 mb-3">
                  <div className="text-sm">Subtotal</div>
                  <div className="text-sm text-slate-400">—</div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      if (cartItemsLocal.length === 0) {
                        alert('Cart is empty. Add items before checkout.');
                        return;
                      }
                      if (!user) {
                        // Checkout page will also guard, but give a friendly message
                        alert('Please sign in to continue to checkout.');
                      }
                      navigate('/checkout');
                    }}
                    className="flex-1 px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white"
                  >
                    Checkout
                  </button>

                  <button
                    onClick={() => clearCart()}
                    className="px-3 py-2 rounded-md bg-red-700 hover:bg-red-600 text-white"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* mobile cart toggle */}
            <div className="mt-4 md:hidden">
              <button
                onClick={() => setShowCartMobile(true)}
                className="w-full px-3 py-2 rounded-md bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center gap-2"
              >
                <ShoppingCart /> View Cart ({cartTotalItems})
              </button>
            </div>
          </aside>
        </div>

        {/* Mobile floating cart modal */}
        {showCartMobile && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowCartMobile(false)} />
            <div className="absolute bottom-0 left-0 right-0 bg-[#07192b] rounded-t-xl p-4 max-h-[80vh] overflow-auto border-t border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Your Cart</h4>
                <button onClick={() => setShowCartMobile(false)} className="p-2 rounded bg-slate-800">
                  <X />
                </button>
              </div>

              <div className="space-y-3">
                {cartItemsLocal.length === 0 ? (
                  <div className="text-slate-400">Cart is empty.</div>
                ) : (
                  cartItemsLocal.map((ci) => (
                    <div key={ci.id} className="flex items-center justify-between gap-3 bg-[#081729] rounded-md p-3 border border-slate-700/30">
                      <div>
                        <div className="font-medium">{ci.name}</div>
                        <div className="text-xs text-slate-400">{ci.category}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button onClick={() => handleUpdateQty(ci.id, ci.qty - 1)} className="p-1 rounded text-slate-200">
                          <Minus size={14} />
                        </button>
                        <div>{ci.qty}</div>
                        <button onClick={() => handleUpdateQty(ci.id, ci.qty + 1)} className="p-1 rounded text-slate-200">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => {
                    if (cartItemsLocal.length === 0) {
                      alert('Cart is empty. Add items before checkout.');
                      return;
                    }
                    if (!user) {
                      alert('Please sign in to continue to checkout.');
                    }
                    navigate('/checkout');
                  }}
                  className="flex-1 px-3 py-2 rounded-md bg-emerald-600 text-white"
                >
                  Checkout
                </button>
                <button onClick={() => clearCart()} className="px-3 py-2 rounded-md bg-red-600 text-white">
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Grocery;
