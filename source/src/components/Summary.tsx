import { useState } from 'react';
import { CATEGORY_ICONS, type Expense } from '../types';
import { formatMoney, monthKey, monthLabel, sum, todayISO } from '../lib/format';

type Props = {
  expenses: Expense[];
  onReset: () => void;
  ytdTotal: number;
  ytdCount: number;
};

export default function Summary({ expenses, onReset, ytdTotal, ytdCount }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  function confirmReset() {
    onReset();
    setConfirmOpen(false);
  }

  const currentMonth = monthKey(todayISO());
  const monthExpenses = expenses.filter((e) => monthKey(e.date) === currentMonth);
  const monthTotal = sum(monthExpenses);

  const byCategory = new Map<string, number>();
  for (const e of monthExpenses) {
    byCategory.set(e.category, (byCategory.get(e.category) ?? 0) + e.amount);
  }
  const categoryRows = [...byCategory.entries()].sort((a, b) => b[1] - a[1]);
  const max = categoryRows.length ? categoryRows[0][1] : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">This month</p>
          <p className="mt-1 text-2xl font-bold text-white">{formatMoney(monthTotal)}</p>
          <p className="mt-1 text-xs text-slate-500">{monthLabel(currentMonth)}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">YTD</p>
          <p className="mt-1 text-2xl font-bold text-white">{formatMoney(ytdTotal)}</p>
          <p className="mt-1 text-xs text-slate-500">{ytdCount} entries</p>
        </div>
      </div>

      <section>
        <h2 className="mb-3 px-1 text-sm font-semibold uppercase tracking-wide text-slate-400">
          By category · {monthLabel(currentMonth)}
        </h2>
        {categoryRows.length === 0 ? (
          <p className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center text-sm text-slate-400">
            No spending recorded this month yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {categoryRows.map(([cat, total]) => (
              <li key={cat}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-200">
                    {CATEGORY_ICONS[cat] ?? '📦'} {cat}
                  </span>
                  <span className="font-semibold text-white">{formatMoney(total)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: `${max > 0 ? (total / max) * 100 : 0}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="pt-2">
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          disabled={monthExpenses.length === 0}
          className="w-full rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 font-semibold text-red-400 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Reset monthly data
        </button>
        <p className="mt-2 px-1 text-center text-xs text-slate-500">
          Deletes this month's expenses. YTD total is kept and resets on 1 January.
        </p>
      </section>

      {confirmOpen && (
        <div
          className="fixed inset-0 z-30 flex items-end bg-black/60"
          onClick={() => setConfirmOpen(false)}
        >
          <div
            className="safe-bottom w-full rounded-t-3xl border-t border-slate-700 bg-slate-900 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-700" />
            <h2 className="text-lg font-bold text-white">Reset monthly data?</h2>
            <p className="mt-2 text-sm text-slate-400">
              This permanently deletes {monthExpenses.length} expense
              {monthExpenses.length === 1 ? '' : 's'} from {monthLabel(currentMonth)}. Your YTD total is kept. This
              cannot be undone.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 font-semibold text-slate-200 active:scale-[0.99]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmReset}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white active:scale-[0.99]"
              >
                Delete month
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
