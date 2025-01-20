# Wallet App - expense tracker

## 📝 Project Overview

Wallet  is a simple personal finance management application that helps users track their expenses, manage budgets, and gain insights into their financial health. Built with modern web technologies, the application provides an intuitive and powerful way to monitor your financial activities.

Deployment at -> https://wallet.boolean.engineer

## 🌟 Features

### 💰 Expense Tracking
- Record income and expenses
- Categorize transactions
- Attach receipts to transactions
- Filter and search transactions
- Generate transactions reports

### 📊 Budget Management
- Create and manage budgets by category
- Set spending limits
- Receive alerts when nearing or exceeding budget
- Visualize spending distribution

### 💳 Account Management
- Add and manage multiple financial accounts
- Track account balances
- Transfer funds between accounts

### 📈 Financial Insights
- Generate detailed financial reports
- Visualize spending patterns
- Export data to Excel

## 🛠 Tech Stack

### Frontend
- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Recharts (Data Visualization)
- React Query
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt (Password Hashing)

### State Management
- React Query
- Context API

### Additional Tools
- Zod (Validation)
- Cloudinary (Receipt Storage)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB

### Clone the Repository
```bash
git clone https://github.com/jefftrojan/tf-pro.git
cd tf-pro
```

### Setup Environment

#### Backend Setup
1. Navigate to the server directory
```bash
cd server
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the server directory with the following variables:
```
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Start the backend server
```bash
npm run dev
```

#### Frontend Setup
1. Navigate to the client directory
```bash
cd ../client
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file in the client directory:
```
NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
```

4. Start the Next.js development server
```bash
npm run dev
```

### Database Setup
- Ensure MongoDB is running
- The application will automatically create necessary collections

## 🔐 Authentication

- User registration and login
- JWT-based authentication
- Secure password hashing
- Protected routes

## 📦 Project Structure

```
wallet-tracker/
│
├── client/                  # Next.js Frontend
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── app/
│   └── public/
│
├── server/                  # Express Backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── utils/
│
└── README.md
```



## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🙏 Acknowledgements
- Next.js
- React
- MongoDB
- Express.js
- Tailwind CSS
```