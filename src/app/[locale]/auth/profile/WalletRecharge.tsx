'use client';
import Image from 'next/image';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { CopyButton } from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons-react';

import styles from './Profile.module.scss';
import { MOCCA } from '@/constants';
import { UserInfo } from '@/types';
import { showToast, ToastType } from '@/utils/toastUtils';
import { bankDetails, LIST_CHAR, notes, QR_URL } from './constant';
import { useSocketWallet } from '@/utils/socketUtils';

function WalletRecharge({ userInfo }: { userInfo: UserInfo }) {
  const t = useTranslations();
  useSocketWallet(String(userInfo?._id));

  return (
    <div className={clsx(styles['wallet'])}>
      <h4 className={clsx(styles['wallet__title'])}>{t('topUp.title01')}</h4>

      <div className={clsx(styles['wallet__transfer'])}>
        <CopyButton value={`${userInfo?.username}`} timeout={3000}>
          {({ copied, copy }) => (
            <>
              <p
                title="Copy"
                className={clsx(styles['wallet__transfer-value'])}
                onClick={() => {
                  copy();
                  showToast(t('authTwinSetup.toast.copySuccess'), ToastType.SUCCESS);
                }}
              >
                {userInfo?.username}
                {copied ? (
                  <IconCheck size={24} color="var(--primary-bg)" />
                ) : (
                  <IconCopy size={24} color="var(--primary-bg)" />
                )}
              </p>
            </>
          )}
        </CopyButton>
      </div>

      <div className={clsx(styles['wallet__bank'])}>
        <Image
          priority
          width={200}
          height={200}
          alt="TPbank"
          src={'/images/vpBankLogo.png'}
          className={clsx(styles['wallet__bank-img'])}
        />
      </div>

      <div className={clsx(styles['wallet__qr'])}>
        <div className={clsx(styles['wallet__qr-info'])}>
          {bankDetails.map((detail, index) => (
            <div key={index} className={clsx(styles['wallet__qr-row'])}>
              <span className={clsx(styles['wallet__qr-label'])}>{t(detail.label)}</span>
              <span className={clsx(styles['wallet__qr-value'], detail.extraClass && styles[detail.extraClass])}>
                {detail.value}
              </span>
            </div>
          ))}

          <div className={clsx(styles['wallet__qr-img'])}>
            <Image priority width={256} height={256} alt={MOCCA} src={`${QR_URL}${userInfo?.username}`} />
          </div>
        </div>
      </div>

      <div className={clsx(styles['wallet__note'])}>
        <h4 className={clsx(styles['wallet__note-label'])}>{t('topUp.title06')}</h4>
        {notes.map((note, index) => (
          <div key={index} className={clsx(styles['wallet__note-desc'])}>
            <span>{LIST_CHAR}</span>
            {note.link ? (
              <p>
                {t(note.desc)}
                <a className={clsx(styles['wallet__note-link'])} href={note.link} target="_blank">
                  {` ${t(note.linkText)} `}
                </a>
                {t(note.rightDesc)}
              </p>
            ) : (
              <p>{t(note.desc)}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
export default WalletRecharge;
