import type { CommitInfo, GitRepo, RepoData } from "../types/index.ts";

async function runGitCommand(
  repoPath: string,
  args: string[],
): Promise<string> {
  const proc = Bun.spawn(["git", ...args], {
    cwd: repoPath,
    stdout: "pipe",
    stderr: "pipe",
  });

  const output = await new Response(proc.stdout).text();
  await proc.exited;

  return output.trim();
}

async function getUserEmail(repoPath: string): Promise<string | null> {
  const localEmail = await runGitCommand(repoPath, [
    "config",
    "--local",
    "user.email",
  ]);
  if (localEmail) {
    return localEmail;
  }

  const globalEmail = await runGitCommand(repoPath, [
    "config",
    "--global",
    "user.email",
  ]);
  if (globalEmail) {
    return globalEmail;
  }

  return null;
}

export async function getCommitsFromLastDays(
  repoPath: string,
  days: number = 1,
): Promise<Omit<CommitInfo, "diff">[]> {
  // Get user email for filtering
  const userEmail = await getUserEmail(repoPath);

  if (!userEmail) {
    // No user email configured - return empty array
    // This ensures only the current user's commits are included
    return [];
  }

  const format = "%H|%s|%an|%ai";
  const output = await runGitCommand(repoPath, [
    "log",
    `--since=${days} days ago`,
    `--author=${userEmail}`,
    `--format=${format}`,
  ]);

  if (!output) {
    return [];
  }

  return output
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => {
      const [hash = "", message = "", author = "", date = ""] = line.split("|");
      return { hash, message, author, date };
    });
}

export async function getCommitDiff(
  repoPath: string,
  hash: string,
): Promise<string> {
  return runGitCommand(repoPath, ["show", "--format=", hash]);
}

export async function getRepoData(
  repo: GitRepo,
  days: number = 1,
): Promise<RepoData> {
  const commitsWithoutDiff = await getCommitsFromLastDays(repo.path, days);

  const commits = await Promise.all(
    commitsWithoutDiff.map(async (commit) => ({
      ...commit,
      diff: await getCommitDiff(repo.path, commit.hash),
    })),
  );

  return { repo, commits };
}

export async function getAllRepoData(
  repos: GitRepo[],
  days: number = 1,
  onProgress?: (current: number, total: number, repoName: string) => void,
): Promise<RepoData[]> {
  const results: RepoData[] = [];

  for (const [index, repo] of repos.entries()) {
    onProgress?.(index + 1, repos.length, repo.name);
    const data = await getRepoData(repo, days);

    if (data.commits.length > 0) {
      results.push(data);
    }
  }

  return results;
}
