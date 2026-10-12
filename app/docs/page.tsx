import { technologies } from "@/lib/technologies";
import { TechnologyIcon } from "@/components/TechnologyIcon";
import { TechnologyMarquee } from "@/components/TechnologyMarquee";
import { LiquidButton, ScrubbedHeading } from "@/components/Demos";
import { CodeBlock, InstallTabs } from "@/components/docs/CodeBlock";
import { Demo } from "@/components/docs/Demo";
import { IconSetDemos } from "@/components/docs/IconSetDemos";
import { PropsTable } from "@/components/docs/PropsTable";
import { SideNav, type NavGroup } from "@/components/docs/SideNav";
import { dataAttributes, hookOptions, hookReturns, liquidFillProps, PACKAGE, polygonInput, VERSION } from "@/docs/api";
import * as snippets from "@/docs/snippets";
import { HOME_HREF, SITE } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Install react-liquid-fill, see live demos, use it with any icon set, and browse the full API for LiquidFill, useLiquidFill and liquidPolygon.",
  alternates: { canonical: "/docs" },
  openGraph: { title: `Documentation · ${SITE.name}`, url: "/docs" },
};

const nav: NavGroup[] = [
  {
    title: "Getting started",
    items: [
      { id: "overview", label: "Overview" },
      { id: "installation", label: "Installation" },
      { id: "quick-start", label: "Quick start" },
    ],
  },
  {
    title: "Demos",
    items: [
      { id: "demo-hover", label: "On hover" },
      { id: "demo-scroll", label: "On scroll" },
      { id: "demo-anything", label: "On anything" },
    ],
  },
  {
    title: "Guides",
    items: [
      { id: "icon-sets", label: "Any icon set" },
      { id: "the-hook", label: "Using the hook" },
      { id: "styling", label: "Styling and dark mode" },
      { id: "accessibility", label: "Accessibility" },
    ],
  },
  {
    title: "API",
    items: [
      { id: "api-liquidfill", label: "<LiquidFill />" },
      { id: "api-hook", label: "useLiquidFill()" },
      { id: "api-polygon", label: "liquidPolygon()" },
      { id: "api-styling", label: "Attributes and CSS" },
    ],
  },
];

export default function DocsPage() {
  return (
    <>
      <header className="topbar">
        <a href={HOME_HREF} className="brand">
          <span className="brand-mark" aria-hidden="true" />
          {PACKAGE}
        </a>
        <span className="chip">v{VERSION}</span>
        <span className="topbar-crumb">Docs</span>
        <code className="topbar-install">npm i {PACKAGE}</code>
      </header>

      <div className="docs">
        <aside className="docs-aside">
          <SideNav groups={nav} />
        </aside>

        <main className="docs-main">
          {/* ------------------------------------------------ Getting started */}
          <section id="overview" className="doc-section hero">
            <p className="eyebrow">React component · hook · zero dependencies</p>
            <h1>Liquid Fill</h1>
            <p className="lede">
              Pour colour into icons, buttons and text. {PACKAGE} stacks two versions of anything and reveals the top one
              with an animated liquid edge, on hover, focus, scroll, or your own trigger. Hover the strip below.
            </p>
          </section>

          <div className="hero-strip">
            <TechnologyMarquee>
              {technologies.map((t) => (
                <div className="technology-slot" key={t.slug}>
                  <TechnologyIcon name={t.name} slug={t.slug} darkInvert={t.darkInvert} />
                </div>
              ))}
            </TechnologyMarquee>
          </div>

          <section id="installation" className="doc-section">
            <h2>Installation</h2>
            <p>Requires React 18 or newer. Works with Next.js (App and Pages Router), Vite, Remix and any other React setup. It ships no CSS file and has no dependencies.</p>
            <InstallTabs commands={snippets.install} />
          </section>

          <section id="quick-start" className="doc-section">
            <h2>Quick start</h2>
            <p>
              Give <code>LiquidFill</code> a <code>base</code> that is always visible and a <code>fill</code> to pour over it.
              Hover and keyboard focus work straight away.
            </p>
            <CodeBlock code={snippets.quickStart} />
          </section>

          {/* ------------------------------------------------ Demos */}
          <section id="demo-hover" className="doc-section">
            <h2>On hover</h2>
            <p>
              The default, and what the <a href="#overview">strip at the top</a> uses. The liquid pours in from whichever side
              the pointer enters and drains when it leaves. Each logo is two image files: an outline and the full-colour logo.
              The strip itself is a small marquee from the example project; it slows to a stop under the mouse.
            </p>
            <CodeBlock code={snippets.hoverDemo} />
          </section>

          <section id="demo-scroll" className="doc-section">
            <h2>On scroll</h2>
            <p>
              Set <code>trigger=&quot;inView&quot;</code> and each item fills as it scrolls into view, rising from the bottom.
              Scroll back up and they drain. Use <code>inView.delay</code> to stagger a grid, or <code>inView.once</code> to keep
              them full.
            </p>
            <Demo code={snippets.scrollDemo}>
              <div className="scroll-grid">
                {technologies.map((t, i) => (
                  <TechnologyIcon
                    key={t.slug}
                    name={t.name}
                    slug={t.slug}
                    darkInvert={t.darkInvert}
                    size={56}
                    trigger="inView"
                    inView={{ delay: (i % 6) * 70 }}
                  />
                ))}
              </div>
            </Demo>
          </section>

          <section id="demo-anything" className="doc-section">
            <h2>On anything</h2>
            <p>
              Nothing is tied to icons. The heading uses the hook with <code>trigger=&quot;manual&quot;</code> and calls{" "}
              <code>setProgress()</code> as you scroll. The button is <code>LiquidFill</code> rendered as a <code>button</code>{" "}
              with two copies of its label.
            </p>
            <Demo code={snippets.scrubDemo} className="is-stack">
              <ScrubbedHeading>Scrubbed by scroll position.</ScrubbedHeading>
            </Demo>
            <Demo code={snippets.buttonDemo}>
              <LiquidButton>Get in touch ↗</LiquidButton>
            </Demo>
          </section>

          {/* ------------------------------------------------ Guides */}
          <section id="icon-sets" className="doc-section">
            <h2>Use it with any icon set</h2>
            <p>
              {PACKAGE} doesn&apos;t ship icons and doesn&apos;t care where yours come from. You need two renderings of the same
              thing: a quiet <code>base</code> and a coloured <code>fill</code>. How you make them depends on the set. Hover each
              example.
            </p>
            <IconSetDemos />
            <p className="note">
              Need outline and colour versions of brand logos? The demo strip uses Devicon&apos;s full-colour logos, with the
              outline generated from the same file by re-styling every shape to a white fill and a thin stroke. The script that
              does this is in the example project.
            </p>
          </section>

          <section id="the-hook" className="doc-section">
            <h2>Using the hook</h2>
            <p>
              <code>LiquidFill</code> is a thin wrapper. When you need your own markup, use <code>useLiquidFill</code>{" "}
              directly: attach <code>ref</code> and <code>bind</code> to an element, and clip whatever should be revealed with the{" "}
              <code>--liquid-clip</code> variable the hook animates.
            </p>
            <CodeBlock code={snippets.hookBasic} />
          </section>

          <section id="styling" className="doc-section">
            <h2>Styling and dark mode</h2>
            <p>
              There is no stylesheet to import and no theme provider. The library only writes one CSS variable and two data
              attributes, so you style everything with your own CSS, Tailwind or CSS-in-JS.
            </p>
            <CodeBlock code={snippets.themingCss} language="css" />
          </section>

          <section id="accessibility" className="doc-section">
            <h2>Accessibility</h2>
            <ul className="checklist">
              <li>The fill layer is rendered with <code>aria-hidden</code>, so screen readers announce the content once.</li>
              <li>The default triggers include keyboard focus. Add <code>tabIndex=&#123;0&#125;</code> to non-interactive elements you want reachable.</li>
              <li>Users who turn on reduced motion get an instant change instead of the animation. Set <code>reducedMotion=&quot;ignore&quot;</code> to opt out.</li>
              <li>Touch screens have no hover, so nothing happens by default. Set <code>touch=&quot;tap-toggle&quot;</code> to fill on tap.</li>
            </ul>
          </section>

          {/* ------------------------------------------------ API */}
          <section id="api-liquidfill" className="doc-section">
            <h2>
              <code>&lt;LiquidFill /&gt;</code>
            </h2>
            <CodeBlock code={`import { LiquidFill } from "${PACKAGE}";`} compact />
            <PropsTable rows={liquidFillProps} />
          </section>

          <section id="api-hook" className="doc-section">
            <h2>
              <code>useLiquidFill(options)</code>
            </h2>
            <CodeBlock code={`import { useLiquidFill } from "${PACKAGE}";`} compact />
            <h3>Options</h3>
            <PropsTable rows={hookOptions} />
            <h3>Returns</h3>
            <PropsTable rows={hookReturns} showDefault={false} />
          </section>

          <section id="api-polygon" className="doc-section">
            <h2>
              <code>liquidPolygon(input)</code>
            </h2>
            <p>
              The geometry on its own, with no React. Returns a CSS <code>polygon()</code> string, or <code>inset()</code> at 0 and
              1. Use it with vanilla JS, canvas clipping, or another framework.
            </p>
            <CodeBlock code={snippets.polygonExample} />
            <PropsTable rows={polygonInput} />
          </section>

          <section id="api-styling" className="doc-section">
            <h2>Attributes and CSS</h2>
            <PropsTable rows={dataAttributes} showDefault={false} />
          </section>

          <footer className="docs-footer">
            {PACKAGE} v{VERSION} · MIT · Demo logos from Devicon (MIT) and Simple Icons (CC0) · Effect after sandepalm.com
          </footer>
        </main>
      </div>
    </>
  );
}
