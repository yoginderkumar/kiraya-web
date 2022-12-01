import * as Validator from 'yup';
import { stringify } from 'qs';
import { isPossiblePhoneNumber } from 'react-phone-number-input';

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
