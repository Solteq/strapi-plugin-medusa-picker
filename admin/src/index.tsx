import { PuzzlePiece } from '@strapi/icons';
import pluginId from './pluginId';
import { Initializer } from './components/Initializer';

// Simple icon component
const PluginIcon = () => <PuzzlePiece />;

export default {
  register(app: any) {
    // Register plugin first
    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name: pluginId,
    });

    // Register custom field with minimal config
    app.customFields.register({
      name: 'medusa-picker',
      pluginId: pluginId,
      type: 'text',
      intlLabel: {
        id: `${pluginId}.field.label`,
        defaultMessage: 'Medusa Picker',
      },
      intlDescription: {
        id: `${pluginId}.field.description`,
        defaultMessage: 'Select products, categories, or collections from Medusa',
      },
      icon: PluginIcon,
      components: {
        Input: async () => import('./components/MedusaPickerInput'),
      },
      options: {
        base: [],
        advanced: [
          {
            sectionTitle: {
              id: `${pluginId}.field.options.title`,
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'required',
                type: 'checkbox',
                intlLabel: {
                  id: 'form.attribute.item.requiredField',
                  defaultMessage: 'Required field',
                },
                description: {
                  id: 'form.attribute.item.requiredField.description',
                  defaultMessage: "You won't be able to create an entry if this field is empty",
                },
              },
            ],
          },
        ],
      },
    });
  },

  bootstrap(app: any) {
    // Add settings link to global settings
    app.addSettingsLink('global', {
      intlLabel: {
        id: `${pluginId}.settings.link`,
        defaultMessage: 'Medusa Picker',
      },
      id: pluginId,
      to: `/settings/${pluginId}`,
      Component: () => import('./pages/Settings'),
    });
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return locales.map((locale) => ({
      data: {},
      locale,
    }));
  },
};
