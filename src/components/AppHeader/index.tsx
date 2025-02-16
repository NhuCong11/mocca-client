'use client';
import Image, { StaticImageData } from 'next/image';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { removeCookie } from 'typescript-cookie';
import { useLocale, useTranslations } from 'next-intl';
import { IconCaretDownFilled, IconShoppingCart } from '@tabler/icons-react';

import styles from './AppHeader.module.scss';
import { getUserOptions } from './constant';
import Button from '@/share/Button';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { fonts } from '@/styles/fonts';
import LoadingStart from '@/share/Loading';
import { Locale, locales } from '@/i18n/config';
import useClickOutside from '@/hooks/useClickOutSide';
import { showToast, ToastType } from '@/utils/toastUtils';
import { logout } from '@/lib/features/authSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { getLocalStorageItem } from '@/utils/localStorage';
import { UserInfo } from '@/types';

function AppHeader() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isAuth = useAppSelector((state) => state?.auth?.isLogin);
  const userInfo: UserInfo | null = getLocalStorageItem('user');
  const token = JSON.parse(String(getLocalStorageItem('accessToken')));

  const [isLogin, setIsLogin] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [avatar, setAvatar] = useState<string | StaticImageData>(userInfo?.avatar ? userInfo.avatar : '');

  const headerRef = useRef<HTMLDivElement | null>(null);

  const {
    elementRef: languagesRef,
    triggerRef: languageBtnRef,
    isVisible: showLanguages,
    setIsVisible: setShowLanguages,
  } = useClickOutside<HTMLUListElement, HTMLDivElement>();

  const {
    elementRef: userOptionsRef,
    triggerRef: avatarRef,
    isVisible: showUserOptions,
    setIsVisible: setShowUserOptions,
  } = useClickOutside<HTMLUListElement, HTMLImageElement>();

  const handleCloseCart = () => {
    if (showCart) {
      setShowCart(false);
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    removeCookie('accessToken', { path: '/' });
    setShowUserOptions(false);
    showToast(t('login.notify02'), ToastType.SUCCESS);
    dispatch(logout());
  };

  const handleLanguageChange = (lang: Locale) => {
    const newPath = [`${lang}`].join('/');
    router.replace(newPath);
    setShowLanguages(false);
  };

  const handleViewLang = (lang: Locale) => {
    return locales
      .map((locale) => ({ name: locale, img: `/images/languages/${locale}.png` }))
      .find((item) => item.name === lang);
  };

  const userOptions = getUserOptions(setShowCart, setShowUserOptions, handleLogOut);

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    const onScroll = () => {
      if (window.innerWidth >= 768 && headerRef.current) {
        if (window.scrollY > 0) {
          headerRef.current.style.backgroundColor = '#181818';
          headerRef.current.style.boxShadow = '-1px 0px 2px 0px var(--header-shadow)';
        } else {
          headerRef.current.style.boxShadow = '0 1px 1px transparent';
          if (!['/'].includes(pathname)) {
            headerRef.current.style.backgroundColor = '#181818';
          } else {
            headerRef.current.style.backgroundColor = 'transparent';
          }
        }
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [pathname]);

  useEffect(() => {
    if (headerRef.current) {
      if (!['/'].includes(pathname)) {
        headerRef.current.style.backgroundColor = '#181818';
      } else {
        headerRef.current.style.backgroundColor = 'transparent';
      }
    }
  }, [pathname]);

  useEffect(() => {
    const disableScroll = (event: Event) => {
      event.preventDefault();
    };

    if (showCart) {
      window.addEventListener('wheel', disableScroll, { passive: false });
      document.documentElement.style.overflow = 'hidden';
    } else {
      window.removeEventListener('wheel', disableScroll, { passive: false } as AddEventListenerOptions);
      document.documentElement.style.overflow = 'auto';
    }

    return () => {
      window.removeEventListener('wheel', disableScroll, { passive: false } as AddEventListenerOptions);
      document.documentElement.style.overflow = 'auto';
    };
  }, [showCart]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isAuth || token) {
        setIsLogin(true);
        setAvatar(userInfo?.avatar ? userInfo.avatar : '/images/logo.png');
      } else {
        setIsLogin(false);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth]);

  return (
    <div ref={headerRef} className={clsx(styles['wrapper'])}>
      <div className={clsx('container gx-5')}>
        <div className={clsx(styles['header'])}>
          {/* Logo */}
          <Link
            href={'/'}
            onClick={(e) => {
              if (typeof window !== 'undefined') {
                if (pathname === '/') e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <Image
              width={210}
              height={65}
              src={'/images/logo-vip1.png'}
              priority
              alt="logo"
              className={clsx(styles['header__logo'])}
            />
          </Link>

          {/* Actions */}
          <nav className={clsx(styles['header__actions'])}>
            {pathname !== '/checkout' && pathname !== '/payment' && (
              <div
                onClick={() => setShowCart(!showCart)}
                className={clsx(styles['header__actions-group'], styles['header__actions-cart'])}
              >
                <Button haveProducts action outline leftIcon={<IconShoppingCart width={22} height={22} />}>
                  {`${(0).toLocaleString('vi-VN')} ₫`}
                </Button>
                {true && <span className={clsx(styles['header__actions-quantity'])}>{0}</span>}
              </div>
            )}
            {!isLogin && (
              <div className={clsx(styles['header__actions-group'])}>
                <Link href={'/auth/signin'}>
                  <Button tabletLaptop action outline>
                    {t('header.na02')}
                  </Button>
                  <Button mobile action outline>
                    {t('button.btn05')}
                  </Button>
                </Link>
              </div>
            )}
            {isLogin && (
              <div className={clsx(styles['header__actions-group'])}>
                <Image
                  priority
                  width={42}
                  height={42}
                  alt="Avatar"
                  src={avatar}
                  ref={avatarRef}
                  onClick={() => setShowUserOptions(!showUserOptions)}
                  className={clsx(
                    styles['header__actions-avatar'],
                    showUserOptions && styles['header__actions-avatar--open'],
                  )}
                />
                <ul
                  ref={userOptionsRef}
                  className={clsx(
                    styles['header__user-options'],
                    showUserOptions && styles['header__user-options--show'],
                  )}
                >
                  {userOptions?.map((option, index) => {
                    const Icon = option?.Icon;
                    return (
                      <li
                        key={index}
                        className={clsx(
                          styles['header__user-option'],
                          fonts.inter,
                          option?.onClick && 'header__user-option--md',
                        )}
                        onClick={option?.onClick}
                      >
                        {option.href ? (
                          <Link href={option?.href ?? ''}>{t(option?.label)}</Link>
                        ) : (
                          <p>{t(option?.label)}</p>
                        )}
                        <Icon width={22} height={22} />
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            <div
              className={clsx(styles['header__actions-group'])}
              ref={languageBtnRef}
              onClick={() => setShowLanguages(!showLanguages)}
            >
              <Button
                action
                outline
                rightIcon={
                  <IconCaretDownFilled
                    className={clsx(
                      styles['header__language-arrow'],
                      showLanguages && styles['header__language-arrow--open'],
                    )}
                    width={16}
                    height={16}
                  />
                }
              >
                {locale.toUpperCase()}
              </Button>
            </div>

            {/* Language options */}
            <ul
              ref={languagesRef}
              className={clsx(styles['header__languages'], showLanguages && styles['header__languages--show'])}
            >
              {locales.map((locale) => {
                const lang = handleViewLang(locale);
                return (
                  <li
                    key={locale}
                    onClick={() => handleLanguageChange(locale)}
                    className={clsx(styles['header__language'], fonts.inter)}
                  >
                    <p>{t(`languages.${lang?.name ?? 'vi'}`)}</p>
                    <Image
                      priority
                      width={30}
                      height={30}
                      alt={locale}
                      className={clsx(styles['header__language-img'])}
                      src={lang?.img || '/images/languages/vi.png'}
                    />
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
        {/* <Cart showCart={showCart} handleCloseCart={handleCloseCart} data={cartsData as CartsInfo} /> */}
      </div>
      {/* Overlay */}
      {showCart && <div onClick={handleCloseCart} className={clsx('overlay', showCart && 'overlay--show')}></div>}
      {false && !showCart && <LoadingStart />}
    </div>
  );
}

export default AppHeader;
