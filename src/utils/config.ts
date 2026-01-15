import { homedir } from "node:os";
import { join } from "node:path";
import { loadPersistedConfigSync } from "./persistence.ts";

export interface Config {
  aiGatewayKey: string;
  outputDir: string;
  maxDepth: number;
  daysToInclude: number;
}

export function getConfig(): Config {
  const aiGatewayKey = process.env.AI_GATEWAY_API_KEY;
  if (!aiGatewayKey) {
    throw new Error("AI_GATEWAY_API_KEY environment variable is required");
  }

  const outputDir =
    process.env.DAILY_SUMMARY_OUTPUT ||
    join(homedir(), "Documents", "dev-diary");

  const maxDepth = parseInt(process.env.DAILY_SUMMARY_DEPTH || "3", 10);
  const daysToInclude = parseInt(process.env.DAILY_SUMMARY_DAYS || "1", 10);

  return {
    aiGatewayKey,
    outputDir,
    maxDepth,
    daysToInclude,
  };
}

export function getDefaultDirectory(): string {
  const persisted = loadPersistedConfigSync();
  if (persisted.directory) {
    return persisted.directory;
  }
  return process.cwd();
}

export function getDefaultOutputPath(): string {
  const persisted = loadPersistedConfigSync();
  if (persisted.outputPath) {
    return persisted.outputPath;
  }
  return (
    process.env.DAILY_SUMMARY_OUTPUT ||
    join(homedir(), "Documents", "dev-diary")
  );
}

const VALID_DAYS = [1, 3, 7, 14, 30];

export function getDefaultDays(): number {
  const persisted = loadPersistedConfigSync();
  if (
    persisted.daysToInclude !== undefined &&
    VALID_DAYS.includes(persisted.daysToInclude)
  ) {
    return persisted.daysToInclude;
  }
  return parseInt(process.env.DAILY_SUMMARY_DAYS || "1", 10);
}
