"use client";

import { useRef, useState } from "react";

export function CodeBlock({ code, language = "tsx", compact = false }: { code: string; language?: string; compact?: boolean }) {
  const pre = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // clipboard refused: select the text so the reader can copy it themselves
      const range = document.createRange();
      if (pre.current) range.selectNodeContents(pre.current);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className={`code${compact ? " is-compact" : ""}`}>
      <div className="code-bar">
        <span className="code-lang">{language}</span>
        <button type="button" className="code-copy" onClick={copy}>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre ref={pre}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function InstallTabs({ commands }: { commands: Record<string, string> }) {
  const names = Object.keys(commands);
  const [active, setActive] = useState(names[0]);
  return (
    <div className="install">
      <div className="install-tabs" role="tablist" aria-label="Package manager">
        {names.map((n) => (
          <button
            key={n}
            type="button"
            role="tab"
            id={`install-tab-${n}`}
            aria-selected={active === n}
            className="install-tab"
            onClick={() => setActive(n)}
          >
            {n}
          </button>
        ))}
      </div>
      <CodeBlock code={commands[active]} language="bash" compact />
    </div>
  );
}
