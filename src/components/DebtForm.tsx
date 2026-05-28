/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PlusCircle, FileText, Calendar, DollarSign, Tag, X, Check } from 'lucide-react';
import { Debt } from '../types';

interface DebtFormProps {
  onAddDebt: (debt: Omit<Debt, 'id' | 'isPaid'>) => void;
  onUpdateDebt: (debt: Debt) => void;
  editingDebt: Debt | null;
  onCancelEdit: () => void;
  onCloseForm?: () => void;
}

export default function DebtForm({ onAddDebt, onUpdateDebt, editingDebt, onCancelEdit, onCloseForm }: DebtFormProps) {
  const [creditor, setCreditor] = useState('');
  const [originalValue, setOriginalValue] = useState('');
  const [startDate, setStartDate] = useState('2026-01-01');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Debt['category']>('bank');
  const [error, setError] = useState('');

  // When editing is loaded, set values
  useEffect(() => {
    if (editingDebt) {
      setCreditor(editingDebt.creditor);
      setOriginalValue(editingDebt.originalValue.toString());
      setStartDate(editingDebt.startDate);
      setDescription(editingDebt.description);
      setCategory(editingDebt.category);
    } else {
      // Clear fields for new add
      setCreditor('');
      setOriginalValue('');
      setStartDate('2026-01-01');
      setDescription('');
      setCategory('bank');
    }
  }, [editingDebt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!creditor.trim()) {
      setError('Por favor, informe o nome do credor ou instituição.');
      return;
    }

    const numericValue = parseFloat(originalValue);
    if (isNaN(numericValue) || numericValue <= 0) {
      setError('Por favor, digite um valor original maior que zero.');
      return;
    }

    if (!startDate) {
      setError('Selecione uma data para o início da dívida.');
      return;
    }

    // Prepare payload
    const formPayload = {
      creditor: creditor.trim(),
      originalValue: numericValue,
      startDate,
      description: description.trim(),
      category,
    };

    if (editingDebt) {
      onUpdateDebt({
        ...editingDebt,
        ...formPayload,
      });
    } else {
      onAddDebt(formPayload);
    }

    // Reset fields if adding
    if (!editingDebt) {
      setCreditor('');
      setOriginalValue('');
      setStartDate('2026-01-01');
      setDescription('');
      setCategory('bank');
    }
    
    if (onCloseForm) {
      onCloseForm();
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-bold text-slate-900 tracking-tight font-sans flex items-center gap-2">
          {editingDebt ? '📝 Editar Dívida' : '➕ Registrar Nova Pendência'}
        </h3>
        {onCloseForm && (
          <button 
            type="button" 
            onClick={onCloseForm} 
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200"
            aria-label="Cancelar e Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Creditor */}
          <div className="space-y-1">
            <label htmlFor="creditor-input" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              Credor / Instituição <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="creditor-input"
                type="text"
                placeholder="Ex: Banco Itaú, Amigo Carlos, etc."
                value={creditor}
                onChange={(e) => setCreditor(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Original Value */}
          <div className="space-y-1">
            <label htmlFor="original-value-input" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              Valor Original (Dívida Inicial) <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-400 text-sm font-medium">R$</span>
              <input
                id="original-value-input"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0,00"
                value={originalValue}
                onChange={(e) => setOriginalValue(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Date */}
          <div className="space-y-1">
            <label htmlFor="start-date-input" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              Data de Início da Dívida <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="start-date-input"
                type="date"
                max="2026-05-28"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label htmlFor="category-select" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              Categoria / Origem
            </label>
            <select
              id="category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as Debt['category'])}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="bank">🏦 Banco / Financiadora</option>
              <option value="card">💳 Cartão de Crédito</option>
              <option value="personal">👥 Empréstimo Pessoal (Amigo / Família)</option>
              <option value="service">🔌 Serviço (Contas de Água, Luz, Internet)</option>
              <option value="other">📦 Outros / Diversas</option>
            </select>
          </div>
        </div>

        {/* Description / Notes */}
        <div className="space-y-1">
          <label htmlFor="description-input" className="text-xs font-semibold text-slate-700">Descrição / Notas (Opcional)</label>
          <textarea
            id="description-input"
            rows={2}
            placeholder="Descreva detalhes como taxas extras combinadas ou formas de quitação negociadas..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end items-center gap-3 pt-2">
          {editingDebt && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancelar Edição
            </button>
          )}

          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2"
          >
            {editingDebt ? (
              <>
                <Check className="h-4 w-4" /> Salvar Alterações
              </>
            ) : (
              <>
                <PlusCircle className="h-4 w-4" /> Registrar Dívida
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
