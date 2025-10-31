-- Denormalized customer name on orders for quick viewing in the dashboard
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS customer_name text;

-- Backfill from profiles
UPDATE public.orders o
SET customer_name = p.full_name
FROM public.profiles p
WHERE o.user_id = p.id
  AND (o.customer_name IS NULL OR o.customer_name = '');

-- Keep the name in sync on new orders
CREATE OR REPLACE FUNCTION public.set_order_customer_name()
RETURNS trigger AS $$
BEGIN
  IF NEW.customer_name IS NULL OR NEW.customer_name = '' THEN
    SELECT full_name INTO NEW.customer_name FROM public.profiles WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_set_order_customer_name ON public.orders;
CREATE TRIGGER trg_set_order_customer_name
BEFORE INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.set_order_customer_name();


