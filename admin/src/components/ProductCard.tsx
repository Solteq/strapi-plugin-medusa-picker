import React, { useState } from 'react';
import { Box, Checkbox, Flex, Typography } from '@strapi/design-system';
import type { MedusaEntity } from '../types';
import type { ViewMode } from './FilterBar';

interface ProductCardProps {
  entity: MedusaEntity;
  isSelected: boolean;
  onToggle: (entity: MedusaEntity) => void;
  viewMode: ViewMode;
}

const badgeColors = (type: string) => {
  if (type === 'product') return { bg: 'primary100', text: 'primary700' };
  if (type === 'category') return { bg: 'success100', text: 'success700' };
  return { bg: 'warning100', text: 'warning700' };
};

export const ProductCard = ({ entity, isSelected, onToggle, viewMode }: ProductCardProps) => {
  const [hovered, setHovered] = useState(false);
  const colors = badgeColors(entity.type);

  if (viewMode === 'list') {
    return (
      <Box
        borderColor={isSelected || hovered ? 'primary600' : 'neutral200'}
        borderStyle="solid"
        borderWidth="1px"
        hasRadius
        padding={3}
        background={isSelected ? 'primary100' : 'neutral0'}
        onClick={() => onToggle(entity)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
      >
        <Flex gap={3} alignItems="center">
          {entity.thumbnail ? (
            <img
              src={entity.thumbnail}
              alt={entity.name}
              style={{
                width: '40px',
                height: '40px',
                objectFit: 'cover',
                borderRadius: '4px',
                flexShrink: 0,
              }}
            />
          ) : (
            <Flex
              background="neutral100"
              hasRadius
              justifyContent="center"
              alignItems="center"
              shrink={0}
              style={{ width: '40px', height: '40px' }}
            >
              <Typography variant="pi" textColor="neutral500" style={{ fontSize: '8px' }}>
                N/A
              </Typography>
            </Flex>
          )}
          <Typography
            variant="omega"
            fontWeight="semiBold"
            ellipsis
            title={entity.name}
            style={{ flex: 1, minWidth: 0 }}
          >
            {entity.name}
          </Typography>
          {entity.sku && (
            <Typography variant="pi" textColor="neutral600" style={{ flexShrink: 0 }}>
              {entity.sku}
            </Typography>
          )}
          <Box
            background={colors.bg}
            style={{
              display: 'inline-block',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: 600,
              textTransform: 'uppercase',
              color: 'inherit',
            }}
          >
            <Typography textColor={colors.text} style={{ fontSize: '10px', fontWeight: 600 }}>
              {entity.type}
            </Typography>
          </Box>
          <Checkbox checked={isSelected} onChange={() => onToggle(entity)} />
        </Flex>
      </Box>
    );
  }

  return (
    <Box
      borderColor={isSelected || hovered ? 'primary600' : 'neutral200'}
      borderStyle="solid"
      borderWidth="1px"
      hasRadius
      padding={3}
      background={isSelected ? 'primary100' : 'neutral0'}
      onClick={() => onToggle(entity)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
    >
      <Flex direction="column" gap={2}>
        {entity.thumbnail ? (
          <img
            src={entity.thumbnail}
            alt={entity.name}
            style={{
              width: '100%',
              height: '80px',
              objectFit: 'cover',
              borderRadius: '4px',
              backgroundColor: '#f6ecec',
            }}
          />
        ) : (
          <Flex
            background="neutral100"
            hasRadius
            justifyContent="center"
            alignItems="center"
            style={{ width: '100%', height: '80px' }}
          >
            <Typography variant="pi" textColor="neutral500">
              No image
            </Typography>
          </Flex>
        )}

        <Flex justifyContent="space-between" alignItems="flex-start">
          <Flex direction="column" gap={1} style={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="omega"
              fontWeight="semiBold"
              ellipsis
              title={entity.name}
            >
              {entity.name}
            </Typography>
            {entity.sku && (
              <Typography variant="pi" textColor="neutral600">
                SKU: {entity.sku}
              </Typography>
            )}
            <Box
              background={colors.bg}
              style={{
                display: 'inline-block',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              <Typography textColor={colors.text} style={{ fontSize: '10px', fontWeight: 600 }}>
                {entity.type}
              </Typography>
            </Box>
          </Flex>
          <Checkbox checked={isSelected} onChange={() => onToggle(entity)} />
        </Flex>
      </Flex>
    </Box>
  );
};
