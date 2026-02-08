import React, { useState, useMemo } from 'react';
import { Box, Button, DesignSystemProvider, Field, Flex } from '@strapi/design-system';
import { Plus } from '@strapi/icons';
import { SelectedItemsList } from './SelectedItemsList';
import { MedusaPickerModal } from './MedusaPickerModal';
import type { MedusaReference } from '../types';

interface MedusaPickerInputProps {
  name: string;
  value?: string | null;
  onChange: (event: { target: { name: string; value: string | undefined; type: string } }) => void;
  attribute: {
    customField: string;
    type: string;
  };
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  hint?: string;
}

export default function MedusaPickerInput({
  name,
  value,
  onChange,
  attribute,
  disabled,
  error,
  label,
  required,
  hint,
}: MedusaPickerInputProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Parse the JSON string value
  const items: MedusaReference[] = useMemo(() => {
    if (!value) return [];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [value]);

  const handleConfirm = (selectedItems: MedusaReference[]) => {
    onChange({
      target: {
        name,
        value: selectedItems.length > 0 ? JSON.stringify(selectedItems) : undefined,
        type: attribute.type,
      },
    });
  };

  const handleRemove = (medusaId: string) => {
    const newItems = items.filter((item) => item.medusa_id !== medusaId);
    onChange({
      target: {
        name,
        value: newItems.length > 0 ? JSON.stringify(newItems) : undefined,
        type: attribute.type,
      },
    });
  };

  return (
    <DesignSystemProvider>
      <Field.Root name={name} error={error} hint={hint} required={required}>
        <Field.Label>{label || 'Medusa Picker'}</Field.Label>

        <Box
          padding={4}
          background="neutral100"
          hasRadius
          borderColor={error ? 'danger600' : 'neutral200'}
        >
          <Flex direction="column" gap={4}>
            <SelectedItemsList items={items} onRemove={handleRemove} />

            <Button
              variant="secondary"
              startIcon={<Plus />}
              onClick={() => setIsModalOpen(true)}
              disabled={disabled}
              fullWidth
            >
              Select from Medusa
            </Button>
          </Flex>
        </Box>

        <Field.Hint />
        <Field.Error />

        <MedusaPickerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirm}
          initialSelected={items}
        />
      </Field.Root>
    </DesignSystemProvider>
  );
}

// Also export as named for backwards compatibility
export { MedusaPickerInput };
