import React, { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Flex,
  Grid,
  Loader,
  Modal,
  Typography,
} from '@strapi/design-system';
import { FilterBar } from './FilterBar';
import type { ViewMode } from './FilterBar';
import { ProductCard } from './ProductCard';
import { useMedusaData } from '../hooks/useMedusaData';
import { useDebounce } from '../hooks/useDebounce';
import type { MedusaEntity, MedusaEntityType, MedusaReference } from '../types';

interface MedusaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (items: MedusaReference[]) => void;
  initialSelected: MedusaReference[];
}

export const MedusaPickerModal = ({
  isOpen,
  onClose,
  onConfirm,
  initialSelected,
}: MedusaPickerModalProps) => {
  const [search, setSearch] = useState('');
  const [entityType, setEntityType] = useState<MedusaEntityType>('product');
  const [pageSize, setPageSize] = useState(15);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selected, setSelected] = useState<Map<string, MedusaReference>>(
    () => new Map(initialSelected.map((item) => [item.medusa_id, item]))
  );

  const debouncedSearch = useDebounce(search, 300);
  const offset = (page - 1) * pageSize;

  const { data, count, isLoading, error } = useMedusaData({
    type: entityType,
    search: debouncedSearch,
    limit: pageSize,
    offset,
  });

  const totalPages = Math.ceil(count / pageSize);

  const handleToggle = (entity: MedusaEntity) => {
    setSelected((prev) => {
      const newSelected = new Map(prev);
      if (newSelected.has(entity.id)) {
        newSelected.delete(entity.id);
      } else {
        newSelected.set(entity.id, {
          medusa_id: entity.id,
          type: entity.type,
          name: entity.name,
        });
      }
      return newSelected;
    });
  };

  const handleConfirm = () => {
    onConfirm(Array.from(selected.values()));
    onClose();
  };

  const handleEntityTypeChange = (type: MedusaEntityType) => {
    setEntityType(type);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const selectedCount = selected.size;

  return (
    <Modal.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Content style={{ maxWidth: '900px', width: '90vw' }}>
        <Modal.Header>
          <Modal.Title>Select from Medusa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Flex direction="column" gap={4} alignItems="stretch">
            <FilterBar
              search={search}
              onSearchChange={handleSearchChange}
              entityType={entityType}
              onEntityTypeChange={handleEntityTypeChange}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            {selectedCount > 0 && (
              <Typography variant="pi" textColor="neutral600">
                {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
              </Typography>
            )}

            {isLoading ? (
              <Flex
                justifyContent="center"
                alignItems="center"
                style={{ height: '200px' }}
              >
                <Loader>Loading...</Loader>
              </Flex>
            ) : error ? (
              <Flex
                direction="column"
                justifyContent="center"
                alignItems="center"
                gap={2}
                style={{ height: '200px' }}
              >
                <Typography variant="omega" textColor="danger600">
                  Error loading data
                </Typography>
                <Typography variant="pi" textColor="neutral600">
                  {error}
                </Typography>
              </Flex>
            ) : data.length === 0 ? (
              <Flex
                direction="column"
                justifyContent="center"
                alignItems="center"
                style={{ height: '200px' }}
              >
                <Typography variant="omega" textColor="neutral600">
                  No items found
                </Typography>
              </Flex>
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <Box
                    padding={2}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                      gap: '16px',
                      maxHeight: '400px',
                      overflowY: 'auto',
                    }}
                  >
                    {data.map((entity) => (
                      <ProductCard
                        key={entity.id}
                        entity={entity}
                        isSelected={selected.has(entity.id)}
                        onToggle={handleToggle}
                        viewMode={viewMode}
                      />
                    ))}
                  </Box>
                ) : (
                  <Flex
                    direction="column"
                    gap={2}
                    padding={2}
                    style={{ maxHeight: '400px', overflowY: 'auto' }}
                  >
                    {data.map((entity) => (
                      <ProductCard
                        key={entity.id}
                        entity={entity}
                        isSelected={selected.has(entity.id)}
                        onToggle={handleToggle}
                        viewMode={viewMode}
                      />
                    ))}
                  </Flex>
                )}

                {totalPages > 1 && (
                  <Flex gap={2} justifyContent="center" alignItems="center">
                    <Button
                      variant="tertiary"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </Button>
                    <Typography variant="pi" textColor="neutral600">
                      Page {page} of {totalPages}
                    </Typography>
                    <Button
                      variant="tertiary"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                      Next
                    </Button>
                  </Flex>
                )}
              </>
            )}
          </Flex>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close>
            <Button variant="tertiary">Cancel</Button>
          </Modal.Close>
          <Button onClick={handleConfirm}>
            Select {selectedCount > 0 ? `(${selectedCount})` : ''}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};
