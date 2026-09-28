import { theme } from "@styles/theme.css";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
import { I18nProvider } from "react-aria-components";
import { ErrorScreen } from "@/components/layouts/error-screen/error-screen.component";
import type { ErrorScreenLink } from "@/components/layouts/error-screen/error-screen.component";
import { SITE_URL } from "@/features/labs/data/labs-seo";
import { useIsHydrated } from "@/hooks/use-is-hydrated.hook";
import { usePaperGrain } from "@/hooks/use-paper-grain.hook";
import { contactLinks } from "@/pages/welcome/data/contact-links.data";
import type { Route } from "./+types/root";
import * as styles from "./root.css";

import "@styles/global.css";
import "@styles/fonts.css";

const ERROR_LINKS: ErrorScreenLink[] = [
  { label: "Back home", to: "/" },
  { label: "Labs", to: "/labs/" },
];

const OG_IMAGE = {
  url: `${SITE_URL}/og-image-1200x630.png`,
  alt: "A CSS-3D laptop with a terminal dashboard on its screen, lit mint and gold on a near-black background.",
};

export function Layout({ children }: { children: React.ReactNode }) {
  usePaperGrain();

  return (
    <html className={theme} lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" href="/logo.svg" />
        {/* OG / Social: crawlers need an absolute URL. One image for every route. */}
        <meta property="og:type" content="website" />
        <meta property="og:image" content={OG_IMAGE.url} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={OG_IMAGE.alt} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={OG_IMAGE.url} />
        <meta name="twitter:image:alt" content={OG_IMAGE.alt} />
        {/* Both faces are self-hosted: the hero's first paint needs them, and nothing else. */}
        <link
          rel="preload"
          href="/fonts/PPNeueMontreal-Variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Doto-Variable-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Nicolas Coulonnier",
              alternateName: "Netoun",
              url: SITE_URL,
              jobTitle: "Full-stack engineer",
              description:
                "Full-stack engineer crafting fast, clean web experiences. Specialized in React, TypeScript, Next.js, NestJS and creative frontend development.",
              knowsAbout: [
                "React",
                "TypeScript",
                "Next.js",
                "NestJS",
                "Node.js",
                "WebGL",
                "Three.js",
                "Creative Coding",
              ],
              // The footer's profiles, so the two never drift apart again.
              sameAs: contactLinks
                .map((link) => link.url)
                .filter((url) => url.startsWith("https://")),
            }),
          }}
        />
        <Meta />
        <Links />
      </head>
      <body>
        <div className={styles.appContent}>
          {/* React Aria announces in the page's language, not the browser's. */}
          <I18nProvider locale="en-US">{children}</I18nProvider>
          <ScrollRestoration />
          <Scripts />
        </div>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

// A route that throws lands here. Unknown paths do not: the `*` route (pages/not-found) takes
// them. The boundary can render inside the SPA fallback, whose body is empty, so it hydrates as
// nothing and paints on the next render.
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { pathname } = useLocation();
  const isHydrated = useIsHydrated();
  if (!isHydrated) return null;

  const code = isRouteErrorResponse(error) ? String(error.status) : "ERROR";
  const stack =
    import.meta.env.DEV && error instanceof Error ? (error.stack ?? error.message) : undefined;

  return (
    <>
      <title>Netoun - Error</title>
      <meta name="robots" content="noindex" />
      <ErrorScreen
        code={code}
        title="Something broke"
        command={`open ${pathname}`}
        output={
          isRouteErrorResponse(error) && error.statusText
            ? `error: ${error.statusText}`
            : "error: the page stopped"
        }
        links={ERROR_LINKS}
        stack={stack}
      >
        <p>This page hit an error while loading. Reloading it usually helps.</p>
      </ErrorScreen>
    </>
  );
}
