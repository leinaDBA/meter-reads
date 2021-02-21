import sample from './fixtures/sample.json';
import expected from './fixtures/expected.json';
import { MeterRead, questionOne, questionTwo, validateInputs } from './solutions';

describe('solutions', () => {
  describe('validate', () => {
    it('requires inputs to be an array', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(validateInputs({})).toBeFalsy();
    });

    it('requires inputs to have only one read per month', () => {
      const input: MeterRead[] = [
        { cumulative: 18270, readingDate: '2019-06-18T00:00:00.000Z' },
        { cumulative: 18270, readingDate: '2019-06-19T00:00:00.000Z' },
      ];

      expect(validateInputs(input)).toBeFalsy();
    });

    it('requires input cumulative to use whole numbers', () => {
      const input: MeterRead[] = [{ cumulative: 18270.123, readingDate: '2019-06-18T00:00:00.000Z' }];
      expect(validateInputs(input)).toBeFalsy();
    });

    it('requires input readingDate to use valid dates', () => {
      const input: MeterRead[] = [{ cumulative: 18270, readingDate: 'abcd2019-06-18T00:00:00.000Z' }];
      expect(validateInputs(input)).toBeFalsy();
    });

    it('requires input dates to be at midnight', () => {
      const input: MeterRead[] = [{ cumulative: 18270, readingDate: '2019-06-18T00:00:00.001Z' }];
      expect(validateInputs(input)).toBeFalsy();
    });
  });

  describe('questionOne', () => {
    it('should produce the month with the highest increase', () => {
      expect(questionOne(sample)).toEqual({ cumulative: 24000, readingDate: '2020-07-29T00:00:00.000Z' });
    });
  });

  describe('questionTwo', () => {
    it('produces an estimate for each month', () => {
      expect(questionTwo(sample)).toEqual(expected);
    });
  });
});
