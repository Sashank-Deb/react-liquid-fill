"use client";

import { useEffect, useState } from "react";

export type NavGroup = { title: string; items: { id: string; label: string }[] };

/** Sidebar that highlights the section currently in view. */
export function SideNav({ groups }: { groups: NavGroup[] }) {
  const [active, setActive] = useState(groups[0]?.items[0]?.id);

  useEffect(() => {
    const ids = groups.flatMap((g) => g.items.map((i) => i.id));
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [groups]);

  return (
    <nav className="sidenav" aria-label="Documentation">
      {groups.map((g) => (
        <div className="sidenav-group" key={g.title}>
          <p className="sidenav-title">{g.title}</p>
          <ul>
            {g.items.map((i) => (
              <li key={i.id}>
                <a href={`#${i.id}`} aria-current={active === i.id ? "location" : undefined}>
                  {i.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
