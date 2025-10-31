import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface OrderItem {
  id: string;
  name: string;
  unit_price: number;
  qty: number;
}

interface Order {
  id: string;
  pickup_location: string;
  delivery_location: string;
  item_description: string;
  status: 'pending' | 'accepted' | 'in_transit' | 'delivered' | 'cancelled';
  created_at: string;
  delivery_fee: number;
  service_categories: {
    name: string;
  };
  profiles?: {
    full_name: string | null;
  };
  order_items: OrderItem[];
}

export default function OrdersView() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;

    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        service_categories (
          name
        ),
        profiles (
          full_name
        ),
        order_items (
          id, name, unit_price, qty
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setOrders(data || []);
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'in_transit':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_transit':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
        <p className="text-gray-600">Start by placing your first order!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              {getStatusIcon(order.status)}
              <div>
                <h3 className="font-semibold text-gray-900">
                  {order.service_categories.name}
                </h3>
                <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                {order.profiles?.full_name && (
                  <p className="text-xs text-gray-600">Customer: <span className="font-medium text-gray-800">{order.profiles.full_name}</span></p>
                )}
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                order.status
              )}`}
            >
              {order.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="text-gray-500">Pickup:</span>{' '}
                <span className="text-gray-900 font-medium">{order.pickup_location}</span>
              </div>
              <div>
                <span className="text-gray-500">Delivery:</span>{' '}
                <span className="text-gray-900 font-medium">{order.delivery_location}</span>
              </div>
            </div>
            <div>
              <span className="text-gray-500">Items:</span>
              <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-1">
                {order.order_items && order.order_items.length > 0 ? (
                  order.order_items.map((it) => (
                    <div key={it.id} className="flex justify-between text-gray-900">
                      <span className="font-medium">{it.name}</span>
                      <span className="text-gray-600">× {it.qty} • ₹{it.unit_price * it.qty}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-gray-900">{order.item_description}</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm text-gray-500">Order ID: {order.id.slice(0, 8)}</span>
            <span className="font-semibold text-blue-600">₹{order.delivery_fee}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
