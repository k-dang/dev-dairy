import { useKeyboard } from "@opentui/react";
import { readFileSync } from "fs";
import { useState } from "react";

interface FilePreviewProps {
  filePath: string;
  onBack: () => void;
}

export function FilePreview({ filePath, onBack }: FilePreviewProps) {
  const [content] = useState(() => {
    try {
      return readFileSync(filePath, "utf-8");
    } catch (error) {
      return `Error reading file: ${error instanceof Error ? error.message : "Unknown error"}`;
    }
  });

  useKeyboard((key) => {
    if (key.name === "escape" || key.name === "q" || key.name === "b") {
      onBack();
    }
  });

  return (
    <box flexDirection="column" padding={1}>
      <box
        border
        title="File Preview"
        padding={1}
        flexDirection="column"
        gap={1}
      >
        <text>
          <span fg="gray">File: </span>
          <span fg="cyan">{filePath}</span>
        </text>

        <box
          border
          borderStyle="single"
          padding={1}
          flexDirection="column"
          marginTop={1}
        >
          <text>{content}</text>
        </box>

        <box marginTop={1}>
          <text>
            <span fg="gray">[B] Back [Q/Esc] Back</span>
          </text>
        </box>
      </box>
    </box>
  );
}
