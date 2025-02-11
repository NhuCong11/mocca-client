'use client';
import { createRef, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Formik, Form, FormikHelpers } from 'formik';
import { useTranslations } from 'next-intl';

import styles from '../layout.module.scss';
import validationSchema from './schema';
import Button from '@/share/Button';
import { fonts } from '@/styles/fonts';
import InputText from '@/share/InputText';

interface VerifyOTPForgotPasswordInfo {
  tokenForgot: string;
  otp: string;
}

function VerifyOTP() {
  const t = useTranslations();

  const isLoading = false;

  const [inputs, setInputs] = useState(Array(6).fill(''));

  const inputRefs = useRef(
    Array(6)
      .fill(0)
      .map(() => createRef<HTMLInputElement>()),
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !inputs[index] && index > 0) {
      inputRefs.current[index - 1].current?.focus();
    }
  };

  const handleVerifyOTP = (
    values: VerifyOTPForgotPasswordInfo,
    resetForm: FormikHelpers<VerifyOTPForgotPasswordInfo>['resetForm'],
  ) => {
    console.log(values);
    resetForm();
  };

  useEffect(() => {
    if (inputRefs) {
      inputRefs.current[0].current?.focus();
    }
  }, []);

  return (
    <div className={clsx(styles['auth'], fonts.inter)}>
      <h1 className={clsx(styles['auth__heading'])}>{t('login-with-2fa.heading')}</h1>
      <p className={clsx(styles['auth__desc'], fonts.lora)}>{t('verify-otp.desc01')}</p>

      <Formik
        initialValues={{ otp: '' } as VerifyOTPForgotPasswordInfo}
        validationSchema={validationSchema()}
        onSubmit={(values: VerifyOTPForgotPasswordInfo, { resetForm }) => {
          handleVerifyOTP(values, resetForm);
        }}
        validateOnChange={true}
        validateOnMount={true}
      >
        {({ isValid, dirty, setFieldValue }) => {
          const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
            e.preventDefault();
            const pasteData = e.clipboardData.getData('text').slice(0, 6);
            if (pasteData.length === 6) {
              const newInputs = pasteData.split('');
              setInputs(newInputs);
              setFieldValue('otp', newInputs.join(''));
            }
          };

          const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
            const { value } = e.target;
            if (!/^\d*$/.test(value)) return;
            const updatedInputs = [...inputs];
            updatedInputs[index] = value.slice(-1);
            setInputs(updatedInputs);
            setFieldValue('otp', updatedInputs.join(''));

            if (value && index < 5) {
              inputRefs.current[index + 1].current?.focus();
            }
          };

          return (
            <Form>
              <div className={clsx(styles['verify-otp__group'])}>
                {inputs.map((value, index) => (
                  <InputText
                    key={index}
                    name={`otp`}
                    ref={inputRefs.current[index]}
                    value={value}
                    onPaste={handlePaste}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, index)}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, index)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    textCenter
                    autoComplete="off"
                    readOnly={isLoading}
                  />
                ))}
              </div>

              <div
                style={!isValid || !dirty || isLoading ? { cursor: 'no-drop' } : {}}
                className={clsx(styles['form__group'], styles['auth__btn-group'])}
              >
                <Button disabled={!isValid || !dirty || isLoading} primary auth>
                  {t('button.btn10')}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>

      <p className={clsx(styles['auth__footer'])}>{t('verify-otp.heading')}</p>
    </div>
  );
}

export default VerifyOTP;
