// -----------------------
// src/components/Header.tsx
// -----------------------
import React, { useMemo, useState } from 'react';
import { Zap, User, LogOut, ShoppingCart, X, Trash } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number; // in rupees (or smallest currency unit — adapt to your app)
  qty: number;
  image?: string;
}

interface HeaderProps {
  view: 'home' | 'orders';
  setView: (v: 'home' | 'orders') => void;
  user: any;
  profile: any;
  onSignOut: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onBrandClick?: () => void;

  /* Cart-related props */
  cartItems?: CartItem[];
  onToggleCart?: () => void; // optional callback if parent wants to manage a cart drawer
  onRemoveFromCart?: (id: string) => void;
  onCheckout?: () => void;
}

export default function Header({
  view,
  setView,
  user,
  profile,
  onSignOut,
  onOpenAuth,
  onOpenProfile,
  onBrandClick,
  cartItems = [],
  onToggleCart,
  onRemoveFromCart,
  onCheckout,
}: HeaderProps) {
  const [showMiniCart, setShowMiniCart] = useState(false);

  const itemCount = useMemo(() => {
    return cartItems.reduce((acc, it) => acc + it.qty, 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, it) => acc + it.price * it.qty, 0);
  }, [cartItems]);

  const formattedCurrency = (value: number) => {
    // Change locale / currency if you want a different format
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
  };

  const handleCartToggle = () => {
    // prefer parent-managed toggle if provided
    if (onToggleCart) {
      onToggleCart();
    } else {
      setShowMiniCart((s) => !s);
    }
  };

  return (
    <nav className="sticky top-0 z-50">
      {/* translucent dark glass bar with subtle border & glow */}
      <div className="backdrop-blur-md bg-bg-elev/90 border-b border-bg-border shadow-[0_6px_30px_rgba(2,6,23,0.6)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left - Brand */}
            <button
              onClick={() => {
                setView('home');
                onBrandClick?.();
              }}
              className="flex items-center gap-3 group focus:outline-none"
            >
              <div className="relative flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="BluBlu logo"
                  className="w-9 h-9 object-contain rounded-md shadow-[0_6px_20px_rgba(3,57,255,0.15)]"
                />
                <span className="text-2xl font-extrabold tracking-tight text-text-secondary drop-shadow-[0_2px_10px_rgba(0,150,255,0.15)] group-hover:text-brand-cyan transition-colors">
                  BluBlu
                </span>
              </div>
            </button>

            {/* Center - Nav Buttons */}
            {user && (
              <div className="hidden md:flex items-center space-x-3 bg-[#071027]/60 px-3 py-2 rounded-full border border-blue-700/20 shadow-inner">
                <button
                  onClick={() => setView('home')}
                  className={`px-4 py-1.5 rounded-full font-medium text-sm transition-all ${
                    view === 'home'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-black shadow-[0_8px_30px_rgba(0,150,255,0.18)]'
                      : 'text-gray-200 hover:bg-white/3'
                  }`}
                >
                  Home
                </button>

                <button
                  onClick={() => setView('orders')}
                  className={`px-4 py-1.5 rounded-full font-medium text-sm transition-all ${
                    view === 'orders'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-black shadow-[0_8px_30px_rgba(0,150,255,0.18)]'
                      : 'text-gray-200 hover:bg-white/3'
                  }`}
                >
                  Orders
                </button>
              </div>
            )}

            {/* Right - Auth/Profile + Cart */}
            <div className="flex items-center space-x-3 relative">
              {/* Cart button */}
              <div className="relative">
                <button
                  onClick={handleCartToggle}
                  aria-label="Toggle cart"
                  className="relative flex items-center justify-center w-11 h-11 rounded-full bg-[#071226]/60 border border-blue-700/30 hover:backdrop-brightness-110 transition-all"
                >
                  <ShoppingCart className="w-5 h-5 text-cyan-300" />

                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 text-black shadow-[0_6px_20px_rgba(3,57,255,0.12)]">
                      {itemCount}
                    </span>
                  )}
                </button>

                {/* Mini cart dropdown */}
                {(showMiniCart || onToggleCart) && (
                  <div className="absolute right-0 mt-3 w-80 md:w-96 bg-[#061225]/90 backdrop-blur-sm border border-blue-800/30 rounded-2xl shadow-[0_12px_60px_rgba(2,6,23,0.6)] overflow-hidden z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-blue-800/20">
                      <div className="flex items-center gap-3">
                        <ShoppingCart className="w-5 h-5 text-cyan-300" />
                        <div>
                          <div className="text-sm font-semibold text-white">Your Cart</div>
                          <div className="text-xs text-gray-300">{itemCount} item(s)</div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (onToggleCart) onToggleCart();
                          else setShowMiniCart(false);
                        }}
                        className="p-1 rounded-full hover:bg-white/3"
                        aria-label="Close cart"
                      >
                        <X className="w-4 h-4 text-gray-200" />
                      </button>
                    </div>

                    <div className="max-h-64 overflow-y-auto px-3 py-2">
                      {cartItems.length === 0 ? (
                        <div className="px-4 py-6 text-center text-sm text-gray-300">Your cart is empty.</div>
                      ) : (
                        cartItems.map((it) => (
                          <div key={it.id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/2">
                            <div className="w-12 h-12 rounded-md bg-[#0a1220] flex-shrink-0 overflow-hidden flex items-center justify-center">
                              {it.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="text-xs text-gray-400">No Image</div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div className="text-sm font-medium text-white truncate">{it.name}</div>
                                <div className="text-sm text-gray-200">{formattedCurrency(it.price * it.qty)}</div>
                              </div>

                              <div className="mt-1 flex items-center justify-between text-xs text-gray-400">
                                <div>Qty: {it.qty}</div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => onRemoveFromCart?.(it.id)}
                                    className="p-1 rounded-full hover:bg-white/3"
                                    aria-label={`Remove ${it.name}`}
                                  >
                                    <Trash className="w-4 h-4 text-red-400" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="px-4 py-3 border-t border-blue-800/20 bg-gradient-to-t from-[#081226] to-transparent">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm text-gray-300">Subtotal</div>
                        <div className="text-sm font-semibold text-white">{formattedCurrency(subtotal)}</div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            if (onCheckout) onCheckout();
                            else alert('Proceed to checkout (implement handler)');
                          }}
                          className="flex-1 px-4 py-2 rounded-full font-semibold text-sm bg-gradient-to-r from-blue-600 to-cyan-400 text-black shadow-[0_10px_30px_rgba(3,57,255,0.12)] hover:brightness-105"
                        >
                          Checkout
                        </button>

                        <button
                          onClick={() => {
                            if (onToggleCart) onToggleCart();
                            else setShowMiniCart(false);
                          }}
                          className="px-3 py-2 rounded-full font-medium text-sm bg-[#0b0f15] text-white border border-blue-800/20 hover:opacity-95"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right - Auth/Profile */}
              <div className="flex items-center space-x-3">
                {user ? (
                  <>
                    <button
                      onClick={onOpenProfile}
                      className="flex items-center space-x-2 px-3 py-2 rounded-full font-medium text-sm text-white bg-[#071226]/60 border border-blue-700/30 hover:backdrop-brightness-110 transition-all"
                    >
                      <User className="w-4 h-4 text-cyan-300" />
                      <span className="hidden sm:inline">{profile?.full_name || 'Profile'}</span>
                    </button>

                    <button
                      onClick={onSignOut}
                      className="flex items-center space-x-2 px-3 py-2 rounded-full font-medium text-sm bg-gradient-to-br from-[#0b0b0b] to-[#1a1a1a] text-white hover:opacity-95 shadow-[0_8px_30px_rgba(0,0,0,0.6)] border border-blue-800/30 transition-all"
                    >
                      <LogOut className="w-4 h-4 text-white" />
                      <span className="hidden sm:inline">Sign Out</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={onOpenAuth}
                    className="px-5 py-2 rounded-full font-semibold text-sm bg-gradient-to-r from-blue-600 to-cyan-500 text-black shadow-[0_10px_30px_rgba(0,150,255,0.18)] hover:brightness-105 transition"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
