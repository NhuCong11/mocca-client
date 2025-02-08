import React from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import CustomLink from '@/share/CustomLink';
import styles from './AppFooter.module.scss';
import { footerLinks, socialLinks } from './constant';

function AppFooter() {
  const t = useTranslations();

  return (
    <div className={clsx(styles.footer)}>
      <div className="container gx-5">
        <CustomLink href="/">
          <Image
            width={230}
            height={71}
            src="/images/logo-vip1.png"
            priority
            alt="Mocca Cafe"
            className={clsx(styles.footer__logo)}
          />
        </CustomLink>

        <div className="separate" style={{ '--separate-bg': 'transparent' } as React.CSSProperties}></div>

        <div className="row">
          {footerLinks.map((column, colIndex) => (
            <div key={colIndex} className="col col-xxl-3 col-xl-3 col-12">
              <ul>
                {column.map(({ href, key }) => (
                  <li key={key}>
                    <CustomLink href={href} className={clsx(styles.footer__item)}>
                      {t(key)}
                    </CustomLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col col-xxl-3 col-xl-3 col-12">
            <div className={clsx(styles.footer__socials)}>
              {socialLinks.map(({ href, icon: Icon }, index) => (
                <a
                  key={index}
                  href={href}
                  rel="noreferrer"
                  target="_blank"
                  className={clsx(styles['footer__social-link'])}
                >
                  <Icon size={28} color="var(--white)" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="separate"></div>

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
              {['footer.title07', 'footer.title09'].map((key, index) => (
                <React.Fragment key={key}>
                  {index > 0 && <span className="dot-separate">•</span>}
                  <p className={clsx(styles['footer__bottom-text'])}>
                    <a href="#!" className={clsx(styles['footer__bottom-link'])}>
                      {t(key)}
                    </a>
                  </p>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppFooter;
