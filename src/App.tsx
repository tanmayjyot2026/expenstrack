import { useState } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Summary from './components/Summary';
import { useExpenses, type ExpenseInput } from './hooks/useExpenses';
import { exportToExcel } from './lib/exportExcel';
import type { Expense } from './types';

type Tab = 'add' | 'list' | 'summary';

export default function App() {
  const { expenses, addExpense, updateExpense, deleteExpense, resetMonth, ytdTotal, ytdCount } = useExpenses();
  const [tab, setTab] = useState<Tab>('add');
  const [editing, setEditing] = useState<Expense | null>(null);

  function handleAdd(input: ExpenseInput) {
    addExpense(input);
    setTab('list');
  }

  function handleUpdate(input: ExpenseInput) {
    if (editing) {
      updateExpense(editing.id, input);
      setEditing(null);
    }
  }

  function handleExport() {
    if (expenses.length === 0) {
      alert('No expenses to export yet.');
      return;
    }
    exportToExcel(expenses);
  }

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col text-white">
      <header className="safe-top sticky top-0 z-10 border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold">Expense Tracker</h1>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Excel
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 py-5">
        {tab === 'add' && <ExpenseForm onSubmit={handleAdd} />}
        {tab === 'list' && (
          <ExpenseList expenses={expenses} onEdit={setEditing} onDelete={deleteExpense} />
        )}
        {tab === 'summary' && <Summary expenses={expenses} onReset={resetMonth} ytdTotal={ytdTotal} ytdCount={ytdCount} />}
      </main>

      <nav className="safe-bottom sticky bottom-0 border-t border-slate-800 bg-slate-900/90 backdrop-blur">
        <div className="grid grid-cols-3">
          <TabButton label="Add" active={tab === 'add'} onClick={() => setTab('add')} icon="＋" />
          <TabButton label="Expenses" active={tab === 'list'} onClick={() => setTab('list')} icon="≡" />
          <TabButton
            label="Summary"
            active={tab === 'summary'}
            onClick={() => setTab('summary')}
            icon="▦"
          />
        </div>
      </nav>

      {editing && (
        <div className="fixed inset-0 z-20 flex items-end bg-black/60" onClick={() => setEditing(null)}>
          <div
            className="safe-bottom w-full rounded-t-3xl border-t border-slate-700 bg-slate-900 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-700" />
            <h2 className="mb-4 text-lg font-bold">Edit expense</h2>
            <ExpenseForm
              initial={editing}
              onSubmit={handleUpdate}
              onCancel={() => setEditing(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition ${
        active ? 'text-indigo-400' : 'text-slate-500'
      }`}
    >
      <span className="text-xl leading-none">{icon}</span>
      {label}
    </button>
  );
}
