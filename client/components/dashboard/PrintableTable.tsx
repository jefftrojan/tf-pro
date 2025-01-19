import React from 'react';
import { Download } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const PrintableTable = ({ stats, dateRange }) => {
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Hide the print component from normal view, only show when printing
  const printTable = () => {
    window.print();
  };

  return (
    <>
      {/* Regular view button */}
      <button
        onClick={printTable}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
      >
        <Download className="h-5 w-5" />
        Print Report
      </button>

      {/* Hidden printable content */}
      <div className="hidden print:block print:mx-auto print:w-full print:max-w-4xl">
        <style type="text/css" media="print">
          {`
            @media print {
              body * {
                visibility: hidden;
              }
              .print-section, .print-section * {
                visibility: visible;
              }
              .print-section {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 1rem;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f5f5f5;
              }
              h2 {
                margin: 1rem 0;
              }
            }
          `}
        </style>
        
        <div className="print-section">
          <h1 className="text-xl font-bold mb-4">
            Financial Report ({formatDate(dateRange.startDate)} - {formatDate(dateRange.endDate)})
          </h1>

          {/* Summary Section */}
          <h2 className="text-lg font-semibold mb-2">Summary</h2>
          <table>
            <tbody>
              <tr>
                <td>Total Income</td>
                <td>{formatCurrency(stats.totalIncome)}</td>
              </tr>
              <tr>
                <td>Total Expenses</td>
                <td>{formatCurrency(stats.totalExpenses)}</td>
              </tr>
              <tr>
                <td>Total Savings</td>
                <td>{formatCurrency(stats.totalSavings)}</td>
              </tr>
              <tr>
                <td>Savings Rate</td>
                <td>{stats.savingsRate.toFixed(1)}%</td>
              </tr>
            </tbody>
          </table>

          {/* Income Categories */}
          <h2 className="text-lg font-semibold mb-2">Income by Category</h2>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {stats.incomeByCategory.map((item) => (
                <tr key={item.category}>
                  <td>{item.category}</td>
                  <td>{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Expense Categories */}
          <h2 className="text-lg font-semibold mb-2">Expenses by Category</h2>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {stats.expensesByCategory.map((item) => (
                <tr key={item.category}>
                  <td>{item.category}</td>
                  <td>{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Account Balances */}
          <h2 className="text-lg font-semibold mb-2">Account Balances</h2>
          <table>
            <thead>
              <tr>
                <th>Account</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {stats.accountBalances.map((account) => (
                <tr key={account.name}>
                  <td>{account.name}</td>
                  <td>{formatCurrency(account.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Recent Transactions */}
          <h2 className="text-lg font-semibold mb-2">Recent Transactions</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Account</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {stats.transactions?.slice(0, 5).map((transaction) => (
                <tr key={transaction._id}>
                  <td>{formatDate(transaction.date)}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.category}</td>
                  <td>
                    {stats.accountBalances.find(a => a._id === transaction.account)?.name}
                  </td>
                  <td className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PrintableTable;