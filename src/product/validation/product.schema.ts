import * as Yup from 'yup';
const imageFileExtensions = ['jpg', 'jpeg', 'png', 'gif'];
export const createProductSchema = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string().required(),
  categoryIdId: Yup.number().required(),
  price: Yup.number().required(),
  image: Yup.mixed()
    .required()
    .test('fileType', 'Invalid image format', (value: any) => {
      if (!value) return true; // Allow empty value
      console.log(value);

      const { mimetype } = value;
      if (mimetype) {
        const fileExtension = mimetype.split('/').pop()?.toLowerCase();
        return imageFileExtensions.includes(fileExtension);
      }

      const fileExtension = value.name.split('.').pop()?.toLowerCase();
      return imageFileExtensions.includes(fileExtension);
    }),
});
export const updateProductSchema = Yup.object().shape({
  name: Yup.string().notRequired(),
  description: Yup.string().notRequired(),
  price: Yup.number().notRequired(),
  categoryIdId: Yup.number().notRequired(),
});
