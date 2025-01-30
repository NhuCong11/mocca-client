import Image from 'next/image';
import clsx from 'clsx';

import { useTranslations } from 'next-intl';
import CustomLink from '@/share/CustomLink';

import styles from './AppFooter.module.scss';
import { IconBrandFacebook, IconBrandGithub, IconBrandInstagram } from '@tabler/icons-react';

function AppFooter() {
  const t = useTranslations();

  return (
    <div className={clsx(styles.footer)}>
      <div className={'container gx-5'}>
        <CustomLink href={'/'}>
          <Image
            width={230}
            height={71}
            src={'/images/logo-vip1.png'}
            priority
            alt="Mocca Cafe"
            className={clsx(styles.footer__logo)}
          />
        </CustomLink>

        <div className={clsx('separate')} style={{ '--separate-bg': 'transparent' } as React.CSSProperties}></div>

        <div className={'row'}>
          <div className={'col col-xxl-3 col-xl-3 col-12'}>
            <ul>
              <li>
                <CustomLink href={'/about'} className={clsx(styles.footer__item)}>
                  {t('footer.title01')}
                </CustomLink>
              </li>
              <li>
                <CustomLink href={'/#!'} className={clsx(styles.footer__item)}>
                  {t('footer.title03')}
                </CustomLink>
              </li>
            </ul>
          </div>

          <div className={'col col-xxl-3 col-xl-3 col-12'}>
            <ul>
              <li>
                <CustomLink href={'/#!'} className={clsx(styles.footer__item)}>
                  {t('footer.title04')}
                </CustomLink>
              </li>
              <li>
                <CustomLink href={'/#!'} className={clsx(styles.footer__item)}>
                  {t('footer.title05')}
                </CustomLink>
              </li>
            </ul>
          </div>

          <div className={'col col-xxl-3 col-xl-3 col-12'}>
            <ul>
              <li>
                <CustomLink href={'/#!'} className={clsx(styles.footer__item)}>
                  {t('footer.title06')}
                </CustomLink>
              </li>
              <li>
                <CustomLink href={'/#!'} className={clsx(styles.footer__item)}>
                  {t('footer.title07')}
                </CustomLink>
              </li>
            </ul>
          </div>

          <div className={'col col-xxl-3 col-xl-3 col-12'}>
            <div className={clsx(styles.footer__socials)}>
              <a
                href="https://www.facebook.com/Nhu.Cong1123"
                rel="noreferrer"
                target="_blank"
                className={clsx(styles['footer__social-link'])}
              >
                <IconBrandFacebook size={28} color="var(--white)" />
              </a>
              <a href="#!" rel="noreferrer" target="_blank" className={clsx(styles['footer__social-link'])}>
                <IconBrandInstagram size={28} color="var(--white)" />
              </a>
              <a href="#!" rel="noreferrer" target="_blank" className={clsx(styles['footer__social-link'])}>
                <IconBrandGithub size={28} color="var(--white)" />
              </a>
            </div>
          </div>
        </div>

        <div className={clsx('separate')}></div>

        <div className={clsx(styles.footer__bottom)}>
          <div className={clsx(styles['footer__bottom-group'])}>
            <p className={clsx(styles['footer__bottom-text'])}>
              {t('footer.title08')}:
              <a href="mailto: info.moccacafe@gmail.com" className={clsx(styles['footer__bottom-link'])}>
                {' '}
                info.moccacafe@gmail.com
              </a>
            </p>
          </div>
          <div className={clsx(styles['footer__bottom-group'])}>
            <div className={clsx(styles['footer__bottom-wrapper'])}>
              <p className={clsx(styles['footer__bottom-text'])}>© 2024 Mocca Cafe</p>
            </div>
            <div className={clsx(styles['footer__bottom-wrapper'])}>
              <p className={clsx(styles['footer__bottom-text'])}>
                <a href="#!" className={clsx(styles['footer__bottom-link'])}>
                  {t('footer.title07')}
                </a>
              </p>
              <span className={clsx('dot-separate')}>•</span>
              <p className={clsx(styles['footer__bottom-text'])}>
                <a href="#!" className={clsx(styles['footer__bottom-link'])}>
                  {t('footer.title09')}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppFooter;
