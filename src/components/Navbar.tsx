/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Landmark, TrendingUp, ShieldAlert, CircleAlert } from 'lucide-react';
import { formatCurrency } from '../utils';

interface NavbarProps {
  totalCurrentValue: number;
  activeCreditorsCount: number;
}

export default function Navbar({ totalCurrentValue, activeCreditorsCount }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center bg-indigo-50">
              <Landmark className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 tracking-tight font-sans">
                Giro<span className="text-indigo-600">5</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-medium tracking-wide bg-amber-50 text-amber-800 border border-amber-200 rounded-full font-mono uppercase">
                Juros 5% a.m.
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4 sm:space-x-6">
            <div className="flex flex-col items-end text-right">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-sans">
                Total acumulado
              </span>
              <span className="text-sm font-bold text-slate-900 font-mono">
                {formatCurrency(totalCurrentValue)}
              </span>
            </div>

            <div className="h-8 w-px bg-slate-200"></div>

            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full flex items-center gap-1 border border-red-100">
                <CircleAlert className="h-3 w-3" />
                {activeCreditorsCount} {activeCreditorsCount === 1 ? 'Credor' : 'Credores'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
