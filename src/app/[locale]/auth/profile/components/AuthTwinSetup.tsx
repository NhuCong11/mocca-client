import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { ActionIcon, CopyButton } from '@mantine/core';
import { IconCheck, IconCopy, IconPower, IconRefresh } from '@tabler/icons-react';

import styles from '../scss/Profile.module.scss';
import { authTwinSetupDesc, authTwinSetupNotes, formatSecretKey } from '../constant';
import { UserInfo } from '@/types';
import Button from '@/share/Button';
import { generateQRCodeImage } from '@/utils/constants';
import { showToast, ToastType } from '@/utils/toastUtils';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { getSecretKey, toggle2FA, updateSecretKey } from '@/services/authServices';
import { getLocalStorageItem, addOrUpdateFieldInLocalStorage } from '@/utils/localStorage';

function AuthTwinSetup() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const reduxData = useAppSelector((state) => state.auth);
  const userInfo: UserInfo | null = getLocalStorageItem('user');

  const [qrImg, setQrImg] = useState<string>('');
  const [otpValue, setOtpValue] = useState<string>('');
  const [secretKey, setSecretKey] = useState<string>('');
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const [isUseAuthTwin, setIsUseAuthTwin] = useState<boolean>();
  const [tempSecretKey, setTempSecretKey] = useState<string>('');
  const formattedSecret = useMemo(
    () => formatSecretKey(tempSecretKey ? tempSecretKey : secretKey),
    [secretKey, tempSecretKey],
  );

  const handleRefreshSecretKey = () => {
    if (isRefresh === false) {
      setIsRefresh(true);
    }
    const refreshSecretKeyPromise = dispatch(getSecretKey()).then((result) => {
      if (result?.payload?.code === 200) {
        setTempSecretKey(result.payload?.data?.secret);
        setSecretKey(result.payload?.data?.secret);
        setQrImg(generateQRCodeImage(userInfo?.email, result.payload?.data?.secret));
        return result.payload?.message;
      } else {
        throw new Error(result?.payload?.message || t('system.error'));
      }
    });
    showToast('', ToastType.PROMISE, refreshSecretKeyPromise);
  };

  const handleToggle2FA = () => {
    if (!isUseAuthTwin && !isUpdate) {
      showToast(t('authTwinSetup.toast.invalidOtp'), ToastType.ERROR);
      return;
    }
    const toggle2FAPromise = dispatch(toggle2FA(isUseAuthTwin ? {} : { code: otpValue })).then((result) => {
      if (result?.payload?.code === 200) {
        setOtpValue('');
        setIsUseAuthTwin(!isUseAuthTwin);
        addOrUpdateFieldInLocalStorage('user', 'is2FA', result.payload.data.is2FA);
        return result.payload.message;
      } else {
        setOtpValue('');
        throw new Error(result?.payload?.message || t('system.error'));
      }
    });
    setIsUpdate(false);
    showToast('', ToastType.PROMISE, toggle2FAPromise);
  };

  const handleUpdateSecretKey = () => {
    if (isUpdate && tempSecretKey) {
      const updateSecretKeyPromise = dispatch(updateSecretKey({ code: otpValue, secret: tempSecretKey })).then(
        (result) => {
          if (result?.payload?.code === 200) {
            setIsUpdate(false);
            setIsRefresh(false);
            addOrUpdateFieldInLocalStorage('user', 'secret', result.payload.data.secret);
            return result.payload.message;
          } else {
            throw new Error(result?.payload?.message || t('system.error'));
          }
        },
      );
      showToast('', ToastType.PROMISE, updateSecretKeyPromise);
    } else {
      showToast(t('authTwinSetup.toast.invalidOtp'), ToastType.ERROR);
    }
    setOtpValue('');
  };

  const validateOtpInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target?.value;
    if (/^\d*$/.test(value) && value.length < 7) {
      setOtpValue(value);
      setIsUpdate(false);
    }
    if (value.length === 6) {
      setIsUpdate(true);
    }
  };

  const secretKeyDisplay = (
    <div className={clsx(styles['auth-twin__secret-value'])}>
      <div className={clsx(styles['auth-twin__secret-text'])}>
        {formattedSecret}
        <CopyButton value={formattedSecret}>
          {({ copied, copy }) => (
            <ActionIcon
              size={60}
              color={copied ? 'teal' : 'gray'}
              variant="subtle"
              onClick={() => {
                copy();
                showToast(t('authTwinSetup.toast.copySuccess'), ToastType.SUCCESS);
              }}
            >
              {copied ? <IconCheck size={20} /> : <IconCopy size={20} />}
            </ActionIcon>
          )}
        </CopyButton>
      </div>
      <Button
        outline
        leftIcon={<IconRefresh size={20} />}
        disabled={reduxData.loading}
        onClick={handleRefreshSecretKey}
      >
        {t('button.btn23')}
      </Button>
    </div>
  );

  useEffect(() => {
    setIsUseAuthTwin(userInfo?.is2FA);
  }, [userInfo]);

  useEffect(() => {
    if (isRefresh) {
      setQrImg(generateQRCodeImage(userInfo?.email, secretKey));
    }
  }, [secretKey, isRefresh, userInfo?.email]);

  return (
    <div className={clsx(styles['auth-twin'])}>
      <h4 className={clsx(styles['auth-twin__title'])}>{t('authTwinSetup.title01')}</h4>
      <div className={clsx(styles['auth-twin__first'])}>
        {authTwinSetupDesc.map((item, index) => (
          <p key={index} className={clsx(styles['auth-twin__first-desc'])}>
            <IconCheck size={14} color="var(--primary-color)" />
            {t(item.desc)}
            {item.link &&
              item.link.map((url, i) => (
                <>
                  <a key={i} target="blank" href={url}>
                    <strong className={clsx(styles['auth-twin__strong'])}>{item.linkText?.[i]}</strong>
                  </a>
                  {i !== item.link.length - 1 && '-'}
                </>
              ))}
          </p>
        ))}
      </div>

      <div className={clsx(styles['auth-twin__security'])}>
        <h4 className={clsx(styles['auth-twin__security-title'])}>{t('authTwinSetup.title02')}</h4>
        <div className={clsx(styles['auth-twin__security-options'])}>
          <p className={clsx(styles['auth-twin__security-option'])}>
            {!isUseAuthTwin ? t('authTwinSetup.method01') : t('authTwinSetup.method02')}
          </p>
        </div>
      </div>

      <div className={clsx(styles['auth-twin__secret'])}>
        <div className={clsx(styles['auth-twin__secret-first'])}>
          <div className={clsx(styles['auth-twin__secret-content'])}>
            <p className={clsx(styles['auth-twin__secret-desc'])}>{t('authTwinSetup.desc04')}</p>
            <p className={clsx(styles['auth-twin__secret-label'])}>{t('authTwinSetup.secretKey')}</p>
            {secretKeyDisplay}
          </div>

          <Image
            priority
            width={200}
            height={200}
            alt="QR Code"
            className={clsx(styles['auth-twin__secret-qr'])}
            src={qrImg || '/images/logo.png'}
          />
        </div>

        <div className={clsx(styles['auth-twin__otp'])}>
          <h4 className={clsx(styles['auth-twin__otp-title'])}>{t('authTwinSetup.title03')}</h4>
          <input
            className={clsx(styles['auth-twin__otp-input'], { isDisabled: reduxData.loading })}
            placeholder="XXXXXX"
            value={otpValue}
            onChange={(e) => {
              validateOtpInput(e);
            }}
          />
          <p className={clsx(styles['auth-twin__otp-desc'])}> {t('authTwinSetup.otpNote')}</p>
        </div>

        <div className={clsx(styles['auth-twin__otp-btns'])}>
          <Button
            cancel={isUseAuthTwin}
            primary={!isUseAuthTwin}
            leftIcon={<IconPower size={20} />}
            disabled={(isRefresh && !isUseAuthTwin) || reduxData.loading}
            onClick={handleToggle2FA}
          >
            {isUseAuthTwin ? t('button.btn24') : t('button.btn25')}
          </Button>

          <Button
            primary
            leftIcon={<IconCheck size={20} />}
            disabled={!isRefresh || reduxData.loading}
            onClick={handleUpdateSecretKey}
          >
            {t('button.btn26')}
          </Button>
        </div>

        <div className={clsx(styles['auth-twin__note'])}>
          <h4 className={clsx(styles['auth-twin__note-title'])}>{t('authTwinSetup.title04')}</h4>
          {authTwinSetupNotes?.map((item, index) => (
            <p key={index} className={clsx(styles['auth-twin__note-desc'])}>
              {`${index + 1}. ${t(item.note)}`}
              {item.strong && <strong className={clsx(styles['auth-twin__strong'])}>{item.strong}</strong>}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
export default AuthTwinSetup;
