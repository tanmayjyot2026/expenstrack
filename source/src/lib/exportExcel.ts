import * as XLSX from 'xlsx';
import type { Expense } from '../types';
import { sortByDateDesc } from './format';

type Row = {
  Date: string;
  Category: string;
  Amount: number;
  Note: string;
};

export function exportToExcel(expenses: Expense[], filename = 'expenses.xlsx') {
  const rows: Row[] = [...expenses].sort(sortByDateDesc).map((e) => ({
    Date: e.date,
    Category: e.category,
    Amount: e.amount,
    Note: e.note ?? '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows, {
    header: ['Date', 'Category', 'Amount', 'Note'],
  });

  // Append a total row.
  const total = expenses.reduce((acc, e) => acc + e.amount, 0);
  XLSX.utils.sheet_add_aoa(worksheet, [['', 'Total', total, '']], { origin: -1 });

  worksheet['!cols'] = [{ wch: 12 }, { wch: 16 }, { wch: 12 }, { wch: 30 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');
  XLSX.writeFile(workbook, filename);
}
