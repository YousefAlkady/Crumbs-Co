# Product Requirements Document (PRD): Crumb & Co.

## Project Overview
Crumb & Co. is a whimsical, cartoony, and fun e-commerce web application for ordering cookies. It features a customer-facing menu and checkout flow, alongside a secure admin dashboard for inventory management.

## Tech Stack
* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS, Framer Motion (for bouncy/playful animations)
* **Database & Auth:** Supabase
* **State Management:** Zustand or React Context (for the Cart)

## Database Schema (Supabase)

### 1. `products`
* `id` (bigint, PK)
* `name` (text)
* `description` (text)
* `price` (numeric)
* `image_url` (text) - *Linked to Supabase Storage*
* `available` / `is_available` / `is_visible` (boolean, defaults to true)
* *Note: Admin updates restricted to `yoyoalk@gmail.com` via RLS.*

### 2. `orders`
* `id` (bigint, PK)
* `created_at` (timestamptz)
* `customer_name` (text)
* `customer_phone` (text)
* `address`, `apartment`, `governorate` (text)
* `cart_items` (jsonb) - *Stores the array of products ordered and quantities*
* `total_price` (numeric)
* `status` (text, default 'Pending')
* `user_id` (uuid, FK to auth.users)
* `delivery_method`, `payment_method` (text, default 'Cash on Delivery')
* `order_code`, `notes` (text)

### 3. `profiles`
* `id` (uuid, PK, FK to auth.users)
* `first_name`, `last_name`, `phone` (text)
* `address`, `apartment`, `city`, `governorate` (text)

## Application Flow

```mermaid
graph TD
    A[Customer] --> B(Landing Page)
    B --> C(Ordering Page / Menu)
    C --> D{Cart State}
    D --> E(Checkout Page)
    E --> F[Order Saved in DB]

    G[Admin: yoyoalk@gmail.com] --> H(Admin Dashboard Login)
    H --> I(Manage Products)
    H --> J(View Pending Orders)
    I --> K[Upload Images to Storage]
    I --> L[Toggle is_visible/available]