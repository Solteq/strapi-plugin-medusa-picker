import React from 'react';
import { Box, Flex, IconButton, Typography } from '@strapi/design-system';
import { Cross } from '@strapi/icons';
import { useIntl } from 'react-intl';
import pluginId from '../pluginId';
import type { MedusaReference } from '../types';

interface SelectedItemsListProps {
  items: MedusaReference[];
  onRemove: (medusaId: string) => void;
}

export const SelectedItemsList = ({ items, onRemove }: SelectedItemsListProps) => {
  const { formatMessage } = useIntl();

  if (!items || items.length === 0) {
    return (
      <Box padding={4} background="neutral100" hasRadius>
        <Typography variant="pi" textColor="neutral600">
          {formatMessage({ id: `${pluginId}.input.noSelection`, defaultMessage: 'No items selected. Click "Select from Medusa" to add items.' })}
        </Typography>
      </Box>
    );
  }

  return (
    <Flex direction="column" gap={2}>
      {items.map((item) => (
        <Box
          key={item.medusa_id}
          borderColor="neutral200"
          borderStyle="solid"
          borderWidth="1px"
          hasRadius
          padding={3}
          background="neutral0"
        >
          <Flex justifyContent="space-between" alignItems="center">
            <Flex direction="column" gap={1}>
              <Typography variant="omega" fontWeight="semiBold">
                {item.name}
              </Typography>
              <Typography textColor="neutral500" variant="pi">
                {item.type}: {item.external_id ?? item.medusa_id}
              </Typography>
            </Flex>
            <IconButton
              onClick={() => onRemove(item.medusa_id)}
              label={formatMessage({ id: `${pluginId}.input.remove`, defaultMessage: 'Remove' })}
              variant="ghost"
            >
              <Cross />
            </IconButton>
          </Flex>
        </Box>
      ))}
    </Flex>
  );
};
