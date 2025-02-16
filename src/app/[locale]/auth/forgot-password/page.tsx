'use client';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Formik, Form } from 'formik';
import { useTranslations } from 'next-intl';

import styles from '../layout.module.scss';
import validationSchema from './schema';
import Button from '@/share/Button';
import { Link, useRouter } from '@/i18n/routing';
import { fonts } from '@/styles/fonts';
import InputText from '@/share/InputText';
import { IconMail, IconRefresh } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { forgotPassword, getCaptcha } from '@/services/authServices';
import useSessionStorage from '@/hooks/useSessionStorage';
import { showToast, ToastType } from '@/utils/toastUtils';

export interface ForgotPasswordInfo {
  email: string;
  text: string;
  sign: string | undefined;
}

interface CaptchaData {
  image: string;
  sign: string;
}

const SvgComponent = ({ data }: { data: CaptchaData }) => {
  const svgString = data?.image;
  if (!svgString) return null;
  const newWidth = '120';
  const newHeight = '100%';
  const updatedSvgString = svgString
    .replace(/width="[^"]*"/, `width="${newWidth}"`)
    .replace(/height="[^"]*"/, `height="${newHeight}"`);

  return <div dangerouslySetInnerHTML={{ __html: updatedSvgString }} />;
};

function ForgotPassword() {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { setItem } = useSessionStorage();
  const loading = useAppSelector((state) => state.auth.loading);

  const [captcha, setCaptcha] = useState<CaptchaData | null>(null);
  const [loadingCaptcha, setLoadingCaptcha] = useState(false);

  const counter = useRef(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchCaptcha = async () => {
    const getCaptchaPromise = dispatch(getCaptcha())
      .then((result) => {
        if (result?.payload.code === 201) {
          setCaptcha(result?.payload.data);
          setItem('signature', result?.payload.data.sign);
          return result?.payload.message;
        } else {
          throw new Error(result?.payload.message || t('system.error'));
        }
      })
      .catch((err) => {
        throw new Error(err?.message || t('system.error'));
      });
    showToast('', ToastType.PROMISE, getCaptchaPromise);
  };

  const handleReloadCaptcha = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoadingCaptcha(true);
    counter.current = Date.now();
    try {
      await fetchCaptcha();
    } catch (err) {
      showToast(String(err), ToastType.ERROR);
    } finally {
      setLoadingCaptcha(false);
    }
  };

  const handleForgotPassword = async (values: ForgotPasswordInfo) => {
    const data: ForgotPasswordInfo = {
      email: values?.email,
      text: values?.text,
      sign: captcha?.sign,
    };
    const forgotPasswordPromise = dispatch(forgotPassword(data))
      .then((result) => {
        if (result?.payload.code === 200) {
          setItem('tokenForgot', result?.payload.data.tokenForgot);
          router.push('/auth/verify-otp');
        } else if (result?.payload.code === 400) {
          fetchCaptcha();
          throw new Error(result?.payload.message || t('system.error'));
        }
      })
      .catch((err) => {
        throw new Error(err?.message || t('system.error'));
      });
    showToast('', ToastType.PROMISE, forgotPasswordPromise);
  };

  useEffect(() => {
    fetchCaptcha();
    const interval = 2 * 60 * 1000;
    timerRef.current = setInterval(async () => {
      const latestCounter = counter.current;
      if (Date.now() - latestCounter >= interval) {
        fetchCaptcha();
        counter.current = Date.now();
      }
    }, 1000);

    return () => {
      clearInterval(timerRef.current!);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={clsx(styles['auth'], fonts.inter)}>
      <h1 className={clsx(styles['auth__heading'])}>{t('forgot-password.heading')}</h1>
      <p className={clsx(styles['auth__desc'], fonts.lora)}>{t('forgot-password.desc01')}</p>

      <Formik
        initialValues={{ email: '', text: '' } as ForgotPasswordInfo}
        validationSchema={validationSchema(t)}
        onSubmit={(values: ForgotPasswordInfo) => {
          handleForgotPassword(values);
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
                readOnly={loading}
              />

              <div className={clsx(styles['captcha'])}>
                <InputText
                  label="Captcha"
                  name="text"
                  type="text"
                  placeholder="Captcha"
                  className={clsx(styles['captcha__input'])}
                  readOnly={loading}
                  autoComplete="off"
                />

                <div className={clsx(styles['captcha__img'])}>
                  {!loadingCaptcha && <SvgComponent data={captcha as CaptchaData} />}
                </div>

                <button type="button" className={clsx(styles['captcha__icon'])} onClick={(e) => handleReloadCaptcha(e)}>
                  <IconRefresh />
                </button>
              </div>

              <div
                style={!isValid || !dirty || loading ? { cursor: 'no-drop' } : {}}
                className={clsx(styles['form__group'], styles['auth__btn-group'])}
              >
                <Button type="submit" disabled={!isValid || !dirty || loading} primary auth>
                  {t('button.btn08')}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>

      <p className={clsx(styles['auth__footer'])}>
        {t('forgot-password.desc02')}
        <Link className={clsx(styles['auth__link'])} href={'/auth/signin'}>
          {t('button.btn05')}
        </Link>
      </p>
    </div>
  );
}

export default ForgotPassword;
