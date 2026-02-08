import type { Core } from '@strapi/strapi';

const medusaProxy = ({ strapi }: { strapi: Core.Strapi }) => ({
  async getProducts(ctx: any) {
    const { search, limit = 15, offset = 0 } = ctx.query;

    try {
      const result = await strapi
        .plugin('medusa-picker')
        .service('medusa')
        .fetchProducts({
          search,
          limit: Number(limit),
          offset: Number(offset),
        });

      ctx.body = result;
    } catch (error: any) {
      ctx.throw(500, error.message || 'Unknown error');
    }
  },

  async getCategories(ctx: any) {
    const { search, limit = 15, offset = 0 } = ctx.query;

    try {
      const result = await strapi
        .plugin('medusa-picker')
        .service('medusa')
        .fetchCategories({
          search,
          limit: Number(limit),
          offset: Number(offset),
        });

      ctx.body = result;
    } catch (error: any) {
      ctx.throw(500, error.message || 'Unknown error');
    }
  },

  async getCollections(ctx: any) {
    const { search, limit = 15, offset = 0 } = ctx.query;

    try {
      const result = await strapi
        .plugin('medusa-picker')
        .service('medusa')
        .fetchCollections({
          search,
          limit: Number(limit),
          offset: Number(offset),
        });

      ctx.body = result;
    } catch (error: any) {
      ctx.throw(500, error.message || 'Unknown error');
    }
  },
});

export default medusaProxy;
