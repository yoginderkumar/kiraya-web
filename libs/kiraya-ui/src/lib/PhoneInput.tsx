import React from 'react';
import BasePhoneInput, {
  isPossiblePhoneNumber,
  parsePhoneNumber,
} from 'react-phone-number-input/max';
import { Input } from './Form';

export { isPossiblePhoneNumber, parsePhoneNumber };

export function PhoneInput(
  props: Omit<
    React.ComponentProps<typeof BasePhoneInput>,
    'inputComponent' | 'onChange'
  > & {
    onChange: (phoneNumber: string) => void;
  }
) {
  return (
    <BasePhoneInput
      placeholder="e.g. 8772321230"
      className="space-x-4 ml-4"
      {...props}
      type="tel"
      inputComponent={Input}
    />
  );
}
