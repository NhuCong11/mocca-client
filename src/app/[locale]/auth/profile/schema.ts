/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from 'yup';
import useAgeEligible from '@/hooks/useAgeEligible';

const validationSchemaInfo = (t: (key: string, params?: Record<string, any>) => string) => {
  return Yup.object({
    fullname: Yup.string().trim().required(t('errors.err05')).min(3, t('errors.err15')).max(50, t('errors.err15')),
    dateOfBirth: Yup.string()
      .required(t('errors.birthDay.err01'))
      .test('age-minimum', t('errors.birthDay.err03'), (value) => {
        if (!value) return false;
        const birthDate = new Date(value);
        return useAgeEligible(birthDate);
      })
      .test('age-maximum', t('errors.birthDay.err04'), (value) => {
        if (!value) return false;
        const today = new Date();
        const age = today.getFullYear() - new Date(value).getFullYear();
        return age <= 100;
      }),
    phone: Yup.string()
      .trim()
      .matches(/(((\+|)84)|0)(3|5|7|8|9)([0-9]{8})\b/, t('errors.err08'))
      .max(10),
    email: Yup.string().required(t('errors.err01')).email(t('errors.err02')),
    gender: Yup.string(),
  });
};

export const validationSchemaChangePassword = (t: (key: string, params?: Record<string, any>) => string) => {
  return Yup.object({
    oldPassword: Yup.string()
      .required(t('errors.err03'))
      .matches(/^(?=.*[@-_]).{8,}$/, t('errors.err04')),
    newPassword: Yup.string()
      .required(t('errors.err03'))
      .matches(/^(?=.*[@-_]).{8,}$/, t('errors.err04')),
    confirmPassword: Yup.string()
      .required(t('errors.err07'))
      .matches(/^(?=.*[@-_]).{8,}$/, t('errors.err04'))
      .oneOf([Yup.ref('newPassword')], t('errors.err06')),
  });
};

export default validationSchemaInfo;
