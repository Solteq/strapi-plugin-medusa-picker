import React from 'react';
import { Field, Flex, IconButton, SearchForm, Searchbar, SingleSelect, SingleSelectOption } from '@strapi/design-system';
import { GridFour, List } from '@strapi/icons';
import type { MedusaEntityType } from '../types';

export type ViewMode = 'grid' | 'list';

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  entityType: MedusaEntityType;
  onEntityTypeChange: (value: MedusaEntityType) => void;
  pageSize: number;
  onPageSizeChange: (value: number) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const FilterBar = ({
  search,
  onSearchChange,
  entityType,
  onEntityTypeChange,
  pageSize,
  onPageSizeChange,
  viewMode,
  onViewModeChange,
}: FilterBarProps) => {
  return (
    <Flex gap={4} wrap="wrap" alignItems="flex-end">
      <SearchForm>
        <Searchbar
          name="search"
          placeholder="Search..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          onClear={() => onSearchChange('')}
          clearLabel="Clear search"
        >
          Search
        </Searchbar>
      </SearchForm>

      <Field.Root>
        <Field.Label>Type</Field.Label>
        <SingleSelect
          value={entityType}
          onChange={(value: string | number) => onEntityTypeChange(String(value) as MedusaEntityType)}
        >
          <SingleSelectOption value="product">Products</SingleSelectOption>
          <SingleSelectOption value="category">Categories</SingleSelectOption>
          <SingleSelectOption value="collection">Collections</SingleSelectOption>
        </SingleSelect>
      </Field.Root>

      <Field.Root>
        <Field.Label>Show</Field.Label>
        <SingleSelect
          value={String(pageSize)}
          onChange={(value: string | number) => onPageSizeChange(Number(value))}
        >
          <SingleSelectOption value="15">15</SingleSelectOption>
          <SingleSelectOption value="30">30</SingleSelectOption>
          <SingleSelectOption value="50">50</SingleSelectOption>
        </SingleSelect>
      </Field.Root>

      <Flex gap={1}>
        <IconButton
          label="Grid view"
          variant={viewMode === 'grid' ? 'default' : 'ghost'}
          onClick={() => onViewModeChange('grid')}
        >
          <GridFour />
        </IconButton>
        <IconButton
          label="List view"
          variant={viewMode === 'list' ? 'default' : 'ghost'}
          onClick={() => onViewModeChange('list')}
        >
          <List />
        </IconButton>
      </Flex>
    </Flex>
  );
};
