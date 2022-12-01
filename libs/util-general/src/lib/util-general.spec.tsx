import { normalizeNumber } from './util-general';

describe('utilsGeneral', () => {
  describe('normalizeNumber', () => {
    it('removes unwanted decimal points', () => {
      expect(normalizeNumber(1.0)).toEqual(1);
      expect(normalizeNumber(1.1)).toEqual(1.1);
      expect(normalizeNumber(100)).toEqual(100);
    });
    it('can restrict to given decimal points', () => {
      expect(normalizeNumber(1.0123, 2)).toEqual(1.01);
    });
  });
});
