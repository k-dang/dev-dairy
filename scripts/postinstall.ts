#!/usr/bin/env bun

// Only show message during global npm installations
const isGlobalInstall = process.env.npm_config_global === "true";
const isPostinstall = process.env.npm_lifecycle_event === "postinstall";

if (isGlobalInstall && isPostinstall) {
  console.log("");
  console.log("dev-diary installed successfully!");
  console.log("");
  console.log("Quick start:");
  console.log("  export AI_GATEWAY_API_KEY=your-api-key-here");
  console.log("  dev-diary");
  console.log("");
  console.log("For more information and configuration options, see:");
  console.log("  https://github.com/k-dang/dev-diary#readme");
  console.log("");
}
