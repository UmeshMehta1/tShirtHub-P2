# Admin Dashboard - Microservice Architecture

A complete admin dashboard built as a separate microservice for managing products, orders, and users.

## Features

- 🔐 **Admin Authentication** - Secure login with role-based access
- 📊 **Dashboard Overview** - Statistics, revenue tracking, and recent orders
- 📦 **Product Management** - Create, read, update, and delete products
- 🛒 **Order Management** - View and update order status and payment status
- 👥 **User Management** - View all registered users
- 🎨 **Modern UI** - Built with React, Tailwind CSS, and Redux Toolkit

## Project Structure

```
adminDashboard/
├── src/
│   ├── components/        # Reusable components (Sidebar, Header, ProtectedRoute)
│   ├── layouts/           # Layout components (AdminLayout)
│   ├── pages/             # Page components (Login, Dashboard, Products, Orders, Users)
│   ├── store/             # Redux store and slices
│   ├── http/              # API configuration
│   ├── statues/           # Status constants
│   ├── App.jsx            # Main app component with routing
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Installation

1. Navigate to the admin dashboard directory:
```bash
cd adminDashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The admin dashboard will run on `http://localhost:5174`

## API Endpoints

The admin dashboard connects to the main backend API at `http://localhost:3000/api`:

### Authentication
- `POST /api/auth/login` - Admin login

### Products
- `GET /api/admin/product/getproducts` - Get all products
- `GET /api/admin/product/getproducts/:id` - Get single product
- `POST /api/admin/product/` - Create product (requires auth)
- `PATCH /api/admin/product/:id` - Update product (requires auth)
- `DELETE /api/admin/product/:id` - Delete product (requires auth)

### Orders
- `GET /api/admin/order/` - Get all orders (requires auth)
- `GET /api/admin/order/:id` - Get single order (requires auth)
- `PATCH /api/admin/order/:id` - Update order status (requires auth)
- `PATCH /api/admin/order/paymentStatus/:id` - Update payment status (requires auth)

### Users
- `GET /api/admin/user` - Get all users (requires auth)

## Routes

- `/admin/login` - Admin login page
- `/admin/dashboard` - Dashboard overview (protected)
- `/admin/products` - Products list (protected)
- `/admin/products/create` - Create new product (protected)
- `/admin/products/edit/:id` - Edit product (protected)
- `/admin/orders` - Orders list (protected)
- `/admin/users` - Users list (protected)

## Authentication

The admin dashboard uses a separate token stored in `localStorage` as `adminToken`. The token is automatically included in API requests via the `APIAuthenticated` axios instance.

## State Management

The dashboard uses Redux Toolkit for state management with the following slices:

- `adminAuthSlice` - Authentication state
- `adminProductSlice` - Product management
- `adminOrderSlice` - Order management
- `adminUserSlice` - User management

## Development

### Build for production:
```bash
npm run build
```

### Preview production build:
```bash
npm run preview
```

## Notes

- Make sure the main backend server is running on `http://localhost:3000`
- Admin users must have `userRole: 'admin'` in the database
- The dashboard runs on a separate port (5174) to maintain microservice architecture
- All protected routes require authentication and will redirect to login if not authenticated

