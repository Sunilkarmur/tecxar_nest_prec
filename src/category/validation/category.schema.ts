import * as Yup from 'yup';

export const createCategorySchema = Yup.object().shape({
  name: Yup.string().required(),
});
export const updateCategorySchema = Yup.object().shape({
  name: Yup.string().required(),
});
