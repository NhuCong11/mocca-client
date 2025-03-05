import * as Yup from 'yup';

const validationSchemaInfo = () => {
  return Yup.object({
    message: Yup.string().trim(),
  });
};

export default validationSchemaInfo;
