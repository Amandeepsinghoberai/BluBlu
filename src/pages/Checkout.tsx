import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  const [profile, setProfile] = useState<any>(null);
  const [address, setAddress] = useState({ building: '', room: '', phone: '' });
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod'>('upi');
  const upiId = '9424476949@pthdfc';
  const upiPayeeName = 'BluBlu';

  const deliveryFee = 20;
  const total = useMemo(() => subtotal + deliveryFee, [subtotal]);

  const upiUrl = useMemo(() => {
    const params = new URLSearchParams({
      pa: upiId, // payee address
      pn: upiPayeeName, // payee name
      am: String(total),
      cu: 'INR',
      tn: 'BluBlu Order',
    });
    return `upi://pay?${params.toString()}`;
  }, [total]);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      setProfile(data);
      setAddress({
        building: data?.building ?? '',
        room: data?.room_number ?? '',
        phone: data?.phone ?? '',
      });
    })();
  }, [user, navigate]);

  const placeOrder = async () => {
    if (!user) return;
    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    setPlacing(true);
    setError(null);
    try {
      // persist delivery address back to profile for future orders
      await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          building: address.building || null,
          room_number: address.room || null,
          phone: address.phone || null,
          full_name: profile?.full_name || null,
        }, { onConflict: 'id' });

      const deliveryLocation = address.building && address.room
        ? `${address.building} - Room ${address.room}`
        : 'Room not set';

      // Attempt to find the "Food Delivery" category id (fallback to any existing category)
      const { data: foodCat } = await supabase
        .from('service_categories')
        .select('id,name')
        .ilike('name', 'Food%')
        .maybeSingle();

      let serviceCategoryId: string | undefined = foodCat?.id as string | undefined;
      if (!serviceCategoryId) {
        const { data: anyCat } = await supabase
          .from('service_categories')
          .select('id')
          .order('created_at')
          .limit(1)
          .maybeSingle();
        serviceCategoryId = anyCat?.id as string | undefined;
      }
      if (!serviceCategoryId) {
        setError('No service categories found. Please seed service categories in the database.');
        setPlacing(false);
        return;
      }

      const summary = cartItems.map((it) => `${it.name} x ${it.qty}`).join(', ');

      const { data: orderRow, error: orderErr } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          service_category_id: serviceCategoryId!,
          pickup_location: 'Checkout',
          delivery_location: deliveryLocation,
          item_description: summary,
          special_instructions: `Phone: ${address.phone}`,
          status: 'pending',
          delivery_fee: deliveryFee,
          total_amount: total,
          payment_method: paymentMethod,
          payment_status: paymentMethod === 'cod' ? 'cod' : 'pending',
          customer_name: profile?.full_name || null,
        })
        .select('id')
        .single();
      if (orderErr) throw orderErr;

      // Insert order_items
      const itemsPayload = cartItems.map((it) => ({
        order_id: orderRow.id,
        item_id: it.id,
        name: it.name,
        unit_price: it.price,
        qty: it.qty,
        image: it.image ?? null,
      }));
      const { error: itemsErr } = await supabase.from('order_items').insert(itemsPayload);
      if (itemsErr) throw itemsErr;

      clearCart();
      if (paymentMethod === 'upi') {
        // For UPI, open link and let user mark as paid afterwards
        window.location.href = upiUrl;
        navigate('/?orders');
      } else {
        // COD — already marked as 'cod'
        navigate('/?orders');
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#01040a] via-[#071021] to-[#02172a] text-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Checkout</h1>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0b0f15] text-white border border-blue-800/30 hover:opacity-95"
            aria-label="Go back"
          >
            ← Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#061225]/70 border border-blue-800/30 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  className="px-4 py-3 rounded-lg bg-[#0b1426] border border-blue-900/40 outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Building"
                  value={address.building}
                  onChange={(e) => setAddress((s) => ({ ...s, building: e.target.value }))}
                />
                <input
                  className="px-4 py-3 rounded-lg bg-[#0b1426] border border-blue-900/40 outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Room Number"
                  value={address.room}
                  onChange={(e) => setAddress((s) => ({ ...s, room: e.target.value }))}
                />
                <input
                  className="px-4 py-3 rounded-lg bg-[#0b1426] border border-blue-900/40 outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Phone"
                  value={address.phone}
                  onChange={(e) => setAddress((s) => ({ ...s, phone: e.target.value }))}
                />
              </div>
              <p className="text-xs text-slate-400 mt-3">These will be saved on your profile for faster checkout later.</p>
            </div>

            <div className="bg-[#061225]/70 border border-blue-800/30 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Payment</h2>
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${paymentMethod === 'upi' ? 'bg-gradient-to-r from-blue-600 to-cyan-400 text-black' : 'bg-[#0b0f15] text-white border border-blue-800/30'}`}
                >
                  UPI (GPay/PhonePe/Paytm)
                </button>
                <button
                  onClick={() => setPaymentMethod('cod')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${paymentMethod === 'cod' ? 'bg-gradient-to-r from-blue-600 to-cyan-400 text-black' : 'bg-[#0b0f15] text-white border border-blue-800/30'}`}
                >
                  Cash on Delivery
                </button>
              </div>

              {paymentMethod === 'upi' && (
                <div className="space-y-3">
                  <div className="text-slate-300 text-sm">Pay securely to <span className="font-semibold text-white">{upiId}</span>. Amount will auto-fill.</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a href={upiUrl} className="px-4 py-3 rounded-lg text-center bg-[#0b0f15] border border-blue-800/30 hover:opacity-95">Open UPI App</a>
                    <a href={upiUrl.replace('upi://','tez://')} className="px-4 py-3 rounded-lg text-center bg-[#0b0f15] border border-blue-800/30 hover:opacity-95">Open GPay</a>
                    <a href={upiUrl.replace('upi://','phonepe://')} className="px-4 py-3 rounded-lg text-center bg-[#0b0f15] border border-blue-800/30 hover:opacity-95">Open PhonePe</a>
                    <a href={upiUrl.replace('upi://','paytmmp://')} className="px-4 py-3 rounded-lg text-center bg-[#0b0f15] border border-blue-800/30 hover:opacity-95">Open Paytm</a>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm text-slate-300 mb-2">Or scan QR</div>
                    <img
                      alt="UPI QR"
                      className="w-40 h-40 bg-white p-1 rounded"
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`}
                    />
                  </div>
                  <div className="text-xs text-slate-400">After payment, your order will show as unpaid until verified manually. You can mark it paid by contacting support or we can add automatic verification later.</div>
                </div>
              )}
            </div>

            <div className="bg-[#061225]/70 border border-blue-800/30 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Items</h2>
              {cartItems.length === 0 ? (
                <div className="text-slate-300">Your cart is empty.</div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((it) => (
                    <div key={it.id} className="flex items-center justify-between py-2 border-b border-blue-900/30">
                      <div className="font-medium">{it.name} <span className="text-slate-400">× {it.qty}</span></div>
                      <div className="text-slate-200">₹{it.price * it.qty}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="bg-[#061225]/70 border border-blue-800/30 rounded-2xl p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-300">Subtotal</span><span>₹{subtotal}</span></div>
              <div className="flex justify-between"><span className="text-slate-300">Delivery Fee</span><span>₹{deliveryFee}</span></div>
              <div className="border-t border-blue-900/40 my-2"></div>
              <div className="flex justify-between text-lg font-semibold"><span>Total</span><span>₹{total}</span></div>
            </div>

            {error && <div className="mt-4 text-sm text-red-400">{error}</div>}

            <button
              onClick={placeOrder}
              disabled={placing || cartItems.length === 0}
              className="mt-5 w-full px-4 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 to-cyan-400 text-black shadow-[0_10px_30px_rgba(3,57,255,0.12)] hover:brightness-105 disabled:opacity-50"
            >
              {placing ? 'Placing...' : paymentMethod === 'cod' ? 'Place Order (COD)' : 'Place & Pay with UPI'}
            </button>

            <button
              onClick={() => navigate(-1)}
              className="mt-3 w-full px-4 py-3 rounded-xl font-medium text-sm bg-[#0b0f15] text-white border border-blue-800/30 hover:opacity-95"
            >
              Back
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}


