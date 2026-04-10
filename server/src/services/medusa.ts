import type { Core } from '@strapi/strapi';

export interface MedusaSettings {
  medusa_url: string;
  api_key: string;
}

export interface FetchParams {
  search?: string;
  limit?: number;
  offset?: number;
}

const medusa = ({ strapi }: { strapi: Core.Strapi }) => ({
  async getSettings(): Promise<MedusaSettings | null> {
    const pluginStore = strapi.store({
      type: 'plugin',
      name: 'medusa-picker',
    });

    return await pluginStore.get({ key: 'settings' }) as MedusaSettings | null;
  },

  async updateSettings(settings: MedusaSettings) {
    const pluginStore = strapi.store({
      type: 'plugin',
      name: 'medusa-picker',
    });

    await pluginStore.set({
      key: 'settings',
      value: settings,
    });
  },

  async testConnection(url?: string, apiKey?: string) {
    const settings = await this.getSettings();
    const medusaUrl = url || settings?.medusa_url;
    const medusaApiKey = apiKey || settings?.api_key;

    if (!medusaUrl) {
      return { success: false, message: 'Medusa URL is not configured' };
    }

    try {
      const response = await fetch(`${medusaUrl}/store/products?limit=1`, {
        headers: {
          'x-publishable-api-key': medusaApiKey || '',
        },
      });

      if (response.ok) {
        return { success: true, message: 'Connection successful' };
      }

      const errorText = await response.text();
      return { success: false, message: `Connection failed: ${response.status} ${errorText}` };
    } catch (error: any) {
      return { success: false, message: `Connection failed: ${error.message || 'Unknown error'}` };
    }
  },

  async fetchProducts(params: FetchParams) {
    const settings = await this.getSettings();
    if (!settings?.medusa_url) {
      throw new Error('Medusa URL is not configured');
    }

    const queryParams = new URLSearchParams();
    if (params.search) queryParams.set('q', params.search);
    if (params.limit) queryParams.set('limit', String(params.limit));
    if (params.offset) queryParams.set('offset', String(params.offset));
    queryParams.set('fields', '+external_id');

    const response = await fetch(
      `${settings.medusa_url}/store/products?${queryParams.toString()}`,
      {
        headers: {
          'x-publishable-api-key': settings.api_key || '',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const data: any = await response.json();
    return {
      data: data.products || [],
      count: data.count || 0,
    };
  },

  async fetchCategories(params: FetchParams) {
    const settings = await this.getSettings();
    if (!settings?.medusa_url) {
      throw new Error('Medusa URL is not configured');
    }

    const queryParams = new URLSearchParams();
    if (params.search) queryParams.set('q', params.search);
    if (params.limit) queryParams.set('limit', String(params.limit));
    if (params.offset) queryParams.set('offset', String(params.offset));
    queryParams.set('fields', '+external_id');

    const response = await fetch(
      `${settings.medusa_url}/store/product-categories?${queryParams.toString()}`,
      {
        headers: {
          'x-publishable-api-key': settings.api_key || '',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }

    const data: any = await response.json();
    return {
      data: data.product_categories || [],
      count: data.count || 0,
    };
  },

  async fetchCollections(params: FetchParams) {
    const settings = await this.getSettings();
    if (!settings?.medusa_url) {
      throw new Error('Medusa URL is not configured');
    }

    const queryParams = new URLSearchParams();
    if (params.search) queryParams.set('q', params.search);
    if (params.limit) queryParams.set('limit', String(params.limit));
    if (params.offset) queryParams.set('offset', String(params.offset));
    queryParams.set('fields', '+external_id');

    const response = await fetch(
      `${settings.medusa_url}/store/collections?${queryParams.toString()}`,
      {
        headers: {
          'x-publishable-api-key': settings.api_key || '',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch collections: ${response.status}`);
    }

    const data: any = await response.json();
    return {
      data: data.collections || [],
      count: data.count || 0,
    };
  },
});

export default medusa;
