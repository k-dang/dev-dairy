import { useKeyboard } from "@opentui/react";
import type { GitRepo } from "../types/index.ts";

interface RepoListProps {
  repos: GitRepo[];
  onConfirm: () => void;
}

export function RepoList({ repos, onConfirm }: RepoListProps) {
  useKeyboard((key) => {
    if (key.name === "return") {
      onConfirm();
    }
  });

  return (
    <box style={{ flexDirection: "column", padding: 1 }}>
      <box
        style={{ border: true, padding: 1, flexDirection: "column", gap: 1 }}
        title={`Dev Diary Repositories (${repos.length})`}
      >
        <scrollbox style={{ height: 15 }} focused>
          <box style={{ flexDirection: "column" }}>
            {repos.map((repo, index) => (
              <text key={`${repo.name}-${index}`}>
                <span fg="green">• </span>
                <span fg="white">{repo.name}</span>
                <span fg="gray"> - {repo.path}</span>
              </text>
            ))}
          </box>
        </scrollbox>

        <text>
          <span fg="gray">[Enter] Continue [Esc] Back</span>
        </text>
      </box>
    </box>
  );
}
