// src/pages/FoodMenuPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

type MenuItem = {
  id: string;
  name: string;
  desc?: string;
  price: number;
  // sizes can be derived from desc at runtime; keep optional so existing data unchanged
  sizes?: { label: string; price: number }[];
};

type MenuSection = {
  id: string;
  title: string;
  items: MenuItem[];
};

export default function FoodMenuPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // === FULL groupedMenu: every unique item from your provided lists, grouped by stall/restaurant in the order you gave ===
  const groupedMenu: MenuSection[] = [
    {
      id: 's-korean-street',
      title: 'Korean Street Food',
      items: [
        { id: 'k-r1', name: 'Veg Fiery Ramen (Soupy)', desc: 'Soupy ramyun', price: 69 },
        { id: 'k-r2', name: 'Chilly Oil Ramen (Dry)', desc: 'Dry style', price: 69 },
        { id: 'k-r3', name: 'Kimchi Kick Ramen (Dry)', desc: 'Dry style with kimchi', price: 69 },
        { id: 'k-r4', name: 'Momo Love Ramen (Soupy)', desc: 'Soupy - contains mandu', price: 89 },
        { id: 'k-pack', name: 'Choose Your Pack (Mix-n-Match Custom Bowl)', desc: '+₹10', price: 10 },
        { id: 'k-t1', name: 'Gochujang Seoul Tteok', desc: 'Gochujang tteokbokki', price: 129 },
        { id: 'k-t2', name: 'Cheesy Maggi Tteok', desc: 'Maggi + cheese', price: 149 },
        { id: 'k-t3', name: 'Tofu Maggi Tteok', desc: 'Maggi + tofu', price: 149 },
        { id: 'k-rb', name: 'RaBokki (Ramyun + Tteokbokki)', desc: 'Ramyun + Tteokbokki', price: 129 },
        { id: 'k-m1', name: 'Nutri Bomb Mandu', desc: '', price: 69 },
        { id: 'k-m2', name: 'Mix Veg Mandu', desc: '', price: 69 },
        { id: 'k-m3', name: 'Paneer Pop Mandu', desc: '', price: 89 },
        { id: 'k-m4', name: 'Cheesy Corn Mandu', desc: '', price: 99 },
        { id: 'k-sm1', name: 'Alfredo Creamy Mandu', desc: '', price: 89 },
        { id: 'k-sm2', name: 'Angry Chilli Mandu', desc: '', price: 89 },
        { id: 'k-sm3', name: 'Tandoori Temptation Mandu', desc: '', price: 89 },
        { id: 'k-sr1', name: 'Veg Maangchi with Kimchi', desc: '', price: 69 },
        { id: 'k-sr2', name: 'K-Noodle Maangchi', desc: '', price: 69 },
        { id: 'k-sr3', name: 'Cheongpomuk Muchim (Laphings)', desc: '', price: 79 },
        { id: 'k-sr4', name: 'Cheese & Corn Maangchi', desc: '', price: 89 },
        { id: 'k-b1', name: 'Mandu Kimchi Beo', desc: '', price: 59 },
        { id: 'k-b2', name: 'Spicy Korean Veg Beo', desc: '', price: 59 },
        { id: 'k-b3', name: 'Paneer Gochujang Beo', desc: '', price: 79 },
        { id: 'k-bt1', name: 'Taro Fizzy Boba Tea', desc: '', price: 79 },
        { id: 'k-bt2', name: 'Cold Coffee Boba', desc: '', price: 79 },
        { id: 'k-bt3', name: 'Peach Boba', desc: '', price: 79 },
        { id: 'k-mt1', name: 'Matcha Latte Love', desc: '', price: 99 },
        { id: 'k-mt2', name: 'Taro Milk Matcha', desc: '', price: 109 },
        { id: 'k-mt3', name: 'Strawberry Matcha Crush', desc: '', price: 109 },
        { id: 'k-sn1', name: 'Corn Dog', desc: '', price: 99 },
        { id: 'k-sn2', name: 'Kimchi Fries', desc: '', price: 79 },
      ],
    },

    {
      id: 's-oven-xpress',
      title: 'Oven Xpress',
      items: [
        { id: 'ox-c1', name: 'Chilly Potato', desc: '', price: 90 },
        { id: 'ox-c2', name: 'Honey Chilly Potato', desc: '', price: 90 },
        { id: 'ox-c3', name: 'Manchurian (Dry/Gravy)', desc: '', price: 100 },
        { id: 'ox-c4', name: 'Paneer Crispy', desc: '', price: 120 },
        { id: 'ox-c5', name: 'Mushroom Chilly', desc: '', price: 120 },
        { id: 'ox-c6', name: 'Paneer 65', desc: '', price: 120 },
        { id: 'ox-m1', name: 'Veg Steam Momos', desc: '', price: 80 },
        { id: 'ox-m2', name: 'Paneer Steam Momos', desc: '', price: 90 },
        { id: 'ox-m3', name: 'Veg Fried Momos', desc: '', price: 90 },
        { id: 'ox-m4', name: 'Paneer Fried Momos', desc: '', price: 100 },
        { id: 'ox-m5', name: 'Veg Kurkure Momos', desc: '', price: 90 },
        { id: 'ox-m6', name: 'Paneer Kurkure Momos', desc: '', price: 100 },
        { id: 'ox-k1', name: 'Veg Kathi Roll', desc: '', price: 70 },
        { id: 'ox-k2', name: 'Paneer Kathi Roll', desc: '', price: 90 },
        { id: 'ox-k3', name: 'Bombay Batata Roll', desc: '', price: 80 },
        { id: 'ox-k4', name: 'Veg Tikka Kathi Roll', desc: '', price: 90 },
        { id: 'ox-k5', name: 'Paneer Tikka Kathi Roll', desc: '', price: 100 },
        { id: 'ox-p1', name: 'Margherita', desc: 'Regular', price: 130 },
        { id: 'ox-p2', name: 'Cheese Tomato', desc: 'Regular', price: 130 },
        { id: 'ox-p3', name: 'Cheese N Corn', desc: '', price: 150 },
        { id: 'ox-p4', name: 'Mix Veg', desc: '', price: 150 },
        { id: 'ox-p5', name: 'Fully Loaded', desc: '', price: 180 },
        { id: 'ox-mc1', name: 'Dal Fry', desc: 'Half / Full: ₹70 / ₹120', price: 70 },
        { id: 'ox-mc2', name: 'Dal Makhni', desc: 'Half / Full: ₹90 / ₹150', price: 90 },
        { id: 'ox-mc3', name: 'Paneer Butter Masala', desc: 'Half / Full: ₹130 / ₹180', price: 130 },
        { id: 'ox-mc4', name: 'Shahi Paneer', desc: 'Half / Full: ₹130 / ₹180', price: 130 },
        { id: 'ox-mc5', name: 'Kadai Paneer', desc: 'Half / Full: ₹130 / ₹180', price: 130 },
        { id: 'ox-mc6', name: 'Mushroom Masala', desc: 'Half / Full: ₹120 / ₹180', price: 120 },
        { id: 'ox-mc7', name: 'Paneer Bhurji', desc: 'Half / Full: ₹120 / ₹180', price: 120 },
      ],
    },

    {
      id: 's-kitchen-ette',
      title: 'Kitchen Ette',
      items: [
        { id: 'ke-th1', name: 'Special Thali', desc: '', price: 130 },
        { id: 'ke-th2', name: 'Normal Thali', desc: '', price: 110 },
        { id: 'ke-p1', name: 'Aloo Prantha', desc: '', price: 40 },
        { id: 'ke-p2', name: 'Gobi Prantha', desc: '', price: 40 },
        { id: 'ke-p3', name: 'Mooli Prantha', desc: '', price: 40 },
        { id: 'ke-p4', name: 'Onion Prantha', desc: '', price: 40 },
        { id: 'ke-p5', name: 'Mix Prantha', desc: '', price: 50 },
        { id: 'ke-p6', name: 'Paneer Prantha', desc: '', price: 60 },
        { id: 'ke-p7', name: 'Plain Prantha', desc: '', price: 25 },
        { id: 'ke-p8', name: 'Lacha Prantha', desc: '', price: 45 },
        { id: 'ke-p9', name: 'Plain Tawa Butter Roti', desc: '', price: 10 },
        { id: 'ke-r1', name: 'Veg Pulao Paneer', desc: '', price: 130 },
        { id: 'ke-r2', name: 'Paneer Rice', desc: '', price: 115 },
        { id: 'ke-r3', name: 'Rajma Rice', desc: '', price: 80 },
        { id: 'ke-r4', name: 'Dal Rice', desc: '', price: 80 },
        { id: 'ke-r5', name: 'Curry Rice', desc: '', price: 85 },
        { id: 'ke-r6', name: 'Veg Pulao', desc: '', price: 70 },
        { id: 'ke-r7', name: 'Veg Pulao Raita', desc: '', price: 90 },
        { id: 'ke-b1', name: 'Paneer Gravy', desc: '₹65/₹130 (Half/Full)', price: 65 },
        { id: 'ke-b2', name: 'Paneer Bhurji', desc: '₹65/₹130 (Half/Full)', price: 65 },
        { id: 'ke-b3', name: 'Special Sabji', desc: '₹50/₹100 (Half/Full)', price: 50 },
        { id: 'ke-b4', name: 'Dal Rajmah', desc: '₹35/₹70 (Half/Full)', price: 35 },
        { id: 'ke-b5', name: 'Plain Dahi / Raita', desc: '₹15/₹30/₹50 (S/M/L)', price: 15 },
        { id: 'ke-b6', name: 'Plain Rice', desc: '₹30/₹50 (S/M)', price: 30 },
        { id: 'ke-b7', name: 'Green Salad', desc: '', price: 20 },
      ],
    },

    {
      id: 's-nescafe',
      title: 'NESCAFÉ (Coffee, Maggi, Coolers & More)',
      items: [
        { id: 'n-select', name: 'Select - Maggi', desc: 'Select – ₹50', price: 50 },
        { id: 'n-original', name: 'Original Masala', desc: '', price: 50 },
        { id: 'n-greenchilli', name: 'Green Chilli Maggi', desc: '', price: 50 },
        { id: 'n-premium', name: 'Premium – Maggi', desc: 'Premium – ₹60', price: 60 },
        { id: 'n-exotic', name: 'Exotic – Maggi', desc: 'Exotic – ₹65', price: 65 },
        { id: 'n-limited', name: 'Limited – Maggi', desc: 'Limited – ₹75', price: 75 },
        { id: 'n-sweetcorn', name: 'Sweet Corn (side)', desc: '₹45', price: 45 },
        { id: 'c-espresso', name: 'Espresso / Coffee', desc: '₹35 (Reg) / ₹55 (Large)', price: 35 },
        { id: 'c-cap', name: 'Cappuccino / Café Latte / Americano', desc: '₹50 (Reg) / ₹70 (Large)', price: 50 },
        { id: 'c-mocha', name: 'Café Mocha / Hot Chocolate', desc: '₹55 (Reg) / ₹80 (Large)', price: 55 },
        { id: 'c-strong', name: 'Strong Cappuccino / Irish / Caramel / Hazelnut Cappuccino', desc: '₹60 (Reg) / ₹85 (Large)', price: 60 },
        { id: 't-lemon', name: 'Lemon Ice Tea', desc: '₹45 / ₹70', price: 45 },
        { id: 't-peach', name: 'Peach Ice Tea', desc: '₹45 / ₹70', price: 45 },
        { id: 't-water', name: 'Watermelon Ice Tea', desc: '₹55 / ₹80', price: 55 },
        { id: 't-greenapple', name: 'Green Apple / Passion Fruit Ice Tea', desc: '₹55 / ₹80', price: 55 },
        { id: 'frappe-basic', name: 'Frappe', desc: '₹60 / ₹100', price: 60 },
        { id: 'frappe-choco', name: 'Frappe Mocha / Cold Chocolate', desc: '₹70 / ₹110', price: 70 },
        { id: 'frappe-irish', name: 'Irish / Caramel Frappe', desc: '₹70 / ₹110', price: 70 },
        { id: 'frappe-chocolate', name: 'Chocolate Frappe', desc: '₹70 / ₹110', price: 70 },
        { id: 'frappe-hazelnut', name: 'Hazelnut Frappe', desc: '₹70 / ₹110', price: 70 },
      ],
    },

    {
      id: 's-cafe-selfie',
      title: 'Café (Selfie Spot)',
      items: [
        { id: 'cf-s1', name: 'Veg Cheese Sandwich', desc: '', price: 80 },
        { id: 'cf-s2', name: 'Paneer Makhni Sandwich', desc: '', price: 100 },
        { id: 'cf-s3', name: 'Chipotle Paneer Sandwich (with fries)', desc: '', price: 130 },
        { id: 'cf-s4', name: 'Paneer Mint Sandwich (2 Pieces)', desc: '', price: 100 },
        { id: 'cf-f1', name: 'Salted Fries', desc: '', price: 70 },
        { id: 'cf-f2', name: 'Masala / Peri Peri Fries', desc: '', price: 80 },
        { id: 'cf-f3', name: 'Mint Fries', desc: '', price: 80 },
        { id: 'cf-f4', name: 'Cheesy Fries', desc: '', price: 100 },
        { id: 'cf-f5', name: 'Loaded Fries', desc: '', price: 130 },
        { id: 'cf-f6', name: 'Ultimate Fries Bucket', desc: '', price: 150 },
        { id: 'cf-m1', name: 'Virgin Mojito', desc: '', price: 70 },
        { id: 'cf-m2', name: 'Green Apple Mojito', desc: '', price: 70 },
        { id: 'cf-m3', name: 'Watermelon Mojito', desc: '', price: 70 },
        { id: 'cf-m4', name: 'Passion Fruit Mojito', desc: '', price: 70 },
        { id: 'cf-m5', name: 'Peach Mojito', desc: '', price: 70 },
        { id: 'cf-m6', name: 'Blue Curacao Mojito', desc: '', price: 70 },
        { id: 'cf-p1', name: 'White Sauce Pasta', desc: '', price: 90 },
        { id: 'cf-p2', name: 'Red Sauce Pasta', desc: '', price: 90 },
        { id: 'cf-p3', name: 'Mix Sauce Pasta', desc: '', price: 100 },
        { id: 'cf-w1', name: 'Aloo Tikki Wrap', desc: '', price: 70 },
        { id: 'cf-w2', name: 'Paneer Wrap', desc: '', price: 85 },
        { id: 'cf-w3', name: 'Beetroot Falafel Wrap', desc: '', price: 100 },
        { id: 'cf-b1', name: 'Veg Cheese Burger', desc: '', price: 60 },
        { id: 'cf-b2', name: 'Shezwan Cheese Burger', desc: '', price: 70 },
        { id: 'cf-b3', name: 'Maha Raja Burger', desc: '', price: 100 },
        { id: 'cf-b4', name: 'Mac-Paneer Burger', desc: '', price: 100 },
        { id: 'cf-sub1', name: 'Paneer Tikka Sub', desc: '', price: 90 },
        { id: 'cf-sub2', name: 'Aloo Tikki Sub', desc: '', price: 90 },
        { id: 'cf-kr1', name: 'Chocolate Krusher', desc: '', price: 80 },
        { id: 'cf-kr2', name: 'Strawberry Krusher', desc: '', price: 80 },
        { id: 'cf-kr3', name: 'Banana Caramel Krusher', desc: '', price: 90 },
        { id: 'cf-kr4', name: 'Mango Alphonso Krusher', desc: '', price: 90 },
        { id: 'cf-kr5', name: 'Blueberry Krusher', desc: '', price: 100 },
        { id: 'cf-kr6', name: 'Banoffee Krusher', desc: '', price: 100 },
        { id: 'cf-kr7', name: 'Belgian Chocolate Krusher', desc: '', price: 100 },
        { id: 'cf-kr8', name: 'Kit-Kat Krusher', desc: '', price: 110 },
        { id: 'cf-kr9', name: 'Brownie Krusher', desc: '', price: 110 },
        { id: 'cf-cc1', name: 'Iced Americano', desc: '', price: 70 },
        { id: 'cf-cc2', name: 'Affogato', desc: '', price: 70 },
        { id: 'cf-cc3', name: 'Iced Latte', desc: '', price: 70 },
        { id: 'cf-cc4', name: 'Iced Cappuccino', desc: '', price: 90 },
        { id: 'cf-cc5', name: 'Cold Coffee with Ice Cream', desc: '', price: 100 },
        { id: 'cf-cc6', name: 'Red Mocha', desc: '', price: 100 },
        { id: 'cf-cc7', name: 'Strong Cold Coffee', desc: '', price: 100 },
      ],
    },

    {
      id: 's-dessert-waffles',
      title: 'Dessert & Shakes (Belgian Waffles Stall)',
      items: [
        { id: 'dw1', name: 'Belgian Chocolate', desc: '', price: 100 },
        { id: 'dw2', name: 'KitKat Crunch', desc: '', price: 110 },
        { id: 'dw3', name: 'Cream & Cookies', desc: '', price: 110 },
        { id: 'dw4', name: 'Nuclear Nutella', desc: '', price: 120 },
        { id: 'dw5', name: 'Caramello', desc: '', price: 110 },
        { id: 'dw6', name: 'Butterscotch', desc: '', price: 100 },
        { id: 'dw7', name: 'Coffee Choco', desc: '', price: 100 },
        { id: 'dw-f1', name: 'Strawberry', desc: '', price: 100 },
        { id: 'dw-f2', name: 'Cream Cheese', desc: '', price: 120 },
        { id: 'dw-f3', name: 'Boo-Blueberry', desc: '', price: 120 },
        { id: 'dw-f4', name: 'Mango', desc: '', price: 120 },
        { id: 'dw-f5', name: 'White Chocolate', desc: '', price: 120 },
        { id: 'dw-d1', name: 'Chocolate Overdose', desc: 'Double Chocolate', price: 100 },
        { id: 'dw-d2', name: 'Dark & White Fairy', desc: '', price: 110 },
        { id: 'dw-d3', name: 'Double Trouble', desc: '', price: 110 },
        { id: 'dw-d4', name: 'Trio of Chocolate', desc: '', price: 120 },
        { id: 'ws1', name: 'Waffle Sundae (Fudge Ice Cream)', desc: '', price: 120 },
        { id: 'ws2', name: 'Heavy Weight', desc: 'Large sundae', price: 150 },
        { id: 'a-b1', name: 'Brownie', desc: '', price: 50 },
        { id: 'a-b2', name: 'Brownie + Ice Cream', desc: '', price: 60 },
        { id: 'a-l1', name: 'Choco Lava Cake', desc: '', price: 50 },
        { id: 'a-l2', name: 'Choco Lava + Ice Cream', desc: '', price: 60 },
        { id: 'a-t1', name: 'Twin Chocolate Chips', desc: '', price: 20 },
        { id: 'a-o1', name: 'Crunch Oreo', desc: '', price: 10 },
        { id: 'a-ice', name: 'Ice Cream (single scoop)', desc: '', price: 20 },
        { id: 'si1', name: 'Softy Ice Cream - Vanilla', desc: '', price: 30 },
        { id: 'si2', name: 'Softy Ice Cream - Chocolate', desc: '', price: 30 },
        { id: 'mp1', name: 'Belgian Chocolate Mini Pancakes', desc: '', price: 80 },
        { id: 'mp2', name: 'Trio of Chocolate Mini Pancakes', desc: '', price: 80 },
        { id: 'mp3', name: 'Kit-Kat Crunch Mini Pancakes', desc: '', price: 80 },
        { id: 's-choco', name: 'Chocolate Krusher', desc: '', price: 80 },
        { id: 's-straw', name: 'Strawberry Krusher', desc: '', price: 80 },
        { id: 's-banana', name: 'Banana Caramel Krusher', desc: '', price: 90 },
        { id: 's-mango', name: 'Mango Alphonso Krusher', desc: '', price: 90 },
        { id: 's-blue', name: 'Blueberry Krusher', desc: '', price: 100 },
        { id: 's-banoffee', name: 'Banoffee Krusher', desc: '', price: 100 },
        { id: 's-belg', name: 'Belgian Chocolate Krusher', desc: '', price: 100 },
        { id: 's-kitkat', name: 'Kit-Kat Krusher', desc: '', price: 110 },
        { id: 's-brownie', name: 'Brownie Krusher', desc: '', price: 110 },
        { id: 'cold1', name: 'Cold Coffee', desc: 'Cold Coffee / variations', price: 50 },
        { id: 'cold-b1', name: 'Brownie Cold Coffee', desc: '', price: 70 },
        { id: 'oreo-shake', name: 'Oreo Shake', desc: '', price: 60 },
        { id: 'kitkat-shake', name: 'Kit-Kat Shake', desc: '', price: 60 },
        { id: 'blueberry-shake', name: 'Blueberry Shake', desc: '', price: 70 },
        { id: 'straw-shake', name: 'Strawberry Shake', desc: '', price: 60 },
        { id: 'belg-shake', name: 'Belgian Chocolate Shake', desc: '', price: 70 },
        { id: 'crusher-st1', name: 'Strawberry Crusher', desc: '', price: 40 },
        { id: 'crusher-st2', name: 'Mango Crusher', desc: '', price: 40 },
        { id: 'crusher-st3', name: 'Pineapple Crusher', desc: '', price: 40 },
        { id: 'crusher-st4', name: 'Blueberry Crusher', desc: '', price: 40 },
        { id: 'tea-hot', name: 'Hot Coffee', desc: '', price: 35 },
        { id: 'tea-cold', name: 'Cold Coffee', desc: '', price: 60 },
        { id: 'tea-hotmilk', name: 'Hot Milk', desc: '', price: 40 },
        { id: 'tea-hotchoco', name: 'Hot Chocolate', desc: '', price: 45 },
      ],
    },

    {
      id: 's-oven-xpress-expanded',
      title: 'Oven Xpress (Expanded)',
      items: [
        { id: 'oxp1', name: 'Baked Pasta - White Sauce', desc: '', price: 120 },
        { id: 'oxp2', name: 'Baked Pasta - Red Sauce', desc: '', price: 120 },
        { id: 'oxp3', name: 'Baked Pasta - Mix Sauce', desc: '', price: 130 },
        { id: 'sand1', name: 'Veg Grilled Sandwich', desc: '', price: 90 },
        { id: 'sand2', name: 'Paneer Cheese Sandwich', desc: '', price: 110 },
        { id: 'sand3', name: 'Pizza Sandwich', desc: '', price: 120 },
        { id: 'sand4', name: 'Super Veggie Sandwich', desc: '', price: 130 },
        { id: 'wrap1', name: 'Veg Tacos', desc: '', price: 90 },
        { id: 'wrap2', name: 'Paneer Tacos', desc: '', price: 110 },
        { id: 'wrap3', name: 'Veg Burrito', desc: '', price: 110 },
        { id: 'rb1', name: 'Veg Rice Bowl', desc: '', price: 100 },
        { id: 'rb2', name: 'Paneer Rice Bowl', desc: '', price: 120 },
        { id: 'frx1', name: 'Masala Fries', desc: '', price: 60 },
        { id: 'frx2', name: 'Peri Peri Fries', desc: '', price: 70 },
        { id: 'burg-a1', name: 'Aloo Tikki Burger', desc: '', price: 70 },
        { id: 'burg-a2', name: 'Shezwan Burger', desc: '', price: 90 },
        { id: 'burg-a3', name: 'Paneer Burger', desc: '', price: 110 },
        { id: 'burg-a4', name: 'Spicy Paneer Burger', desc: '', price: 120 },
      ],
    },

    {
      id: 's-zero-oil',
      title: 'Zero Oil Menu',
      items: [
        { id: 'z1', name: 'Soy Salad', desc: '₹50/₹80', price: 50 },
        { id: 'z2', name: 'Mexican Salad', desc: '₹80/₹100', price: 80 },
        { id: 'z3', name: 'Russian Salad', desc: '₹80/₹100', price: 80 },
        { id: 'z4', name: 'Hearty Vegan Salad', desc: '₹100/₹120', price: 100 },
        { id: 'z5', name: 'Broccoli Salad', desc: '', price: 100 },
        { id: 'z6', name: 'Protein Rich Salad', desc: '', price: 120 },
        { id: 'z7', name: 'Sprouts Salad', desc: '₹50/₹80', price: 50 },
        { id: 's-sf1', name: 'Steam Salad', desc: '₹50/₹80', price: 50 },
        { id: 's-sf2', name: 'Steam Corn', desc: '₹60/₹90', price: 60 },
        { id: 's-sf3', name: 'Steam Sprouts', desc: '₹30/₹40', price: 30 },
        { id: 's-sf4', name: 'Steam Beans', desc: '₹50/₹80', price: 50 },
        { id: 's-sf5', name: 'Sweet Potato', desc: '₹60/₹100', price: 60 },
        { id: 's-sf6', name: 'Grill Paneer', desc: '', price: 50 },
        { id: 's-sf7', name: 'Paneer Raw', desc: '', price: 45 },
        { id: 's-sf8', name: 'Grill Tofu', desc: '', price: 25 },
        { id: 's-sf9', name: 'Steam Broccoli', desc: '', price: 80 },
        { id: 'z-sand1', name: 'Tofu Cold Sandwich (Atta)', desc: '₹35/₹40', price: 35 },
        { id: 'z-sand2', name: 'Tofu Grill Sandwich (Atta)', desc: '₹40/₹45', price: 40 },
        { id: 'z-sand3', name: 'Keema Sandwich', desc: '₹40/₹50', price: 40 },
        { id: 'z-sand4', name: 'Paneer Sandwich', desc: '₹50/₹60', price: 50 },
        { id: 'z-sand5', name: 'Bean Sandwich', desc: '₹50/₹60', price: 50 },
        { id: 'z-sand6', name: 'Corn Sandwich', desc: '₹50/₹60', price: 50 },
        { id: 'z-sand7', name: 'Vegan Sandwich', desc: '₹50/₹60', price: 50 },
        { id: 'z-sand8', name: 'Peanut Butter Sandwich', desc: '₹50/₹60', price: 50 },
        { id: 'z-wrap1', name: 'Tofu Wrap (Atta)', desc: '₹60', price: 60 },
        { id: 'z-wrap2', name: 'Corn Wrap', desc: '₹70', price: 70 },
        { id: 'z-wrap3', name: 'Beans Wrap', desc: '₹70', price: 70 },
        { id: 'z-wrap4', name: 'Keema Wrap', desc: '₹70', price: 70 },
        { id: 'z-wrap5', name: 'Vegan Wrap', desc: '₹80', price: 80 },
        { id: 'z-wrap6', name: 'Paneer Wrap (Atta)', desc: '₹80', price: 80 },
        { id: 'z-sub1', name: 'Tofu Tikka Subz', desc: '₹70/₹80', price: 70 },
        { id: 'z-sub2', name: 'Keema Subz', desc: '₹70/₹80', price: 70 },
        { id: 'z-sub3', name: 'Vegan Subz', desc: '₹80/₹90', price: 80 },
        { id: 'z-sub4', name: 'Paneer Tikka Subz', desc: '₹80/₹90', price: 80 },
        { id: 'z-b1', name: 'Soy Veggie Burger (Atta)', desc: '₹40', price: 40 },
        { id: 'z-b2', name: 'Tofu Patties Burger (Atta)', desc: '₹50', price: 50 },
        { id: 'z-b3', name: 'Chunks Burger (Atta)', desc: '₹60', price: 60 },
        { id: 'z-b4', name: 'Vegan Burger (Atta)', desc: '₹70', price: 70 },
        { id: 'z-b5', name: 'Paneer Burger (Atta)', desc: '₹80', price: 80 },
      ],
    },

    {
      id: 's-juice-shakes',
      title: 'Krusher & Beverages / Juice & Shakes Bar',
      items: [
        { id: 'k-kr1', name: 'Banana Krusher', desc: '₹30/₹40/₹50 (S/M/L)', price: 30 },
        { id: 'k-kr2', name: 'Strawberry Krusher', desc: '₹30/₹40/₹50', price: 30 },
        { id: 'k-kr3', name: 'Pista Krusher', desc: '', price: 50 },
        { id: 'k-kr4', name: 'Mango Krusher', desc: '', price: 50 },
        { id: 'k-kr5', name: 'Protein Shake', desc: '', price: 75 },
        { id: 'k-kr6', name: 'Protein Shake (Dry Fruit)', desc: '', price: 95 },
        { id: 'k-kr7', name: 'Mojito (Soda)', desc: '', price: 40 },
        { id: 'k-kr8', name: 'Green Apple (Soda)', desc: '', price: 40 },
        { id: 'k-kr9', name: 'Fresh Lime Soda', desc: '₹30/₹40/₹50', price: 30 },
        { id: 'sh-1', name: 'Banana / Chocolate / Cold Coffee / Oreo / Strawberry / Vanilla Shakes', desc: '₹50/₹60/₹70 (S/M/L)', price: 50 },
        { id: 'sh-2', name: 'Papaya / Butterscotch / Mango / Apple / Pineapple / Kiwi / Brahmi / Black Currant', desc: '₹50/₹60/₹70', price: 50 },
        { id: 'sh-3', name: 'Mango Lassi', desc: '₹50/₹60/₹70', price: 50 },
        { id: 'thick-1', name: 'KitKat / Chocopie / Brownie / Oreo Thick Shakes', desc: '₹70/₹80/₹90', price: 70 },
        { id: 'j-1', name: 'Mausami / Carrot / Orange / Mix / Muskmelon / Watermelon / Pineapple / Apple / Grape', desc: '₹50/₹60/₹70 (S/M/L)', price: 50 },
        { id: 'j-2', name: 'Fresh Lime Soda (sizes)', desc: '₹30/₹40/₹50', price: 30 },
        { id: 'j-3', name: 'Sugar Cane Juice', desc: '₹40/₹50/₹60', price: 40 },
        { id: 'j-4', name: 'Fresh Lime Water', desc: '₹20/₹30/₹40', price: 20 },
        { id: 'j-5', name: 'Pomegranate Juice', desc: '₹100/₹120/₹150', price: 100 },
        { id: 'ex-fruit', name: 'Fresh Fruit Salad', desc: '₹60/₹80', price: 60 },
      ],
    },
  ];

  // UI state
  const [selectedId, setSelectedId] = useState<string | null>(groupedMenu[0]?.id ?? null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // cart from context
  const { cartItems, addItem, updateQty: setCartQty, removeItem, itemCount, subtotal } = useCart();

  // local UI debounce for rapid clicks (keeps UX from sending many clicks in a short span)
  const [disabledItems, setDisabledItems] = useState<Record<string, boolean>>({});

  // per-item selected size, keyed by item.id
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 120);
    return () => clearTimeout(t);
  }, []);

  // --- Helpers to parse prices & generate size labels from desc ---
  const extractNumbersFromString = (txt?: string): number[] => {
    if (!txt) return [];
    // match numbers like 30 or 100 (with optional ₹ and commas)
    const rx = /₹?\s*([0-9]{1,4})(?:[,0-9]*)/g;
    const out: number[] = [];
    let m: RegExpExecArray | null;
    while ((m = rx.exec(txt))) {
      const n = Number(m[1]);
      if (!Number.isNaN(n)) out.push(n);
    }
    return out;
  };

  const inferLabelsForCount = (count: number, desc?: string): string[] => {
    // if 3 -> S/M/L
    if (count === 3) return ['S', 'M', 'L'];
    if (count === 2) {
      // if desc mentions Half / Full use those
      const d = (desc || '').toLowerCase();
      if (d.includes('half') && d.includes('full')) return ['Half', 'Full'];
      if (d.includes('reg') || d.includes('regular') || d.includes('large') || d.includes('(reg)')) {
        return ['Reg', 'Large'];
      }
      // default for two: Reg / Large
      return ['Reg', 'Large'];
    }
    if (count === 1) return ['One'];
    // fallback
    return Array.from({ length: count }, (_, i) => `Opt${i + 1}`);
  };

  const deriveSizesFromDesc = (desc?: string, basePrice?: number) => {
    // first try explicit numbers in desc
    const nums = extractNumbersFromString(desc);
    if (nums.length >= 2) {
      const labels = inferLabelsForCount(nums.length, desc);
      return labels.map((label, idx) => ({
        label,
        price: nums[idx] ?? nums[nums.length - 1],
      }));
    }

    // fallback: look for patterns like '(S/M/L)' but without prices - keep base price for S/M/L increments maybe infer small=base
    if (desc && desc.toLowerCase().includes('s/m/l')) {
      // create S/M/L with base price repeated
      return ['S', 'M', 'L'].map((l) => ({ label: l, price: basePrice ?? 0 }));
    }

    // nothing to do
    return null;
  };

  // Deterministic addToCart with per-item temporary disable to avoid rapid double clicks
  // If the item has sizes, this will add as a distinct id `item.id::SIZELABEL` so each sized variant is tracked separately
  const addToCart = (item: MenuItem, sizeLabel?: string, sizePrice?: number) => {
    const displayId = sizeLabel ? `${item.id}::${sizeLabel}` : item.id;

    if (disabledItems[displayId]) return; // ignore if temporarily disabled

    // temporarily disable clicking for this displayId
    setDisabledItems((p) => ({ ...p, [displayId]: true }));
    setTimeout(() => setDisabledItems((p) => ({ ...p, [displayId]: false })), 350);

    const priceToUse = typeof sizePrice === 'number' ? sizePrice : item.price;
    const nameToUse = sizeLabel ? `${item.name} (${sizeLabel})` : item.name;

    // use shared cart addItem (adds if not present / increments if present)
    addItem({ id: displayId, name: nameToUse, price: priceToUse }, 1);
  };

  // update quantity by delta (safe wrapper)
  const updateQty = (id: string, delta: number) => {
    const existing = cartItems.find((c) => c.id === id);
    const currentQty = existing?.qty ?? 0;
    const newQty = Math.max(0, currentQty + delta);
    if (newQty <= 0) {
      removeItem(id);
    } else {
      // setCartQty expects absolute qty
      setCartQty(id, newQty);
    }
  };

  const selectedSection = groupedMenu.find((s) => s.id === selectedId) ?? null;

  // returns sizes array (or null) for an item — uses item.sizes if present, else parse desc
  const getSizesForItem = (item: MenuItem) => {
    if (item.sizes && item.sizes.length > 0) return item.sizes;
    const derived = deriveSizesFromDesc(item.desc, item.price);
    return derived;
  };

  // helper to get selected size label for an item (initialize default if not set)
  const getSelectedSizeLabel = (item: MenuItem) => {
    const sizes = getSizesForItem(item);
    if (!sizes || sizes.length === 0) return undefined;
    if (!selectedSizes[item.id]) {
      // default to first option
      setSelectedSizes((p) => ({ ...p, [item.id]: sizes[0].label }));
      return sizes[0].label;
    }
    return selectedSizes[item.id];
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-3 py-1 rounded-md bg-gradient-to-r from-[#071132] to-[#04203a] hover:opacity-95 transition"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold tracking-tight">Food Delivery</h1>
            <span className="text-sm text-sky-300/60">Black & Deep Blue — aesthetic</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-sky-300/60">{itemCount} items</div>
              <div className="text-lg font-semibold text-sky-100">₹{subtotal}</div>
            </div>
            <button
              onClick={() => {
                if (itemCount === 0) {
                  alert('Cart is empty');
                  return;
                }
                navigate('/checkout');
              }}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded-lg font-semibold shadow"
            >
              Checkout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left column: restaurant list */}
          <aside>
            <div className="bg-gradient-to-b from-[#030303] to-[#051226] border border-sky-800/20 rounded-2xl p-4 shadow-lg sticky top-6">
              <h2 className="font-semibold text-lg mb-3 text-sky-100">Restaurants</h2>
              <div className="flex flex-col gap-2">
                {groupedMenu.map((s) => {
                  const active = s.id === selectedId;
                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedId(s.id);
                        setDropdownOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-full text-left p-3 rounded-lg transition flex items-center justify-between
                        ${active ? 'bg-sky-900/50 ring-1 ring-sky-500/30' : 'bg-white/2 hover:bg-white/5'}`}
                    >
                      <span className={`font-medium ${active ? 'text-sky-200' : 'text-sky-100'}`}>{s.title}</span>
                      <span className="text-sm text-sky-300/60">{s.items.length}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4">
                <label className="text-sm text-sky-300/60">Quick pick</label>
                <div className="relative mt-2">
                  <button
                    onClick={() => setDropdownOpen((d) => !d)}
                    className="w-full text-left px-4 py-2 rounded-lg bg-sky-900/20 hover:bg-sky-900/35 flex items-center justify-between"
                  >
                    <span className="text-sky-100">{selectedSection?.title ?? 'Select restaurant'}</span>
                    <span className="text-sky-300/60">{dropdownOpen ? '▴' : '▾'}</span>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute z-20 left-0 right-0 mt-2 bg-[#020617] border border-sky-800/30 rounded-lg shadow-xl max-h-64 overflow-auto">
                      {groupedMenu.map((s) => (
                        <div
                          key={s.id}
                          onClick={() => {
                            setSelectedId(s.id);
                            setDropdownOpen(false);
                          }}
                          className="px-4 py-3 hover:bg-sky-900/20 cursor-pointer flex items-center justify-between"
                        >
                          <span className="text-sky-100">{s.title}</span>
                          <span className="text-sm text-sky-300/60">{s.items.length}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* Right column: selected restaurant menu */}
          <main className="md:col-span-3">
            {loading ? (
              <div className="bg-gradient-to-b from-[#020617] to-[#011426] border border-sky-800/20 rounded-2xl p-6 shadow-lg">
                <div className="py-10 text-center text-sky-300/50">Loading menu...</div>
              </div>
            ) : selectedSection ? (
              <div className="bg-gradient-to-b from-[#020617] to-[#011426] border border-sky-800/30 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-sky-100">{selectedSection.title}</h2>
                    <p className="text-sm text-sky-300/60">{selectedSection.items.length} items</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        const first = selectedSection.items[0];
                        if (!first) return;
                        const sizes = getSizesForItem(first);
                        if (sizes && sizes.length > 0) {
                          // add default size
                          addToCart(first, sizes[0].label, sizes[0].price);
                        } else {
                          addToCart(first);
                        }
                      }}
                      className="px-3 py-2 bg-sky-800/40 hover:bg-sky-800/60 rounded-md text-sky-100"
                      title="Quick Add"
                    >
                      Quick Add
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedSection.items.map((item) => {
                    const sizes = getSizesForItem(item);
                    const selLabel = getSelectedSizeLabel(item);
                    const selPrice =
                      sizes && selLabel ? sizes.find((s) => s.label === selLabel)?.price ?? item.price : item.price;

                    // displayId is used to track per-size cart entries
                    const displayId = selLabel ? `${item.id}::${selLabel}` : item.id;
                    const cartEntry = cartItems.find((c) => c.id === displayId);
                    const inCart = !!cartEntry;

                    return (
                      <div
                        key={item.id}
                        className="p-4 bg-gradient-to-b from-[#041226] to-[#021226] border border-sky-800/20 rounded-xl flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg text-sky-100">{item.name}</h3>
                              {item.desc && <p className="text-sm text-sky-300/60 mt-1">{item.desc}</p>}

                              {/* if sizes exist, show small hint of available prices */}
                              {sizes ? (
                                <div className="mt-2 text-sm text-sky-300/60 flex items-center gap-2">
                                  <span>Sizes:</span>
                                  <div className="flex items-center gap-2">
                                    <select
                                      value={selLabel}
                                      onChange={(e) =>
                                        setSelectedSizes((p) => ({ ...p, [item.id]: e.target.value }))
                                      }
                                      className="bg-[#021226] border border-sky-800/20 rounded px-2 py-1 text-sky-100"
                                    >
                                      {sizes.map((s) => (
                                        <option key={s.label} value={s.label}>
                                          {s.label} — ₹{s.price}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                            <div className="font-bold text-sky-200">
                              {/* show selected price (if sizes selected) or base price */}
                              ₹{sizes ? selPrice : item.price}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          {inCart ? (
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQty(displayId, -1)}
                                  className="px-2 py-1 bg-sky-900/30 rounded-md"
                                  aria-label="decrease"
                                >
                                  -
                                </button>
                                <span className="mx-2">{cartEntry?.qty ?? 0}</span>
                                <button
                                  onClick={() => updateQty(displayId, +1)}
                                  className="px-2 py-1 bg-sky-900/30 rounded-md"
                                  aria-label="increase"
                                >
                                  +
                                </button>
                              </div>
                              <div className="text-sm text-sky-300/60">In Cart</div>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                if (sizes && selLabel) {
                                  const sPrice = sizes.find((s) => s.label === selLabel)?.price ?? item.price;
                                  addToCart(item, selLabel, sPrice);
                                } else {
                                  addToCart(item);
                                }
                              }}
                              className={`w-full py-2 rounded-lg font-medium shadow
                                ${disabledItems[displayId] ? 'bg-sky-700/40 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-500'}`}
                              disabled={!!disabledItems[displayId]}
                            >
                              {disabledItems[displayId] ? 'Adding...' : 'Add to Cart'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-b from-[#020617] to-[#011426] border border-sky-800/30 rounded-2xl p-6 shadow-lg">
                <div className="py-10 text-center text-sky-300/60">Select a restaurant to view its menu.</div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
