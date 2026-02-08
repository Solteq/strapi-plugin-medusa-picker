import type { Core } from '@strapi/strapi';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.customFields.register({
    name: 'medusa-picker',
    plugin: 'medusa-picker',
    type: 'text',
  });
};

export default register;
