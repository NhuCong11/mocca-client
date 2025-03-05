import React, { useEffect } from 'react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useDisclosure } from '@mantine/hooks';
import { IconBrandMessenger, IconMessageChatbot } from '@tabler/icons-react';

import styles from './scss/AppChats.module.scss';
import { getLocalStorageItem } from '@/utils/localStorage';
import { useRouter } from '@/i18n/routing';
import { showToast, ToastType } from '@/utils/toastUtils';
import Chatbot from './components/Chatbot';
import ChatMessages from './components/ChatMessages';

function AppChats() {
  const t = useTranslations();
  const router = useRouter();

  const [openedChatBot, { open: openChatBot, close: closeChatBot }] = useDisclosure(false);
  const [openedChatMessage, { open: openChatMessage, close: closeChatMessage }] = useDisclosure(false);

  const handleOpenModal = (type: 'chat-bot' | 'chat-message') => {
    const authUser = getLocalStorageItem('user');
    if (!authUser) {
      showToast(t('errors.err12'), ToastType.WARNING);
      return router.push('/auth/signin');
    }
    if (type === 'chat-bot') {
      openChatBot();
    } else {
      openChatMessage();
    }
  };

  useEffect(() => {
    if (openedChatBot || openedChatMessage) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = 'auto';
    }

    return () => {
      document.documentElement.style.overflow = 'auto';
    };
  }, [openedChatBot, openedChatMessage]);

  return (
    <div data-aos="fade-up-left" className={clsx(styles['chats'])}>
      <div className={clsx(styles['chats__bot'])} onClick={() => handleOpenModal('chat-bot')}>
        <IconMessageChatbot size={30} />
      </div>
      <Chatbot opened={openedChatBot} closeModal={closeChatBot} />

      <div className={clsx(styles['chats__bot'])} onClick={() => handleOpenModal('chat-message')}>
        <IconBrandMessenger size={30} />
      </div>
      <ChatMessages opened={openedChatMessage} closeModal={closeChatMessage} />
    </div>
  );
}

export default AppChats;
