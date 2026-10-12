import { DOCS_HREF, SITE } from "@/lib/site";
import { HeroShowcase } from "@/components/landing/HeroShowcase";
import { InstallChip } from "@/components/landing/InstallChip";
import { Playground } from "@/components/landing/Playground";
import { UseCases } from "@/components/landing/UseCases";
import { FinalCta } from "@/components/landing/FinalCta";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { quickStart } from "@/docs/snippets";

const features = [
  { title: "Any content", text: "Icons, logos, images, buttons, links, headings. If it renders, it can fill. Bring your own icon set." },
  { title: "Four triggers", text: "Hover, keyboard focus, scrolling into view, or your own code. Mix them, or scrub progress with setProgress()." },
  { title: `${SITE.sizeGzip} gzipped`, text: "One component, one hook and one pure function. No dependencies, no stylesheet, no provider." },
  { title: "Accessible by default", text: "Focus triggers the fill, the duplicate layer is hidden from screen readers, and reduced-motion users see an instant change." },
  { title: "Ready for Next.js", text: "Safe to server-render. Works in the App and Pages Router, Vite, Remix and any React 18+ setup." },
  { title: "Fully typed", text: "Written in TypeScript with documented options, so your editor completes every prop." },
];

const iconSets = ["Devicon", "Lucide", "react-icons", "Heroicons", "Material Icons", "Simple Icons", "Phosphor", "Your own SVGs"];

const faqs = [
  {
    q: "What does react-liquid-fill do?",
    a: "It stacks two versions of an element, such as an outlined and a full-colour icon, and reveals the top one with an animated liquid edge when the user hovers, focuses or scrolls to it.",
  },
  {
    q: "Does it work with my icon library?",
    a: "Yes. It doesn't ship icons. Pass any two renderings as base and fill: image files, SVG components from react-icons or Lucide, emoji or text.",
  },
  {
    q: "How big is it?",
    a: `About ${SITE.sizeGzip} minified and gzipped, with no dependencies besides React.`,
  },
  {
    q: "Can I trigger the fill on scroll instead of hover?",
    a: 'Yes. Set trigger="inView" to fill as elements scroll into view, or call setProgress() to tie the fill to scroll position.',
  },
  {
    q: "Is it accessible?",
    a: "Keyboard focus triggers the same effect as hover, the fill layer is aria-hidden so content is announced once, and users who prefer reduced motion get an instant change.",
  },
];

/** The landing page body. The route (app/page.tsx) supplies the published version. */
export function Landing({ version }: { version: string }) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE.name,
      url: `${SITE.url}/`,
      description: SITE.description,
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareSourceCode",
      name: SITE.name,
      description: SITE.description,
      url: SITE.url,
      codeRepository: SITE.repo,
      programmingLanguage: ["TypeScript", "JavaScript"],
      runtimePlatform: "React",
      license: "https://opensource.org/licenses/MIT",
      version,
      author: { "@type": "Person", name: SITE.author },
      keywords: SITE.keywords.join(", "),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <div className="lp">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="lp-header">
        <a href="#top" className="brand">
          <span className="brand-mark" aria-hidden="true" />
          {SITE.name}
        </a>
        <nav className="lp-nav" aria-label="Main">
          <a href="#features">Features</a>
          <a href="#playground">Playground</a>
          <a href="#use-cases">Use cases</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a href={DOCS_HREF} className="lp-header-cta">
          Discover the core library
        </a>
      </header>

      <main id="top">
        <section className="lp-hero" aria-labelledby="hero-title">
          <div className="lp-hero-copy">
            <p className="lp-eyebrow">
              <span className="chip">v{version}</span> React · MIT · {SITE.sizeGzip}
            </p>
            <h1 id="hero-title">Pour colour into your interface.</h1>
            <p className="lp-lede">
              {SITE.name} is a tiny React component and hook that reveals icons, buttons and text with an animated liquid edge.
              On hover, on focus, or as they scroll into view.
            </p>
            <div className="lp-hero-actions">
              <a href={DOCS_HREF} className="lp-btn lp-btn-primary">
                Discover the core library <span aria-hidden="true">→</span>
              </a>
              <InstallChip command={`npm i ${SITE.name}`} />
            </div>
          </div>
          <HeroShowcase />
        </section>

        <section className="lp-sets" aria-label="Compatible icon sets">
          <p>Works with the icons you already use</p>
          <ul>
            {iconSets.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>

        <section id="features" className="lp-section" aria-labelledby="features-title">
          <p className="lp-kicker">Features</p>
          <h2 id="features-title">A small API that covers every trigger.</h2>
          <div className="lp-features">
            {features.map((f) => (
              <article className="lp-feature" key={f.title}>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="playground" className="lp-section" aria-labelledby="playground-title">
          <p className="lp-kicker">Playground</p>
          <h2 id="playground-title">Tune it live, copy the code.</h2>
          <p className="lp-section-lede">Every control maps to a prop. The snippet updates as you change them.</p>
          <Playground />
        </section>

        <section id="use-cases" className="lp-section" aria-labelledby="cases-title">
          <p className="lp-kicker">Use cases</p>
          <h2 id="cases-title">Made for the details people hover over.</h2>
          <UseCases />
        </section>

        <section className="lp-section lp-start" aria-labelledby="start-title">
          <div>
            <p className="lp-kicker">Get started</p>
            <h2 id="start-title">Install, import, done.</h2>
            <p className="lp-section-lede">Give LiquidFill a base and a fill. Hover and keyboard focus work immediately.</p>
            <dl className="lp-stats">
              <div>
                <dt>Size</dt>
                <dd>{SITE.sizeGzip}</dd>
              </div>
              <div>
                <dt>Dependencies</dt>
                <dd>0</dd>
              </div>
              <div>
                <dt>Triggers</dt>
                <dd>4</dd>
              </div>
              <div>
                <dt>React</dt>
                <dd>18+</dd>
              </div>
            </dl>
          </div>
          <CodeBlock code={quickStart} />
        </section>

        <section id="faq" className="lp-section" aria-labelledby="faq-title">
          <p className="lp-kicker">FAQ</p>
          <h2 id="faq-title">Questions</h2>
          <div className="lp-faq">
            {faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <FinalCta docsHref={DOCS_HREF} />
      </main>

      <footer className="lp-footer">
        <span>
          {SITE.name} v{version} · MIT
        </span>
        <nav className="lp-footer-links" aria-label="Project">
          <a href={DOCS_HREF}>Docs</a>
          <a href={SITE.repo} rel="noopener">GitHub</a>
          <a href={SITE.npm} rel="noopener">npm</a>
        </nav>
        <span>Demo logos from Devicon (MIT) and Simple Icons (CC0)</span>
      </footer>
    </div>
  );
}
