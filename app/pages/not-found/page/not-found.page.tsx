import { useLocation } from "react-router";
import { ErrorScreen } from "@/components/layouts/error-screen/error-screen.component";
import { useIsHydrated } from "@/hooks/use-is-hydrated.hook";
import { useNotFoundGame } from "../hooks/use-not-found-game.hook";
import { NotFoundGameSection } from "../sections/not-found-game/not-found-game.section";

export function meta() {
  return [
    { title: "Netoun - Page not found" },
    { name: "description", content: "Nothing lives at this address on netoun.com." },
    { name: "robots", content: "noindex" },
  ];
}

/**
 * Any path no route claims. Cloudflare Pages answers it with `404.html` (status 404), the SPA
 * fallback; the page paints once hydrated, then offers a game while the visitor is here.
 */
export default function NotFoundPage() {
  const { pathname } = useLocation();
  const isHydrated = useIsHydrated();
  const game = useNotFoundGame();
  if (!isHydrated) return null;

  return (
    <ErrorScreen
      code="404"
      title="Page not found"
      command={`cd ${pathname}`}
      output={`cd: no such file or directory: ${pathname}`}
      links={[
        { label: "Back home", to: "/", isLit: game.phase === "won" },
        { label: "Labs", to: "/labs/" },
      ]}
      aside={<NotFoundGameSection game={game} />}
    >
      <p>
        Nothing lives at <code>{pathname}</code>. The link may be old, or the address mistyped.
      </p>
    </ErrorScreen>
  );
}
