/*
  # BluBlu Delivery Service Database Schema

  ## Overview
  Complete database schema for a college delivery service platform that handles food, groceries, 
  parcels, and custom delivery requests within campus.

  ## Tables Created

  ### 1. profiles
  Extended user profile information linked to auth.users
  - `id` (uuid, primary key) - Links to auth.users.id
  - `full_name` (text) - User's full name
  - `phone` (text) - Contact number
  - `room_number` (text) - Dorm/room location
  - `building` (text) - Building name
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update

  ### 2. service_categories
  Different types of services offered (Food, Groceries, Parcels, etc.)
  - `id` (uuid, primary key)
  - `name` (text) - Category name
  - `description` (text) - Category description
  - `icon` (text) - Icon identifier for UI
  - `is_active` (boolean) - Whether category is currently available
  - `created_at` (timestamptz)

  ### 3. orders
  Main orders table tracking all delivery requests
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - References profiles
  - `service_category_id` (uuid, foreign key) - Type of service
  - `pickup_location` (text) - Where to collect item
  - `delivery_location` (text) - Where to deliver (usually room number)
  - `item_description` (text) - What needs to be delivered
  - `special_instructions` (text) - Additional notes
  - `status` (text) - Order status (pending, accepted, in_transit, delivered, cancelled)
  - `estimated_delivery_time` (timestamptz) - Expected delivery time
  - `actual_delivery_time` (timestamptz) - When actually delivered
  - `delivery_fee` (numeric) - Cost of delivery
  - `total_amount` (numeric) - Total cost including items
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. order_status_history
  Tracks status changes for orders
  - `id` (uuid, primary key)
  - `order_id` (uuid, foreign key) - References orders
  - `status` (text) - New status
  - `notes` (text) - Status change notes
  - `created_at` (timestamptz)

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Users can only view and manage their own orders
  - Profiles are linked to authenticated users
  - Service categories are publicly viewable but only admins can modify
  - Order history is viewable by order owners only

  ## Indexes
  - Indexed on user_id for fast order lookups
  - Indexed on status for filtering active orders
  - Indexed on created_at for chronological sorting
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  room_number text,
  building text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create service categories table
CREATE TABLE IF NOT EXISTS service_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  service_category_id uuid NOT NULL REFERENCES service_categories(id),
  pickup_location text NOT NULL,
  delivery_location text NOT NULL,
  item_description text NOT NULL,
  special_instructions text DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  estimated_delivery_time timestamptz,
  actual_delivery_time timestamptz,
  delivery_fee numeric(10,2) DEFAULT 0,
  total_amount numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'accepted', 'in_transit', 'delivered', 'cancelled'))
);

-- Create order status history table
CREATE TABLE IF NOT EXISTS order_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status text NOT NULL,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Service categories policies (public read, admin write)
CREATE POLICY "Anyone can view active service categories"
  ON service_categories FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Orders policies
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Order status history policies
CREATE POLICY "Users can view own order history"
  ON order_status_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_status_history.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert order history for own orders"
  ON order_status_history FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_status_history.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Insert default service categories
INSERT INTO service_categories (name, description, icon) VALUES
  ('Food Delivery', 'Get food delivered from campus cafeteria, food court, or restaurants', 'utensils'),
  ('Groceries', 'Order groceries and essentials from nearby stores', 'shopping-bag'),
  ('Tuck Shop', 'Snacks, beverages, and quick bites from the tuck shop', 'candy'),
  ('Parcel Pickup', 'Collect parcels from gate, reception, or mail room', 'package'),
  ('Mall Delivery', 'Items from the university mall delivered to your room', 'store'),
  ('Custom Service', 'Any other delivery service within campus', 'sparkles')
ON CONFLICT (name) DO NOTHING;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();