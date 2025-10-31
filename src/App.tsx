// src/App.tsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Zap, Package, Utensils, ShoppingBag, Coffee, Store, Sparkles } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider, useCart } from './contexts/CartContext';
import { supabase } from './lib/supabase';
import Hero from './components/Hero';
import ServiceCard from './components/ServiceCard';
import AuthModal from './components/AuthModal';
import OrderModal from './components/OrderModal';
import ProfileModal from './components/ProfileModal';
import OrdersView from './components/OrdersView';
import Header from './components/Header';
import Footer from './components/Footer';
import FoodMenuPage from './pages/FoodMenuPage';
import Grocery from './pages/Grocery';
import Tuck from './pages/Tuck'; // <- Tuck page you created
import Checkout from './pages/Checkout';

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  slug?: string;
}

const iconMap: Record<string, any> = {
  utensils: Utensils,
  'shopping-bag': ShoppingBag,
  coffee: Coffee,
  package: Package,
  store: Store,
  sparkles: Sparkles,
};

const defaultServices: ServiceCategory[] = [
  { id: 'food', name: 'Food Delivery', description: 'Get food delivered from campus cafeteria, food court, or restaurants', icon: 'utensils' },
  { id: 'groceries', name: 'Groceries', description: 'Order groceries and essentials from nearby stores', icon: 'shopping-bag' },
  { id: 'tuck', name: 'Tuck Shop', description: 'Snacks, beverages, and quick bites from the tuck shop', icon: 'coffee' },
  { id: 'parcel', name: 'Parcel Pickup', description: 'Collect parcels from gate, reception, or mail room', icon: 'package' },
  { id: 'mall', name: 'Mall Delivery', description: 'Items from the university mall delivered to your room', icon: 'store' },
  { id: 'custom', name: 'Custom Service', description: 'Any other delivery service within campus', icon: 'sparkles' },
];

function AppContent() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [view, setView] = useState<'home' | 'orders'>('home');
  const [profile, setProfile] = useState<any>(null);

  // Cart from context
  const { cartItems, itemCount, subtotal, removeItem, clearCart } = useCart();

  useEffect(() => {
    loadServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .eq('is_active', true)
        .order('created_at');

      if (error) {
        console.error('supabase loadServices error:', error);
        setServices(defaultServices);
        return;
      }

      if (data && data.length > 0) {
        setServices(data as ServiceCategory[]);
        console.log('services loaded from DB:', data);
      } else {
        setServices(defaultServices);
        console.log('no DB services found — using defaultServices');
      }
    } catch (err) {
      console.error('Failed to load services:', err);
      setServices(defaultServices);
    }
  };

  const loadProfile = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      setProfile(data);
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  // detect food, groceries and tuck robustly
  const handleServiceClick = (service: ServiceCategory) => {
    console.log('handleServiceClick:', service);

    const rawId = String((service as any).id ?? '').toLowerCase();
    const rawName = String((service as any).name ?? '').toLowerCase();
    const rawSlug = String((service as any).slug ?? (service as any).key ?? '').toLowerCase();

    const isFood =
      rawId === 'food' ||
      rawName.includes('food') ||
      rawName.includes('food delivery') ||
      rawSlug === 'food' ||
      rawSlug.includes('food');

    const isGroceries =
      rawId === 'groceries' ||
      rawId === 'grocery' ||
      rawName.includes('grocery') ||
      rawName.includes('groceries') ||
      rawSlug === 'groceries' ||
      rawSlug === 'grocery' ||
      rawSlug.includes('grocery');

    const isTuck =
      rawId === 'tuck' ||
      rawName.includes('tuck') ||
      rawName.includes('tuck shop') ||
      rawSlug === 'tuck' ||
      rawSlug.includes('tuck');

    if (isFood) {
      if (!user) {
        setShowAuthModal(true);
        return;
      }
      navigate('/food');
      return;
    }

    if (isGroceries) {
      if (!user) {
        setShowAuthModal(true);
        return;
      }
      navigate('/grocery');
      return;
    }

    if (isTuck) {
      if (!user) {
        setShowAuthModal(true);
        return;
      }
      navigate('/tuck');
      return;
    }

    // default behavior: open order modal for other services
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setSelectedCategory(service);
    setShowOrderModal(true);
  };

  const handleGetStarted = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      const servicesSection = document.getElementById('services');
      servicesSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-text">
      <Header
        view={view}
        setView={setView}
        user={user}
        profile={profile}
        onSignOut={signOut}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenProfile={() => setShowProfileModal(true)}
        onBrandClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        // cart props (passed from useCart)
        cartItems={cartItems}
        onRemoveFromCart={removeItem}
        onCheckout={() => {
          // simple checkout handler — adapt to your flow
          if (!user) {
            setShowAuthModal(true);
            return;
          }
          // navigate to a checkout page or create order
          navigate('/checkout'); // implement route /checkout if needed
        }}
      />

      {view === 'home' ? (
        <>
          <Hero onGetStarted={handleGetStarted} />

          <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white drop-shadow-md mb-4">Our Services</h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                Choose from a variety of delivery services tailored for campus life
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => {
                const IconComponent = iconMap[service.icon] || Package;
                return (
                  <ServiceCard
                    key={(service as any).id ?? service.name}
                    icon={IconComponent}
                    title={service.name}
                    description={service.description}
                    onClick={() => handleServiceClick(service)}
                  />
                );
              })}
            </div>
          </section>

          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="rounded-3xl overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,115,230,0.18)] border border-bg-border">
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="p-10 text-center bg-gradient-to-r from-primary to-brand-cyan">
                    <div className="text-5xl font-extrabold text-white">7–15 min</div>
                    <div className="text-white/80 mt-2">Average Delivery Time</div>
                  </div>

                  <div className="p-10 text-center bg-gradient-to-r from-primary to-brand-cyan/90">
                    <div className="text-5xl font-extrabold text-white">₹20</div>
                    <div className="text-white/80 mt-2">Flat Delivery Fee</div>
                  </div>

                  <div className="p-10 text-center bg-gradient-to-r from-primary to-brand-cyan">
                    <div className="text-5xl font-extrabold text-white">24/7</div>
                    <div className="text-white/80 mt-2">Always Available</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-white mb-8">Your Orders</h1>
          <OrdersView />
        </section>
      )}

      <Footer />

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      {/* don't render OrderModal for food, groceries or tuck categories (they have dedicated pages) */}
      {showOrderModal && selectedCategory && !['food', 'groceries', 'tuck'].includes(String(selectedCategory.id).toLowerCase()) && (
        <OrderModal
          categoryId={selectedCategory.id}
          categoryName={selectedCategory.name}
          onClose={() => {
            setShowOrderModal(false);
            setSelectedCategory(null);
          }}
          onSuccess={() => setView('orders')}
        />
      )}

      {showProfileModal && (
        <ProfileModal
          onClose={() => {
            setShowProfileModal(false);
            loadProfile();
          }}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/food" element={<FoodMenuPage />} />
            <Route path="/grocery" element={<Grocery />} />
            <Route path="/tuck" element={<Tuck />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/*" element={<AppContent />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
