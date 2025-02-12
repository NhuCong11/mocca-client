import * as Yup from 'yup';

const validationSchema = () => {
  return Yup.object({
    keyword: Yup.string(),
  });
};

export default validationSchema;
