import React from 'react';
import { Field, Flex, IconButton, SearchForm, Searchbar, SingleSelect, SingleSelectOption } from '@strapi/design-system';
import { GridFour, List } from '@strapi/icons';
import { useIntl } from 'react-intl';
import pluginId from '../pluginId';
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
  const { formatMessage } = useIntl();

  return (
    <Flex gap={4} wrap="wrap" alignItems="flex-end">
      <SearchForm>
        <Searchbar
          name="search"
          placeholder={formatMessage({ id: `${pluginId}.modal.search`, defaultMessage: 'Search...' })}
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          onClear={() => onSearchChange('')}
          clearLabel={formatMessage({ id: `${pluginId}.modal.search.clearLabel`, defaultMessage: 'Clear search' })}
        >
          {formatMessage({ id: `${pluginId}.modal.search`, defaultMessage: 'Search...' })}
        </Searchbar>
      </SearchForm>

      <Field.Root>
        <Field.Label>{formatMessage({ id: `${pluginId}.modal.type.label`, defaultMessage: 'Type' })}</Field.Label>
        <SingleSelect
          value={entityType}
          onChange={(value: string | number) => onEntityTypeChange(String(value) as MedusaEntityType)}
        >
          <SingleSelectOption value="product">{formatMessage({ id: `${pluginId}.modal.type.products`, defaultMessage: 'Products' })}</SingleSelectOption>
          <SingleSelectOption value="category">{formatMessage({ id: `${pluginId}.modal.type.categories`, defaultMessage: 'Categories' })}</SingleSelectOption>
          <SingleSelectOption value="collection">{formatMessage({ id: `${pluginId}.modal.type.collections`, defaultMessage: 'Collections' })}</SingleSelectOption>
        </SingleSelect>
      </Field.Root>

      <Field.Root>
        <Field.Label>{formatMessage({ id: `${pluginId}.modal.show.label`, defaultMessage: 'Show' })}</Field.Label>
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
          label={formatMessage({ id: `${pluginId}.modal.viewMode.grid`, defaultMessage: 'Grid view' })}
          variant={viewMode === 'grid' ? 'default' : 'ghost'}
          onClick={() => onViewModeChange('grid')}
        >
          <GridFour />
        </IconButton>
        <IconButton
          label={formatMessage({ id: `${pluginId}.modal.viewMode.list`, defaultMessage: 'List view' })}
          variant={viewMode === 'list' ? 'default' : 'ghost'}
          onClick={() => onViewModeChange('list')}
        >
          <List />
        </IconButton>
      </Flex>
    </Flex>
  );
};
