import { normalizeNumber } from '@kiraya/util-general';
import classNames from 'classnames';
import evalNumExpr from 'eval-num-expr';
import {
  connect,
  Field,
  FieldProps,
  FormikConfig,
  FormikErrors,
  getIn,
  useField,
} from 'formik';
import React, { useState } from 'react';
import { $PropertyType } from 'utility-types';
import { Button, getButtonClassName } from './Button';
import {
  ArrowLeftIcon,
  CameraIcon,
  CancelIcon,
  InformationCircleIcon,
  PencilIcon,
  TrashIcon,
} from './Icons';
import { Modal, ModalBody, ModalFooter, useOverlayTriggerState } from './Modal';
import { readFileAsDataURL } from './util';

export const Input = React.forwardRef<
  HTMLInputElement,
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={classNames(
        'block rounded bg:gray-100 placeholder-gray-500 border border-gray-100',
        className,
        props.type === 'checkbox'
          ? 'form-checkbox'
          : props.type === 'radio'
          ? 'form-radio'
          : 'form-input'
      )}
      {...props}
    />
  );
});

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  >
>(function Select({ className, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={classNames(
        'block rounded bg:gray-100 placeholder-gray-500 border border-gray-100',
        className,
        props.multiple ? 'form-multiselect' : 'form-select'
      )}
      {...props}
    />
  );
});

export const TextArea = React.forwardRef<
  HTMLTextAreaElement,
  React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  >
>(function Select({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={classNames(
        'block rounded bg:gray-100 placeholder-gray-500 border border-gray-100',
        className,
        'form-textarea'
      )}
      {...props}
    />
  );
});

type FormFieldProps = Omit<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  'name'
> & {
  label?: React.ReactNode;
  name: string;
  secondaryLabel?: string;
  actionLabel?: React.ReactNode;
  renderInput?: (props: FieldProps) => React.ReactNode;
  help?: React.ReactNode;
  noMargin?: boolean;
  invisibleInput?: boolean;
  hideError?: boolean;
};

export function FormField({
  label,
  name,
  id,
  ref,
  renderInput,
  help,
  noMargin = false,
  invisibleInput = false,
  hideError = false,
  secondaryLabel,
  actionLabel,
  ...props
}: FormFieldProps) {
  const fieldId = id || name;
  const labelAlignment =
    props.type === 'checkbox' || props.type === 'radio' ? 'After' : 'Before';
  return (
    <Field name={name} type={props.type} value={props.value}>
      {(fieldProps: FieldProps) => {
        const { field, meta } = fieldProps;
        return (
          <div
            className={classNames(
              'relative',
              { 'mb-6': !noMargin },
              invisibleInput ? props.className : ''
            )}
          >
            <div
              className={classNames(
                'flex',
                props.type === 'radio' || props.type === 'checkbox'
                  ? `flex-row items-center${
                      !invisibleInput ? ' space-x-2' : ''
                    }`
                  : 'flex-col space-y-1'
              )}
            >
              {label && labelAlignment === 'Before' ? (
                <InputLabel
                  fieldId={fieldId}
                  secondaryLabel={secondaryLabel}
                  actionLabel={actionLabel}
                >
                  {label}
                </InputLabel>
              ) : null}
              {renderInput ? (
                renderInput(fieldProps)
              ) : (
                <Input
                  id={fieldId}
                  ref={ref as unknown as React.Ref<HTMLInputElement>}
                  {...field}
                  {...props}
                  className={classNames(props.className, {
                    'opacity-0 top-0 left-0 w-1 h-1 absolute': invisibleInput,
                  })}
                />
              )}
              {label && labelAlignment === 'After' ? (
                <InputLabel
                  fieldId={fieldId}
                  secondaryLabel={secondaryLabel}
                  actionLabel={actionLabel}
                >
                  {label}
                </InputLabel>
              ) : null}
            </div>
            {help ? (
              <div className="text-gray-500 text-xs mt-1">{help}</div>
            ) : null}
            {!hideError && meta.error && meta.touched ? (
              <ErrorMessage name={name} />
            ) : null}
          </div>
        );
      }}
    </Field>
  );
}

export const ErrorMessage = connect<{ name: string }>(function ErrorMessage({
  formik,
  name,
}) {
  const errors: Record<string, unknown> = formik.errors || {};
  const allTouched = formik.touched;
  const error = errors[name as unknown as string] || getIn(errors, name);
  const touched: boolean = getIn(allTouched, name);
  if (!error || !touched) return null;
  return (
    <div className="px-2 py-1 mt-1 bg-red-100 border rounded border-red-100 text-red-900 text-sm">
      {Array.isArray(error) ? error.join(', ') : error}
    </div>
  );
});

function InputLabel({
  children,
  fieldId,
  className,
  secondaryLabel,
  actionLabel,
  ...props
}: React.DetailedHTMLProps<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  HTMLLabelElement
> & {
  fieldId: string;
  secondaryLabel?: string;
  actionLabel?: React.ReactNode;
}) {
  return (
    <div
      className={classNames('text-sm font-medium flex-1', {
        flex: actionLabel,
      })}
    >
      <label
        htmlFor={fieldId}
        className={classNames('cursor-pointer flex-1', className)}
        {...props}
      >
        {children}
        {secondaryLabel ? (
          <span className="text-gray-500 ml-3">({secondaryLabel})</span>
        ) : null}
      </label>
      {actionLabel ? <div>{actionLabel}</div> : null}
    </div>
  );
}

export function FormImageFileField({
  ref,
  label,
  defaultValue,
  onRemove,
  onSelectionStart,
  onPreview,
  ...props
}: FormFieldProps & {
  onRemove?: () => void;
  // Callback to handle the first image selection
  onSelectionStart?: () => void;
  onPreview?: () => void;
}) {
  const [fileName, setFileName] = useState<string>('');
  // we need to keep this state because we want to show outlines on the labels
  // :focus-within can not be used because the input is outside of the the label
  // and creating duplicate inputs will not work as well due the how file inputs behave
  const [fileInputFocused, setFileIputFocusState] = useState<boolean>(false);
  const [dataUrl, setFileDataUrl] = useState<string | undefined>(
    defaultValue ? String(defaultValue) : undefined
  );
  const imagePreviewState = useOverlayTriggerState({ defaultOpen: false });
  const id = props.id || props.name;
  return (
    <FormField
      {...props}
      renderInput={({ field, form }) => {
        return (
          <div className="relative">
            <input
              accept="images/*"
              {...props}
              name={`file_name_${id}`}
              type="file"
              id={id}
              value={fileName}
              className="opacity-0 absolute top-0 left-0 w-1 h-2"
              onFocus={() => {
                setFileIputFocusState(true);
              }}
              onBlur={() => {
                setFileIputFocusState(false);
                form.setFieldTouched(field.name, true);
              }}
              onChange={({ currentTarget: { value, files } }) => {
                form.setFieldTouched(field.name, true);
                form.setFieldValue(
                  field.name,
                  props.multiple ? files || [] : files ? files[0] : ''
                );
                setFileName(value);
                if (files && files.length) {
                  readFileAsDataURL(files[0]).then((dataUrl) => {
                    setFileDataUrl(dataUrl as string);
                  });
                } else {
                  setFileDataUrl(undefined);
                }
              }}
            />
            {!dataUrl ? (
              <InputLabel
                fieldId={id}
                onClick={() => {
                  onSelectionStart?.();
                }}
                className={getButtonClassName({})}
              >
                <CameraIcon />
                <span>{label || 'Select Image'}</span>
              </InputLabel>
            ) : (
              <div className="flex space-x-4 items-center">
                <div className="border p-1px rounded overflow-hidden">
                  <img
                    src={dataUrl}
                    alt="Preview"
                    className="w-12 h-12 cursor-pointer"
                    onClick={() => {
                      imagePreviewState.open();
                      onPreview?.();
                    }}
                  />
                  <Modal
                    title="Bill"
                    isOpen={imagePreviewState.isOpen}
                    onClose={imagePreviewState.close}
                  >
                    <ModalBody>
                      <img
                        src={dataUrl}
                        alt="Preview"
                        className="w-full h-full max-w-full"
                      />
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        onClick={imagePreviewState.close}
                        level="primary"
                        autoFocus
                        size="lg"
                      >
                        Ok
                      </Button>
                      <InputLabel
                        fieldId={id}
                        className={getButtonClassName({ size: 'lg' })}
                      >
                        <PencilIcon /> Change
                      </InputLabel>
                    </ModalFooter>
                  </Modal>
                </div>
                <label
                  htmlFor={id}
                  className={classNames(getButtonClassName({ inline: true }), {
                    'block ring-2 ring-blue-900': fileInputFocused,
                  })}
                >
                  <PencilIcon /> Change
                </label>
                <div className="border-l pl-4 flex items-center">
                  <Button
                    inline
                    status="error"
                    onClick={() => {
                      form.setFieldValue(field.name, '');
                      setFileName('');
                      setFileDataUrl(undefined);
                      onRemove?.();
                    }}
                  >
                    <TrashIcon /> Delete
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      }}
    />
  );
}

//   export function DatePicker({
//     onChange,
//     value,
//     inputProps,
//     min,
//     max,
//     onOpen,
//   }: {
//     onChange: (date: Date | undefined) => void
//     inputProps?: React.HTMLProps<HTMLInputElement>
//     value?: Date
//     min?: Date
//     max?: Date
//     onOpen?: () => void
//   }) {
//     const disabledDays: Matcher = useMemo(() => {
//       let disableDaysObj = {}
//       if (min || max) {
//         if (min) {
//           disableDaysObj = { ...disableDaysObj, before: new Date(min) }
//         }
//         if (max) {
//           disableDaysObj = {
//             ...disableDaysObj,
//             after: new Date(max),
//           }
//         }
//       }
//       return disableDaysObj as Matcher
//     }, [min, max])
//     return (
//       <Menu>
//         {({ isExpended, toggle }) => (
//           <>
//             <MenuButton
//               inline
//               onClick={() => {
//                 if (!isExpended) {
//                   onOpen?.()
//                 }
//               }}
//             >
//               <DateInput
//                 value={`${
//                   value ? formatDate(value as Date, "dd MMM, yyyy") : ""
//                 }`}
//                 readOnly
//                 placeholder="DD MMM, YYYY"
//                 style={{ color: "black" }}
//                 className={classNames(inputProps?.className, "w-full")}
//               />
//             </MenuButton>
//             <MenuList>
//               <DayPicker
//                 selected={new Date(value as Date)}
//                 mode={"single"}
//                 modifiersStyles={{
//                   selected: { color: "white", background: "blue" },
//                   today: {
//                     color:
//                       new Date().toDateString() ===
//                       new Date(value as Date).toDateString()
//                         ? "white"
//                         : "red",
//                   },
//                 }}
//                 disabled={disabledDays}
//                 onDayClick={(date: Date) => {
//                   if (value) {
//                     // update the time (h,m,s) from the value
//                     // because the the library removes and sets it to 12:00:00
//                     date = (
//                       [
//                         [setHours, getHours],
//                         [setMinutes, getMinutes],
//                         [setSeconds, getSeconds],
//                       ] as Array<[typeof setHours, typeof getHours]>
//                     ).reduce<Date>(
//                       (date, [setFn, getFn]) => setFn(date, getFn(value)),
//                       date
//                     )
//                   }
//                   onChange(new Date(date))
//                   toggle()
//                 }}
//               />
//             </MenuList>
//           </>
//         )}
//       </Menu>
//     )
//   }

//   const DateInput = React.forwardRef<
//     HTMLInputElement,
//     React.ComponentProps<typeof Input>
//   >(function DateInputInner(props, ref) {
//     return (
//       <div className="relative">
//         <div className="flex absolute inset-y-0 left-0 items-center pointer-events-none pl-3 ">
//           <CalendarIcon color="blue900" />
//         </div>
//         <Input
//           {...props}
//           ref={ref}
//           color="black"
//           className="bg-gray-50 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//         />
//       </div>
//     )
//   })

// export function FormDatePicker({
//   name,
//   min,
//   max,
//   onOpen,
//   ...props
// }: Omit<
//   Omit<
//     React.ComponentProps<typeof FormField>,
//     'value' | 'onChange' | 'renderInput'
//   >,
//   keyof React.ComponentProps<typeof DatePicker>
// > &
//   Omit<React.ComponentProps<typeof DatePicker>, 'value' | 'onChange'> & {
//     name: string;
//   }) {
//   return (
//     <FormField
//       name={name}
//       {...props}
//       renderInput={({ field, form }) => {
//         return (
//           <DatePicker
//             value={field.value}
//             min={min}
//             max={max}
//             onChange={(value) => form.setFieldValue(name, value)}
//             onOpen={onOpen}
//             inputProps={{
//               onBlur: field.onBlur,
//               name: field.name,
//               id: props.id || field.name,
//             }}
//           />
//         );
//       }}
//     />
//   );
// }

//   export function FormTimePicker({
//     name,
//     min,
//     max,
//     ...props
//   }: Omit<
//     Omit<
//       React.ComponentProps<typeof FormField>,
//       "value" | "onChange" | "renderInput"
//     >,
//     keyof React.ComponentProps<typeof DatePicker>
//   > &
//     Omit<React.ComponentProps<typeof DatePicker>, "value" | "onChange"> & {
//       name: string
//     }) {
//     return (
//       <FormField
//         name={name}
//         {...props}
//         renderInput={({ field, form }) => {
//           return (
//             <>
//               <div className="flex space-x-2">
//                 <Select
//                   id={props.id}
//                   placeholder="hh"
//                   value={field.value ? formatDate(field.value, "h") : ""}
//                   onBlur={() => {
//                     form.setFieldTouched(field.name, true)
//                   }}
//                   onChange={(e) => {
//                     const value = e.currentTarget.value || "0"
//                     let hours = parseInt(value) % 12
//                     const date = field.value || new Date()
//                     const isPM = formatDate(date, "a") === "PM"
//                     if (isPM) {
//                       hours += 12
//                     }
//                     form.setFieldValue(name, setHours(date, hours))
//                   }}
//                   aria-label="Hours"
//                 >
//                   {Array.from(Array(12).keys()).map((val) => (
//                     <option value={`${val + 1}`} key={val}>
//                       {val + 1}
//                     </option>
//                   ))}
//                 </Select>
//                 <Select
//                   placeholder="mm"
//                   aria-label="Minutes"
//                   value={field.value ? getMinutes(field.value) : ""}
//                   onBlur={() => {
//                     form.setFieldTouched(field.name, true)
//                   }}
//                   onChange={(e) => {
//                     const value = e.currentTarget.value || "0"
//                     const minutes = parseInt(value) % 60
//                     const date = field.value || new Date()
//                     form.setFieldValue(name, setMinutes(date, minutes))
//                   }}
//                 >
//                   {Array.from(Array(60).keys()).map((val) => (
//                     <option value={`${val}`} key={val}>
//                       {val}
//                     </option>
//                   ))}
//                 </Select>
//                 <Select
//                   placeholder="AM/PM"
//                   aria-label="AM/PM"
//                   value={field.value ? formatDate(field.value, "a") : ""}
//                   onBlur={() => {
//                     form.setFieldTouched(field.name, true)
//                   }}
//                   onChange={(e) => {
//                     const currentValue = formatDate(field.value, "a")
//                     const date = field.value || new Date()
//                     const hours = getHours(date)
//                     switch (e.currentTarget.value) {
//                       case "AM":
//                         if (currentValue === "PM") {
//                           // going from PM to AM, subtract 12 hours
//                           form.setFieldValue(
//                             name,
//                             setHours(date, (hours - 12) % 24)
//                           )
//                         }
//                         break
//                       case "PM":
//                         if (currentValue === "AM") {
//                           // going from AM to PM, add 12 hours
//                           form.setFieldValue(
//                             name,
//                             setHours(date, (hours + 12) % 24)
//                           )
//                         }
//                         break
//                     }
//                   }}
//                 >
//                   <option value="AM">AM</option>
//                   <option value="PM">PM</option>
//                 </Select>
//               </div>
//               <input
//                 type="text"
//                 name={name}
//                 value={field.value ? formatDate(field.value, "HH:mm:ss") : ""}
//                 readOnly
//                 hidden
//               />
//             </>
//           )
//         }}
//       />
//     )
//   }

export function FormAmountField({
  label,
  name,
  rawName,
  id,
  ref,
  renderInput,
  help,
  secondaryLabel,
  ...props
}: FormFieldProps & {
  rawName: string;
}) {
  const fieldId = id || name;
  const [rawField] = useField(rawName);
  const detailVisiblityState = useOverlayTriggerState({ defaultOpen: false });
  return (
    <Field name={name} type={props.type} value={props.value}>
      {(fieldProps: FieldProps) => {
        const { field, meta, form } = fieldProps;
        const updateAmount = (textAmount: string) => {
          form.setFieldValue(
            rawName,
            textAmount.replace(/[^\d+-/x\\*\\%\s]/gi, '')
          );
          try {
            const amount = normalizeNumber(evalNumExpr(textAmount));
            form.setFieldValue(field.name, amount);
          } catch (e) {
            const error = e as Error;
            if (meta.touched) {
              form.setFieldError(
                field.name,
                error.message || 'Please enter valid amount'
              );
              form.setFieldValue(field.name, 0);
            }
          }
        };
        return (
          <div className="mb-6">
            <div
              className={classNames(
                'flex',
                props.type === 'radio' || props.type === 'checkbox'
                  ? 'flex-row items-center space-x-2'
                  : 'flex-col space-y-1'
              )}
            >
              {label ? (
                <div className="flex items-center justify-between">
                  <InputLabel fieldId={fieldId} secondaryLabel={secondaryLabel}>
                    {label}
                  </InputLabel>
                  <button
                    className="text-gray-500"
                    type="button"
                    tabIndex={-1}
                    onClick={() =>
                      detailVisiblityState.isOpen
                        ? detailVisiblityState.close()
                        : detailVisiblityState.open()
                    }
                  >
                    <InformationCircleIcon />
                  </button>
                </div>
              ) : null}
              {renderInput ? (
                renderInput({
                  ...fieldProps,
                  field: {
                    ...field,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                      updateAmount(e.currentTarget.value),
                    value: rawField.value,
                  },
                  meta,
                })
              ) : (
                <Input
                  id={fieldId}
                  ref={ref as unknown as React.Ref<HTMLInputElement>}
                  {...field}
                  {...props}
                  type="text"
                  inputMode="decimal"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateAmount(e.currentTarget.value)
                  }
                  value={rawField.value}
                />
              )}
            </div>
            {help ? (
              <div className="text-gray-500 text-xs mt-1">{help}</div>
            ) : null}
            {field.value &&
            rawField.value &&
            normalizeNumber(field.value) !==
              normalizeNumber(Number(rawField.value)) ? (
              <div className="mt-2 font-medium text-lg">{field.value}</div>
            ) : null}
            {meta.error && meta.touched ? (
              <div className="px-2 py-1 mt-1 bg-red-100 border rounded border-red-100 text-red-900 text-sm">
                {meta.error}
              </div>
            ) : null}
            {detailVisiblityState.isOpen ? (
              <div className="p-4 border rounded-lg bg-blue-100 mt-3 relative">
                <div className="float-right">
                  <Button onClick={detailVisiblityState.close} inline>
                    <CancelIcon />
                  </Button>
                </div>
                <div className="font-medium mb-4 text-lg">
                  Amount Calculator
                </div>
                <p className="mb-4 text-gray-500">
                  You can use basic operations (e.g. +, -, *, /, % etc.) while
                  entering the amount to quickly calculate the total.
                </p>
                <div className="font-medium mb-2">Examples</div>
                <ul className="list-disc ml-5 mb-4">
                  {['175 + 40 + 2 * 32 - 100', '2 x 22 + 40 + 18%'].map(
                    (rawAmount) => (
                      <li key={rawAmount} className="mb-2">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                          <p>
                            {rawAmount} ={' '}
                            {normalizeNumber(evalNumExpr(rawAmount))}
                          </p>
                          <div>
                            <Button
                              onClick={() => updateAmount(rawAmount)}
                              type="button"
                              inline
                            >
                              Try it <ArrowLeftIcon className="rotate-180 " />
                            </Button>
                          </div>
                        </div>
                      </li>
                    )
                  )}
                </ul>
                <p className="mb-2 text-sm">
                  NOTE: "%" can be use to add/remove taxes
                </p>
              </div>
            ) : null}
          </div>
        );
      }}
    </Field>
  );
}

type TOnSubmit<T> = $PropertyType<FormikConfig<T>, 'onSubmit'>;

// wrap formik onSubmit to automatically handle errors
export function formikOnSubmitWithErrorHandling<T>(
  handleSubmit: TOnSubmit<T>,
  rethrow?: boolean
): TOnSubmit<T> {
  return async (values, actions) => {
    actions.setStatus();
    try {
      return await Promise.resolve(handleSubmit(values, actions));
    } catch (e) {
      if (!e) return;
      const error = e as string | (Error & { formikErrors?: FormikErrors<T> });
      if (typeof error === 'string') {
        actions.setStatus(error);
      } else if (error.message) {
        actions.setStatus(error.message);
        if (error.formikErrors) {
          actions.setErrors(error.formikErrors);
        }
      }
      if (rethrow) {
        return Promise.reject(e);
      }
    }
  };
}