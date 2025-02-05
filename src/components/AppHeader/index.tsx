'use client';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import { removeCookie } from 'typescript-cookie';
import { useLocale, useTranslations } from 'next-intl';
import { IconCaretDownFilled, IconLogout, IconShoppingCart, IconUser } from '@tabler/icons-react';
import styles from './AppHeader.module.scss';
import Button from '@/share/Button';
import { Link } from '@/i18n/routing';
import { fonts } from '@/styles/fonts';
import LoadingStart from '@/share/Loading';
import { Locale, locales } from '@/i18n/config';
import useClickOutside from '@/hooks/useClickOutSide';

function AppHeader() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [showCart, setShowCart] = useState(false);

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
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    removeCookie('accessToken', { path: '/' });
    setShowUserOptions(false);

    // Lưu trạng thái thông báo vào localStorage
    localStorage.setItem('showToast', 'true');
    window.location.href = '/';
  };

  const handleLanguageChange = (lang: Locale) => {
    const segments = pathname.split('/');
    segments[1] = lang;
    const newPath = segments.join('/');
    router.replace(newPath);
    setShowLanguages(false);
  };
  

  const handleViewLang = (lang: Locale) => {
    return locales
      .map((locale) => ({ name: locale, img: `/images/languages/${locale}.png` }))
      .find((item) => item.name === lang);
  };

  useEffect(() => {
    const showToast = localStorage.getItem('showToast');
    if (showToast === 'true') {
      toast.success(t('login.notify02'));

      const deleteToast = setTimeout(() => {
        localStorage.removeItem('showToast');
      }, 100);

      return () => clearTimeout(deleteToast);
    }
  }, [t]);

  useEffect(() => {
    const onScroll = () => {
      if (window.innerWidth >= 768 && headerRef.current) {
        if (window.scrollY > 0) {
          headerRef.current.style.backgroundColor = '#181818';
          headerRef.current.style.boxShadow = '-1px 0px 2px 0px var(--header-shadow)';
        } else {
          headerRef.current.style.boxShadow = '0 1px 1px transparent';
          if (!['/vi', '/en', '/zh', '/ko'].includes(pathname)) {
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
      if (!['/vi', '/en', '/zh', '/ko'].includes(pathname)) {
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
              width={100}
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
            {true && (
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
            {false && (
              <div className={clsx(styles['header__actions-group'])}>
                <Image
                  ref={avatarRef}
                  onClick={() => setShowUserOptions(!showUserOptions)}
                  className={clsx(
                    styles['header__actions-avatar'],
                    showUserOptions && styles['header__actions-avatar--open'],
                  )}
                  src={''}
                  priority
                  width={42}
                  height={42}
                  alt="Avatar"
                />
                <ul
                  ref={userOptionsRef}
                  className={clsx(
                    styles['header__user-options'],
                    showUserOptions && styles['header__user-options--show'],
                  )}
                >
                  <Link href={'/auth/profile'} onClick={() => setShowUserOptions(false)}>
                    <li className={clsx(styles['header__user-option'], fonts.inter)}>
                      <p>{t('user-options.op01')}</p>
                      <IconUser width={16} height={16} />
                    </li>
                  </Link>
                  <li
                    onClick={() => {
                      setShowCart(!showCart);
                      setShowUserOptions(false);
                    }}
                    className={clsx(styles['header__user-option'], 'header__user-option--md', fonts.inter)}
                  >
                    <p>{t('cart.title02')}</p>
                    <IconShoppingCart width={22} height={22} />
                  </li>
                  <li onClick={handleLogOut} className={clsx(styles['header__user-option'], fonts.inter)}>
                    <p>{t('user-options.op02')}</p>
                    <IconLogout width={16} height={16} />
                  </li>
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
