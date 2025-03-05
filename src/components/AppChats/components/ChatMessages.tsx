'use client';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { Divider, Modal } from '@mantine/core';
import { IconBrandWechat, IconX } from '@tabler/icons-react';

import Sidebar from './chats/Sidebar';
import Conversation from './chats/Conversation';
import styles from '../scss/AppChats.module.scss';
import { useAppSelector } from '@/lib/hooks';

const ChatMessages = ({ closeModal, opened }: { closeModal: () => void; opened: boolean }) => {
  const t = useTranslations();
  const isMobile = useAppSelector((state) => state.chats.isMobile);

  return (
    <Modal
      centered
      padding="xl"
      fullScreen
      radius={0}
      zIndex={999}
      opened={opened}
      onClose={closeModal}
      closeButtonProps={{
        icon: <IconX />,
        size: 'xl',
      }}
      title={
        <h4 className={clsx(styles['chat-message__title'])}>
          {t('chatMessage.title01')}
          <IconBrandWechat size={25} color="var(--primary-bg)" />
        </h4>
      }
      className={clsx(styles['chat-message'])}
    >
      <Divider pb={20} variant="dashed" color="gray" />
      <div className={clsx(styles['chats__message-container'], 'row')}>
        <div className={clsx('col-12 col-md-4', isMobile && 'd-none d-md-block')}>
          <Sidebar />
        </div>
        <div className={clsx('col-12 col-md-8', !isMobile && 'd-none d-md-block')}>
          <Conversation />
        </div>
      </div>
    </Modal>
  );
};

export default ChatMessages;
