import { Timestamp, serverTimestamp } from 'firebase/firestore';

import {
  startOfDay,
  endOfDay,
  startOfWeek as startOfWeekDefault,
  endOfWeek as endOfWeekDefault,
  startOfMonth,
  endOfMonth,
  parseISO as parseISODate,
  parse as parseDate,
  format as formatDate,
  setHours,
  setMinutes,
  setSeconds,
  getHours,
  getMinutes,
  getSeconds,
  isSameDay,
  subDays,
  isBefore as isBeforeDate,
  isAfter as isAfterDate,
  isToday as isTodayDate,
  isValid as isValidDate,
  isSameSecond,
  addMonths,
  formatDistance as formatDistanceFns,
} from 'date-fns';

export {
  startOfMonth,
  endOfMonth,
  parseISODate,
  parseDate,
  formatDate,
  setHours,
  setMinutes,
  setSeconds,
  getHours,
  getMinutes,
  getSeconds,
  isSameDay,
  isBeforeDate,
  isAfterDate,
  isTodayDate,
  isValidDate,
  startOfDay,
  endOfDay,
  isSameSecond,
  subDays,
  addMonths,
};

export const startOfWeek: typeof startOfWeekDefault = (date, options) => {
  return startOfWeekDefault(
    date,
    Object.assign(
      {},
      {
        weekStartsOn: 1, // week starts on monday
      },
      options
    )
  );
};

export const endOfWeek: typeof endOfWeekDefault = (date, options) => {
  return endOfWeekDefault(
    date,
    Object.assign(
      {},
      {
        weekStartsOn: 1, // week starts on monday, ends of sunday
      },
      options
    )
  );
};

export function isSameOrAfterDay(
  date: Date | number,
  dateToCompare: Date | number
) {
  return isSameDay(date, dateToCompare) || isAfterDate(date, dateToCompare);
}

export function isSameOrBeforeDay(
  date: Date | number,
  dateToCompare: Date | number
) {
  return isSameDay(date, dateToCompare) || isBeforeDate(date, dateToCompare);
}

export function areIntervalSameDay(...args: Array<[Date, Date]>) {
  return args.reduce<boolean>((areSame, date, i, arr) => {
    if (i >= arr.length - 1) return areSame;
    return (
      areSame &&
      isSameDay(date[0], arr[i + 1][0]) &&
      isSameDay(date[1], arr[i + 1][1])
    );
  }, true);
}

export function timeStampToDate(
  time:
    | string
    | {
        seconds?: number;
        nanoseconds?: number;
        _seconds?: number;
        _nanoseconds?: number;
        toDate?: () => Date;
      }
    | Timestamp
): Date {
  // we need to handle many cases for the timestamp as the there are different
  // ways in which the timestamp has been created over the application updates
  try {
    if (typeof time === 'string') {
      return new Date(time);
    }
    if (time instanceof Timestamp) {
      return time.toDate();
    }
    if (typeof time.seconds !== 'undefined') {
      return new Timestamp(time.seconds, time.nanoseconds || 0).toDate();
    }
    if (typeof time._seconds !== 'undefined') {
      return new Timestamp(time._seconds, time._nanoseconds || 0).toDate();
    }
    throw new Error('Can not convert timestamp to date');
  } catch (e) {
    // report it. find the exceptions and add more catches
    return new Date();
  }
}

export function getServerTimestamp() {
  return serverTimestamp();
}

export function dateToTimestamp(date: Date) {
  return Timestamp.fromDate(date);
}

export function getThisDayInterval(relativeTo?: Date): [Date, Date] {
  const date = relativeTo ? new Date(relativeTo) : new Date();
  return [startOfDay(date), endOfDay(date)];
}

export function getYesterdayInterval(relativeTo?: Date): [Date, Date] {
  const yesterday = relativeTo ? new Date(relativeTo) : new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return [startOfDay(yesterday), endOfDay(yesterday)];
}

export function getThisMonthInterval(relativeTo?: Date): [Date, Date] {
  const date = relativeTo ? new Date(relativeTo) : new Date();
  return [startOfMonth(date), endOfMonth(date)];
}

export function getLastMonthInterval(relativeTo?: Date): [Date, Date] {
  const lastMonth = startOfMonth(
    relativeTo ? new Date(relativeTo) : new Date()
  );
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  return [startOfMonth(lastMonth), endOfMonth(lastMonth)];
}

export function formatDistance(date: Date, removePrefix?: boolean) {
  return removePrefix
    ? formatDistanceFns(new Date(date), new Date(), {
        addSuffix: true,
      })
        .replace('about', '')
        .replace('less than', '')
    : formatDistanceFns(new Date(date), new Date(), {
        addSuffix: true,
      });
}
