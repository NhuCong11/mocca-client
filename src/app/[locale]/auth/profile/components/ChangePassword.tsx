import { useCallback, useState } from 'react';
import clsx from 'clsx';
import { Form, Formik, FormikHelpers } from 'formik';
import { useTranslations } from 'next-intl';
import { IconLock } from '@tabler/icons-react';

import styles from '../Profile.module.scss';
import { IconKeyPassword } from '../../constant';
import { validationSchemaChangePassword } from '../schema';
import Button from '@/share/Button';
import InputText from '@/share/InputText';
import { ChangePasswordInfo } from '@/types';
import { useAppDispatch } from '@/lib/hooks';
import { changePassword } from '@/services/authServices';
import { showToast, ToastType } from '@/utils/toastUtils';

function ChangePassword() {
  const t = useTranslations();
  const dispatch = useAppDispatch();

  const [isChange, setIsChange] = useState(false);
  const [showPassword, setShowPassword] = useState({ old: false, new: false, confirm: false });

  const handleShowPassword = useCallback((type: 'old' | 'new' | 'confirm') => {
    setShowPassword((prevState) => ({ ...prevState, [type]: !prevState[type] }));
  }, []);

  const handleChangePassword = (
    values: ChangePasswordInfo,
    resetForm: FormikHelpers<ChangePasswordInfo>['resetForm'],
  ) => {
    const { oldPassword, newPassword } = values;
    const changePasswordPromise = dispatch(changePassword({ oldPassword, newPassword })).then((result) => {
      if (result?.payload?.code === 200) {
        resetForm();
        setIsChange(false);
        return t('profile.toast.successed');
      } else if (result?.payload?.code === 401) {
        throw new Error(t('profile.toast.noExactlyPasswords'));
      } else {
        throw new Error(result?.payload?.message || t('system.error'));
      }
    });
    showToast('', ToastType.PROMISE, changePasswordPromise);
  };

  return (
    <Formik
      initialValues={
        {
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        } as ChangePasswordInfo
      }
      validationSchema={validationSchemaChangePassword(t)}
      onSubmit={(values: ChangePasswordInfo, { resetForm }) => {
        handleChangePassword(values, resetForm);
      }}
      validateOnChange={true}
      validateOnMount={true}
    >
      {({ isValid, dirty, setErrors }) => {
        return (
          <Form className={clsx(styles['profile__form'])}>
            <div className={clsx(styles['profile__content'])}>
              <div className={clsx(styles['profile__inputs'], 'profile__inputs--row')}>
                <InputText
                  required
                  label={t('profile.oldPassword')}
                  name="oldPassword"
                  type={showPassword.old ? 'text' : 'password'}
                  placeholder={t('profile.oldPassword')}
                  readOnly={!isChange}
                  noChange={!isChange}
                  LeftIcon={<IconLock />}
                  RightIcon={
                    <IconKeyPassword showPassword={showPassword.old} onToggle={() => handleShowPassword('old')} />
                  }
                />

                <InputText
                  required
                  label={t('profile.newPassword')}
                  name="newPassword"
                  type={showPassword.new ? 'text' : 'password'}
                  placeholder={t('profile.newPassword')}
                  readOnly={!isChange}
                  noChange={!isChange}
                  LeftIcon={<IconLock />}
                  RightIcon={
                    <IconKeyPassword showPassword={showPassword.new} onToggle={() => handleShowPassword('new')} />
                  }
                />

                <InputText
                  required
                  label={t('profile.confirmPassword')}
                  name="confirmPassword"
                  type={showPassword.confirm ? 'text' : 'password'}
                  placeholder={t('profile.confirmPassword')}
                  readOnly={!isChange}
                  noChange={!isChange}
                  LeftIcon={<IconLock />}
                  RightIcon={
                    <IconKeyPassword
                      showPassword={showPassword.confirm}
                      onToggle={() => handleShowPassword('confirm')}
                    />
                  }
                />
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
                      setIsChange(false);
                      setErrors({});
                    }}
                    disabled={!isChange}
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
  );
}

export default ChangePassword;
