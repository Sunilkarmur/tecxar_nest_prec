import * as Yup from 'yup';

const imageFileExtensions = ['jpg', 'jpeg', 'png', 'gif'];

export const registrationSchema = Yup.object().shape({
  first_name: Yup.string().required(),
  last_name: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required(),
  mobile: Yup.number().required(),
  profile_image: Yup.mixed().test(
    'fileType',
    'Invalid image format',
    (value: any) => {
      if (!value) return true; // Allow empty value
      console.log(value);

      const { mimetype } = value;
      if (mimetype) {
        const fileExtension = mimetype.split('/').pop()?.toLowerCase();
        return imageFileExtensions.includes(fileExtension);
      }

      const fileExtension = value.name.split('.').pop()?.toLowerCase();
      return imageFileExtensions.includes(fileExtension);
    },
  ),
});


export const loginSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required(),
});

export const updateSchema = Yup.object().shape({
  first_name: Yup.string().required(),
  last_name: Yup.string().required(),
  email: Yup.string().email().required(),
  mobile: Yup.number().required(),
});