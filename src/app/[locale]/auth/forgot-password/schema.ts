/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from 'yup';

const validationSchema = (t: (key: string, params?: Record<string, any>) => string) => {
  return Yup.object({
    email: Yup.string().required(t('errors.err01')).email(t('errors.err02')),
    text: Yup.string().required(t('errors.err13')).max(4, t('errors.err14')).min(4, t('errors.err14')),
  });
};

export default validationSchema;
