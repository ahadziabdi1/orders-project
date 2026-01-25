# Orders Management System

A modern web application for managing orders, built with Next.js, TypeScript, and PostgreSQL via Supabase.

## ✨ Features

- **View all orders** with sorting and filtering
- **Create new orders** with form validation
- **Edit existing orders** (update status, quantity, etc.)
- **Delete orders** with confirmation dialog
- **Order details page** for individual order view
- **Pagination** for large datasets
- **Real-time updates**

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript
- **UI:** Material-UI (MUI)
- **Forms:** React Hook Form + Zod validation
- **Backend:** Next.js Server Actions
- **Database:** PostgreSQL (Supabase)
- **Hosting:** Supabase (Database + Auth)

## 🚀 Quick Start

1. **Clone and install**
```bash
git clone https://github.com/yourusername/orders-app.git
cd orders-app
npm install
```

2. **Set up environment variables**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Run the development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:3000
```

## 📁 Project Structure

- `/app` - Next.js App Router pages and layouts
- `/components` - Reusable React components
- `/lib` - Utility functions (Supabase client, etc.)
- `/types` - TypeScript type definitions

## 🗄️ Database Schema

The `orders` table includes:
- `id` (UUID primary key)
- `product_name`, `customer`, `quantity`, `price`
- `status` (CREATED, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
- `created_date`, `delivery_address`
