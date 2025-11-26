// migrations/deploy.ts
const anchor = require("@coral-xyz/anchor");

module.exports = async function (provider) {
  anchor.setProvider(provider);
  // Your deploy script goes here.
  // For Anchor, simply running `anchor deploy` from the CLI
  // will handle the deployment of programs defined in Anchor.toml.
  // This file is primarily for custom deployment logic if needed.
  console.log("Deploying counter_contract program...");
  // No explicit deploy instruction needed here for standard Anchor programs
  // as `anchor deploy` handles it based on Anchor.toml.
};