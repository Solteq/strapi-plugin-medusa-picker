import { useState, useEffect, useCallback } from 'react';
import { useFetchClient } from '@strapi/strapi/admin';
import pluginId from '../pluginId';
import type {
  MedusaEntity,
  MedusaEntityType,
  MedusaProduct,
  MedusaCategory,
  MedusaCollection,
} from '../types';

interface UseMedusaDataParams {
  type: MedusaEntityType;
  search?: string;
  limit?: number;
  offset?: number;
}

interface UseMedusaDataReturn {
  data: MedusaEntity[];
  count: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useMedusaData({
  type,
  search,
  limit = 15,
  offset = 0,
}: UseMedusaDataParams): UseMedusaDataReturn {
  const [data, setData] = useState<MedusaEntity[]>([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { get } = useFetchClient();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const endpoint =
        type === 'product'
          ? 'products'
          : type === 'category'
            ? 'categories'
            : 'collections';

      const params = new URLSearchParams();
      if (search) params.set('search', search);
      params.set('limit', String(limit));
      params.set('offset', String(offset));

      const { data: response } = await get(
        `/${pluginId}/medusa/${endpoint}?${params.toString()}`
      );

      const entities = transformToEntities(response.data, type);
      setData(entities);
      setCount(response.count || 0);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(message);
      setData([]);
      setCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [type, search, limit, offset, get]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, count, isLoading, error, refetch: fetchData };
}

function transformToEntities(
  items: (MedusaProduct | MedusaCategory | MedusaCollection)[],
  type: MedusaEntityType
): MedusaEntity[] {
  return items.map((item) => {
    if (type === 'product') {
      const product = item as MedusaProduct;
      return {
        id: product.id,
        name: product.title,
        handle: product.handle,
        thumbnail: product.thumbnail,
        sku: product.variants?.[0]?.sku,
        type,
      };
    } else if (type === 'category') {
      const category = item as MedusaCategory;
      return {
        id: category.id,
        name: category.name,
        handle: category.handle,
        type,
      };
    } else {
      const collection = item as MedusaCollection;
      return {
        id: collection.id,
        name: collection.title,
        handle: collection.handle,
        type,
      };
    }
  });
}
