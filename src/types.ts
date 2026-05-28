/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Debt {
  id: string;
  creditor: string;
  originalValue: number;
  startDate: string; // ISO date string YYYY-MM-DD
  description: string;
  category: 'bank' | 'card' | 'personal' | 'service' | 'other';
  isPaid: boolean;
  paidDate?: string;
}

export interface InterestSimulation {
  creditor: string;
  originalValue: number;
  months: number;
  interestRate: number; // monthly interest rate, e.g., 0.05 for 5%
}
