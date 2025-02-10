'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { Formik, Form } from 'formik';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';

import styles from '../layout.module.scss';
import validationSchema from './schema';
import { Link } from '@/i18n/routing';
import Button from '@/share/Button';
import { fonts } from '@/styles/fonts';
import Checkbox from '@/share/Checkbox';
import InputText from '@/share/InputText';
import { IconBrandGoogleFilled, IconKey, IconMail } from '@tabler/icons-react';

export interface LoginInfo {
  email: string;
  password: string;
}

function SignIn() {
  const t = useTranslations();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState('password');

  const handleShowPassword = () => {
    setShowPassword(showPassword === 'password' ? 'text' : 'password');
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmit = async (values: LoginInfo) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      toast.warning(t('login.notify03'));
      router.push('/');
      return;
    }
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
              />
              <InputText
                label={t('form.tp02')}
                name="password"
                type={showPassword}
                placeholder={t('form.tp02')}
                Icon={<IconKey />}
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
                <Button type="submit" disabled={!isValid || !dirty} primary auth>
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
