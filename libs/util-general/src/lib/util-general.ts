import * as Validator from 'yup';
import { stringify } from 'qs';
import { isPossiblePhoneNumber } from 'react-phone-number-input';
import { EffectCallback, useEffect } from 'react';
import plural, { addRule as addPluralRule } from 'plural';

// warn when a context is used by not defined/set
export function normalizeNumber(
  n: number,
  digitsAfterDecimal: number | undefined = 2
): number {
  let str = n.toString();
  if (digitsAfterDecimal !== undefined) {
    str = Number(str).toFixed(digitsAfterDecimal).toString();
  }
  if (parseInt(str) === parseFloat(str)) {
    str = parseInt(str).toString();
  }
  return Number(str);
}

export const PhoneNumberValidator = Validator.string().test({
  name: `valid-phone-number`,
  test: (value: string | undefined | null) => {
    const currentLength = value ? String(value).trim().length : 0;
    if (currentLength === 0 || !value) {
      // required attribute should handle the empty case
      return true;
    }
    return isPossiblePhoneNumber(value);
  },
  message: function test() {
    return `Please enter a valid mobile number`;
  },
});

export const EmailValidator = Validator.string().email(
  'Please provide a valid email address'
);

export const PasswordValidator = Validator.string().min(
  8,
  'Password is too short - should be 8 chars minimum.'
);

export function queryToSearch(
  query: Record<
    string,
    null | string | number | Array<string> | Array<number>
  > = {},
  options: qs.IStringifyOptions = {}
): string {
  return stringify(query, { addQueryPrefix: true, ...options });
}

function useEffectOnce(effect: EffectCallback) {
  useEffect(effect, [effect]);
}

export function useMount(fn: () => void) {
  useEffectOnce(() => {
    fn();
  });
}

addPluralRule('is', 'are');

const __PLURALIZED_CACHE__: { [key: string]: string } = {};
export function pluralize(word: string, count: number | Array<unknown> = 2) {
  if (Array.isArray(count)) count = count.length;
  const key = `${word}__${count}`;
  if (!__PLURALIZED_CACHE__[key]) {
    __PLURALIZED_CACHE__[key] = plural(word, count);
  }
  return __PLURALIZED_CACHE__[key];
}
