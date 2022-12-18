import {
  useRef,
  useReducer,
  useCallback,
  useState,
  useMemo,
  useEffect,
} from 'react';
import { ArrowDropDownIcon, CancelIcon, PlusIcon, SpinnerIcon } from './Icons';
import { MenuContext, MenuList } from './Menu';
import classNames from 'classnames';
import { Inline } from './Inline';
import { Stack } from './Stack';
import { Box } from './Box';
import { Text } from './Text';
import { Optional } from 'utility-types';
import { useFocusWithin } from 'react-aria';
import { useOverlayTriggerState } from './Modal';
import { useMount } from '@kiraya/util-general';

export type TSelectableBaseOption = {
  id: string | number;
  label: string;
  heading?: boolean;
};

type SearchSelectProps<TOption extends TSelectableBaseOption> = {
  actionLabel?: React.ReactNode;
  control?: 'input' | 'button';
  hasValue?: boolean;
  label?: string;
  placeholder?: string;
  onChange: (option: TOption | null) => void;
  options?: Array<TOption>;
  fetchOptions?: (q: string) => Promise<Array<TOption>>;
  searchDisabled?: boolean;
  searchPlaceholder?: string;
  value: TOption | null | string;
  createOptionLabel?: (q: string) => React.ReactNode;
  onCreateOption?: (q: string, onSuccess: () => void) => void;
  isCreating?: boolean;
  readonly?: boolean;
  height?: number;
  removeActionButtons?: boolean;
};

export function SearchSelect<TOption extends TSelectableBaseOption>({
  actionLabel,
  control = 'button',
  hasValue,
  label,
  onChange,
  options,
  placeholder,
  searchDisabled,
  searchPlaceholder,
  value,
  readonly,
  fetchOptions,
  createOptionLabel,
  onCreateOption,
  isCreating,
  height,
  removeActionButtons,
}: SearchSelectProps<TOption>) {
  hasValue = hasValue !== undefined ? hasValue : Boolean(value);
  const { q, filteredOptions, handleQueryChange, filtering } =
    useFilteredOptions({
      options,
      fetchOptions,
    });
  const [isFocusWithin, setFocusWithin] = useState(false);
  const menuState = useOverlayTriggerState({});
  const { focusWithinProps } = useFocusWithin({
    onFocusWithinChange: (isFocusWithin) => setFocusWithin(isFocusWithin),
  });
  const controlContainerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!isFocusWithin) menuState.close();
  }, [menuState, isFocusWithin]);
  const menuContextValue = useMemo(() => {
    return {
      isExpended: menuState.isOpen,
      open: () => {
        menuState.open();
        // This will ensure that we have latest options available on every open
        handleQueryChange(q);
      },
      close: () => {
        // focus the container before closing for better focus management
        controlContainerRef.current?.focus();
        menuState.close();
        // reset the query
        handleQueryChange('');
      },
      toggle: () => (menuState.isOpen ? menuState.close() : menuState.open()),
    };
  }, [menuState, q, handleQueryChange]);
  return (
    <div {...focusWithinProps} className="relative bg-white">
      <MenuContext.Provider value={menuContextValue}>
        {control === 'input' ? (
          <Stack gap="1">
            {label ? (
              <Box>
                <Inline justifyContent="between">
                  <Text>{label}</Text>
                  {actionLabel ? <Box>{actionLabel}</Box> : null}
                </Inline>
              </Box>
            ) : null}
            <Inline<'div'>
              rounded="md"
              className={
                isFocusWithin
                  ? 'ring-1 ring-blue-900 border border-blue-900'
                  : 'border border-gray100'
              }
              ref={controlContainerRef}
              tabIndex={-1}
              onKeyDown={(e) => {
                // open on arrow down
                if (e.keyCode === 40 && !menuContextValue.isExpended) {
                  menuContextValue.open();
                }
                // close on escape
                if (e.keyCode === 27 && menuContextValue.isExpended) {
                  menuContextValue.close();
                }
              }}
            >
              <input
                type="search"
                autoComplete="off"
                onClick={menuContextValue.open}
                placeholder={searchPlaceholder}
                readOnly={isCreating || readonly}
                disabled={isCreating || readonly}
                value={
                  isCreating
                    ? 'Creating...'
                    : menuContextValue.isExpended
                    ? q
                    : value
                    ? typeof value === 'string'
                      ? value
                      : value.label
                    : ''
                }
                className="flex-1 block px-3 py-2 rounded bg:gray-100 placeholder-gray-500 border border-gray-100 border-0 outline-none shadow-none"
                onChange={(e) => {
                  const q = e.currentTarget.value;
                  if (!menuContextValue.isExpended) menuContextValue.open();
                  handleQueryChange(q || '');
                }}
              />
              {hasValue && (!isCreating || !readonly) ? (
                <Box
                  as="button"
                  disabled={isCreating || readonly || filtering}
                  onClick={() => onChange(null)}
                  type="button"
                  padding="2"
                  tabIndex={-1}
                >
                  <CancelIcon size="5" color="gray500" />
                </Box>
              ) : null}
              <Box
                as="button"
                disabled={isCreating || readonly || filtering}
                onClick={menuContextValue.toggle}
                type="button"
                padding="2"
                borderLeftWidth="1"
                tabIndex={-1}
              >
                {filtering || isCreating ? (
                  <SpinnerIcon size="6" />
                ) : (
                  <ArrowDropDownIcon size="6" />
                )}
              </Box>
            </Inline>
          </Stack>
        ) : (
          <button
            type="button"
            onClick={menuContextValue.toggle}
            tabIndex={-1}
            className={classNames(
              `h-${
                height ? height : 8
              } inline-flex gap-3 pl-3 py-1 pr-1 items-center border rounded font-medium text-sm`,
              {
                'bg-blue-100': hasValue,
              }
            )}
          >
            {label || 'Select'} <ArrowDropDownIcon size="6" />
          </button>
        )}
        <MenuList
          autoFocus={control !== 'input'}
          fullWidth={control === 'input'}
        >
          <div>
            {!(searchDisabled || control === 'input') ? (
              <div className="p-3 border-b">
                <input
                  type="search"
                  placeholder={searchPlaceholder}
                  name="q"
                  value={q}
                  className="w-full h-[40px] px-4 form-input py-0 h-[36px] border-gray-100 rounded text-base"
                  onChange={(e) => {
                    const q = e.currentTarget.value;
                    handleQueryChange(q || '');
                  }}
                />
              </div>
            ) : null}
            <div
              className={classNames('overflow-auto', {
                'max-h-[230px] w-full': control === 'input',
                'max-h-[300px] w-[280px]': control !== 'input',
              })}
            >
              <ol className="py-2">
                {!filteredOptions.length ? (
                  <li className="py-3 px-5 text-sm font-medium text-center text-gray-500">
                    No results found
                  </li>
                ) : (
                  filteredOptions.map((option) => (
                    <li key={option.id}>
                      <label
                        className={classNames(
                          'flex gap-4 items-center py-3 px-5',
                          {
                            'cursor-pointer hover:bg-blue-100': !option.heading,
                          }
                        )}
                      >
                        <input
                          type="radio"
                          name="member"
                          value={option.id}
                          placeholder={placeholder}
                          readOnly={Boolean(option.heading)}
                          className={
                            option.heading ? 'invisible opacity-0' : ''
                          }
                          checked={
                            typeof value === 'string'
                              ? value === option.id || value === option.label
                              : value?.id === option.id
                          }
                          onChange={(e) => {
                            if (option.heading) return;
                            if (e.currentTarget.checked) {
                              onChange(option);
                            }
                            menuContextValue.close();
                          }}
                        />
                        {option.heading ? (
                          <span className="flex-1 pointer-event-none font-medium text-gray-600 text-sm">
                            {option.label}
                          </span>
                        ) : (
                          <span className="flex-1 pointer-event-none font-medium">
                            {option.label}
                          </span>
                        )}
                      </label>
                    </li>
                  ))
                )}
              </ol>
            </div>
            {createOptionLabel &&
            onCreateOption &&
            (!isCreating || !readonly) ? (
              <div className="p-3">
                <button
                  type="button"
                  className="w-full flex gap-2 border border-gray-100 bg-blue-50 p-2 items-center rounded"
                  onClick={() => {
                    menuContextValue.close();
                    onCreateOption(q, () =>
                      controlContainerRef.current?.focus()
                    );
                  }}
                >
                  <PlusIcon size="5" color="blue900" />
                  <span className="flex-1 min-w-0 font-medium text-left">
                    {createOptionLabel(q)}
                  </span>
                </button>
              </div>
            ) : null}
            {control !== 'input' && !removeActionButtons ? (
              <footer className="flex gap-8 flex-row-reverse border-t py-4 px-5">
                <button
                  type="button"
                  onClick={() => {
                    menuContextValue.close();
                  }}
                  className="text-blue-900 font-semibold"
                >
                  Done
                </button>
                <button
                  type="button"
                  className="text-gray-500 font-semibold"
                  onClick={() => {
                    onChange(null);
                    menuContextValue.close();
                  }}
                >
                  Clear
                </button>
              </footer>
            ) : null}
          </div>
        </MenuList>
      </MenuContext.Provider>
    </div>
  );
}

type MultiSearchSelectProps<TOption extends TSelectableBaseOption> = {
  onChange: (option: Array<TOption> | null) => void;
  options?: Array<TOption>;
  value: Array<TOption> | null | undefined;
  label: string;
  searchPlaceholder?: string;
  searchDisabled?: boolean;
  hasValue?: boolean;
  helpOnEmptyResults?: React.ReactNode;
};

export function MultiSearchSelect<TOption extends TSelectableBaseOption>({
  value,
  label = 'Select',
  hasValue,
  ...props
}: MultiSearchSelectProps<TOption>) {
  hasValue = hasValue !== undefined ? hasValue : Boolean(value?.length);
  const [isFocusWithin, setFocusWithin] = useState(false);
  const menuState = useOverlayTriggerState({});
  const { focusWithinProps } = useFocusWithin({
    onFocusWithinChange: (isFocusWithin) => setFocusWithin(isFocusWithin),
  });
  useEffect(() => {
    if (!isFocusWithin) menuState.close();
  }, [menuState, isFocusWithin]);
  const menuContextValue = useMemo(() => {
    return {
      isExpended: menuState.isOpen,
      open: menuState.open,
      close: menuState.close,
      toggle: () => (menuState.isOpen ? menuState.close() : menuState.open()),
    };
  }, [menuState]);
  return (
    <div {...focusWithinProps} className="relative">
      <MenuContext.Provider value={menuContextValue}>
        <button
          type="button"
          onClick={menuContextValue.toggle}
          className={classNames(
            'h-8 inline-flex gap-3 pl-3 py-1 pr-1 items-center border rounded font-medium text-sm',
            {
              'bg-blue-100': hasValue,
            }
          )}
        >
          {label} <ArrowDropDownIcon className="w-6 h-6" />
        </button>
        <MenuList>
          <MultiSearchMenu
            {...props}
            value={value}
            onClose={menuContextValue.close}
          />
        </MenuList>
      </MenuContext.Provider>
    </div>
  );
}

function MultiSearchMenu<TOption extends TSelectableBaseOption>({
  onChange,
  value,
  options,
  searchPlaceholder = 'Search..',
  searchDisabled,
  onClose,
  helpOnEmptyResults,
}: Omit<MultiSearchSelectProps<TOption>, 'label' | 'hasValue'> & {
  onClose: () => void;
}) {
  const { q, filteredOptions, handleQueryChange } = useFilteredOptions({
    options,
  });
  return (
    <div>
      {!searchDisabled ? (
        <div className="p-3 border-b">
          <input
            type="search"
            placeholder={searchPlaceholder}
            name="q"
            value={q}
            className="w-full h-[40px] px-4 form-input py-0 h-[36px] border-gray-100 rounded text-base"
            onChange={(e) => {
              const q = e.currentTarget.value;
              handleQueryChange(q || '');
            }}
          />
        </div>
      ) : null}
      <div className="max-h-[300px] overflow-auto w-[280px]">
        <ol className="py-2">
          {!options?.length ? (
            <li>
              <div className="py-4 px-5">
                {helpOnEmptyResults || (
                  <div className="font-semibold mb-1">
                    No options available!
                  </div>
                )}
              </div>
              <footer className="border-t py-4 px-5 text-right">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                  }}
                  autoFocus
                  className="text-blue-900 font-semibold"
                >
                  Ok, Got it
                </button>
              </footer>
            </li>
          ) : (
            filteredOptions.map((option) => {
              const optionIndexInValue = !value
                ? -1
                : value.findIndex((val) =>
                    typeof val === 'string'
                      ? val === option.id || val === option.label
                      : val?.id === option.id
                  );
              return (
                <li key={option.id}>
                  <label className="flex gap-4 items-center cursor-pointer py-3 px-5 hover:bg-blue-100 ">
                    <input
                      type="checkbox"
                      name="member"
                      value={option.id}
                      checked={optionIndexInValue !== -1}
                      onChange={() => {
                        if (optionIndexInValue === -1) {
                          onChange(value ? value.concat([option]) : [option]);
                        } else {
                          const newValue = value ? value.concat() : [];
                          if (newValue.length) {
                            newValue.splice(optionIndexInValue, 1);
                          }
                          onChange(newValue);
                        }
                      }}
                    />
                    <span className="flex-1 pointer-event-none font-medium">
                      {option.label}
                    </span>
                  </label>
                </li>
              );
            })
          )}
        </ol>
      </div>
      {options?.length ? (
        <footer className="flex gap-8 flex-row-reverse border-t py-4 px-5">
          <button
            type="button"
            onClick={() => {
              onClose();
            }}
            className="text-blue-900 font-semibold"
          >
            Done
          </button>
          <button
            type="button"
            className="text-gray-500 font-semibold"
            onClick={() => {
              onChange(null);
              onClose();
            }}
          >
            Clear
          </button>
        </footer>
      ) : null}
    </div>
  );
}

function useFilteredOptions<TOption extends TSelectableBaseOption>({
  options,
  fetchOptions,
}: {
  options?: Array<TOption>;
  fetchOptions?: (q: string) => Promise<Array<TOption>>;
}) {
  type TState = {
    q: string;
    allOptions: Array<TOption>;
    filteredOptions: Array<TOption>;
    filtering: boolean;
  };
  const [state, dispatch] = useReducer(
    (state: TState, action: Optional<TState>) => ({ ...state, ...action }),
    {
      q: '',
      allOptions: options || [],
      filteredOptions: options || [],
      filtering: false,
    }
  );
  useMount(() => {
    if (fetchOptions) handleQueryChange('');
  });
  const filterWorkerRef = useRef<NodeJS.Timeout | null>(null);
  const handleQueryChange = useCallback(
    (q = '') => {
      if (filterWorkerRef.current) clearTimeout(filterWorkerRef.current);
      dispatch({ q, filtering: Boolean(fetchOptions) });
      // filterout the options
      filterWorkerRef.current = setTimeout(async () => {
        const filteredOptions: Array<TOption> = [];
        let allOptions: Array<TOption> = [];
        let lastHeaderToInclude: TOption | null = null;
        if (fetchOptions) {
          allOptions = await fetchOptions(q);
        } else {
          allOptions = options || [];
        }
        if (!allOptions.length) return;
        for (const option of allOptions) {
          if (option.heading) {
            lastHeaderToInclude = option;
            continue;
          }
          const shouldIncludeOption =
            option.label.toLowerCase().indexOf(q.toLowerCase()) !== -1;
          if (shouldIncludeOption) {
            if (lastHeaderToInclude) {
              // push the header first
              filteredOptions.push(lastHeaderToInclude);
            }
            filteredOptions.push(option);
            // reset the header to remove duplicate inclusion
            lastHeaderToInclude = null;
          }
        }
        dispatch({ filteredOptions, filtering: false, allOptions });
      }, 100);
    },
    [options, fetchOptions]
  );

  return {
    ...state,
    handleQueryChange,
  };
}
