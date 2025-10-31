import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface OrderModalProps {
  categoryId: string;
  categoryName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function OrderModal({ categoryId, categoryName, onClose, onSuccess }: OrderModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState<any>(null);

  const [formData, setFormData] = useState({
    pickupLocation: '',
    itemDescription: '',
    specialInstructions: '',
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    setProfile(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    setError('');
    setLoading(true);

    try {
      const deliveryLocation = profile.room_number && profile.building
        ? `${profile.building} - Room ${profile.room_number}`
        : 'Room not set';

      const { error } = await supabase.from('orders').insert({
        user_id: user.id,
        service_category_id: categoryId,
        pickup_location: formData.pickupLocation,
        delivery_location: deliveryLocation,
        item_description: formData.itemDescription,
        special_instructions: formData.specialInstructions,
        status: 'pending',
        delivery_fee: 20,
        total_amount: 20,
      });

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white border border-gray-200 rounded-2xl w-full max-w-2xl shadow-[0_25px_80px_rgba(0,0,0,0.25)] my-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b bg-white/95 rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">New Order</h2>
            <p className="text-sm text-gray-600">{categoryName}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">

        

        {!profile?.room_number && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg mb-6 text-sm">
            Please update your profile with room details for delivery.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Pickup Location *
            </label>
            <input
              type="text"
              value={formData.pickupLocation}
              onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
              placeholder="e.g., Main Cafeteria, Gate 2, Tuck Shop"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Item Description *
            </label>
            <textarea
              value={formData.itemDescription}
              onChange={(e) => setFormData({ ...formData, itemDescription: e.target.value })}
              placeholder="Describe what you need delivered"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-gray-900 placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Special Instructions
            </label>
            <textarea
              value={formData.specialInstructions}
              onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
              placeholder="Any special requests or notes"
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-gray-900 placeholder-gray-400"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center text-sm mb-1">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-semibold text-gray-900">₹20</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-bold text-blue-600 text-lg">₹20</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Placing Order...
              </>
            ) : (
              'Place Order'
            )}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
}
