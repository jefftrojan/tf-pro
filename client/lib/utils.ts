import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as XLSX from 'xlsx';

export const exportToExcel = (data: any[], filename: string) => {
  try {
    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Budget Report');

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Create blob and download
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
  }
};
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function createGradient(startColor: string, endColor: string): string {
  return `linear-gradient(to right, ${startColor}, ${endColor})`;
}

export const getStatusColor = (spent: number, limit: number): string => {
  const percentage = (spent / limit) * 100;

  if (percentage <= 50) {
    return 'bg-green-500'; // Green when spending is less than 50%
  } else if (percentage <= 75) {
    return 'bg-yellow-500'; // Yellow when spending is between 50-75%
  } else if (percentage <= 100) {
    return 'bg-orange-500'; // Orange when spending is between 75-100%
  } else {
    return 'bg-red-500'; // Red when spending exceeds budget
  }
};

export const calculateBudgetStatus = (spent: number, limit: number) => {
  const percentage = (spent / limit) * 100;
  return {
    percentage: Math.min(percentage, 100), // Ensures percentage doesn't exceed 100%
    isOverBudget: percentage > 100, // Boolean flag if spending exceeds budget
    statusColor: getStatusColor(spent, limit) // Determines color based on spending level
  };
};