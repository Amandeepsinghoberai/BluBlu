import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          phone: string | null;
          room_number: string | null;
          building: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          phone?: string | null;
          room_number?: string | null;
          building?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string | null;
          room_number?: string | null;
          building?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      service_categories: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          is_active: boolean;
          created_at: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          service_category_id: string;
          pickup_location: string;
          delivery_location: string;
          item_description: string;
          special_instructions: string;
          status: 'pending' | 'accepted' | 'in_transit' | 'delivered' | 'cancelled';
          estimated_delivery_time: string | null;
          actual_delivery_time: string | null;
          delivery_fee: number;
          total_amount: number;
          payment_method: 'upi' | 'cod' | null;
          payment_status: 'pending' | 'paid' | 'cod' | null;
          payment_reference: string | null;
          customer_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          service_category_id: string;
          pickup_location: string;
          delivery_location: string;
          item_description: string;
          special_instructions?: string;
          status?: 'pending' | 'accepted' | 'in_transit' | 'delivered' | 'cancelled';
          estimated_delivery_time?: string | null;
          actual_delivery_time?: string | null;
          delivery_fee?: number;
          total_amount?: number;
          payment_method?: 'upi' | 'cod' | null;
          payment_status?: 'pending' | 'paid' | 'cod' | null;
          payment_reference?: string | null;
          customer_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          item_id: string | null;
          name: string;
          unit_price: number;
          qty: number;
          image: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          item_id?: string | null;
          name: string;
          unit_price: number;
          qty: number;
          image?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          item_id?: string | null;
          name?: string;
          unit_price?: number;
          qty?: number;
          image?: string | null;
          created_at?: string;
        };
      };
    };
  };
};
