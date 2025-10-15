import { Money } from '../Money';

describe('Money Value Object', () => {
  describe('creation', () => {
    it('should create money from cents', () => {
      const money = Money.fromCents(1000);
      expect(money.getAmountInCents()).toBe(1000);
      expect(money.getAmount()).toBe(10);
    });

    it('should create money from amount', () => {
      const money = Money.fromAmount(10.50);
      expect(money.getAmount()).toBe(10.50);
      expect(money.getAmountInCents()).toBe(1050);
    });

    it('should create zero money', () => {
      const money = Money.zero();
      expect(money.getAmount()).toBe(0);
      expect(money.getAmountInCents()).toBe(0);
    });

    it('should throw error for negative amount', () => {
      expect(() => Money.fromAmount(-10)).toThrow('Money amount cannot be negative');
    });

    it('should throw error for invalid amount', () => {
      expect(() => Money.fromAmount(Infinity)).toThrow('Money amount must be a finite number');
    });
  });

  describe('operations', () => {
    it('should add money', () => {
      const money1 = Money.fromAmount(10);
      const money2 = Money.fromAmount(5);
      const result = money1.add(money2);
      expect(result.getAmount()).toBe(15);
    });

    it('should subtract money', () => {
      const money1 = Money.fromAmount(10);
      const money2 = Money.fromAmount(5);
      const result = money1.subtract(money2);
      expect(result.getAmount()).toBe(5);
    });

    it('should compare money amounts', () => {
      const money1 = Money.fromAmount(10);
      const money2 = Money.fromAmount(5);
      expect(money1.isGreaterThan(money2)).toBe(true);
      expect(money2.isLessThan(money1)).toBe(true);
    });

    it('should throw error when operating on different currencies', () => {
      const euros = Money.fromAmount(10, 'EUR');
      const dollars = Money.fromAmount(10, 'USD');
      expect(() => euros.add(dollars)).toThrow('Cannot operate on different currencies');
    });
  });

  describe('equals', () => {
    it('should return true for equal money', () => {
      const money1 = Money.fromAmount(10);
      const money2 = Money.fromAmount(10);
      expect(money1.equals(money2)).toBe(true);
    });

    it('should return false for different amounts', () => {
      const money1 = Money.fromAmount(10);
      const money2 = Money.fromAmount(5);
      expect(money1.equals(money2)).toBe(false);
    });

    it('should return false for different currencies', () => {
      const euros = Money.fromAmount(10, 'EUR');
      const dollars = Money.fromAmount(10, 'USD');
      expect(euros.equals(dollars)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should format money as string', () => {
      const money = Money.fromAmount(10.5);
      expect(money.toString()).toBe('10.50 EUR');
    });
  });
});
