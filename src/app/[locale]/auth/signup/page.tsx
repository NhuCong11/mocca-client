'use client';
import { useState } from 'react';
import clsx from 'clsx';
import { Formik, Form } from 'formik';
import { useTranslations } from 'next-intl';

import styles from '../layout.module.scss';
import validationSchema from './schema';
import Button from '@/share/Button';
import { Link } from '@/i18n/routing';
import Checkbox from '@/share/Checkbox';
import InputText from '@/share/InputText';
import { fonts } from '@/styles/fonts';
import { IconKey, IconMail, IconUser } from '@tabler/icons-react';

export interface SignUpInfo {
  fullname: string;
  email: string;
  password: string;
}

function SignUp() {
  const t = useTranslations();

  const [showPassword, setShowPassword] = useState('password');

  const handleShowPassword = () => {
    setShowPassword(showPassword === 'password' ? 'text' : 'password');
  };

  return (
    <div className={clsx(styles['auth'], fonts.inter)}>
      <h1 className={clsx(styles['auth__heading'])}>{t('sign-up.heading')}</h1>
      <p className={clsx(styles['auth__desc'], fonts.lora)}>{t('sign-up.desc01')}</p>

      <Formik
        initialValues={{ fullname: '', email: '', password: '' }}
        validationSchema={validationSchema(t)}
        onSubmit={() => {}}
        validateOnChange={true}
        validateOnMount={true}
      >
        {({ isValid, dirty }) => {
          return (
            <Form>
              <InputText
                label={t('form.tp03')}
                name="fullname"
                type="text"
                placeholder={t('form.tp03')}
                Icon={<IconUser />}
              />
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
              </div>

              <div
                style={!isValid || !dirty ? { cursor: 'no-drop' } : {}}
                className={clsx(styles['form__group'], styles['auth__btn-group'])}
              >
                <Button disabled={!isValid || !dirty} primary auth>
                  {t('button.btn07')}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>

      <p className={clsx(styles['auth__footer'])}>
        {t('sign-up.desc02')}
        <Link className={clsx(styles['auth__link'])} href={'/auth/signin'}>
          {t('button.btn05')}
        </Link>
      </p>
    </div>
  );
}

export default SignUp;
