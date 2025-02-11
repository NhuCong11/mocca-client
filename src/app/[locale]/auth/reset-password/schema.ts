/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from 'yup';

const validationSchema = (t: (key: string, params?: Record<string, any>) => string) => {
  return Yup.object({
    newPassword: Yup.string().required(t('errors.err03')).matches(/^(?=.*[@-_]).{8,}$/, t('errors.err04')),
    confirmPassword: Yup.string()
      .required(t('errors.err07'))
      .matches(/^(?=.*[@-_]).{8,}$/, t('errors.err04'))
      .oneOf([Yup.ref('newPassword')], t('errors.err06')),
  });
};

export default validationSchema;
