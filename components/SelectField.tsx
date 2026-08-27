'use client';

import { useEffect, useId, useRef, useState } from 'react';

interface Props {
  name: string;
  label: string;
  options: readonly string[];
  placeholder?: string;
  defaultValue?: string;
  disabled?: boolean;
}

/**
 * A select styled in the site's own palette.
 *
 * A native <select> is used for the value itself — through a hidden input — but
 * the open list is drawn here, because the browser's own popup is rendered by
 * the OS and cannot be themed.
 */
export default function SelectField({
  name,
  label,
  options,
  placeholder = 'בחירת נושא',
  defaultValue = '',
  disabled = false,
}: Props) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const id = useId();

  // Close when the focus or the pointer leaves the control.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  function choose(option: string) {
    setValue(option);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      setActive((i) => {
        const next = e.key === 'ArrowDown' ? i + 1 : i - 1;
        return (next + options.length) % options.length;
      });
      return;
    }
    if (open && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      choose(options[active]!);
    }
  }

  return (
    <div className="selectField" ref={rootRef}>
      <span className="selectLabel" id={`${id}-label`}>
        {label}
      </span>

      <input type="hidden" name={name} value={value} />

      <button
        type="button"
        className={open ? 'selectTrigger is-open' : 'selectTrigger'}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-label`}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
      >
        <span className={value ? 'selectValue' : 'selectValue is-placeholder'}>
          {value || placeholder}
        </span>
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <ul className="selectList" role="listbox" aria-labelledby={`${id}-label`}>
          {options.map((option, i) => (
            <li key={option}>
              <button
                type="button"
                role="option"
                aria-selected={option === value}
                className={
                  option === value
                    ? 'is-selected'
                    : i === active
                      ? 'is-active'
                      : undefined
                }
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(option)}
              >
                {option}
                {option === value ? <span aria-hidden="true">✦</span> : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
