import type { Core } from '@strapi/strapi';

const settings = ({ strapi }: { strapi: Core.Strapi }) => ({
  async getSettings(ctx: any) {
    const settings = await strapi
      .plugin('medusa-picker')
      .service('medusa')
      .getSettings();

    ctx.body = { data: settings };
  },

  async updateSettings(ctx: any) {
    const { medusa_url, api_key } = ctx.request.body;

    if (!medusa_url) {
      return ctx.badRequest('Medusa URL is required');
    }

    await strapi
      .plugin('medusa-picker')
      .service('medusa')
      .updateSettings({ medusa_url, api_key: api_key || '' });

    const settings = await strapi
      .plugin('medusa-picker')
      .service('medusa')
      .getSettings();

    ctx.body = { data: settings };
  },

  async testConnection(ctx: any) {
    const { medusa_url, api_key } = ctx.request.body;

    const result = await strapi
      .plugin('medusa-picker')
      .service('medusa')
      .testConnection(medusa_url, api_key);

    ctx.body = result;
  },
});

export default settings;
