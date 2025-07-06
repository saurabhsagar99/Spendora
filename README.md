# Personal Finance Visualizer

A comprehensive web application for tracking personal finances with beautiful visualizations and budgeting features.

## Features

### Stage 1: Basic Transaction Tracking ✅
- Add, edit, and delete transactions (amount, date, description)
- Transaction list view with sorting and filtering
- Monthly expenses bar chart
- Basic form validation
- Responsive design

### Stage 2: Categories ✅
- Predefined categories for transactions
- Category-wise pie chart
- Dashboard with summary cards
- Total expenses, category breakdown, and recent transactions

### Stage 3: Budgeting ✅
- Set monthly category budgets
- Budget vs actual comparison chart
- Budget summary cards with progress indicators
- Spending insights and alerts

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **Charts**: Recharts
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS

## Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud instance)
- npm or yarn

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd new-assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/personal-finance
   ```
   
   For MongoDB Atlas, use your connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/personal-finance
   ```

4. **Start MongoDB**
   - **Local**: Start your local MongoDB instance
   - **Cloud**: Ensure your MongoDB Atlas cluster is running

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Adding Transactions
1. Click "Add Transaction" button
2. Fill in the transaction details (amount, date, description, category, type)
3. Click "Add" to save

### Setting Budgets
1. Click "Set Budgets" button
2. Select month, category, and budget amount
3. Click "Set Budget" to save

### Viewing Analytics
- Dashboard shows summary cards with total income, expenses, and net income
- Monthly expenses bar chart shows spending by category
- Category pie chart provides visual breakdown
- Budget comparison chart shows budget vs actual spending
- Budget summary cards show progress for each category

### Managing Transactions
- View all transactions in the table
- Edit transactions by clicking the edit icon
- Delete transactions by clicking the delete icon
- Filter by month using the month selector

## API Endpoints

- `GET /api/transactions` - Get transactions with optional filters
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/[id]` - Update transaction
- `DELETE /api/transactions/[id]` - Delete transaction
- `GET /api/analytics` - Get analytics data
- `GET /api/budgets` - Get budgets for a month
- `POST /api/budgets` - Create/update budget

## Project Structure

```
src/
├── app/
│   ├── api/                 # API routes
│   │   ├── transactions/    # Transaction endpoints
│   │   ├── analytics/       # Analytics endpoint
│   │   └── budgets/         # Budget endpoints
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main dashboard page
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── TransactionForm.tsx  # Transaction form component
│   ├── TransactionList.tsx  # Transaction list component
│   ├── MonthlyExpensesChart.tsx # Bar chart component
│   ├── CategoryPieChart.tsx # Pie chart component
│   ├── BudgetComparisonChart.tsx # Budget comparison chart
│   ├── DashboardCards.tsx   # Summary cards component
│   └── BudgetForm.tsx       # Budget form component
└── lib/
    ├── db.ts                # MongoDB connection
    ├── models/
    │   ├── Transaction.ts   # Transaction model
    │   └── Budget.ts        # Budget model
    └── utils.ts             # Utility functions
```

## Features in Detail

### Responsive Design
- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interface
- Optimized for all screen sizes

### Error Handling
- Form validation with error messages
- API error handling with user feedback
- Loading states for better UX
- Graceful fallbacks for missing data

### Data Visualization
- Interactive charts with tooltips
- Color-coded categories
- Progress indicators for budgets
- Real-time data updates

### Performance
- Optimized database queries
- Efficient state management
- Lazy loading of components
- Minimal bundle size

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
