# ROI Investment App - Complete MERN Stack

A full-featured investment platform built with the MERN stack (MongoDB, Express.js, React, Node.js) that allows users to invest in stocks and track their ROI while providing comprehensive admin controls.

## 🚀 Features

### User Features
- **Secure Authentication**: JWT-based authentication with role-based access
- **Investment Dashboard**: View wallet balance, portfolio holdings, and profit/loss
- **Stock Investment**: Browse and invest in available stocks with real-time ROI calculations
- **Payment Management**: Upload payment proofs with screenshot verification
- **Withdrawal System**: Request withdrawals (restricted to weekdays)
- **Portfolio Tracking**: Track individual holdings and overall performance

### Admin Features
- **Admin Dashboard**: Complete overview of platform statistics
- **Stock Management**: Create, edit, delete, and toggle stock availability
- **User Management**: View users, manage KYC status, and user accounts
- **Payment Verification**: Approve or reject user payment proofs
- **Withdrawal Management**: Process withdrawal requests
- **Transaction Monitoring**: View all platform transactions

### Security Features
- **Password Hashing**: Bcrypt encryption for all passwords
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Separate admin and user interfaces
- **File Upload Validation**: Secure image upload with type checking
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Comprehensive server-side validation

## 🛠 Technology Stack

### Backend
- **Node.js + Express**: RESTful API server
- **MongoDB + Mongoose**: Database and ODM
- **JWT**: Authentication tokens
- **Multer**: File upload handling
- **Bcrypt**: Password hashing
- **Helmet**: Security headers
- **Express Validator**: Input validation

### Frontend
- **React + TypeScript**: Component-based UI
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **React Router**: Client-side routing
- **Axios**: HTTP client with interceptors
- **Lucide React**: Beautiful icons

## 📁 Project Structure

```
├── backend/
│   ├── controllers/          # Request handlers
│   ├── middleware/          # Authentication & validation
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API route definitions
│   └── config/             # Database configuration
├── src/
│   ├── components/         # Reusable React components
│   ├── contexts/           # React context providers
│   ├── pages/             # Page components
│   ├── services/          # API service functions
│   └── config/            # Frontend configuration
├── uploads/               # File upload directory
└── server.js             # Main server file
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Environment Setup
Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/roi_investment

# JWT Configuration  
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### 2. MongoDB Atlas Setup
1. Create a MongoDB Atlas account at https://cloud.mongodb.com
2. Create a new cluster
3. Create a database user
4. Get your connection string
5. Replace the MONGODB_URI in your .env file

### 3. Installation & Development

```bash
# Install dependencies
npm install

# Start the backend server
npm run server:dev

# In another terminal, start the frontend
npm run dev
```

### 4. Default Admin Account
Run the admin creation script to set up the default admin account:

```bash
# Create admin user in database
npm run create-admin
```

This will create:
- **Admin**: admin@test.com / admin123
- **Test User**: user@test.com / user123

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login  
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Stocks
- `GET /api/stocks` - Get all stocks
- `GET /api/stocks/:id` - Get stock by ID
- `POST /api/stocks` - Create stock (Admin only)
- `PUT /api/stocks/:id` - Update stock (Admin only)
- `DELETE /api/stocks/:id` - Delete stock (Admin only)
- `PATCH /api/stocks/:id/toggle` - Toggle stock status (Admin only)

### Transactions
- `POST /api/transactions/buy` - Buy stock
- `POST /api/transactions/sell` - Sell stock
- `GET /api/transactions/my-transactions` - Get user transactions
- `GET /api/transactions/my-holdings` - Get user holdings
- `GET /api/transactions/all` - Get all transactions (Admin only)

### Payments
- `POST /api/payments/upload-proof` - Upload payment proof
- `GET /api/payments/my-payments` - Get user payments
- `GET /api/payments/all` - Get all payments (Admin only)
- `PATCH /api/payments/:id/approve` - Approve payment (Admin only)
- `PATCH /api/payments/:id/reject` - Reject payment (Admin only)

### Withdrawals
- `POST /api/withdrawals/request` - Request withdrawal (Weekdays only)
- `GET /api/withdrawals/my-withdrawals` - Get user withdrawals
- `GET /api/withdrawals/all` - Get all withdrawals (Admin only)
- `PATCH /api/withdrawals/:id/approve` - Approve withdrawal (Admin only)
- `PATCH /api/withdrawals/:id/reject` - Reject withdrawal (Admin only)

## 🚢 Deployment

### Backend (Render/Railway)
1. Create account on Render or Railway
2. Connect your GitHub repository
3. Set environment variables
4. Deploy with build command: `npm install`
5. Start command: `npm run server`

### Frontend (Vercel/Netlify)
1. Create account on Vercel or Netlify
2. Connect your GitHub repository  
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variable: `VITE_API_URL=your_backend_url/api`

### Database (MongoDB Atlas)
1. Create MongoDB Atlas cluster
2. Configure network access (allow all IPs for cloud deployment)
3. Create database user
4. Get connection string for production

## 🔒 Security Features

- **Password Security**: All passwords are hashed using bcrypt
- **JWT Tokens**: Secure authentication with configurable expiration
- **Role-based Access**: Admin and user roles with protected routes
- **Input Validation**: Server-side validation for all inputs
- **File Upload Security**: Image-only uploads with size limits
- **Rate Limiting**: Protection against brute force attacks
- **CORS Protection**: Configured for specific frontend origins
- **Helmet**: Security headers for production

## 📱 Business Logic

- **Stock Investment**: Users can buy stocks with real-time price calculations
- **ROI Calculation**: Profit = shares × current_price × (1 + roi_percentage/100) - invested_amount
- **Wallet Management**: Secure balance updates after payment approvals
- **Weekend Restrictions**: Withdrawals blocked on weekends
- **KYC Integration**: User verification system for enhanced security

## 🎯 Demo Credentials

- **Admin**: admin@test.com / admin123
- **User**: user@test.com / user123

## 📞 Support

For deployment assistance or customization:
- Update MongoDB connection string in `.env`
- Configure payment gateway integration
- Set up email notifications
- Implement additional security measures

This is a production-ready investment platform with enterprise-level security and scalability built into the architecture.