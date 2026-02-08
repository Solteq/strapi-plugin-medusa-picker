export interface MedusaSettings {
  medusa_url: string;
  api_key: string;
}

export interface MedusaReference {
  medusa_id: string;
  type: 'product' | 'collection' | 'category';
  name: string;
}

export interface MedusaProduct {
  id: string;
  title: string;
  handle: string;
  thumbnail?: string;
  variants?: Array<{ sku?: string }>;
}

export interface MedusaCategory {
  id: string;
  name: string;
  handle: string;
  parent_category?: { id: string };
}

export interface MedusaCollection {
  id: string;
  title: string;
  handle: string;
}

export type MedusaEntityType = 'product' | 'collection' | 'category';

export interface MedusaEntity {
  id: string;
  name: string;
  handle?: string;
  thumbnail?: string;
  sku?: string;
  type: MedusaEntityType;
}

export interface FetchParams {
  search?: string;
  limit?: number;
  offset?: number;
}

export interface FetchResponse<T> {
  data: T[];
  count: number;
}
