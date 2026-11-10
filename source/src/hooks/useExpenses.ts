import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Expense, YtdCarry } from '../types';
import { monthKey, sum, todayISO } from '../lib/format';

const STORAGE_KEY = 'expense-tracker.expenses.v1';
const CARRY_KEY = 'expense-tracker.ytdCarry.v1';

function currentYear(): number {
  return Number(todayISO().slice(0, 4));
}

// Reset amounts are only kept for the current year; a new year starts at zero (1 January).
function loadCarry(): YtdCarry {
  const fresh: YtdCarry = { year: currentYear(), amount: 0, count: 0 };
  try {
    const raw = localStorage.getItem(CARRY_KEY);
    if (!raw) return fresh;
    const parsed = JSON.parse(raw) as YtdCarry;
    return parsed.year === fresh.year ? parsed : fresh;
  } catch {
    return fresh;
  }
}

function loadExpenses(): Expense[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Expense[];
    if (!Array.isArray(parsed)) return [];
    // Migrate the renamed Transport category.
    return parsed.map((e) => (e.category === 'Transport' ? { ...e, category: 'Utilities' } : e));
  } catch {
    return [];
  }
}

function saveExpenses(expenses: Expense[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export type ExpenseInput = Omit<Expense, 'id'>;

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>(() => loadExpenses());

  const [carry, setCarry] = useState<YtdCarry>(() => loadCarry());

  useEffect(() => {
    saveExpenses(expenses);
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(CARRY_KEY, JSON.stringify(carry));
  }, [carry]);

  const addExpense = useCallback((input: ExpenseInput) => {
    setExpenses((prev) => [{ ...input, id: newId() }, ...prev]);
  }, []);

  const updateExpense = useCallback((id: string, input: ExpenseInput) => {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...input, id } : e)));
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  // Deletes this month's expenses but keeps their amount in the YTD total.
  const resetMonth = useCallback(() => {
    const month = monthKey(todayISO());
    const removed = expenses.filter((e) => monthKey(e.date) === month);
    if (removed.length === 0) return;
    setCarry((c) => ({
      year: currentYear(),
      amount: (c.year === currentYear() ? c.amount : 0) + sum(removed),
      count: (c.year === currentYear() ? c.count : 0) + removed.length,
    }));
    setExpenses((prev) => prev.filter((e) => monthKey(e.date) !== month));
  }, [expenses]);

  const { ytdTotal, ytdCount } = useMemo(() => {
    const year = String(currentYear());
    const thisYear = expenses.filter((e) => e.date.startsWith(year));
    const base = carry.year === currentYear() ? carry : { amount: 0, count: 0 };
    return { ytdTotal: base.amount + sum(thisYear), ytdCount: base.count + thisYear.length };
  }, [expenses, carry]);

  return { expenses, addExpense, updateExpense, deleteExpense, resetMonth, ytdTotal, ytdCount };
}
