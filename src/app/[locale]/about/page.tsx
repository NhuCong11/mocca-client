'use client';
import Image from 'next/image';
import clsx from 'clsx';
import { Form, Formik, FormikHelpers } from 'formik';
import { useTranslations } from 'next-intl';
import { IconMail, IconMessage, IconPhone, IconQuoteFilled, IconSend, IconUser } from '@tabler/icons-react';

import styles from './About.module.scss';
import validationSchema from './schema';
import { Link } from '@/i18n/routing';
import Button from '@/share/Button';
import InputText from '@/share/InputText';
import { aboutDesc, aboutImages, aboutIntroData, journeyData } from './constant';

export interface ContactInfo {
  fullname: string;
  email: string;
  phone: string;
  message: string;
}

function About() {
  const t = useTranslations();

  const isLoading = false;

  const handleContactUs = (values: ContactInfo, resetForm: FormikHelpers<ContactInfo>['resetForm']) => {
    console.log(values);
    resetForm();
  };

  return (
    <div className={clsx(styles['about'])}>
      <Image
        width={1566}
        height={480}
        className={clsx(styles['about__img'])}
        src={'/images/banner/cafe01.jpg'}
        priority
        alt="Cafe"
      />
      <div className={clsx('container gx-5')}>
        <div className={clsx(styles['about__top'])}>
          <h3 data-aos="zoom-in-right" className={clsx(styles['about__title'])}>
            {t('about-MoccaCafe.heading01')}
          </h3>
          {aboutDesc?.map((desc, index) => (
            <p key={index} data-aos="zoom-in-left" className={clsx(styles['about__desc'])}>
              {t(`${desc}`)}
            </p>
          ))}
          <Link href={'/'} rel="noreferrer" target="_blank" className={clsx(styles['about__btn'])}>
            <Button more primary>
              {t('button.btn14')}
            </Button>
          </Link>
        </div>

        <div className={clsx(styles['about__intro'])}>
          <div className={clsx(styles['about__intro-wrapper'])}>
            {aboutIntroData.map((item) => (
              <div key={item.key} className={clsx(styles['about__intro-item'])} data-aos={item.animation}>
                <h5 className={clsx(styles['about__intro-title'])}>{t(`about-MoccaCafe.${item.key}`)}</h5>
                <p className={clsx(styles['about__intro-desc'])}>{t(`about-MoccaCafe.${item.desc}`)}</p>
              </div>
            ))}
          </div>
          <div className={clsx(styles['about__intro-wrapper'])}>
            <div className={clsx(styles['about__intro-item'], styles['about__intro-item--xl'])}>
              <h5 data-aos="zoom-in-right" className={clsx(styles['about__intro-title'])}>
                {t('about-MoccaCafe.heading04')}
              </h5>
              <p data-aos="zoom-in-right" className={clsx(styles['about__intro-desc'])}>
                {t('about-MoccaCafe.desc05')}
              </p>

              <div className={clsx(styles['about__img-wrapper'])}>
                <div className={clsx('row')}>
                  {aboutImages.map((img, index) => (
                    <div key={index} className={clsx('col col-12 col-xxl-4 col-xl-4 col-lg-6')}>
                      <div data-aos={img.animation} className={clsx(styles['about__img-item'])}>
                        <Image
                          width={396}
                          height={248}
                          src={img.src}
                          className={clsx(styles['about__img-thumb'])}
                          priority
                          alt={t(`about-MoccaCafe.${img.key}`)}
                        />
                        <h5 className={clsx(styles['about__img-title'])}>{t(`about-MoccaCafe.${img.key}`)}</h5>
                        <p className={clsx(styles['about__img-desc'])}>{t(`about-MoccaCafe.${img.desc}`)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Journey */}
          <div className={clsx(styles['about__main'])}>
            <h3 className={clsx(styles['about__main-title'])}>{t('about-MoccaCafe.heading08')}</h3>
            <div className={clsx(styles['journey-list'])}>
              {journeyData.map((journey, index) => (
                <div key={index} className={clsx(styles['journey-item'])}>
                  <Image
                    width={342}
                    height={200}
                    data-aos={journey.animation}
                    src={journey.src}
                    alt=""
                    className={clsx(styles['journey-item__img'])}
                  />
                  <div className={clsx(styles['journey-item__dot'])}></div>
                  <div className={clsx(styles['journey-item__line'])}></div>
                  <div data-aos="fade-up-left" className={clsx(styles['journey-item__desc'])}>
                    <h4 className={clsx(styles['title'])}>{t(`about-MoccaCafe.${journey.key}`)}</h4>
                    <p className={clsx(styles['text'])}>{t(`about-MoccaCafe.${journey.desc}`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Slogan */}
      <div className={clsx(styles['about__footer'])}>
        <div data-aos="zoom-in-right" className={clsx(styles['about__footer-word'])}>
          <p className={clsx(styles['about__footer-text'])}>
            <IconQuoteFilled className={clsx(styles['about__footer-quotes'], styles['about__footer-quotes--close'])} />
            {t('about-MoccaCafe.desc11')}
            <IconQuoteFilled className={clsx(styles['about__footer-quotes'])} />
          </p>
        </div>
        <div className={clsx(styles['about__footer-bg'])}></div>
      </div>
      {/* Form contact */}
      <div className={clsx('container')}>
        <div className={clsx(styles['about__contact'])}>
          <h4 data-aos="fade-up-right" className={clsx(styles['about__contact-heading'])}>
            {t('contact.heading')}
          </h4>
          <p data-aos="fade-up-right" className={clsx(styles['about__contact-desc'])}>
            {t('contact.desc')}
          </p>
          <Formik
            initialValues={{ fullname: '', phone: '', email: '', message: '' } as ContactInfo}
            validationSchema={validationSchema(t)}
            onSubmit={(values: ContactInfo, { resetForm }) => {
              handleContactUs(values, resetForm);
            }}
            validateOnChange={true}
            validateOnMount={true}
          >
            {({ isValid, dirty }) => (
              <Form data-aos="fade-up-right">
                <div className={clsx(styles['about__contact-group'])}>
                  <InputText
                    label={t('form.tp03')}
                    name="fullname"
                    type="text"
                    placeholder={t('form.tp03')}
                    Icon={<IconUser />}
                    readOnly={isLoading}
                  />
                  <InputText
                    label={t('form.tp05')}
                    name="phone"
                    type="tel"
                    maxLength={10}
                    placeholder={t('form.tp05')}
                    Icon={<IconPhone />}
                    readOnly={isLoading}
                  />
                  <InputText
                    label={t('form.tp01')}
                    name="email"
                    type="email"
                    placeholder={t('form.tp01')}
                    Icon={<IconMail />}
                    readOnly={isLoading}
                  />
                </div>
                <InputText
                  label={t('form.tp06')}
                  name="message"
                  type="text"
                  placeholder={t('form.tp06')}
                  Icon={<IconMessage />}
                  readOnly={isLoading}
                />
                <div className={clsx(styles['about__contact-btn'])}>
                  <div style={!isValid || !dirty || isLoading ? { cursor: 'no-drop' } : {}}>
                    <Button send primary disabled={!isValid || !dirty || isLoading} rightIcon={<IconSend />}>
                      {t('button.btn15')}
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default About;
