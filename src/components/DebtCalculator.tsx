/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TrendingUp, Percent, ArrowLeftRight, HelpCircle } from 'lucide-react';
import { formatCurrency, calculateCompoundInterest, calculateSimpleInterest } from '../utils';

export default function DebtCalculator() {
  const [amount, setAmount] = useState<number>(5000);
  const [months, setMonths] = useState<number>(12);

  const interestRate = 0.05; // 5%

  const compoundResult = calculateCompoundInterest(amount, months, interestRate);
  const simpleResult = calculateSimpleInterest(amount, months, interestRate);
  const difference = compoundResult.total - simpleResult.total;

  // Generate chart coordinates for SVG representing 0 to 24 months for visual curve
  const chartPointsSimple: string[] = [];
  const chartPointsCompound: string[] = [];
  const maxSimulatedMonths = Math.max(24, months);
  
  // Calculate relative sizes for graph
  const maxVal = amount * Math.pow(1 + interestRate, maxSimulatedMonths);
  const padding = 40;
  const width = 500;
  const height = 240;

  for (let m = 0; m <= maxSimulatedMonths; m++) {
    const x = padding + (m / maxSimulatedMonths) * (width - padding * 2);
    
    // Simple Interest Vf
    const valSimple = amount * (1 + interestRate * m);
    const ySimple = height - padding - (valSimple / maxVal) * (height - padding * 2);
    chartPointsSimple.push(`${x},${ySimple}`);

    // Compound Interest Vf
    const valCompound = amount * Math.pow(1 + interestRate, m);
    const yCompound = height - padding - (valCompound / maxVal) * (height - padding * 2);
    chartPointsCompound.push(`${x},${yCompound}`);
  }

  // Draw indicators for the currently selected month
  const currentX = padding + (months / maxSimulatedMonths) * (width - padding * 2);
  const currentYSimple = height - padding - (simpleResult.total / maxVal) * (height - padding * 2);
  const currentYCompound = height - padding - (compoundResult.total / maxVal) * (height - padding * 2);

  return (
    <div id="calculator-section" className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight font-sans flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            Simulador de Impacto: Juros de 5% ao Mês
          </h3>
          <p className="text-stone-500 font-sans text-sm mt-1">
            Veja como uma dívida acumula rapidamente. Uma taxa de 5% a.m. equivale a juros robustos que transformam valores pequenos em montantes expressivos em pouco tempo.
          </p>
        </div>
        <span className="shrink-0 px-3 py-1 bg-indigo-50 text-indigo-700 font-mono text-xs font-semibold rounded-full border border-indigo-100 uppercase">
          5% a.m. Fixo
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-6">
          {/* Amount Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="amount-slider" className="text-sm font-semibold text-slate-700">Valor Inicial Devido</label>
              <span className="text-lg font-bold text-slate-900 font-mono">{formatCurrency(amount)}</span>
            </div>
            <input
              id="amount-slider"
              type="range"
              min="100"
              max="50000"
              step="100"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>R$ 100</span>
              <span>R$ 15.000</span>
              <span>R$ 30.000</span>
              <span>R$ 50.000</span>
            </div>
          </div>

          {/* Months Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="months-slider" className="text-sm font-semibold text-slate-700">Tempo de Atraso</label>
              <span className="text-lg font-bold text-slate-900 font-mono">
                {months} {months === 1 ? 'mês' : 'meses'} <span className="text-xs font-normal text-slate-400">({(months / 12).toFixed(1)} anos)</span>
              </span>
            </div>
            <input
              id="months-slider"
              type="range"
              min="1"
              max="36"
              step="1"
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>1 mês</span>
              <span>1 ano (12m)</span>
              <span>2 anos (24m)</span>
              <span>3 anos (36m)</span>
            </div>
          </div>

          {/* Results Summary Grid */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            {/* Simple Interest Box */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Acúmulo Linear (Simples)
              </span>
              <span className="text-xl font-bold text-slate-800 font-mono block mt-1">
                {formatCurrency(simpleResult.total)}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                +{formatCurrency(simpleResult.interestAccrued)} em juros
              </span>
            </div>

            {/* Compound Interest Box */}
            <div className="p-4 bg-red-50/50 border border-red-100 rounded-xl relative overflow-hidden">
              <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1">
                Acúmulo Real (Composto)
              </span>
              <span className="text-xl font-bold text-red-700 font-mono block mt-1">
                {formatCurrency(compoundResult.total)}
              </span>
              <span className="text-xs text-red-500 font-mono">
                +{formatCurrency(compoundResult.interestAccrued)} em juros
              </span>
            </div>
          </div>

          {/* Compound Interest Difference Note */}
          {months > 1 && (
            <div className="p-3 bg-amber-50/70 border border-amber-200/50 rounded-xl flex items-start gap-2.5">
              <Percent className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800 font-sans">
                <p className="font-semibold">O Efeito Exponencial:</p>
                Os juros sobre juros adicionaram mais <strong className="font-mono">{formatCurrency(difference)}</strong> à sua dívida em relação aos juros simples. Recomenda-se negociar o quanto antes!
              </div>
            </div>
          )}
        </div>

        {/* Visual Chart */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white">
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-xs font-mono text-zinc-400">GRÁFICO DE CRESCIMENTO</span>
              <h4 className="text-sm font-semibold text-zinc-100">Simulação de {months} Meses @ 5% a.m.</h4>
            </div>
            <div className="flex gap-4 text-[10px] font-mono">
              <span className="flex items-center gap-1.5 text-zinc-400">
                <span className="w-2.5 h-1 bg-zinc-500 inline-block rounded"></span> Linear
              </span>
              <span className="flex items-center gap-1.5 text-red-400">
                <span className="w-2.5 h-1 bg-red-500 inline-block rounded"></span> Composto
              </span>
            </div>
          </div>

          {/* SVG Canvas for Chart with Absolute Fluid Height */}
          <div className="relative w-full overflow-hidden flex-1 min-h-[190px] flex items-center justify-center">
            <svg 
              className="w-full h-full max-h-[220px]" 
              viewBox={`0 0 ${width} ${height}`} 
              preserveAspectRatio="none"
            >
              <defs>
                {/* Gradients */}
                <linearGradient id="compGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#334155" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#334155" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#475569" strokeWidth="1" />

              {/* Grid Axis X/Y labels */}
              <text x={padding - 5} y={padding + 4} fill="#94a3b8" fontSize="9" textAnchor="end" fontFamily="monospace">
                {formatCurrency(maxVal).split(',')[0]}
              </text>
              <text x={padding - 5} y={height / 2 + 3} fill="#94a3b8" fontSize="9" textAnchor="end" fontFamily="monospace">
                {formatCurrency(maxVal / 2).split(',')[0]}
              </text>
              <text x={padding - 5} y={height - padding + 3} fill="#94a3b8" fontSize="9" textAnchor="end" fontFamily="monospace">
                {formatCurrency(amount).split(',')[0]}
              </text>

              {/* Chronological Grid lines */}
              <line x1={currentX} y1={padding} x2={currentX} y2={height - padding} stroke="#6366f1" strokeWidth="1" strokeDasharray="2,2" />

              {/* Filled Area for Compound Curve */}
              <path
                d={`M ${padding},${height - padding} L ${chartPointsCompound.join(' L ')} L ${width - padding},${height - padding} Z`}
                fill="url(#compGradient)"
              />

              {/* Line Paths */}
              <polyline
                fill="none"
                stroke="#64748b"
                strokeWidth="1.5"
                points={chartPointsSimple.join(' ')}
              />
              <polyline
                fill="none"
                stroke="#ef4444"
                strokeWidth="2.5"
                points={chartPointsCompound.join(' ')}
              />

              {/* Interactive Anchor Nodes */}
              {/* Simple Interest bubble */}
              <circle cx={currentX} cy={currentYSimple} r="5" fill="#64748b" stroke="#ffffff" strokeWidth="1.5" />
              {/* Compound Interest bubble */}
              <circle cx={currentX} cy={currentYCompound} r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
              
              {/* Label at zero month & end month */}
              <text x={padding} y={height - padding + 15} fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">Mês 0</text>
              <text x={currentX} y={height - padding + 15} fill="#6366f1" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">Mês {months}</text>
              {maxSimulatedMonths > months && (
                <text x={width - padding} y={height - padding + 15} fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">{maxSimulatedMonths}m</text>
              )}
            </svg>
          </div>

          {/* Quick analysis output info bar */}
          <div className="pt-3 border-t border-slate-800 text-[11px] font-sans flex flex-col sm:flex-row justify-between text-slate-400 gap-2">
            <span>Início da Dívida: <strong>{formatCurrency(amount)}</strong></span>
            <span>Juros compostos acumulados (5%/mês): <strong className="text-red-400 font-mono">{formatCurrency(compoundResult.interestAccrued)}</strong></span>
            <span>Valor Quitação final: <strong className="text-white font-mono">{formatCurrency(compoundResult.total)}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
