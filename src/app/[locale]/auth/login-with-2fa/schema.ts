import * as Yup from 'yup';

const validationSchema = () => {
  return Yup.object({
    otp: Yup.string().required('').length(6, ''),
  });
};

export default validationSchema;
