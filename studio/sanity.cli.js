const { defineCliConfig } = require('sanity/cli');

module.exports = defineCliConfig({
  api: {
    projectId: 'm8sr7eub',
    dataset: 'production',
  },
  studioHost: 'tapaikobazar',
  autoUpdates: true,
});
