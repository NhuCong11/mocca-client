'use client';
import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { Form, Formik, FormikHelpers } from 'formik';
import { Divider, Loader, Modal } from '@mantine/core';
import { IconChartBubbleFilled, IconSend, IconX } from '@tabler/icons-react';

import styles from '../scss/AppChats.module.scss';
import validationSchemaInfo from '../schema';
import InputText from '@/share/InputText';
import { chatBot } from '@/services/chatsServices';
import useSessionStorage from '@/hooks/useSessionStorage';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';

interface ChatbotForm {
  message: string;
}

interface MessageInfo {
  user: string;
  message: string;
}

const Chatbot = ({ closeModal, opened }: { closeModal: () => void; opened: boolean }) => {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { getItem, setItem } = useSessionStorage();
  const loading = useAppSelector((state) => state.chats.loading);
  const boxRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<MessageInfo[]>(() => getItem('chatMessages') || []);

  const fetchAPI = async (message: string) => {
    const result = await dispatch(chatBot(message));
    if (result.payload?.code === 200) {
      setMessages((prevMessages) => [...prevMessages, { user: 'Chatbot', message: result.payload.data }]);
    }
  };

  const handleSendMessage = async (values: ChatbotForm, resetForm: FormikHelpers<ChatbotForm>['resetForm']) => {
    if (!values.message.trim()) return;

    // Remove asterisk patterns (***) from message
    const cleanMessage = values.message.replace(/\*+/g, '');

    const newMessage = { user: 'User', message: cleanMessage };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    resetForm();
    await fetchAPI(cleanMessage);
  };

  useEffect(() => {
    if (messages.length) {
      setItem('chatMessages', messages);
    }
  }, [messages, setItem]);

  useEffect(() => {
    boxRef.current?.scrollTo({
      top: boxRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  useEffect(() => {
    if (!getItem('isFirst')) {
      const hours = new Date().getHours();
      const message =
        hours <= 12 ? t('chatBot.greeting01') : hours <= 18 ? t('chatBot.greeting02') : t('chatBot.greeting03');

      fetchAPI(message);
      setItem('isFirst', true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      centered
      padding="xl"
      fullScreen
      radius={0}
      zIndex={9999}
      opened={opened}
      onClose={closeModal}
      closeButtonProps={{ icon: <IconX />, size: 'xl' }}
      title={
        <h4 className={clsx(styles['chatbot__title'])}>
          {t('chatBot.title01')}
          <IconChartBubbleFilled color="var(--primary-bg)" />
        </h4>
      }
      className={clsx(styles['chatbot'])}
    >
      <Divider variant="dashed" color="gray" />
      <div className={clsx(styles['chatbot__messages'])} ref={boxRef}>
        {messages.map((msg, index) => (
          <p
            key={index}
            className={clsx(
              styles['chatbot__message'],
              msg.user === 'User' ? styles['chatbot__message--user'] : styles['chatbot__message--chatbot'],
            )}
          >
            {msg.message}
          </p>
        ))}
        {loading && (
          <div className={clsx(styles['chatbot__message-loading'])}>
            <Loader color="var(--primary-bg)" type="dots" />
          </div>
        )}
      </div>
      <Divider variant="dashed" color="gray" />

      <Formik
        initialValues={{ message: '' }}
        validationSchema={validationSchemaInfo()}
        onSubmit={(values, { resetForm }) => handleSendMessage(values, resetForm)}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className={clsx(styles['chatbot__form'])}>
              <InputText
                type="text"
                name="message"
                LeftIcon={<IconSend />}
                autoComplete="off"
                placeholder={t('chatBot.desc01')}
                disabled={loading || isSubmitting}
                readOnly={loading || isSubmitting}
              />
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default Chatbot;
