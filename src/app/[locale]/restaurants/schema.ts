import * as Yup from 'yup';

const validationSchema = () => {
  return Yup.object({
    q: Yup.string(),
  });
};

export default validationSchema;
