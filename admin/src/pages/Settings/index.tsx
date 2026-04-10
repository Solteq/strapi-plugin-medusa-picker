import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Field,
  Flex,
  Grid,
  Typography,
  TextInput,
} from '@strapi/design-system';
import { Check, Play } from '@strapi/icons';
import { useIntl } from 'react-intl';
import { Page, Layouts } from '@strapi/strapi/admin';
import { useFetchClient, useNotification } from '@strapi/strapi/admin';
import pluginId from '../../pluginId';
import type { MedusaSettings } from '../../types';

const SettingsPage = () => {
  const { formatMessage } = useIntl();
  const [settings, setSettings] = useState<MedusaSettings>({
    medusa_url: '',
    api_key: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const { get, put, post } = useFetchClient();
  const { toggleNotification } = useNotification();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await get(`/${pluginId}/settings`);
        if (data?.data) {
          setSettings(data.data);
        }
      } catch (error) {
        toggleNotification({
          type: 'danger',
          message: formatMessage({ id: `${pluginId}.settings.loadError`, defaultMessage: 'Failed to load settings' }),
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [get, toggleNotification, formatMessage]);

  const handleSave = async () => {
    if (!settings.medusa_url) {
      toggleNotification({
        type: 'danger',
        message: formatMessage({ id: `${pluginId}.settings.urlRequired`, defaultMessage: 'Medusa URL is required' }),
      });
      return;
    }

    setIsSaving(true);
    try {
      await put(`/${pluginId}/settings`, settings);
      toggleNotification({
        type: 'success',
        message: formatMessage({ id: `${pluginId}.settings.saveSuccess`, defaultMessage: 'Settings saved successfully' }),
      });
    } catch (error) {
      toggleNotification({
        type: 'danger',
        message: formatMessage({ id: `${pluginId}.settings.saveError`, defaultMessage: 'Failed to save settings' }),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const { data } = await post(`/${pluginId}/settings/test-connection`, settings);
      if (data?.success) {
        toggleNotification({
          type: 'success',
          message: formatMessage({ id: `${pluginId}.settings.connectionSuccess`, defaultMessage: 'Connection successful' }),
        });
      } else {
        toggleNotification({
          type: 'danger',
          message: data?.message || formatMessage({ id: `${pluginId}.settings.connectionFailed`, defaultMessage: 'Connection failed' }),
        });
      }
    } catch (error) {
      toggleNotification({
        type: 'danger',
        message: formatMessage({ id: `${pluginId}.settings.testError`, defaultMessage: 'Connection test failed' }),
      });
    } finally {
      setIsTesting(false);
    }
  };

  if (isLoading) {
    return <Page.Loading />;
  }

  return (
    <Layouts.Root>
      <Page.Title>{formatMessage({ id: `${pluginId}.settings.pageTitle`, defaultMessage: 'Medusa Picker Settings' })}</Page.Title>
      <Page.Main>
        <Layouts.Header
          title={formatMessage({ id: `${pluginId}.settings.title`, defaultMessage: 'Medusa Connection Settings' })}
          subtitle={formatMessage({ id: `${pluginId}.settings.subtitle`, defaultMessage: 'Configure your Medusa API connection' })}
          primaryAction={
            <Button
              onClick={handleSave}
              loading={isSaving}
              startIcon={<Check />}
            >
              {formatMessage({ id: `${pluginId}.settings.save`, defaultMessage: 'Save' })}
            </Button>
          }
        />
        <Layouts.Content>
          <Box
            background="neutral0"
            padding={6}
            shadow="filterShadow"
            hasRadius
          >
            <Flex direction="column" alignItems="stretch" gap={6}>
              <Typography variant="delta" tag="h2">
                {formatMessage({ id: `${pluginId}.settings.connectionTitle`, defaultMessage: 'Connection Settings' })}
              </Typography>

              <Grid.Root gap={4}>
                <Grid.Item col={12}>
                  <Field.Root
                    required
                    hint={formatMessage({ id: `${pluginId}.settings.medusaUrl.hint`, defaultMessage: 'The base URL of your Medusa backend API' })}
                  >
                    <Field.Label>{formatMessage({ id: `${pluginId}.settings.medusaUrl.label`, defaultMessage: 'Medusa API URL' })}</Field.Label>
                    <TextInput
                      placeholder={formatMessage({ id: `${pluginId}.settings.medusaUrl.placeholder`, defaultMessage: 'https://api.medusa.local' })}
                      value={settings.medusa_url}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSettings({ ...settings, medusa_url: e.target.value })
                      }
                    />
                    <Field.Hint />
                  </Field.Root>
                </Grid.Item>

                <Grid.Item col={12}>
                  <Field.Root hint={formatMessage({ id: `${pluginId}.settings.apiKey.hint`, defaultMessage: 'Your Medusa publishable API key for store endpoints' })}>
                    <Field.Label>{formatMessage({ id: `${pluginId}.settings.apiKey.label`, defaultMessage: 'Publishable API Key' })}</Field.Label>
                    <TextInput
                      type="password"
                      placeholder={formatMessage({ id: `${pluginId}.settings.apiKey.placeholder`, defaultMessage: 'pk_...' })}
                      value={settings.api_key}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSettings({ ...settings, api_key: e.target.value })
                      }
                    />
                    <Field.Hint />
                  </Field.Root>
                </Grid.Item>

                <Grid.Item col={12}>
                  <Button
                    variant="secondary"
                    onClick={handleTestConnection}
                    loading={isTesting}
                    startIcon={<Play />}
                  >
                    {formatMessage({ id: `${pluginId}.settings.testConnection`, defaultMessage: 'Test Connection' })}
                  </Button>
                </Grid.Item>
              </Grid.Root>
            </Flex>
          </Box>
        </Layouts.Content>
      </Page.Main>
    </Layouts.Root>
  );
};

export default SettingsPage;
