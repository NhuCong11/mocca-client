import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { IconRotateClockwise2, IconZoomIn, IconZoomOut } from '@tabler/icons-react';

import styles from '../../scss/ChatMessage.module.scss';
import { useAppSelector } from '@/lib/hooks';
import { MessageItemInfo, UserInfo } from '@/types';
import { getLocalStorageItem } from '@/utils/localStorage';

function MessageItem({ data }: { data: MessageItemInfo }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const restaurant = useAppSelector((state) => state.chats.restaurant);

  const fromMe = data.senderId === user?._id;
  const createdAt = useMemo(() => new Date(data.createdAt), [data.createdAt]);
  const formattedTime = useMemo(() => {
    const hours = createdAt.getHours().toString().padStart(2, '0');
    const minute = createdAt.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minute} ${createdAt.getDate()}/${createdAt.getMonth() + 1}/${createdAt.getFullYear()}`;
  }, [createdAt]);

  useEffect(() => {
    setUser(getLocalStorageItem('user'));
  }, []);

  return (
    <div className={clsx(styles['message'], fromMe && 'message--me')}>
      <div className={clsx(styles['message__info'], fromMe && styles['message__info--me'])}>
        <Image
          priority
          width={40}
          height={40}
          alt="Avatar Shop"
          className={clsx(styles['message__avatar'])}
          src={fromMe ? user?.avatar : restaurant?.avatar || '/images/logo.png'}
        />

        <div
          className={clsx(
            styles['message__content'],
            fromMe && styles['message__content--me'],
            data.image && styles['message__content--img'],
          )}
        >
          {data.message && <p>{data.message}</p>}
          {data.image && (
            <PhotoProvider
              speed={() => 800}
              toolbarRender={({ scale, onScale, rotate, onRotate }) => (
                <div className={clsx(styles['message__img-actions'])}>
                  <span className={clsx(styles['message__img-action'])} onClick={() => onRotate(rotate + 90)}>
                    <IconRotateClockwise2 />
                  </span>
                  <span className={clsx(styles['message__img-action'])} onClick={() => onScale(scale + 0.2)}>
                    <IconZoomIn />
                  </span>
                  <span
                    onClick={() => onScale(scale - 0.2)}
                    className={clsx(
                      styles['message__img-action'],
                      scale === 1 && styles['message__img-action--hidden'],
                    )}
                  >
                    <IconZoomOut />
                  </span>
                </div>
              )}
            >
              <PhotoView src={data.image}>
                <Image
                  priority
                  alt="Image"
                  width={384}
                  height={282}
                  src={data.image || '/images/default-img.png'}
                  className={clsx(styles['message__img'], fromMe && styles['message__img--me'])}
                />
              </PhotoView>
            </PhotoProvider>
          )}
        </div>
      </div>
      <span className={clsx(styles['message__time'], fromMe && styles['message__time--me'])}>{formattedTime}</span>
    </div>
  );
}

export default MessageItem;
