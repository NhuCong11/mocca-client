'use client';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Indicator, Loader } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { Form, Formik, FormikHelpers } from 'formik';

import validationSchemaInfo from './schema';
import styles from '../../scss/ChatMessage.module.scss';
import InputText from '@/share/InputText';
import { getRandomEmoji } from '@/utils/constants';
import { showToast, ToastType } from '@/utils/toastUtils';
import { getLocalStorageItem } from '@/utils/localStorage';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { ChatMessageForm, GetMessagesProps, RestaurantInfo, UserInfo } from '@/types';
import { useSocketMessage } from '@/contexts/SocketMessageProvider';
import { useChatMessageContext } from '@/contexts/ChatMessageProvider';
import { getConversations, getMessages } from '@/services/chatsServices';
import { handleMobile, saveRestaurant } from '@/lib/features/chatsSlice';

function Sidebar() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { onlineUsers } = useSocketMessage();
  const { newConversation } = useChatMessageContext();
  const user: UserInfo | null = getLocalStorageItem('user');
  const loading = useAppSelector((state) => state.chats.loading);
  const restaurant = useAppSelector((state) => state.chats.restaurant);

  const [conversations, setConversations] = useState<RestaurantInfo[]>([]);
  const [conversationSelected, setConversationSelected] = useState<RestaurantInfo>();

  const handleClickConversation = useCallback(
    (conversation: RestaurantInfo) => {
      setConversationSelected(conversation);
      dispatch(saveRestaurant(conversation));
      dispatch(getMessages({ userID: user?._id, conversationID: conversation?._id } as GetMessagesProps));
      if (window.innerWidth < 768) {
        dispatch(handleMobile(true));
      }
    },
    [dispatch, user],
  );

  const handleSearch = useCallback(
    (values: ChatMessageForm, resetForm: FormikHelpers<ChatMessageForm>['resetForm']) => {
      const searchConversation = conversations.find((conversation: RestaurantInfo) => {
        if (conversation?.fullname && values.shop) {
          return conversation?.fullname.toLowerCase().includes(values.shop.toLowerCase());
        }
      });

      if (searchConversation) {
        handleClickConversation(searchConversation);
      } else {
        showToast(t('chatMessage.notify01'), ToastType.WARNING);
      }
      resetForm();
    },
    [handleClickConversation, t, conversations],
  );

  const renderedConversations = useMemo(
    () =>
      conversations.map((conversation) => {
        const isOnline = onlineUsers.some((user) => user._id === conversation._id);
        const isActive = conversation._id === conversationSelected?._id || conversation._id === restaurant?._id;

        return (
          <div
            key={conversation._id}
            onClick={() => handleClickConversation(conversation)}
            className={clsx(styles['sidebar__item'], isActive && styles['sidebar__item--active'])}
          >
            <Indicator color="lime" disabled={!isOnline} processing>
              <Image
                priority
                width={40}
                height={40}
                alt="Shop Avatar"
                className={clsx(styles['sidebar__item-avatar'])}
                src={conversation.avatar || '/images/logo.png'}
              />
            </Indicator>
            <div className={clsx(styles['sidebar__item-info'])}>
              <h4 className={clsx(styles['sidebar__item-name'])}>{conversation.fullname}</h4>
              <span>{getRandomEmoji()}</span>
            </div>
          </div>
        );
      }),
    [conversations, onlineUsers, conversationSelected, restaurant, handleClickConversation],
  );

  useEffect(() => {
    if (newConversation && user?._id) {
      setConversations((prevConversations) => {
        const isExist =
          newConversation._id === user._id ||
          prevConversations.some((conversation) => conversation._id === newConversation._id);

        if (!isExist) {
          return [newConversation, ...prevConversations];
        }
        return prevConversations;
      });
    }
  }, [newConversation, user]);

  useEffect(() => {
    if (user?._id) {
      dispatch(getConversations(user?._id)).then((result) => {
        if (result.payload?.code === 200) {
          setConversations(result.payload?.data);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={clsx(styles['sidebar'])}>
      <Formik
        initialValues={{
          shop: '',
        }}
        validationSchema={validationSchemaInfo()}
        onSubmit={(values: ChatMessageForm, { resetForm }) => {
          handleSearch(values, resetForm);
        }}
        validateOnChange={true}
        validateOnMount={true}
      >
        <Form>
          <InputText
            type="text"
            name="shop"
            autoComplete="off"
            className={clsx(styles['sidebar__input'])}
            placeholder={t('chatMessage.desc05')}
          />
        </Form>
      </Formik>

      {loading && (
        <div className={clsx(styles['sidebar__loading'])}>
          <Loader size={50} color="var(--primary-bg)" />
        </div>
      )}

      <div className={clsx(styles['sidebar__list'])}>{renderedConversations}</div>
    </div>
  );
}

export default Sidebar;
