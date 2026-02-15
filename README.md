# Orders Management System

A modern, full-stack order management platform featuring a data-driven dashboard, product catalog, and customer directory. Built with **Next.js 14**, **TypeScript**, and **Supabase**.

## ✨ Features

* **Executive Insights Dashboard**
Interactive data visualization featuring real-time revenue trends, order status distribution (Pie Charts), and top-performing product analytics to track business health at a glance.
* **Intelligent AI Assistant**
A dual-purpose sidebar powered by AI that enables:
  * **Quick Add:** Rapidly create orders using natural language (e.g., *"John bought 2 laptops, address 123 Street"*).
  * **Data Chat:** A conversational interface to query your database for insights on backlogs, status updates, and sales performance.
* **Unified Product Catalog**
A centralized hub to manage your system's offerings. Browse, track, and update the product list, including pricing and metadata for inventory items.
* **Order Lifecycle Management**
Comprehensive order tracking with a dedicated status workflow (from `CREATED` through `SHIPPED` and `DELIVERED`). Includes robust filtering by customer name and order status.
* **Customer Directory**
A searchable database of client relationships, managing contact information and default delivery addresses for streamlined fulfillment.
* **Secure Role-Based Access**
  * **Privacy-First Orders:** Users are restricted to managing and viewing only their own order data.
  * **Profile Management:** Dedicated access for users to view and update their personal account information and system roles.



## 🛠️ Tech Stack

* **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
* **Language:** TypeScript
* **UI/Styling:** Material UI (MUI) & Tailwind CSS
* **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL)
* **Analytics:** Recharts for data visualization
* **Forms:** React Hook Form + Zod validation

## 🗄️ Database Schema

The system uses a relational PostgreSQL schema managed via Supabase:

* **`orders`**: Links customers and products; tracks `total_price`, `quantity`, and `order_status`.
* **`products`**: Maintains the catalog of items and their `unit_price`.
* **`customers`**: Stores contact details and `delivery_address`.
* **`profiles`**: Manages user roles and is linked directly to Supabase Auth (`auth.users`).

## 🚀 Quick Start

1. **Clone and install**

```bash
git clone https://github.com/yourusername/orders-app.git
cd orders-app
npm install

```

2. **Set up environment variables**
Create a `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Assistant (Google Gemini)
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key

```

3. **Run the development server**

```bash
npm run dev

```

4. **Open in browser**

```
http://localhost:3000
```
