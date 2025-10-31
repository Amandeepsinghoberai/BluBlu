// src/pages/Tuck.tsx
import React, { useEffect, useState } from 'react';
import { ShoppingCart, Plus, Minus, X, ChevronDown } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

// Tuck.tsx
// Black + blue neon aesthetic stationery shop page
// Uses the shared CartContext so the Header cart and other pages stay in sync.

type ItemOption = {
  id: string;
  label: string;
  price: number;
};

type Item = {
  id: string;
  title: string;
  description?: string;
  options?: ItemOption[]; // if provided, user must pick one
  price?: number; // fallback price when no options
};

const STATIONERY: Item[] = [
  { id: 'pens-ball', title: 'Ball Pens', price: 12 },
  { id: 'pencils', title: 'Pencils (HB)', price: 8 },
  { id: 'erasers', title: 'Erasers', price: 5 },
  { id: 'sharpeners', title: 'Sharpeners', price: 7 },
  { id: 'highlighters', title: 'Highlighters (Pack of 4)', price: 40 },
  {
    id: 'notebooks', title: 'Notebooks', options: [
      { id: 'n-ruled', label: 'Ruled - ₹40', price: 40 },
      { id: 'n-plain', label: 'Plain - ₹45', price: 45 },
      { id: 'n-spiral', label: 'Spiral - ₹60', price: 60 },
    ]
  },
  { id: 'registers', title: 'Registers', price: 55 },
  { id: 'sticky-notes', title: 'Sticky Notes (Pack)', price: 30 },
  { id: 'a4-sheets', title: 'A4 Sheets (Ream)', price: 120 },
  { id: 'files-folders', title: 'Files & Folders', price: 35 },
  { id: 'stapler', title: 'Stapler & Pins', price: 150 },
  { id: 'glue-stick', title: 'Glue Stick', price: 20 },
  { id: 'scissors', title: 'Scissors', price: 80 },
  { id: 'ruler', title: 'Ruler', price: 15 },
  { id: 'geometry-box', title: 'Geometry Box', price: 95 },
  {
    id: 'calculator', title: 'Calculator', options: [
      { id: 'c-basic', label: 'Basic - ₹250', price: 250 },
      { id: 'c-scientific', label: 'Scientific - ₹700', price: 700 },
    ]
  },
  { id: 'printouts', title: 'Printouts from stationery', price: 3, description: 'Per page printing (B/W) — choose qty at checkout' }
];

const formatINR = (n: number) => `₹${n.toFixed(0)}`;

export default function Tuck() {
  const navigate = useNavigate();
  // selected option per item id
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string | undefined>>({});
  // UI state for small floating cart
  const [openCart, setOpenCart] = useState(false);

  // Shared cart (global)
  const { cartItems, addItem, updateQty, removeItem, itemCount, subtotal } = useCart();

  // Only show tuck-origin items in this page's sidebar (IDs created here use itemId@option)
  const tuckCart = cartItems.filter((c) => c.id.includes('@') && c.id.split('@')[0] && STATIONERY.some(s => c.id.startsWith(s.id)));

  // helper to create a unique id used by CartContext for tuck items
  const makeCartId = (itemId: string, optionId?: string) => `${itemId}@${optionId ?? 'def'}`;

  // add to shared cart
  function handleAddToCart(item: Item) {
    const optionId = selectedOptions[item.id];
    let price = item.price ?? 0;
    let optionLabel: string | undefined;

    if (item.options && optionId) {
      const opt = item.options.find(o => o.id === optionId);
      if (opt) {
        price = opt.price;
        optionLabel = opt.label;
      }
    }

    // if options exist but none selected, pick first by default
    if (item.options && !optionId) {
      const opt = item.options[0];
      price = opt.price;
      optionLabel = opt.label;
      setSelectedOptions(prev => ({ ...prev, [item.id]: opt.id }));
    }

    const cartId = makeCartId(item.id, selectedOptions[item.id] ?? (item.options?.[0]?.id ?? 'def'));
    const displayName = optionLabel ? `${item.title} — ${optionLabel}` : item.title;

    // use shared addItem which merges by id
    addItem({ id: cartId, name: displayName, price }, 1);
    setOpenCart(true);
  }

  // change qty for a specific cart id
  function handleChangeQty(cartId: string, delta: number) {
    const entry = cartItems.find(c => c.id === cartId);
    if (!entry) return;
    const newQty = Math.max(0, entry.qty + delta);
    if (newQty === 0) {
      removeItem(cartId);
    } else {
      updateQty(cartId, newQty);
    }
  }

  function handleRemove(cartId: string) {
    removeItem(cartId);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white py-8 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Catalog */}
        <div className="lg:col-span-2">
          <header className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight">TugShop — Stationery</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setOpenCart(v => !v)}
                className="inline-flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 px-3 py-2 rounded-2xl"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{itemCount}</span>
              </button>
            </div>
          </header>

          <p className="text-sm text-blue-200/70 mb-6">Black & blue neon theme — choose options (if any) and add items to cart. Cart is shared site-wide.</p>

          <div className="grid sm:grid-cols-2 gap-5">
            {STATIONERY.map(item => (
              <div key={item.id} className="bg-gradient-to-br from-gray-900/60 to-black/40 border border-blue-800/40 rounded-2xl p-4 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-tr from-blue-900 to-black flex items-center justify-center text-blue-300 font-bold">✎</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <div className="text-blue-300 font-mono">
                        {item.price ? formatINR(item.price) : item.options ? formatINR(item.options[0].price) : ''}
                      </div>
                    </div>
                    {item.description && <p className="text-sm text-blue-100/60 mt-1">{item.description}</p>}

                    {item.options && (
                      <div className="mt-3">
                        <label className="text-xs text-blue-200/60">Choose option</label>
                        <div className="mt-2 relative inline-block">
                          <select
                            value={selectedOptions[item.id] ?? item.options[0].id}
                            onChange={(e) => setSelectedOptions(prev => ({ ...prev, [item.id]: e.target.value }))}
                            className="appearance-none bg-transparent border border-blue-700/60 px-3 py-2 rounded-lg pr-8 text-sm"
                          >
                            {item.options.map(o => (
                              <option key={o.id} value={o.id}>{o.label}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/80 pointer-events-none" />
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex items-center gap-3">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 transition-shadow font-semibold"
                      >
                        Add to cart
                      </button>
                      <button
                        onClick={() => setSelectedOptions(prev => ({ ...prev, [item.id]: undefined }))}
                        className="text-xs text-blue-200/50 underline"
                      >Clear selection</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart (shows tuck-origin items only for clarity) */}
        <aside className="bg-black/60 border border-blue-800/40 rounded-2xl p-4 shadow-inner">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Cart</h2>
            <button onClick={() => {
              // clear only tuck items
              tuckCart.forEach(c => removeItem(c.id));
            }} className="text-sm text-blue-200/60 hover:text-blue-100">Clear</button>
          </div>

          {tuckCart.length === 0 ? (
            <div className="text-center text-sm text-blue-200/60 py-10">
              Your cart is empty. Add something from the list.
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-auto">
              {tuckCart.map(ci => (
                <div key={ci.id} className="flex items-center justify-between gap-3 bg-gray-900/40 p-3 rounded-lg">
                  <div>
                    <div className="font-semibold">{ci.name}</div>
                    <div className="text-xs text-blue-300 font-mono">{formatINR(ci.price)} each</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => handleChangeQty(ci.id, -1)} className="p-1 rounded-md bg-blue-800/30"><Minus className="w-4 h-4" /></button>
                    <div className="px-3 py-1 bg-black/30 rounded">{ci.qty}</div>
                    <button onClick={() => handleChangeQty(ci.id, +1)} className="p-1 rounded-md bg-blue-800/30"><Plus className="w-4 h-4" /></button>
                    <button onClick={() => handleRemove(ci.id)} className="p-1 rounded-md ml-2 text-red-400/80"><X className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}

              <div className="border-t border-blue-700/30 pt-3 flex items-center justify-between">
                <div className="text-sm text-blue-200/70">Subtotal</div>
                <div className="font-bold text-lg">{formatINR(tuckCart.reduce((s, c) => s + c.price * c.qty, 0))}</div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => {
                    // navigate to your checkout flow or open a modal — default: go to /checkout if exists
                    if (tuckCart.length === 0) {
                      alert('Cart is empty. Add items before checkout.');
                      return;
                    }
                    navigate('/checkout'); // implement route if needed
                  }}
                  className="w-full py-2 rounded-full bg-blue-600 hover:bg-blue-500 font-semibold"
                >
                  Checkout
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Optional floating cart when opened (shows global counts/subtotal) */}
      {openCart && (
        <div className="fixed right-6 bottom-6 md:right-12 md:bottom-12">
          <div className="bg-gradient-to-br from-blue-700 to-blue-500 text-black px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3">
            <ShoppingCart className="w-5 h-5" />
            <div className="font-semibold">{itemCount} items</div>
            <div className="font-mono ml-2">{formatINR(subtotal)}</div>
            <button onClick={() => setOpenCart(false)} className="ml-2 text-sm underline">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
