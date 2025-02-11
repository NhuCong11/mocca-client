'use client';
import { useState } from 'react';
import clsx from 'clsx';
import { Formik, Form } from 'formik';
import { useTranslations } from 'next-intl';

import styles from '../layout.module.scss';
import validationSchema from './schema';
import Button from '@/share/Button';
import { fonts } from '@/styles/fonts';
import Checkbox from '@/share/Checkbox';
import InputText from '@/share/InputText';
import { IconKey } from '@tabler/icons-react';

export interface ResetPasswordInfo {
  tokenVerifyOTP: string;
  newPassword: string;
  confirmPassword?: string;
}

function ResetPassword() {
  const t = useTranslations();

  const isLoading = false;

  const [showPassword, setShowPassword] = useState('password');

  const handleShowPassword = () => {
    setShowPassword(showPassword === 'password' ? 'text' : 'password');
  };

  const handleResetPassword = (values: ResetPasswordInfo) => {
    const tokenVerifyOTP = JSON.parse(String(sessionStorage.getItem('tokenVerifyOTP')));
    const data = {
      tokenVerifyOTP: tokenVerifyOTP,
      newPassword: values.newPassword,
    };
    console.log(data);
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
                label={t('form.tp02')}
                name="newPassword"
                type={showPassword}
                placeholder={t('form.tp02')}
                Icon={<IconKey />}
                readOnly={isLoading}
              />

              <InputText
                label={t('form.tp04')}
                name="confirmPassword"
                type={showPassword}
                placeholder={t('form.tp04')}
                Icon={<IconKey />}
                readOnly={isLoading}
              />

              <div className={clsx(styles['auth__group'])}>
                <Checkbox checkLabel={t('form.lb01')} onChange={handleShowPassword} />
              </div>

              <div
                style={!isValid || !dirty || isLoading ? { cursor: 'no-drop' } : {}}
                className={clsx(styles['form__group'], styles['auth__btn-group'])}
              >
                <Button disabled={!isValid || !dirty || isLoading} primary auth>
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
