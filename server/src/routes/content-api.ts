export default {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/medusa/products',
      handler: 'medusa-proxy.getProducts',
      config: {
        policies: ['admin::isAuthenticatedAdmin'],
      },
    },
    {
      method: 'GET',
      path: '/medusa/categories',
      handler: 'medusa-proxy.getCategories',
      config: {
        policies: ['admin::isAuthenticatedAdmin'],
      },
    },
    {
      method: 'GET',
      path: '/medusa/collections',
      handler: 'medusa-proxy.getCollections',
      config: {
        policies: ['admin::isAuthenticatedAdmin'],
      },
    },
  ],
};
