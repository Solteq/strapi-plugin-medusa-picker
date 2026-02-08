import pluginId from './pluginId';

export const PERMISSIONS = {
  settings: [
    { action: `plugin::${pluginId}.settings.read`, subject: null },
  ],
};
