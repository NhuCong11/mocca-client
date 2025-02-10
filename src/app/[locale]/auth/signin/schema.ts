/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from 'yup';

const validationSchema = (t: (key: string, params?: Record<string, any>) => string) => {
  return Yup.object({
    email: Yup.string().required(t('errors.err01')).email(t('errors.err02')),
    password: Yup.string()
      .required(t('errors.err03'))
      .matches(/^(?=.*[@-_]).{8,}$/, t('errors.err04')),
  });
};

export default validationSchema;
