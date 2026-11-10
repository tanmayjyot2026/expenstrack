import { CATEGORY_ICONS, type Expense } from '../types';
import { formatDay, formatMoney, groupByMonth, monthLabel, sum } from '../lib/format';

type Props = {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
};

export default function ExpenseList({ expenses, onEdit, onDelete }: Props) {
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
        <span className="text-5xl">🧾</span>
        <p className="mt-4 text-lg font-medium text-slate-300">No expenses yet</p>
        <p className="mt-1 text-sm">Add your first expense from the Add tab.</p>
      </div>
    );
  }

  const groups = groupByMonth(expenses);

  return (
    <div className="space-y-6">
      {groups.map(([key, items]) => (
        <section key={key}>
          <div className="mb-2 flex items-baseline justify-between px-1">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              {monthLabel(key)}
            </h2>
            <span className="text-sm font-semibold text-slate-300">{formatMoney(sum(items))}</span>
          </div>
          <ul className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            {items.map((e) => (
              <li
                key={e.id}
                className="flex items-center gap-3 border-b border-slate-800 px-4 py-3 last:border-b-0"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xl">
                  {CATEGORY_ICONS[e.category] ?? '📦'}
                </span>
                <button
                  onClick={() => onEdit(e)}
                  className="min-w-0 flex-1 text-left"
                  aria-label={`Edit ${e.category}`}
                >
                  <p className="truncate font-medium text-white">{e.category}</p>
                  <p className="truncate text-sm text-slate-400">
                    {formatDay(e.date)}
                    {e.note ? ` · ${e.note}` : ''}
                  </p>
                </button>
                <span className="shrink-0 font-semibold text-white">{formatMoney(e.amount)}</span>
                <button
                  onClick={() => onDelete(e.id)}
                  className="shrink-0 rounded-lg p-2 text-slate-500 active:bg-slate-800 active:text-red-400"
                  aria-label="Delete expense"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
