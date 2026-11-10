export type Expense = {
  id: string;
  amount: number;
  category: string;
  date: string; // ISO yyyy-mm-dd
  note?: string;
};

export type Category = {
  name: string;
  icon: string;
};

export const CATEGORIES: Category[] = [
  { name: 'Food', icon: '🍔' },
  { name: 'Groceries', icon: '🛒' },
  { name: 'Utilities', icon: '💡' },
  { name: 'Shopping', icon: '🛍️' },
  { name: 'Health', icon: '💊' },
  { name: 'Travel', icon: '✈️' },
  { name: 'Tech', icon: '💻' },
  { name: 'Misc', icon: '📦' },
];

export const CATEGORY_ICONS: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.name, c.icon]),
);

// Change this to your preferred currency symbol.
export const CURRENCY = '₹';

export const SUB_OPTIONS: Record<string, string[]> = {
  Utilities: ['Fuel', 'Electricity', 'Gas'],
  Travel: ['Hotel', 'Flights', 'Cabs'],
};

// Amount of expenses already reset (deleted) this year, kept for the YTD total.
export type YtdCarry = { year: number; amount: number; count: number };
