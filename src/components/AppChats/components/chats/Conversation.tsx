'use client';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { Indicator, Loader } from '@mantine/core';
import EmojiPicker, { EmojiClickData, EmojiStyle, Theme } from 'emoji-picker-react';
import { useTranslations } from 'next-intl';
import { Form, Formik, FormikHelpers } from 'formik';
import { IconArrowLeft, IconMessage, IconMoodPlus, IconPhotoScan, IconSend, IconX } from '@tabler/icons-react';

import validationSchemaInfo from './schema';
import MessageItem from './MessageItem';
import styles from '../../scss/ChatMessage.module.scss';
import InputText from '@/share/InputText';
import useClickOutside from '@/hooks/useClickOutSide';
import { sendMessage } from '@/services/chatsServices';
import { MessageItemSkeleton } from '@/share/Skeleton';
import { getLocalStorageItem } from '@/utils/localStorage';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useSocketMessage } from '@/contexts/SocketMessageProvider';
import { addMessage, handleMobile } from '@/lib/features/chatsSlice';
import { ChatMessageForm, MessageItemInfo, SendMessageProps, UserInfo } from '@/types';

function Conversation() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { onlineUsers } = useSocketMessage();
  const user: UserInfo | null = getLocalStorageItem('user');
  const restaurant = useAppSelector((state) => state.chats.restaurant);
  const loading = useAppSelector((state) => state.chats.messagesLoading);
  const isSend = useAppSelector((state) => state.chats.messageLoading);
  const messages = useAppSelector((state) => state.chats.messages);
  const isOnline = useMemo(() => onlineUsers.some((user) => user._id === restaurant?._id), [onlineUsers, restaurant]);

  const [imagePreview, setImagePreview] = useState('');
  const [imageSelected, setImageSelected] = useState<File | null>(null);

  const boxRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const valuesRef = useRef<string | undefined>('');
  const setFieldValueRef = useRef<(field: string, value: string) => void>(null);
  const {
    elementRef: emojiRef,
    triggerRef: emojiIconRef,
    isVisible: showEmoji,
    setIsVisible: setShowEmoji,
  } = useClickOutside<HTMLDivElement, HTMLSpanElement>();

  const handleBack = () => dispatch(handleMobile(false));

  const handleClickPicture = () => fileInputRef.current?.click();
  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      setImageSelected(file);
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };

      try {
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error reading the file:', error);
      }
    }
  };

  const handleClosePreview = () => {
    setImagePreview('');
    setImageSelected(null);
  };

  const handleClickEmoji = (emoji: EmojiClickData) => {
    console.log(emoji);

    if (setFieldValueRef.current) {
      setFieldValueRef.current('message', `${valuesRef.current}${emoji.emoji}`);
    }
  };

  const handleSendMessage = (values: ChatMessageForm, resetForm: FormikHelpers<ChatMessageForm>['resetForm']) => {
    const data: SendMessageProps = {
      message: values?.message?.trim() || '',
      conversationID: restaurant._id,
      image: imageSelected || null,
    };
    dispatch(sendMessage(data)).then((result) => {
      if (result.payload?.code === 201) {
        resetForm();
        handleClosePreview();
      }
    });
  };

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTo({
        top: boxRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const { socket } = useSocketMessage();

  useEffect(() => {
    socket?.on('newMessage', async (newMessage) => {
      const sound = new Audio('/sounds/notification.mp3');
      newMessage.shouldShake = true;
      await sound.play();
      dispatch(addMessage(newMessage));
    });
    return () => {
      socket?.off('newMessage');
    };
  }, [socket, dispatch]);

  return (
    <div className={clsx(styles['conversation'])}>
      {!restaurant ? (
        <div className={clsx(styles['conversation__empty'])}>
          <h4>
            {t('chatMessage.desc02')} 🎉 {user?.fullname} ✨
          </h4>
          <p>{t('chatMessage.desc03')}</p>
          <span>
            <IconMessage />
          </span>
        </div>
      ) : (
        <>
          <div className={clsx(styles['conversation__heading'])}>
            <span onClick={handleBack} className={clsx(styles['conversation__heading-back'])}>
              <IconArrowLeft />
            </span>
            <Indicator color={'lime'} disabled={!isOnline} processing>
              <Image
                priority
                width={40}
                height={40}
                alt="Avatar"
                className={clsx(styles['conversation__heading-avatar'])}
                src={restaurant.avatar || '/images/logo.png'}
              />
            </Indicator>
            <div>
              <h4 className={clsx(styles['conversation__heading-name'])}>{restaurant.fullname}</h4>
              <span
                className={clsx(
                  styles['conversation__heading-status'],
                  !isOnline && styles['conversation__heading-status--off'],
                )}
              >
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>

          <div ref={boxRef} className={clsx(styles['conversation__content'])}>
            {loading && <MessageItemSkeleton />}

            {messages &&
              (messages || []).map((message: MessageItemInfo, index: number) => (
                <MessageItem data={message} key={index} />
              ))}

            {!loading && messages?.length === 0 && (
              <p className={clsx(styles['conversation__desc'])}>{t('chatMessage.desc06')}</p>
            )}
          </div>

          <div className={clsx(styles['conversation__actions'])}>
            <div className={clsx(styles['conversation__options'])}>
              <span onClick={handleClickPicture} className={clsx(styles['conversation__action'])}>
                <IconPhotoScan className={clsx(styles['conversation__action-icon'])} />
              </span>
              <span
                ref={emojiIconRef}
                onClick={() => setShowEmoji(!showEmoji)}
                className={clsx(styles['conversation__action'])}
              >
                <IconMoodPlus />
              </span>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleSelectImage}
                className={clsx(styles['conversation__action-input'])}
              />
              {imageSelected && (
                <div className={clsx(styles['conversation__preview'])}>
                  <Image
                    priority
                    width={100}
                    height={50}
                    src={imagePreview || '/images/default-img.png'}
                    alt="Select image"
                    className={clsx(styles['conversation__preview-img'])}
                  />
                  <span onClick={handleClosePreview} className={clsx(styles['conversation__preview-close'])}>
                    <IconX className={clsx(styles['conversation__preview-icon'])} />
                  </span>
                </div>
              )}

              {showEmoji && (
                <div ref={emojiRef} className={clsx(styles['conversation__emoji'])}>
                  <EmojiPicker
                    theme={Theme.AUTO}
                    searchDisabled
                    skinTonesDisabled
                    onEmojiClick={handleClickEmoji}
                    emojiStyle={EmojiStyle.APPLE}
                  />
                </div>
              )}
            </div>

            <Formik
              initialValues={{
                message: '',
              }}
              validationSchema={validationSchemaInfo()}
              onSubmit={(values: ChatMessageForm, { resetForm }) => {
                handleSendMessage(values, resetForm);
              }}
              validateOnChange={true}
              validateOnMount={true}
            >
              {({ setFieldValue, values }) => {
                setFieldValueRef.current = setFieldValue;
                valuesRef.current = values.message;

                return (
                  <Form>
                    <InputText
                      type="text"
                      name="message"
                      autoComplete="off"
                      className={clsx(styles['conversation__input'])}
                      placeholder={t('chatMessage.desc04')}
                      LeftIcon={!isSend ? <IconSend /> : <Loader size={25} />}
                    />
                  </Form>
                );
              }}
            </Formik>
          </div>
        </>
      )}
    </div>
  );
}

export default Conversation;
