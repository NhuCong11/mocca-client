'use client';
import { useCallback, useState } from 'react';
import clsx from 'clsx';
import { Formik, Form } from 'formik';
import { useTranslations } from 'next-intl';
import { Loader } from '@mantine/core';
import { IconLock } from '@tabler/icons-react';

import styles from '../layout.module.scss';
import validationSchema from './schema';
import Button from '@/share/Button';
import { fonts } from '@/styles/fonts';
import InputText from '@/share/InputText';
import { useRouter } from '@/i18n/routing';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { resetPassword } from '@/services/authServices';
import { showToast, ToastType } from '@/utils/toastUtils';
import { IconKeyPassword } from '../constant';

export interface ResetPasswordInfo {
  tokenVerifyOTP: string;
  newPassword: string;
  confirmPassword?: string;
}

function ResetPassword() {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.auth.loading);

  const [showPassword, setShowPassword] = useState({ new: false, confirm: false });

  const handleShowPassword = useCallback((type: 'new' | 'confirm') => {
    setShowPassword((prevState) => ({ ...prevState, [type]: !prevState[type] }));
  }, []);

  const handleResetPassword = (values: ResetPasswordInfo) => {
    const tokenVerifyOTP = JSON.parse(String(sessionStorage.getItem('tokenVerifyOTP')));
    const data = {
      tokenVerifyOTP: tokenVerifyOTP,
      newPassword: values.newPassword,
    };
    const verifyOTPPromise = dispatch(resetPassword(data)).then((result) => {
      if (result.payload.code === 200) {
        router.push('/auth/signin');
        return result.payload?.message;
      } else {
        throw new Error(result?.payload?.message || t('system.error'));
      }
    });
    showToast('', ToastType.PROMISE, verifyOTPPromise);
  };

  return (
    <div className={clsx(styles['auth'], fonts.inter)}>
      <h1 className={clsx(styles['auth__heading'])}>{t('reset-password.heading')}</h1>
      <p className={clsx(styles['auth__desc'], fonts.lora)}>{t('reset-password.desc01')}</p>

      <Formik
        initialValues={{ newPassword: '', confirmPassword: '' } as ResetPasswordInfo}
        validationSchema={validationSchema(t)}
        onSubmit={(values: ResetPasswordInfo) => {
          handleResetPassword(values);
        }}
        validateOnChange={true}
        validateOnMount={true}
      >
        {({ isValid, dirty }) => {
          return (
            <Form>
              <InputText
                required
                label={t('form.tp02')}
                name="newPassword"
                type={showPassword.new ? 'text' : 'password'}
                placeholder={t('form.tp02')}
                LeftIcon={<IconLock />}
                RightIcon={
                  <IconKeyPassword showPassword={showPassword.new} onToggle={() => handleShowPassword('new')} />
                }
                readOnly={isLoading}
              />

              <InputText
                required
                label={t('form.tp04')}
                name="confirmPassword"
                type={showPassword.confirm ? 'text' : 'password'}
                placeholder={t('form.tp04')}
                LeftIcon={<IconLock />}
                RightIcon={
                  <IconKeyPassword showPassword={showPassword.confirm} onToggle={() => handleShowPassword('confirm')} />
                }
                readOnly={isLoading}
              />

              <div
                style={!isValid || !dirty || isLoading ? { cursor: 'no-drop' } : {}}
                className={clsx(styles['form__group'], styles['auth__btn-group'])}
              >
                <Button
                  auth
                  primary
                  type="submit"
                  disabled={!isValid || !dirty || isLoading}
                  leftIcon={isLoading && <Loader size={30} color="var(--white)" />}
                >
                  {t('button.btn12')}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

export default ResetPassword;
