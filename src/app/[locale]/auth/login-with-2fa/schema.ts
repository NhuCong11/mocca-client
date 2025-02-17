import * as Yup from 'yup';

const validationSchema = () => {
  return Yup.object({
    code: Yup.string().required('').length(6, ''),
  });
};

export default validationSchema;
