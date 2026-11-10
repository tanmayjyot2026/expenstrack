import { useEffect, useState } from 'react';
import { CATEGORIES, CURRENCY, SUB_OPTIONS, type Expense } from '../types';
import type { ExpenseInput } from '../hooks/useExpenses';
import { todayISO } from '../lib/format';

type Props = {
  initial?: Expense;
  onSubmit: (input: ExpenseInput) => void;
  onCancel?: () => void;
};

export default function ExpenseForm({ initial, onSubmit, onCancel }: Props) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].name);
  const [comment, setComment] = useState('');
  const [subOption, setSubOption] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initial) {
      setAmount(String(initial.amount));
      setCategory(initial.category);
      // Note format: "<sub-option> · <comment>"; split it back apart for editing.
      const note = initial.note ?? '';
      const opt = (SUB_OPTIONS[initial.category] ?? []).find(
        (o) => note === o || note.startsWith(`${o} · `),
      );
      setSubOption(opt ?? '');
      setComment(opt ? note.slice(opt.length + 3) : note);
    }
  }, [initial]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setError('Enter an amount greater than 0.');
      return;
    }
    onSubmit({
      amount: Math.round(value),
      category,
      note: [subOption, comment.trim()].filter(Boolean).join(' · ') || undefined,
      // Editing keeps the original date; new entries use the current system date.
      date: initial ? initial.date : todayISO(),
    });
    if (!initial) {
      setAmount('');
      setComment('');
      setSubOption('');
    }
    setError('');
  }

  const labelCls = 'block text-sm font-medium text-slate-300 mb-1.5';
  const fieldCls =
    'w-full rounded-xl bg-slate-800 border border-slate-700 text-white px-4 py-3 text-base outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelCls} htmlFor="amount">
          Amount
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
            {CURRENCY}
          </span>
          <input
            id="amount"
            type="number"
            inputMode="numeric"
            step="1"
            min="0"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`${fieldCls} pl-9 text-2xl font-semibold`}
            autoFocus={!initial}
          />
        </div>
      </div>

      <div>
        <label className={labelCls} htmlFor="comment">
          Comment <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <input
          id="comment"
          type="text"
          placeholder="Add a note"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className={fieldCls}
        />
      </div>

      <div>
        <label className={labelCls}>Category</label>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((c) => {
            const active = c.name === category;
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => {
                  if (c.name !== category) setSubOption('');
                  setCategory(c.name);
                }}
                className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-xs font-medium transition ${
                  active
                    ? 'border-indigo-500 bg-indigo-500/20 text-white'
                    : 'border-slate-700 bg-slate-800 text-slate-300'
                }`}
              >
                <span className="text-xl">{c.icon}</span>
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      {SUB_OPTIONS[category] && (
        <div>
          <label className={labelCls}>{category} type</label>
          <div className="grid grid-cols-3 gap-2">
            {SUB_OPTIONS[category].map((o) => {
              const active = o === subOption;
              return (
                <button
                  key={o}
                  type="button"
                  onClick={() => setSubOption(active ? '' : o)}
                  className={`rounded-xl border px-2 py-2.5 text-sm font-medium transition ${
                    active
                      ? 'border-indigo-500 bg-indigo-500/20 text-white'
                      : 'border-slate-700 bg-slate-800 text-slate-300'
                  }`}
                >
                  {o}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3 pt-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 font-semibold text-slate-200 active:scale-[0.99]"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white active:scale-[0.99]"
        >
          {initial ? 'Save changes' : 'Add expense'}
        </button>
      </div>
    </form>
  );
}
