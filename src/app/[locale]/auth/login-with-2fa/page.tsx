'use client';
import { createRef, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Formik, Form, FormikHelpers } from 'formik';
import { useTranslations } from 'next-intl';
import { Loader } from '@mantine/core';

import styles from '../layout.module.scss';
import validationSchema from './schema';
import Button from '@/share/Button';
import { fonts } from '@/styles/fonts';
import InputText from '@/share/InputText';
import { useRouter } from '@/i18n/routing';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { loginWith2FA } from '@/services/authServices';
import { setCookie } from 'typescript-cookie';
import { showToast, ToastType } from '@/utils/toastUtils';

export interface LoginWWith2FA {
  token2FA?: string;
  code: string;
}

function LoginWWith2FA() {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.auth.loading);

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

  const handleVerifyCode = (values: LoginWWith2FA, resetForm: FormikHelpers<LoginWWith2FA>['resetForm']) => {
    const token2FA = JSON.parse(String(sessionStorage.getItem('token2FA')));
    const loginWith2FAPromise = dispatch(loginWith2FA({ token2FA: token2FA, code: values.code }))
      .then((result) => {
        if (result?.payload.code === 200) {
          localStorage.setItem('accessToken', JSON.stringify(result.payload.data.accessToken));
          setCookie('accessToken', JSON.stringify(result?.payload?.data.accessToken));
          localStorage.setItem('refreshToken', JSON.stringify(result.payload.data.refreshToken));
          localStorage.setItem('user', JSON.stringify(result.payload.data.user));
          router.push('/');
          return t('login.notify01');
        } else {
          resetForm();
          setInputs(Array(6).fill(''));
          throw new Error(result?.payload.message || t('system.error'));
        }
      })
      .catch((err) => {
        throw new Error(err?.message || t('system.error'));
      });
    showToast('', ToastType.PROMISE, loginWith2FAPromise);
  };

  useEffect(() => {
    if (inputRefs) {
      inputRefs.current[0].current?.focus();
    }
  }, []);

  return (
    <div className={clsx(styles['auth'], fonts.inter)}>
      <h1 className={clsx(styles['auth__heading'])}>{t('login-with-2fa.heading')}</h1>
      <p className={clsx(styles['auth__desc'], fonts.lora)}>{t('login-with-2fa.desc01')}</p>

      <Formik
        initialValues={{ code: '' } as LoginWWith2FA}
        validationSchema={validationSchema()}
        onSubmit={(values: LoginWWith2FA, { resetForm }) => {
          handleVerifyCode(values, resetForm);
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
              setFieldValue('code', newInputs.join(''));
            }
          };

          const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
            const { value } = e.target;
            if (!/^\d*$/.test(value)) return;
            const updatedInputs = [...inputs];
            updatedInputs[index] = value.slice(-1);
            setInputs(updatedInputs);
            setFieldValue('code', updatedInputs.join(''));

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
                    name={`code`}
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
                <Button
                  auth
                  primary
                  disabled={!isValid || !dirty || isLoading}
                  leftIcon={isLoading && <Loader size={30} color="var(--white)" />}
                >
                  {t('button.btn10')}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>

      <p className={clsx(styles['auth__footer'])}>
        {t('login-with-2fa.desc02')}
        <a href="https://2fa.live" target="blank" className={clsx(styles['auth__link'])}>
          {t('login-with-2fa.here')}
        </a>
      </p>
    </div>
  );
}

export default LoginWWith2FA;
