module.exports = {
  transpileDependencies: ['vuetify'],

  pluginOptions: {
    s3Deploy: {
      registry: undefined,
      awsProfile: 'blizzard-quotes',
      region: 'us-east-1',
      bucket: 'blizzard-quotes-wc3-ui',
      createBucket: false,
      staticHosting: false,
      assetPath: 'dist',
      assetMatch: '**',
      deployPath: '/',
      acl: 'public-read',
      pwa: false,
      enableCloudfront: false,
      uploadConcurrency: 5,
      pluginVersion: '3.0.0',
    },
  },
};
