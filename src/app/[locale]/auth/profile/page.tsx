/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { Form, Formik } from 'formik';

import styles from './scss/Profile.module.scss';
import validationSchemaInfo from './schema';
import ChangePassword from './components/ChangePassword';
import AuthTwinSetup from './components/AuthTwinSetup';
import WalletRecharge from './components/WalletRecharge';
import Help from './components/Help';
import TermsOfUse from './components/TermsOfUse';
import OrderHistory from './components/OrderHistory';
import { ERROR_READ_FILE, listNavbar, MOCCA_COIN } from './constant';
import { MOCCA } from '@/constants';
import Button from '@/share/Button';
import { UserInfo } from '@/types';
import InputText from '@/share/InputText';
import { LoadingOval } from '@/share/Loading';
import useClickOutside from '@/hooks/useClickOutSide';
import { showToast, ToastType } from '@/utils/toastUtils';
import { getMe, updateMe } from '@/services/authServices';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { formatDateTime, getVNCurrency } from '@/utils/constants';
import { IconCoins, IconGenderBigender, IconMail, IconPhone, IconPhotoScan, IconUser } from '@tabler/icons-react';
import { useQueryParams } from '@/hooks/useQueryParams';

function Profile() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { clearParams } = useQueryParams();
  const isLoading = useAppSelector((state) => state.auth.loadingUpdate);

  const [isChange, setIsChange] = useState(false);
  const [selectedNavbar, setSelectedNavbar] = useState(listNavbar[1]);
  const [userData, setUserData] = useState<UserInfo>();
  const [bgSelected, setBgSelected] = useState<File | null>(null);
  const [bgPreview, setBgPreview] = useState<string | null>(null);
  const [avatarSelected, setAvatarSelected] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const inputBgRefs = useRef<HTMLInputElement | null>(null);
  const inputAvatarRefs = useRef<HTMLInputElement | null>(null);
  const inputGenderRefs = useRef<HTMLInputElement | null>(null);
  const setFieldValueRef = useRef<(field: string, value: any) => void>(null);

  const {
    elementRef: genderOptionsRef,
    triggerRef: genderRef,
    isVisible: showGender,
    setIsVisible: setShowGender,
  } = useClickOutside<HTMLUListElement, HTMLDivElement>();

  const upDateUserInfo = (userInfo: UserInfo) => {
    if (userInfo && setFieldValueRef.current) {
      setFieldValueRef.current('fullname', userInfo?.fullname ?? '');
      setFieldValueRef.current('dateOfBirth', formatDateTime(String(userInfo?.dateOfBirth) ?? '', false, true));
      setFieldValueRef.current('phone', userInfo?.phone ?? '');
      setFieldValueRef.current('email', userInfo?.email ?? '');
      if (userInfo?.gender) {
        if (userInfo.gender === 'male') {
          setFieldValueRef.current('gender', t('form.gender.male'));
        } else {
          setFieldValueRef.current('gender', t('form.gender.female'));
        }
      }
    }
  };

  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      if (type === 'avatar') {
        setAvatarSelected(file);
        reader.onloadend = () => {
          setAvatarPreview(reader.result as string);
        };
      } else {
        setBgSelected(file);
        reader.onloadend = () => {
          setBgPreview(reader.result as string);
        };
      }
      try {
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error reading the file:', error);
        showToast(ERROR_READ_FILE, ToastType.ERROR);
      }
    }
  };

  const handleCloseChange = () => {
    setIsChange(false);
    setBgPreview('');
    setAvatarPreview('');
    setBgSelected(null);
    setAvatarSelected(null);
  };

  const handleChangeInfo = (values: UserInfo) => {
    if (values) {
      if (
        values.fullname === userData?.fullname &&
        values.phone === (userData?.phone || '') &&
        values.dateOfBirth === formatDateTime(String(userData?.dateOfBirth) ?? '', false, true) &&
        values.gender === (userData?.gender === 'male' ? t('form.gender.male') : t('form.gender.female')) &&
        avatarSelected === null &&
        bgSelected === null
      ) {
        showToast(t('profile.toast.noChanged'), ToastType.INFO);
        return;
      }

      const data: UserInfo = {};
      if (values.fullname !== userData?.fullname) {
        data['fullname'] = values.fullname;
      }
      if (values.phone !== (userData?.phone || '')) {
        data['phone'] = values.phone;
      }
      if (values.dateOfBirth !== formatDateTime(String(userData?.dateOfBirth) ?? '', false, true)) {
        data['dateOfBirth'] = new Date(String(values.dateOfBirth));
      }
      if (values.gender !== (userData?.gender === 'male' ? t('form.gender.male') : t('form.gender.female'))) {
        data['gender'] = values.gender === t('form.gender.male') ? 'male' : 'female';
      }

      dispatch(updateMe({ userData: data, avatar: avatarSelected, background: bgSelected })).then((result) => {
        if (result.payload?.code === 200) {
          showToast(t('profile.toast.successed'), ToastType.SUCCESS);
          setUserData(result.payload?.data);
        } else {
          showToast(result.payload?.message, ToastType.ERROR);
        }
        handleCloseChange();
      });
    }
  };

  useEffect(() => {
    if (listNavbar[1].title === selectedNavbar.title) {
      dispatch(getMe()).then((result) => {
        if (result.payload?.code === 200) {
          setUserData(result.payload?.data);
        } else {
          showToast(result.payload?.message, ToastType.ERROR);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedNavbar.title === listNavbar[1].title || !isChange) {
      upDateUserInfo(userData as UserInfo);
    } else {
      setIsChange(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, selectedNavbar.title, listNavbar, isChange]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedNavbar]);

  return (
    <div className={clsx(styles['profile'])}>
      <div className={clsx('container gx-5')}>
        <div className={clsx(styles['profile__wrapper'], 'row')}>
          {/* Sidebar */}
          <div className={clsx('col-xl-3')}>
            <div
              className={clsx(styles['profile__info'])}
              style={
                bgPreview && isChange
                  ? ({ '--bg': `url(${bgPreview})` } as React.CSSProperties)
                  : ({ '--bg': `var(--bg-default)` } as React.CSSProperties)
              }
            >
              {isChange && (
                <div
                  className={clsx(styles['select-bg'])}
                  onClick={() => {
                    inputBgRefs.current?.click();
                  }}
                >
                  <input
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleSelectImage(e, 'background');
                    }}
                    ref={inputBgRefs}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <IconPhotoScan />
                </div>
              )}

              <div className={clsx(styles['profile__avatar'])}>
                <Image
                  width={140}
                  height={140}
                  priority
                  className={clsx(styles['profile__avatar-img'])}
                  src={(isChange && avatarPreview) || userData?.avatar || '/images/logo.png'}
                  alt={MOCCA}
                />

                {isChange && (
                  <div
                    className={clsx(styles['select-img'])}
                    onClick={() => {
                      inputAvatarRefs.current?.click();
                    }}
                  >
                    <input
                      onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleSelectImage(e, 'avatar');
                      }}
                      ref={inputAvatarRefs}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    <p className={clsx(styles['select-img__title'])}>{t('profile.btn-select-img')}</p>
                  </div>
                )}
              </div>

              <h4 className={clsx(styles['profile__info-name'])}>{userData?.fullname || MOCCA}</h4>
              <p className={clsx(styles['profile__info-registered'])}>
                {t('profile.registered')} {formatDateTime(`${userData?.createdAt}`)}
              </p>
              <p className={clsx(styles['profile__info-coin'])}>
                {`${MOCCA_COIN}${getVNCurrency(userData?.accountBalance)}`}
                <IconCoins size={20} color="var(--primary-bg)" />
              </p>
            </div>

            <div className={clsx(styles['profile__navbar'])}>
              <ul className={clsx(styles['profile__navbar-list'])}>
                {listNavbar.map((navbar, index: number) => (
                  <li key={index}>
                    {navbar.isTitle && (
                      <Button
                        leftIcon={<navbar.Icon size={18} />}
                        profileNavTitle
                        className={clsx(
                          t(selectedNavbar.titleName) === t(navbar.title) && styles['profile__navbar-title--active'],
                        )}
                      >
                        {t(navbar.title)}
                      </Button>
                    )}
                    {!navbar.isTitle && (
                      <Button
                        profileNavItem
                        leftIcon={<navbar.Icon size={20} />}
                        className={clsx(
                          t(selectedNavbar.title) === t(navbar.title) && styles['profile__navbar-item--active'],
                        )}
                        onClick={() => {
                          setSelectedNavbar(navbar);
                          clearParams();
                        }}
                      >
                        {t(navbar.title)}
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main content */}
          <div className={clsx('col-xl-9')}>
            <div className={clsx(styles['profile__main'])}>
              <h3 className={clsx(styles['profile__content-title'])}>{t(selectedNavbar.title)}</h3>

              {selectedNavbar.title === listNavbar[1].title && (
                <Formik
                  initialValues={
                    {
                      fullname: '',
                      dateOfBirth: '',
                      phone: '',
                      email: '',
                      gender: '',
                    } as UserInfo
                  }
                  validationSchema={validationSchemaInfo(t)}
                  onSubmit={(values: UserInfo) => {
                    handleChangeInfo(values);
                  }}
                  validateOnChange={true}
                  validateOnMount={true}
                >
                  {({ isValid, dirty, setFieldValue, setErrors }) => {
                    setFieldValueRef.current = setFieldValue;
                    const handleSetGender = (value: string) => {
                      setFieldValue('gender', value);
                      setShowGender(false);
                    };

                    return (
                      <Form className={clsx(styles['profile__form'])}>
                        <div className={clsx(styles['profile__content'])}>
                          <div className={clsx(styles['profile__inputs'])}>
                            <InputText
                              required
                              label={t('form.tp03')}
                              name="fullname"
                              type="text"
                              placeholder={t('form.tp03')}
                              LeftIcon={<IconUser />}
                              readOnly={!isChange}
                              noChange={!isChange}
                            />

                            <InputText
                              required
                              label={t('form.tp07')}
                              name="dateOfBirth"
                              type="date"
                              placeholder={t('form.tp07')}
                              readOnly={!isChange}
                              noChange={!isChange}
                            />

                            <InputText
                              required
                              label={t('form.tp05')}
                              name="phone"
                              type="tel"
                              placeholder={t('form.tp05')}
                              LeftIcon={<IconPhone />}
                              readOnly={!isChange}
                              noChange={!isChange}
                            />

                            <InputText
                              required
                              label={t('form.tp01')}
                              name="email"
                              type="email"
                              placeholder={t('form.tp01')}
                              LeftIcon={<IconMail />}
                              readOnly={!isChange}
                              noChange={!isChange}
                            />

                            <div className={clsx(styles['profile__inputs-gender'])} ref={genderRef}>
                              <InputText
                                label={t('form.gender.title')}
                                name="gender"
                                type="text"
                                placeholder={t('form.gender.title')}
                                LeftIcon={<IconGenderBigender />}
                                readOnly={true}
                                noChange={!isChange}
                                ref={inputGenderRefs}
                                onFocus={() => {
                                  setShowGender(!showGender);
                                }}
                              />

                              <ul
                                className={clsx(
                                  styles['profile__inputs-options'],
                                  showGender && styles['profile__inputs-options--show'],
                                )}
                                ref={genderOptionsRef}
                              >
                                <li
                                  className={clsx(styles['profile__inputs-option'])}
                                  onClick={() => handleSetGender(t('form.gender.male'))}
                                >
                                  {t('form.gender.male')}
                                </li>
                                <li
                                  className={clsx(styles['profile__inputs-option'])}
                                  onClick={() => handleSetGender(t('form.gender.female'))}
                                >
                                  {t('form.gender.female')}
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className={clsx(styles['profile__buttons'])}>
                          {!isChange && (
                            <Button type="button" changeProfile primary onClick={() => setIsChange(true)}>
                              {t('profile.btn-edit')}
                            </Button>
                          )}

                          {isChange && (
                            <>
                              <Button
                                type="button"
                                cancel
                                primary
                                onClick={() => {
                                  setErrors({});
                                  handleCloseChange();
                                }}
                                disabled={!isValid || !dirty || !isChange}
                              >
                                {t('profile.btn-cancel')}
                              </Button>
                              <Button type="submit" changeProfile primary disabled={!isValid || !dirty || !isChange}>
                                {t('profile.btn-update')}
                              </Button>
                            </>
                          )}
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
              )}

              {selectedNavbar.title === listNavbar[2].title && <ChangePassword />}
              {selectedNavbar.title === listNavbar[3].title && <AuthTwinSetup />}
              {selectedNavbar.title === listNavbar[5].title && <OrderHistory />}
              {selectedNavbar.title === listNavbar[6].title && <WalletRecharge userInfo={userData as UserInfo} />}
              {selectedNavbar.title === listNavbar[8].title && <Help />}
              {selectedNavbar.title === listNavbar[9].title && <TermsOfUse />}
            </div>
          </div>
        </div>
      </div>
      {isLoading && <LoadingOval />}
    </div>
  );
}

export default Profile;
