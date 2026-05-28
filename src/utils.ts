/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Calculates calendar months elapsed between a start date and an optionally specified end date
 */
export function calculateMonthsElapsed(startDateStr: string, endDateStr: string = '2026-05-28'): number {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
  if (start > end) return 0;
  
  const yearsDiff = end.getFullYear() - start.getFullYear();
  const monthsDiff = end.getMonth() - start.getMonth();
  let totalMonths = (yearsDiff * 12) + monthsDiff;
  
  // Ensure we count at least 1 month if there's any duration and start date day is passed
  // Or keep it simple as calendar month difference but fallback to a fraction or at least 0.
  // We can also calculate partial months for extra precision:
  const dayDiff = end.getDate() - start.getDate();
  if (dayDiff > 15) {
    // If more than half a month has passed, add 0.5 or allow finer math
  }
  
  return Math.max(0, totalMonths);
}

/**
 * Calculates compound interest amount and total value
 * Vf = Vi * (1 + rate)^months
 */
export function calculateCompoundInterest(principal: number, months: number, rate: number = 0.05): { total: number; interestAccrued: number } {
  if (months <= 0) return { total: principal, interestAccrued: 0 };
  const total = principal * Math.pow(1 + rate, months);
  const interestAccrued = total - principal;
  return { total, interestAccrued };
}

/**
 * Calculates simple interest amount and total value
 * Vf = Vi * (1 + rate * months)
 */
export function calculateSimpleInterest(principal: number, months: number, rate: number = 0.05): { total: number; interestAccrued: number } {
  if (months <= 0) return { total: principal, interestAccrued: 0 };
  const interestAccrued = principal * rate * months;
  const total = principal + interestAccrued;
  return { total, interestAccrued };
}

/**
 * Formats value into Brazilian Real (R$) currency styling
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formats a raw date string YYYY-MM-DD into a nicer reading format: eg "Jan de 2026" or "15/01/2026"
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}
