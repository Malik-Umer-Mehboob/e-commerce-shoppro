import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate } from '../formatters';

describe('formatCurrency', () => {
  it('PKR mein symbol ke saath qeemat dikhata hai', () => {
    expect(formatCurrency(1500)).toBe('Rs. 1,500');
  });

  it('exchange rate lagata hai aur decimal khatam karta hai', () => {
    expect(formatCurrency(1000, 'USD', '$', 0.0036)).toBe('$ 4');
  });

  it('zero ko sahi dikhata hai', () => {
    expect(formatCurrency(0)).toBe('Rs. 0');
  });
});

describe('formatDate', () => {
  it('khali value par khali string deta hai', () => {
    expect(formatDate(null)).toBe('');
    expect(formatDate('')).toBe('');
  });

  it('date ko parhne layak format mein badalta hai', () => {
    expect(formatDate('2026-01-15T10:00:00Z')).toBe('January 15, 2026');
  });
});
