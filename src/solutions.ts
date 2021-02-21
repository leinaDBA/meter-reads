import { DateTime, DurationObject } from 'luxon';

export interface MeterRead {
  cumulative: number;
  readingDate: string;
}

interface MeterReadWithIncrease extends MeterRead {
  increase: number;
}

const isArray = <T>(value: unknown): value is Array<T> => Array.isArray(value);

const isWholeNumber = (value: unknown): value is number => (value as number) % 1 === 0;

const isDate = (value: unknown): value is Date => {
  const validDate = new Date(value as string).toString();
  if (validDate !== 'Invalid Date') {
    return true;
  }

  return !isNaN((new Date(value as string) as unknown) as number);
};

const isZeroHourTime = (value: unknown): boolean => {
  const [, time]: string[] = (value as string).split('T');
  return time === '00:00:00.000Z';
};

interface MeterReadWithMonth extends MeterRead {
  isOnlyReadForMonth?: boolean;
}

const isSingleReadingPerMonth = (value: MeterRead[]): boolean => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return (value.reduce((current: MeterReadWithMonth, next: MeterRead, index: number) => {
    if (index !== 1 && !current.isOnlyReadForMonth) {
      return current;
    }

    const currentDate: DateTime = DateTime.fromISO(current.readingDate);
    const nextDate: DateTime = DateTime.fromISO(next.readingDate);
    const isOnlyReadForMonth: boolean =
      currentDate.month !== nextDate.month ? true : currentDate.year === nextDate.year;

    return { ...next, isOnlyReadForMonth };
  }) as MeterReadWithMonth).isOnlyReadForMonth!;
};

export const validateInputs = (inputs: MeterRead[]): boolean => {
  if (!isArray(inputs) || inputs.length === 0) {
    return false;
  }

  const valid: boolean = inputs.some(
    ({ cumulative, readingDate }: MeterRead) =>
      isWholeNumber(cumulative) && isDate(readingDate) && isZeroHourTime(readingDate),
  );

  if (!valid) {
    return false;
  }

  inputs.sort(({ readingDate: readingDateA }: MeterRead, { readingDate: readingDateB }: MeterRead) => {
    if (readingDateA.split('T')[0] === readingDateB.split('T')[0]) {
      return 0;
    }
    const dateA: Date = new Date(readingDateA);
    const dateB: Date = new Date(readingDateB);
    return dateA > dateB ? 1 : -1;
  });

  return !isSingleReadingPerMonth(inputs);
};

export const questionOne = (inputs: MeterRead[]): MeterRead => {
  if (!validateInputs(inputs)) {
    throw new Error('invalid inputs');
  }

  const readsWithIncreaseFromPreviousMonth: MeterReadWithIncrease[] = inputs.map((read: MeterRead, index: number) => {
    if (index === 0) {
      return { ...read, increase: 0 };
    }
    const increase: number = read.cumulative - inputs[index - 1].cumulative;
    return { ...read, increase };
  });

  // this could be merged with the previous map, but for readability I kept them separate
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { increase, ...answer }: MeterReadWithIncrease = readsWithIncreaseFromPreviousMonth.reduce(
    (current: MeterReadWithIncrease, next: MeterReadWithIncrease) => {
      if (current.increase === next.increase) {
        return current;
      }
      if (current.increase > next.increase) {
        return current;
      }
      return next;
    },
  );

  return answer;
};

interface EstimatedMeterRead {
  estimatedRead: number;
  date: string;
}

const getAbsolute = (num: number): number => Math.abs(Math.round(num));

const getDaysDiff = (start: DateTime, end: DateTime): number => {
  const { days }: DurationObject = start.diff(end, 'days').toObject();
  return getAbsolute(days!); // eslint-disable-line @typescript-eslint/no-non-null-assertion
};

const getMonthsDiff = (start: DateTime, end: DateTime): number => {
  const { months }: DurationObject = start.endOf('month').diff(end.startOf('month'), 'months').toObject();
  return getAbsolute(months!) + 1; // eslint-disable-line @typescript-eslint/no-non-null-assertion
};

const getLastDayOfMonth = (date: DateTime): DateTime => date.endOf('month').startOf('day');

export const questionTwo = (inputs: MeterRead[]): EstimatedMeterRead[] => {
  if (!validateInputs(inputs)) {
    throw new Error('invalid inputs');
  }

  /*
  dbr = get the amount of days between readings
  du = calculate the daily usage between those readings
  du = (nextMonthCumulative - thisMonthCumulative) / dbr
  DTEM = get number of days to the end of this month not including today
  estimated = (DTEM * du) + thisMonthCumulative
  */

  return inputs.reduce((acc: EstimatedMeterRead[], current: MeterRead, index: number) => {
    if (inputs.length - 1 === index) {
      return acc;
    }
    const next: MeterRead = inputs[index + 1];

    const currentDate = DateTime.fromISO(current.readingDate);
    const nextDate = DateTime.fromISO(next.readingDate);
    const daysBetweenReadings: number = getDaysDiff(currentDate, nextDate);
    const monthsBetweenReadings: number = getMonthsDiff(currentDate, nextDate);

    const usage: number = next.cumulative - current.cumulative;
    const dailyUsage = usage / daysBetweenReadings;

    [...Array(monthsBetweenReadings).keys()].forEach((index: number) => {
      const dateTime = currentDate.plus({ months: index });
      const date = getLastDayOfMonth(dateTime);

      let estimatedRead: number;
      if (dateTime.month === currentDate.month) {
        const daysTillEndOfMonth: number = currentDate.daysInMonth - currentDate.day;
        estimatedRead = Math.floor(daysTillEndOfMonth * dailyUsage + current.cumulative);
      } else {
        const dateTimeDays: number = getDaysDiff(currentDate, getLastDayOfMonth(dateTime));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const daysSinceRead = getAbsolute(dateTimeDays!);
        estimatedRead = Math.floor((dateTime.daysInMonth + daysSinceRead) * dailyUsage + current.cumulative);
      }

      acc.push({ estimatedRead, date: date.toISO() });
    });

    return acc;
  }, []);
};
