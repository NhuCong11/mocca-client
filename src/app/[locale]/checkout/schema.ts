/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from 'yup';

const validationSchema = (t: (key: string, params?: Record<string, any>) => string) => {
  return Yup.object({
    addressDetail: Yup.string().required(t('errors.err16')),
    note: Yup.string(),
  });
};

export default validationSchema;
