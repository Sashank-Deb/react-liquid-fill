"use client";

import { useState } from "react";

export function InstallChip({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable: the command stays visible and selectable */
    }
  };
  return (
    <div className="lp-install">
      <code>
        <span aria-hidden="true">$ </span>
        {command}
      </code>
      <button type="button" onClick={copy} aria-label={`Copy "${command}"`}>
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
