import { homedir } from "node:os";
import { join } from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";

export interface PersistedConfig {
  directory?: string;
  outputPath?: string;
  daysToInclude?: number;
}

/**
 * Returns the full path to the config file
 */
export function getConfigPath(): string {
  return join(homedir(), ".config", "dev-dairy", "config.json");
}

/**
 * Loads persisted config synchronously from ~/.config/dev-dairy/config.json
 * Returns empty object on any error (file doesn't exist, invalid JSON, etc.)
 * Used during app initialization.
 */
export function loadPersistedConfigSync(): PersistedConfig {
  try {
    const configPath = getConfigPath();
    const content = readFileSync(configPath, "utf-8");
    const config = JSON.parse(content);
    return config;
  } catch (error) {
    // File doesn't exist, invalid JSON, or permission error - return empty config
    return {};
  }
}

/**
 * Loads persisted config from ~/.config/dev-dairy/config.json
 * Returns empty object on any error (file doesn't exist, invalid JSON, etc.)
 */
export async function loadPersistedConfig(): Promise<PersistedConfig> {
  try {
    const configPath = getConfigPath();
    const content = await readFile(configPath, "utf-8");
    const config = JSON.parse(content);
    return config;
  } catch (error) {
    // File doesn't exist, invalid JSON, or permission error - return empty config
    return {};
  }
}

/**
 * Saves persisted config to ~/.config/dev-dairy/config.json
 * Creates directory if needed. Logs errors but doesn't throw.
 */
export async function savePersistedConfig(
  config: PersistedConfig,
): Promise<void> {
  try {
    const configPath = getConfigPath();
    const configDir = join(homedir(), ".config", "dev-dairy");

    // Ensure config directory exists
    await mkdir(configDir, { recursive: true });

    // Write config with pretty formatting
    await writeFile(configPath, JSON.stringify(config, null, 2), "utf-8");
  } catch (error) {
    // Log error but don't crash the app
    console.error("Failed to save config:", error);
  }
}
