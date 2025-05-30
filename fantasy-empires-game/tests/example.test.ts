import { describe, it, expect } from 'vitest';

describe('Example Test Suite', () => {
    it('should perform a basic test', () => {
        expect(true).toBe(true);
    });

    it('should check addition', () => {
        const sum = (a: number, b: number) => a + b;
        expect(sum(1, 2)).toBe(3);
    });
});