'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { Formik, Form } from 'formik';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import { IconBrandGoogleFilled, IconKey, IconMail } from '@tabler/icons-react';

import styles from '../layout.module.scss';
import validationSchema from './schema';
import { Link } from '@/i18n/routing';
import Button from '@/share/Button';
import { fonts } from '@/styles/fonts';
import Checkbox from '@/share/Checkbox';
import InputText from '@/share/InputText';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { loginUser } from '@/services/authAPI';
import { setCookie } from 'typescript-cookie';
import useSessionStorage from '@/hooks/useSessionStorage';
import { Loader } from '@mantine/core';

export interface LoginInfo {
  email: string;
  password: string;
}

function SignIn() {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { setItem } = useSessionStorage();
  const isLogin = useAppSelector((state) => state.auth.isLogin);
  const isLoading = useAppSelector((state) => state?.auth.loading);
  const [showPassword, setShowPassword] = useState('password');

  const handleShowPassword = () => {
    setShowPassword(showPassword === 'password' ? 'text' : 'password');
  };

  const handleSubmit = async (values: LoginInfo) => {
    const token = localStorage.getItem('accessToken');
    if (token || isLogin) {
      toast.warning(t('login.notify03'));
      router.push('/');
      return;
    }

    dispatch(loginUser(values)).then((result) => {
      if (result?.payload?.code === 200) {
        localStorage.setItem('accessToken', JSON.stringify(result?.payload?.data.accessToken));
        setCookie('accessToken', JSON.stringify(result?.payload?.data.accessToken));
        localStorage.setItem('refreshToken', JSON.stringify(result?.payload?.data.refreshToken));
        localStorage.setItem('user', JSON.stringify(result?.payload?.data.user));
        toast.success(t('login.notify01'));
        router.push('/');
      } else if (result?.payload?.code === 202) {
        setItem('token2FA', result?.payload?.data.twoFaToken);
        router.push('/auth/login-with-2fa');
      } else if (result?.payload?.code === 500) {
        router.push('/errors/500');
      } else {
        toast.error(result?.payload?.message || t('system.error'));
      }
    });
  };

  return (
    <div className={clsx(styles['auth'], fonts.inter)}>
      <h1 className={clsx(styles['auth__heading'])}>{t('login.heading')}</h1>
      <p className={clsx(styles['auth__desc'], fonts.lora)}>{t('login.desc01')}</p>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema(t)}
        onSubmit={(values) => {
          handleSubmit(values);
        }}
        validateOnChange={true}
        validateOnMount={true}
      >
        {({ isValid, dirty }) => {
          return (
            <Form>
              <InputText
                label={t('form.tp01')}
                name="email"
                type="email"
                placeholder={t('form.tp01')}
                Icon={<IconMail />}
                readOnly={isLoading}
              />
              <InputText
                label={t('form.tp02')}
                name="password"
                type={showPassword}
                placeholder={t('form.tp02')}
                Icon={<IconKey />}
                readOnly={isLoading}
              />

              <div className={clsx(styles['auth__group'])}>
                <Checkbox checkLabel={t('form.lb01')} onChange={handleShowPassword} />

                <Link className={clsx(styles['auth__link'], styles['auth__pull-right'])} href={'/auth/forgot-password'}>
                  {t('forgot-password.heading')}
                </Link>
              </div>

              <div
                style={!isValid || !dirty ? { cursor: 'no-drop' } : {}}
                className={clsx(styles['form__group'], styles['auth__btn-group'])}
              >
                <Button
                  primary
                  auth
                  type="submit"
                  disabled={!isValid || !dirty || isLoading}
                  leftIcon={isLoading && <Loader size={30} color="var(--white)" />}
                >
                  {t('button.btn05')}
                </Button>
                <Button type="submit" authGoogle leftIcon={<IconBrandGoogleFilled />}>
                  {t('button.btn06')}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>

      <p className={clsx(styles['auth__footer'])}>
        {t('login.desc02')}
        <Link className={clsx(styles['auth__link'])} href={'/auth/signup'}>
          {t('button.btn07')}
        </Link>
      </p>
    </div>
  );
}

export default SignIn;
