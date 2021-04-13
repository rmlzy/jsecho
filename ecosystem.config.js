module.exports = {
  apps: [
    {
      name: "jsecho",
      script: "./dist/main.js",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
