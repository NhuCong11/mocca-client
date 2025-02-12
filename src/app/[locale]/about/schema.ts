/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from 'yup';

const validationSchema = (t: (key: string, params?: Record<string, any>) => string) => {
  return Yup.object({
    fullname: Yup.string().trim().required(t('errors.err05')).min(3, t('errors.err15')).max(50, t('errors.err15')),
    phone: Yup.string()
      .trim()
      .required(t('errors.phoneNumber.err01'))
      .matches(/(((\+|)84)|0)(3|5|7|8|9)([0-9]{8})\b/, t('errors.err08'))
      .max(10),
    email: Yup.string().trim().required(t('errors.err01')).email(t('errors.err02')),
    message: Yup.string().trim().required(t('errors.err09')).min(5, t('errors.err10')).max(500, t('errors.err10')),
  });
};

export default validationSchema;
