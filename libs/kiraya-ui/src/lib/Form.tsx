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
import React, { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { $PropertyType } from 'utility-types';
import { Box } from './Box';
import { Button, getButtonClassName } from './Button';
import { Circle } from './Circle';
import {
  AddImageIcon,
  ArrowLeftIcon,
  CameraIcon,
  CancelIcon,
  InformationCircleIcon,
  PencilIcon,
  TrashIcon,
} from './Icons';
import { Inline } from './Inline';
import { Modal, ModalBody, ModalFooter, useOverlayTriggerState } from './Modal';
import { Stack } from './Stack';
import { Text } from './Text';
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

export function InputLabel({
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
  hideUpdate,
  defaultValue,
  onRemove,
  onSelectionStart,
  onPreview,
  previewClassName,
  ...props
}: FormFieldProps & {
  hideUpdate?: boolean;
  onRemove?: () => void;
  // Callback to handle the first image selection
  onSelectionStart?: () => void;
  onPreview?: () => void;
  previewClassName?: string;
}) {
  const [mediaName, setMediaName] = useState<string>('');
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
                if (files?.length) {
                  const name = files[0].name;
                  setMediaName(name);
                }
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
                    className={`w-12 h-12 cursor-pointer ${previewClassName}`}
                    onClick={() => {
                      imagePreviewState.open();
                      onPreview?.();
                    }}
                  />
                  <Modal
                    title={mediaName || props.title || 'Preview Image'}
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
                      {!hideUpdate && (
                        <InputLabel
                          fieldId={id}
                          className={getButtonClassName({ size: 'lg' })}
                        >
                          <PencilIcon /> Change
                        </InputLabel>
                      )}
                    </ModalFooter>
                  </Modal>
                </div>
                {!hideUpdate && (
                  <label
                    htmlFor={id}
                    className={classNames(
                      getButtonClassName({ inline: true }),
                      {
                        'block ring-2 ring-blue-900': fileInputFocused,
                      }
                    )}
                  >
                    <PencilIcon /> Change
                  </label>
                )}
                <div className="border-l pl-4 flex items-center">
                  <Button
                    inline
                    status="error"
                    disabled={props.disabled}
                    onClick={() => {
                      form.setFieldValue(field.name, '');
                      setFileName('');
                      setMediaName('');
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

export function FormMediaFileField({
  ref,
  imageFiles,
  savedImages,
  defaultValue,
  maxMediaFiles,
  onRemove,
  onSelectionStart,
  ...props
}: FormFieldProps & {
  defaultValue?: string;
  maxMediaFiles?: number;
  imageFiles: File[];
  savedImages?: string[];
  onRemove?: (index: number) => void;
  onSelectionStart?: () => void;
}) {
  const id = props.id || props.name;
  const [multiples, setMultiples] = useState<File[]>([]);
  const [updatingMedia, setUpdatingMedia] = useState<number | null>(null);
  const [previewFile, setPreviewFile] = useState<{
    file: File;
    index: number;
  } | null>(null);
  const [dataUrl, setFileDataUrl] = useState<string | undefined>(
    defaultValue ? String(defaultValue) : undefined
  );
  const [cloudImages, setCloudImages] = useState<string[]>(
    savedImages?.length ? savedImages : []
  );
  const [previewCloudFile, setPreviewCloudFile] = useState<{
    file: string;
    index: number;
  } | null>(null);
  const [loadingPreview, setLoadingPreview] = useState<boolean>(true);

  useEffect(() => {
    if (previewFile !== null) {
      readFileAsDataURL(previewFile.file).then((dataUrl) => {
        setFileDataUrl(dataUrl as string);
      });
    }
  }, [previewFile]);

  useEffect(() => {
    if (previewCloudFile !== null) {
      setFileDataUrl(previewCloudFile.file);
    }
  }, [previewCloudFile]);

  useEffect(() => {
    if (savedImages?.length) {
      setCloudImages(savedImages);
    }
  }, [savedImages?.length, savedImages]);

  useEffect(() => {
    if (!imageFiles.length) {
      setMultiples([]);
    }
  }, [imageFiles.length]);

  const imagePreviewState = useOverlayTriggerState({ defaultOpen: false });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [fileInputFocused, setFileInputFocusState] = useState<boolean>(false);
  const filesUpto = useMemo(() => {
    return cloudImages?.length
      ? (maxMediaFiles || cloudImages.length + 1) - cloudImages.length
      : maxMediaFiles
      ? maxMediaFiles
      : 1;
  }, [maxMediaFiles, cloudImages]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [{ value }, meta, { setValue }] = useField<File[]>(props.name);

  function deleteMedia(index: number, fromCloud?: boolean) {
    onRemove?.(index);
    if (fromCloud) {
      setCloudImages((prevImages) => prevImages.filter((_, i) => i !== index));
      return;
    }
    const updatedFiles = multiples.filter((_, i) => i !== index);
    setMultiples(updatedFiles);
    setValue(updatedFiles);
  }

  return (
    <FormField
      {...props}
      renderInput={({ field, form }) => (
        <Box rounded="lg" borderWidth="1" width="full" padding="4">
          <input
            accept="image/png, image/jpeg, image/jpg"
            {...props}
            name={`file_name_${id}`}
            type="file"
            id={id}
            multiple={updatingMedia === null ? true : false}
            disabled={multiples.length === filesUpto}
            className="opacity-0 absolute top-0 left-0 w-1 h-2"
            onFocus={() => {
              setFileInputFocusState(true);
            }}
            onBlur={() => {
              setFileInputFocusState(false);
              form.setFieldTouched(field.name, true);
            }}
            onChange={({ currentTarget: { value, files } }) => {
              form.setFieldTouched(field.name, true);
              const numOfFiles = files?.length || 0;
              if (numOfFiles > filesUpto) {
                toast.error(`Only ${filesUpto} media can be uploaded at once.`);
                return;
              }
              if (files) {
                if (multiples.length + numOfFiles > filesUpto) {
                  toast.error(
                    `Only ${filesUpto} media can be uploaded at once.`
                  );
                  return;
                }
                const filesConverted = Object.values(files);
                setUpdatingMedia(null);
                if (updatingMedia != null && files[0].name) {
                  const updatedFiles = multiples.map((file, index) => {
                    if (updatingMedia === index) {
                      return filesConverted[0];
                    }
                    return file;
                  });
                  setMultiples(updatedFiles);
                  return;
                }
                setMultiples((prevMultiples) =>
                  prevMultiples.length === filesUpto
                    ? [...prevMultiples]
                    : [...prevMultiples, ...filesConverted]
                );
                form.setFieldValue(field.name, [
                  ...multiples,
                  ...filesConverted,
                ]);
              }
            }}
          />
          <Stack gap="4">
            <InputLabel
              fieldId={id}
              onClick={(e: SyntheticEvent) => {
                if (props.disabled) {
                  e.preventDefault();
                  return;
                }
                onSelectionStart?.();
              }}
            >
              <Box
                id={id}
                rounded="lg"
                paddingY="12"
                paddingX="8"
                display="flex"
                justifyContent="center"
                alignItems="center"
                borderWidth="2"
                borderColor="blue200"
                minHeight="full"
                className="border-dashed"
                cursor="pointer"
                backgroundColor={
                  multiples.length === filesUpto || props.disabled
                    ? 'gray100'
                    : undefined
                }
              >
                <Stack alignItems="center" gap="4" justifyContent="center">
                  <Box>
                    <AddImageIcon color="gray500" size="8" />
                  </Box>
                  <Stack textAlign="center" gap="2">
                    <Text fontWeight="semibold" color="gray500">
                      Drop your image here, or{' '}
                      <Text as="span" color="blue900">
                        Browse
                      </Text>
                    </Text>
                    <Text color="gray500" fontSize="sm">
                      We support only JPG, JPEG or PNG formats
                    </Text>
                  </Stack>
                </Stack>
              </Box>
            </InputLabel>
            <Modal
              title={previewFile?.file.name || 'Preview Image'}
              isOpen={
                (previewFile !== null || previewCloudFile !== null) &&
                imagePreviewState.isOpen
              }
              onClose={imagePreviewState.close}
            >
              <ModalBody>
                {loadingPreview ? (
                  <div className="w-full h-60">
                    <div className="flex justify-center items-center w-full h-60 bg-gray-100 rounded sm:w-96">
                      <svg
                        className="w-12 h-12 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 640 512"
                      >
                        <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
                      </svg>
                    </div>
                  </div>
                ) : null}
                <img
                  src={dataUrl}
                  alt="Preview"
                  onLoad={() => setLoadingPreview(false)}
                  className={`w-full h-full max-w-full ${
                    loadingPreview ? 'hidden' : 'block'
                  }`}
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
              </ModalFooter>
            </Modal>
            {multiples.length || cloudImages.length ? (
              <Stack
                as="ul"
                gap="3"
                onChange={(e: SyntheticEvent) => {
                  e.stopPropagation();
                }}
              >
                {multiples.map((file, index) => (
                  <Box
                    key={`image_${file.name}_${index}`}
                    borderWidth="1"
                    rounded="lg"
                    paddingX="3"
                    paddingY="2"
                  >
                    <Inline alignItems="center" justifyContent="between">
                      <Box
                        className="w-2/3"
                        cursor="pointer"
                        onClick={() => {
                          setPreviewFile({ file, index });
                          imagePreviewState.open();
                        }}
                      >
                        <Stack>
                          <Text
                            fontSize="sm"
                            fontWeight="semibold"
                            className="truncate"
                          >
                            {file.name}
                          </Text>
                          <Button inline align="left">
                            <Text
                              fontWeight="semibold"
                              fontSize="sm"
                              color="blue900"
                            >
                              Click to preview
                            </Text>
                          </Button>
                        </Stack>
                      </Box>
                      <Inline gap="2" alignItems="center" cursor="pointer">
                        <InputLabel
                          fieldId={id}
                          onClick={(e) => {
                            if (props.disabled) {
                              e.preventDefault();
                              return;
                            }
                            setUpdatingMedia(index);
                          }}
                        >
                          <Circle size="8" title="Change Media">
                            <PencilIcon size="4" />
                          </Circle>
                        </InputLabel>
                        <Circle
                          size="8"
                          backgroundColor="red100"
                          title="Delete Media"
                          onClick={(e: SyntheticEvent) => {
                            e.stopPropagation();
                            if (props.disabled) {
                              return;
                            }
                            deleteMedia(index);
                          }}
                        >
                          <TrashIcon size="4" color="red900" />
                        </Circle>
                      </Inline>
                    </Inline>
                  </Box>
                ))}
                {cloudImages.length
                  ? cloudImages.map((url, index) => (
                      <Box
                        key={`image_${url}_${index}`}
                        borderWidth="1"
                        rounded="lg"
                        paddingX="3"
                        paddingY="2"
                      >
                        <Inline alignItems="center" justifyContent="between">
                          <Box
                            className="w-9/12"
                            cursor="pointer"
                            onClick={() => {
                              setPreviewCloudFile({ file: url, index });
                              imagePreviewState.open();
                            }}
                          >
                            <Stack>
                              <Text
                                fontSize="sm"
                                fontWeight="semibold"
                                className="truncate"
                              >
                                {url}
                              </Text>
                              <Button inline align="left">
                                <Text
                                  fontWeight="semibold"
                                  fontSize="sm"
                                  color="blue900"
                                >
                                  Click to preview
                                </Text>
                              </Button>
                            </Stack>
                          </Box>
                          <Inline gap="2" alignItems="center" cursor="pointer">
                            <Circle
                              size="8"
                              backgroundColor="red100"
                              title="Delete Media"
                              onClick={(e: SyntheticEvent) => {
                                e.stopPropagation();
                                if (props.disabled) {
                                  return;
                                }
                                deleteMedia(index, true);
                              }}
                            >
                              <TrashIcon size="4" color="red900" />
                            </Circle>
                          </Inline>
                        </Inline>
                      </Box>
                    ))
                  : null}
              </Stack>
            ) : null}
          </Stack>
        </Box>
      )}
    />
  );
}

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
