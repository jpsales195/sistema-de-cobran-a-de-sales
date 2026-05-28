/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building2, 
  CreditCard, 
  UserPlus, 
  Zap, 
  HelpCircle, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  RotateCcw,
  Search,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { Debt } from '../types';
import { 
  calculateMonthsElapsed, 
  calculateCompoundInterest, 
  formatCurrency, 
  formatDate 
} from '../utils';

// Helper to provide category-specific styling/icons
export function getCategoryConfig(category: Debt['category']) {
  switch (category) {
    case 'bank':
      return {
        label: 'Banco',
        icon: Building2,
        iconClass: 'text-blue-600 bg-blue-50 border-blue-100',
        badgeClass: 'bg-blue-50 text-blue-800 border-blue-200'
      };
    case 'card':
      return {
        label: 'Cartão',
        icon: CreditCard,
        iconClass: 'text-purple-600 bg-purple-50 border-purple-100',
        badgeClass: 'bg-purple-50 text-purple-800 border-purple-200'
      };
    case 'personal':
      return {
        label: 'Pessoal',
        icon: UserPlus,
        iconClass: 'text-amber-600 bg-amber-50 border-amber-100',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200'
      };
    case 'service':
      return {
        label: 'Serviço',
        icon: Zap,
        iconClass: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200'
      };
    default:
      return {
        label: 'Outros',
        icon: HelpCircle,
        iconClass: 'text-slate-600 bg-slate-50 border-slate-100',
        badgeClass: 'bg-slate-50 text-slate-800 border-slate-200'
      };
  }
}

interface DebtListProps {
  debts: Debt[];
  onTogglePaid: (id: string) => void;
  onEditDebt: (debt: Debt) => void;
  onDeleteDebt: (id: string) => void;
}

type FilterStatus = 'all' | 'unpaid' | 'paid';
type FilterCategory = 'all' | Debt['category'];
type SortOption = 'highest_debt' | 'oldest' | 'newest' | 'creditor_name';

export default function DebtList({ debts, onTogglePaid, onEditDebt, onDeleteDebt }: DebtListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>('all');
  const [sortOption, setSortOption] = useState<SortOption>('highest_debt');
  const [showExplanation, setShowExplanation] = useState(false);

  // Constant target today's date context: '2026-05-28'
  const TODAY = '2026-05-28';

  // Process data with interests
  const processedDebts = debts.map(debt => {
    const elapsedMonths = calculateMonthsElapsed(debt.startDate, TODAY);
    const calculation = calculateCompoundInterest(debt.originalValue, elapsedMonths, 0.05);
    
    return {
      ...debt,
      elapsedMonths,
      currentValue: debt.isPaid ? debt.originalValue : calculation.total,
      interestAccrued: debt.isPaid ? 0 : calculation.interestAccrued,
    };
  });

  // Filters and Queries
  const filteredDebts = processedDebts.filter(debt => {
    const matchesSearch = debt.creditor.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          debt.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'paid' && debt.isPaid) || 
                          (statusFilter === 'unpaid' && !debt.isPaid);

    const matchesCategory = categoryFilter === 'all' || debt.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Sorters
  const sortedDebts = [...filteredDebts].sort((a, b) => {
    switch (sortOption) {
      case 'highest_debt':
        return b.currentValue - a.currentValue;
      case 'oldest':
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      case 'newest':
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      case 'creditor_name':
        return a.creditor.localeCompare(b.creditor);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Search & Filtering Control Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
        {/* Row 1: Search */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Pesquisar credor ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Quick status counters */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-start md:self-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                statusFilter === 'all' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Todos ({processedDebts.length})
            </button>
            <button
              onClick={() => setStatusFilter('unpaid')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                statusFilter === 'unpaid' 
                ? 'bg-white text-red-600 shadow-xs' 
                : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Ativos ({processedDebts.filter(d => !d.isPaid).length})
            </button>
            <button
              onClick={() => setStatusFilter('paid')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                statusFilter === 'paid' 
                ? 'bg-white text-emerald-600 shadow-xs' 
                : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Pagos ({processedDebts.filter(d => d.isPaid).length})
            </button>
          </div>
        </div>

        {/* Row 2: Secondary filters & sorter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-3">
            {/* Category selection dropdown */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-medium">Categoria:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as FilterCategory)}
                className="py-1 px-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="all">Todas</option>
                <option value="bank">🏦 Banco</option>
                <option value="card">💳 Cartão</option>
                <option value="personal">👥 Pessoal</option>
                <option value="service">🔌 Serviços</option>
                <option value="other">📦 Outros</option>
              </select>
            </div>

            {/* Sort order selection dropdown */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-medium">Ordenar por:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="py-1 px-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="highest_debt">Maior Valor Atual</option>
                <option value="oldest">Mais Antiga (Mais Tempo)</option>
                <option value="newest">Mais Recente</option>
                <option value="creditor_name">Nome do Credor</option>
              </select>
            </div>
          </div>

          {/* Quick dynamic information trigger */}
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Info className="h-4 w-4" />
            Como é calculado?
          </button>
        </div>

        {/* Informative Explanation overlay */}
        {showExplanation && (
          <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs space-y-2 mt-2">
            <h4 className="font-bold text-indigo-900">Fórmula de Juros Compostos (5% ao mês)</h4>
            <p className="text-indigo-800 font-sans leading-relaxed">
              O saldo atualizado das dívidas ativas é acrescido de <strong>5% ao mês de forma composta</strong>. 
              Isso significa que a cada mês completo decorrido desde a data inicial da dívida, o juro é aplicado sobre o saldo acumulado do mês anterior:
            </p>
            <div className="p-2.5 bg-white/75 rounded-lg border border-indigo-200/50 flex flex-col gap-1 text-center font-mono text-zinc-800">
              <span className="font-bold">V_final = V_original × (1 + 0.05)^n_meses</span>
              <span className="text-[10px] text-zinc-500">Onde 0.05 é a taxa de 5% e "n" é a quantidade de meses completos em atraso.</span>
            </div>
            <p className="text-indigo-800 font-sans leading-relaxed">
              Dívidas já marcadas como <em>"Pagas"</em> congelam o valor para o montante original de liquidação simulada, interrompendo o acréscimo exponencial.
            </p>
          </div>
        )}
      </div>

      {/* Cards List Layout */}
      {sortedDebts.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl">
          <p className="text-slate-400 text-sm font-medium">Nenhuma dívida encontrada para os critérios selecionados.</p>
          {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' ? (
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setStatusFilter('all');
              }}
              className="mt-3 px-4 py-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 border border-indigo-200 rounded-xl"
            >
              Limpar Filtros
            </button>
          ) : null}
        </div>
      ) : (
        <div id="debts-listing" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedDebts.map(debt => {
            const config = getCategoryConfig(debt.category);
            const IconComponent = config.icon;

            return (
              <div 
                key={debt.id} 
                className={`flex flex-col justify-between bg-white border rounded-2xl p-5 shadow-xs transition-all duration-300 hover:shadow-md ${
                  debt.isPaid 
                  ? 'border-slate-200 opacity-75 grayscale bg-slate-50/50' 
                  : debt.elapsedMonths >= 6 
                  ? 'border-red-200 hover:border-red-300 ring-1 ring-red-50/50' 
                  : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header of the Debt item */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 border rounded-xl shrink-0 ${config.iconClass}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 tracking-tight leading-snug">{debt.creditor}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 text-[10px] font-bold border rounded ${config.badgeClass}`}>
                          {config.label}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Desde {formatDate(debt.startDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right side upper visual badge for paid or unpaid warning */}
                  <div>
                    {debt.isPaid ? (
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 rounded-full font-mono uppercase">
                        Pago
                      </span>
                    ) : debt.elapsedMonths > 0 ? (
                      <span className="px-2.5 py-1 bg-red-50 text-red-700 text-[10px] font-bold border border-red-200 rounded-full font-mono">
                        {debt.elapsedMonths} {debt.elapsedMonths === 1 ? 'mês' : 'meses'}
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-zinc-100 text-zinc-600 text-[10px] font-bold border border-zinc-200 rounded-full font-mono">
                        Novo (0m)
                      </span>
                    )}
                  </div>
                </div>

                {/* Main description notes if available */}
                {debt.description && (
                  <p className="text-xs text-slate-600 font-sans italic line-clamp-2 mb-4 bg-slate-50 p-2.5 rounded-xl border border-dashed border-slate-200">
                    "{debt.description}"
                  </p>
                )}

                {/* Values breakdown */}
                <div className="border-t border-slate-100 pt-3.5 mt-auto flex justify-between items-end gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Original
                    </span>
                    <span className="text-sm text-slate-700 font-medium font-mono">
                      {formatCurrency(debt.originalValue)}
                    </span>
                  </div>

                  {/* Calculated Interest display (only showing if NOT paid) */}
                  {!debt.isPaid && debt.elapsedMonths > 0 && (
                    <div className="space-y-0.5 text-right hidden sm:block">
                      <span className="text-[10px] font-semibold text-red-400 uppercase tracking-wider block">
                        Juros (5%/m)
                      </span>
                      <span className="text-xs text-red-600 font-bold font-mono">
                        +{formatCurrency(debt.interestAccrued)}
                      </span>
                    </div>
                  )}

                  {/* Final computed value */}
                  <div className="space-y-0.5 text-right">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      {debt.isPaid ? 'Valor Pago' : 'Valor Atualizado'}
                    </span>
                    <span className={`text-lg font-bold font-mono tracking-tight block ${debt.isPaid ? 'text-emerald-700 line-through' : 'text-red-700'}`}>
                      {formatCurrency(debt.currentValue)}
                    </span>
                  </div>
                </div>

                {/* Bottom interactive command bar */}
                <div className="border-t border-slate-100 mt-4 pt-3 flex justify-between items-center gap-2">
                  {/* Mark as paid button */}
                  <button
                    onClick={() => onTogglePaid(debt.id)}
                    className={`text-xs font-bold py-1 px-3.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                      debt.isPaid 
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200' 
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {debt.isPaid ? (
                      <>
                        <RotateCcw className="h-4.5 w-4.5" /> Reativar
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4.5 w-4.5" /> Quitar Dívida
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5">
                    {/* Edit button */}
                    <button
                      onClick={() => onEditDebt(debt)}
                      className="p-1.5 border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 rounded-lg hover:bg-indigo-50/50 transition-colors"
                      title="Editar Dívida"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => onDeleteDebt(debt.id)}
                      className="p-1.5 border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 rounded-lg hover:bg-red-50/50 transition-colors"
                      title="Excluir Dívida"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
