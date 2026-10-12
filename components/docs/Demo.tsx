import type { ReactNode } from "react";
import { CodeBlock } from "./CodeBlock";

/** A live example with its source underneath, collapsed by default. */
export function Demo({ children, code, className = "", open = false }: { children: ReactNode; code: string; className?: string; open?: boolean }) {
  return (
    <figure className="demo">
      <div className={`demo-canvas ${className}`}>{children}</div>
      <details className="demo-source" open={open}>
        <summary>Show code</summary>
        <CodeBlock code={code} />
      </details>
    </figure>
  );
}
