'use client';
import { Field, ErrorMessage, useField } from 'formik';
import React, { forwardRef, useMemo } from 'react';
import clsx from 'clsx';
import styles from './Input.module.scss';

interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  LeftIcon?: React.ReactNode;
  RightIcon?: React.ReactNode;
  sm?: boolean;
  textCenter?: boolean;
  isNumber?: boolean;
  noChange?: boolean;
  required?: boolean;
}

const InputText = forwardRef<HTMLInputElement, InputTextProps>(
  (
    {
      label,
      name,
      type = 'text',
      LeftIcon,
      RightIcon,
      placeholder = '',
      className,
      sm,
      textCenter,
      isNumber,
      noChange,
      required,
      ...passProps
    },
    ref,
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [field, meta] = useField(name);
    const today = useMemo(() => new Date().toISOString().split('T')[0], []);

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
      e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '');
    };

    return (
      <div className={clsx(styles['form__group'], !label && styles['form__group--not'])}>
        <label
          htmlFor={name}
          className={clsx(styles['form__label'], styles['form__label--medium'], !label && styles['form__label--not'])}
        >
          {label}
          {required && <span className={clsx(styles['form__label--required'])}>*</span>}
        </label>

        {/* Input wrapper */}
        <div
          className={clsx(styles['form__text-input'], sm && styles['form__text-input--sm'], {
            [className as string]: className,
          })}
          style={meta.touched && meta.error ? { border: '1px solid #f44336' } : {}}
        >
          {LeftIcon && (
            <span
              className={clsx(
                styles['form__input-icon'],
                meta.touched && meta.error && styles['form__input-icon--err'],
              )}
            >
              {LeftIcon}
            </span>
          )}

          <Field
            type={type}
            id={name}
            name={name}
            readOnly={passProps.readOnly}
            disabled={noChange}
            placeholder={placeholder}
            className={clsx(styles['form__input'], textCenter && styles['form__input--center'])}
            ref={ref}
            onInput={isNumber ? handleInput : undefined}
            max={type === 'date' ? today : undefined}
            {...passProps}
          />

          {RightIcon && (
            <span className={clsx(styles['form__input-icon'], styles['form__input-icon--right'])}>{RightIcon}</span>
          )}
        </div>

        {/* Error message */}
        <ErrorMessage name={name} component="p" className={clsx(styles['form__error'])} />
      </div>
    );
  },
);

InputText.displayName = 'InputText';

export default InputText;
