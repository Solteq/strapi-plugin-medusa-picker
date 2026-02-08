import * as yup from 'yup';

export const settingsSchema = yup.object().shape({
  medusa_url: yup
    .string()
    .required('Medusa URL is required')
    .url('Must be a valid URL'),
  api_key: yup.string(),
});

export type SettingsFormData = yup.InferType<typeof settingsSchema>;
