import type { Core } from '@strapi/strapi';

const bootstrap = async ({ strapi }: { strapi: Core.Strapi }) => {
  const pluginStore = strapi.store({
    type: 'plugin',
    name: 'medusa-picker',
  });

  const existingSettings = await pluginStore.get({ key: 'settings' });

  if (!existingSettings) {
    await pluginStore.set({
      key: 'settings',
      value: {
        medusa_url: process.env.MEDUSA_BACKEND_URL || '',
        api_key: '',
      },
    });
  }
};

export default bootstrap;
