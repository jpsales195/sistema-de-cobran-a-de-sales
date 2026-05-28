/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  HelpCircle, 
  Trash2, 
  CheckCircle2, 
  UserSquare2, 
  Sparkles, 
  Landmark, 
  ArrowRight,
  TrendingDown,
  ChevronDown,
  TrendingUp,
  Coins
} from 'lucide-react';
import { Debt } from './types';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import DebtCalculator from './components/DebtCalculator';
import DebtForm from './components/DebtForm';
import DebtList from './components/DebtList';
import { calculateMonthsElapsed, calculateCompoundInterest } from './utils';

// Static initial educational demo mock data
const SAMPLE_DEBTS: Debt[] = [
  {
    id: 'sample-1',
    creditor: 'Cartão de Crédito Platinum MultiSect',
    originalValue: 1200,
    startDate: '2025-11-15', // ~6.4 months ago from 2026-05-28
    description: 'Estouro voluntário do limite com presentes de fim de ano',
    category: 'card',
    isPaid: false
  },
  {
    id: 'sample-2',
    creditor: 'Banco Star SA (Empréstimo)',
    originalValue: 4500,
    startDate: '2025-08-20', // ~9.2 months ago from 2026-05-28
    description: 'Crédito pessoal inicial para reforma estrutural urgente',
    category: 'bank',
    isPaid: false
  },
  {
    id: 'sample-3',
    creditor: 'Thiago Almeida (Conserto Moto)',
    originalValue: 800,
    startDate: '2026-02-10', // ~3.5 months ago from 2026-05-28
    description: 'Empréstimo amigável parcelado para conserto do motor',
    category: 'personal',
    isPaid: false
  },
  {
    id: 'sample-4',
    creditor: 'Distribuidora Light S.A. (Contas)',
    originalValue: 340,
    startDate: '2026-04-05', // ~1.7 months ago from 2026-05-28
    description: 'Fatura de energia elétrica acumulada em atraso',
    category: 'service',
    isPaid: false
  }
];

export default function App() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Target current date setup: '2026-05-28'
  const TODAY = '2026-05-28';

  // Load from local storage or set default on initial mount
  useEffect(() => {
    const saved = localStorage.getItem('giro5_debts_db');
    if (saved) {
      try {
        setDebts(JSON.parse(saved));
      } catch (err) {
        setDebts(SAMPLE_DEBTS);
      }
    } else {
      setDebts(SAMPLE_DEBTS);
    }
  }, []);

  // Sync to local storage on changes
  const saveDebts = (updatedDebts: Debt[]) => {
    setDebts(updatedDebts);
    localStorage.setItem('giro5_debts_db', JSON.stringify(updatedDebts));
  };

  // Add sample placeholder data
  const handleAddSampleData = () => {
    saveDebts(SAMPLE_DEBTS);
  };

  // Clear all debts
  const handleClearAll = () => {
    if (confirm('Tem certeza de que deseja apagar todos os registros de dívidas?')) {
      saveDebts([]);
    }
  };

  // Add new debt
  const handleAddDebt = (newDebtData: Omit<Debt, 'id' | 'isPaid'>) => {
    const newDebt: Debt = {
      ...newDebtData,
      id: `debt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      isPaid: false
    };
    saveDebts([...debts, newDebt]);
    setShowForm(false);
  };

  // Update existing debt
  const handleUpdateDebt = (updatedDebt: Debt) => {
    const updated = debts.map(d => d.id === updatedDebt.id ? updatedDebt : d);
    saveDebts(updated);
    setEditingDebt(null);
    setShowForm(false);
  };

  // Toggle Paid / Unpaid
  const handleTogglePaid = (id: string) => {
    const updated = debts.map(d => {
      if (d.id === id) {
        return {
          ...d,
          isPaid: !d.isPaid,
          paidDate: !d.isPaid ? TODAY : undefined
        };
      }
      return d;
    });
    saveDebts(updated);
  };

  // Delete Debt
  const handleDeleteDebt = (id: string) => {
    if (confirm('Deseja realmente remover esta dívida do controle?')) {
      const updated = debts.filter(d => d.id !== id);
      saveDebts(updated);
      if (editingDebt?.id === id) {
        setEditingDebt(null);
      }
    }
  };

  // Trigger edit mode
  const handleEditDebtTrigger = (debt: Debt) => {
    setEditingDebt(debt);
    setShowForm(true);
    // Smooth scroll back to form view
    document.getElementById('debts-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Cancels editing mode
  const handleCancelEdit = () => {
    setEditingDebt(null);
    setShowForm(false);
  };

  // Calculate high-level aggregates for Navbar values
  const totalCurrentValue = debts.reduce((sum, debt) => {
    if (debt.isPaid) {
      return sum + debt.originalValue;
    }
    const elapsed = calculateMonthsElapsed(debt.startDate, TODAY);
    const valuation = calculateCompoundInterest(debt.originalValue, elapsed, 0.05);
    return sum + valuation.total;
  }, 0);

  const activeCreditorsCount = debts.filter(d => !d.isPaid).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 font-sans pb-16">
      {/* Navbar with stats */}
      <Navbar 
        totalCurrentValue={totalCurrentValue} 
        activeCreditorsCount={activeCreditorsCount} 
      />

      {/* Hero Header Section */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <HeroSection 
          debts={debts} 
          onAddSampleData={handleAddSampleData}
          onClearAll={handleClearAll}
        />
      </header>

      {/* Main Sections Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 mt-6">
        
        {/* Interactive Math playground Banner */}
        <section aria-label="Simulador de Juros">
          <DebtCalculator />
        </section>

        {/* Debts Listing and Management Form Section */}
        <section id="debts-section" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sans">
                Seu Centro de Controle de Credores
              </h2>
              <p className="text-sm text-slate-500 font-sans mt-0.5">
                Veja detalhadamente quem você deve, as datas de início e a evolução calculada de cada item a 5% ao mês.
              </p>
            </div>

            {/* Quick button to toggle input form */}
            {!showForm && (
              <button
                onClick={() => {
                  setEditingDebt(null);
                  setShowForm(true);
                }}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <PlusCircle className="h-4 w-4" /> Registrar Nova Dívida
              </button>
            )}
          </div>

          {/* Form wrapper */}
          {showForm && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-200">
              <DebtForm
                onAddDebt={handleAddDebt}
                onUpdateDebt={handleUpdateDebt}
                editingDebt={editingDebt}
                onCancelEdit={handleCancelEdit}
                onCloseForm={() => setShowForm(false)}
              />
            </div>
          )}

          {/* Actual list of active and paid debts */}
          <DebtList
            debts={debts}
            onTogglePaid={handleTogglePaid}
            onEditDebt={handleEditDebtTrigger}
            onDeleteDebt={handleDeleteDebt}
          />
        </section>

      </main>

      {/* Disclaimer / Informative Footer bar */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-200 text-center space-y-3">
        <div className="flex justify-center items-center gap-1.5 text-slate-400">
          <Landmark className="h-5 w-5" />
          <span className="text-xs font-mono tracking-tight uppercase">Giro5 Banco de Controle e Juros</span>
        </div>
        <p className="text-xs text-slate-400 font-sans max-w-2xl mx-auto leading-relaxed">
          <strong>Aviso Educativo e Pragmático:</strong> Giro5 é uma ferramenta interativa e privada para fins de controle e simulação. Seus dados são salvos exclusivamente de forma local no navegador (localStorage) para sua segurança. Nós não compartilhamos ou enviamos suas informações pessoais para nenhuma entidade financeira externa.
        </p>
        <div className="text-[10px] text-slate-400 font-mono">
          &copy; {new Date().getFullYear()} Giro5 Finanças do Amanhã. Juros compostos simulados com taxa fixa de 5% ao mês.
        </div>
      </footer>
    </div>
  );
}
