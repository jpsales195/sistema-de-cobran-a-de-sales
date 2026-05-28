/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ShieldAlert, 
  TrendingDown, 
  Coins, 
  DollarSign, 
  Calendar, 
  ThumbsUp, 
  Percent, 
  ArrowUpRight 
} from 'lucide-react';
import { Debt } from '../types';
import { calculateMonthsElapsed, calculateCompoundInterest, formatCurrency } from '../utils';

interface HeroSectionProps {
  debts: Debt[];
  onAddSampleData: () => void;
  onClearAll: () => void;
}

export default function HeroSection({ debts, onAddSampleData, onClearAll }: HeroSectionProps) {
  const TODAY = '2026-05-28';
  
  // Computations
  const activeDebts = debts.filter(d => !d.isPaid);
  const paidDebts = debts.filter(d => d.isPaid);

  const stats = activeDebts.reduce(
    (acc, debt) => {
      const elapsed = calculateMonthsElapsed(debt.startDate, TODAY);
      const calculation = calculateCompoundInterest(debt.originalValue, elapsed, 0.05);
      
      acc.totalOriginal += debt.originalValue;
      acc.totalCurrent += calculation.total;
      acc.totalInterest += calculation.interestAccrued;
      acc.maxElapsed = Math.max(acc.maxElapsed, elapsed);
      return acc;
    },
    { totalOriginal: 0, totalCurrent: 0, totalInterest: 0, maxElapsed: 0 }
  );

  const totalPaidSum = paidDebts.reduce((sum, d) => sum + d.originalValue, 0);

  return (
    <div className="space-y-8">
      {/* Visual Splash Intro Row */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-950 to-neutral-950 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            Simulador de Controle de Crédito
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black font-sans tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-250 to-indigo-200">
            Assuma o controle de suas dívidas de juros altos.
          </h1>
          
          <p className="text-zinc-400 text-sm sm:text-base font-sans max-w-xl leading-relaxed">
            Uma taxa de juros de <strong>5% ao mês</strong> representa um acúmulo financeiro expressivo devido ao efeito dos juros sobre juros. Cadastre seus credores abaixo, simule o crescimento e trace planos inteligentes para quitação imediata.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <a 
              href="#calculator-section" 
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
            >
              Ver Simulador de Juros <ArrowUpRight className="h-4 w-4" />
            </a>
            
            <a 
              href="#debts-section"
              className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/10 text-xs font-bold rounded-xl transition-colors"
            >
              Registrar Meu Credor
            </a>

            {debts.length === 0 && (
              <button 
                onClick={onAddSampleData}
                className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 text-xs font-semibold rounded-xl transition-colors"
              >
                Carregar Dados de Exemplo
              </button>
            )}

            {debts.length > 0 && (
              <button 
                onClick={onClearAll}
                className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-medium rounded-xl transition-colors"
              >
                Excluir Todos os Dados
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Background visual grid glow */}
        <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none transform translate-x-12 translate-y-12">
          <div className="w-80 h-80 bg-indigo-500 rounded-full filter blur-[100px]" />
          <div className="w-60 h-60 bg-red-400 rounded-full filter blur-[80px]" />
        </div>
      </div>

      {/* Bento Stats Counters */}
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest block -mb-4 font-mono">
        Situação Atual ({TODAY.split('-').reverse().join('/')})
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI: Total Original */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-xl">
            <Coins className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Montante de Origem
            </span>
            <span className="text-xl font-bold text-slate-900 font-mono block mt-0.5">
              {formatCurrency(stats.totalOriginal)}
            </span>
            <span className="text-[11px] text-slate-500">
              Valor nominal contratado
            </span>
          </div>
        </div>

        {/* KPI: Accrued Interest */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-red-50 rounded-xl">
            <Percent className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block">
              Total Juros Acumulados
            </span>
            <span className="text-xl font-bold text-red-700 font-mono block mt-0.5">
              {formatCurrency(stats.totalInterest)}
            </span>
            <span className="text-[11px] text-red-500 font-semibold font-mono">
              +5% ao mês acumulado
            </span>
          </div>
        </div>

        {/* KPI: Total Current Debt updated */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-neutral-950 rounded-xl text-white">
            <ShieldAlert className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Dívida Atualizada Total
            </span>
            <span className="text-xl font-bold text-slate-900 font-mono block mt-0.5">
              {formatCurrency(stats.totalCurrent)}
            </span>
            <span className="text-[11px] text-indigo-700 font-medium font-sans">
              Necessário para quitação
            </span>
          </div>
        </div>

        {/* KPI: Total Saved or Paid */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl">
            <ThumbsUp className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
              Total Quitado / Pago
            </span>
            <span className="text-xl font-bold text-emerald-700 font-mono block mt-0.5">
              {formatCurrency(totalPaidSum)}
            </span>
            <span className="text-[11px] text-emerald-600">
              {paidDebts.length} {paidDebts.length === 1 ? 'conta resolvida' : 'contas resolvidas'}
            </span>
          </div>
        </div>
      </div>

      {/* Advisory Alert Grid */}
      <div className="bg-slate-100/70 border border-slate-200 rounded-2xl p-5 sm:p-6">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 mb-3 font-sans">
          <ShieldAlert className="h-4.5 w-4.5 text-indigo-600" />
          Plano de Quitação Inteligente Giro5 Para Juros Elevados
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs space-y-1">
            <span className="text-xs font-bold text-indigo-650 font-sans block">1. Priorizar pelo Método Avalanche</span>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Ordene as dívidas de 5% ao mês pela que tem o maior valor absoluto atualizado. Liquide o saldo devedor mais alto primeiro para diminuir o crescimento acelerado dos juros compostos.
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs space-y-1">
            <span className="text-xs font-bold text-indigo-650 font-sans block">2. Troca por Crédito Saudável</span>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Considere obter empréstimo com taxas menores (ex: consignado a 1.5% ou 2% a.m.) para pagar de uma só vez a dívida de 5% a.m., economizando uma quantia expressiva de dinheiro.
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs space-y-1">
            <span className="text-xs font-bold text-indigo-650 font-sans block">3. Negociação Baseada em Juros</span>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Entre em contato com os credores explicando que uma taxa de 5% a.m. se sobressai do mercado nacional e ofereça o pagamento do valor original do crédito acrescido de juros simples.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
