# Research — Premium Polish Pass

Aucun NEEDS CLARIFICATION restant (levés en amont avec le propriétaire). Décisions techniques :

## D1 — Reveals au scroll : CSS + IntersectionObserver maison, pas de lib

- **Decision**: hook partagé `use-reveal` composé sur `use-intersection-observer` + `use-animation-priority` existants ; l'animation elle-même en CSS (classe/data-attr togglée, transition transform/opacity), stagger via `transitionDelay` calculé (custom property `--reveal-index`).
- **Rationale**: zéro dépendance, GPU-only garanti, reduced-motion trivial (media query CSS), pas de coût JS par frame.
- **Alternatives considered**: Anime.js timeline par section (plus de JS par frame, inutile pour de simples fades) ; `animation-timeline: view()` CSS (support Firefox encore partiel → rejeté, contrainte Firefox 60fps).

## D2 — Contenu visible sans JS (FR-011)

- **Decision**: l'état caché (`opacity: 0; translateY`) n'est appliqué **que** via une classe/attr posée par JS au montage (avant paint via `useLayoutEffect` ou attr posé par le hook), jamais dans le CSS initial. Sans JS : tout est visible. bfcache : listener `pageshow` → état final.
- **Rationale**: prerender statique (`ssr: false` + prerender) — le HTML doit rester lisible si le bundle tarde ; protège aussi SEO et LCP.
- **Alternatives considered**: `opacity: 0` initial en CSS + `.js`-class sur `<html>` (flash possible, plus fragile).

## D3 — Magnetic CTA : translate JS léger, pas Anime.js

- **Decision**: hook local (mousemove sur la zone hero, rAF-throttled) qui pose `--magnet-x/--magnet-y` (clamp ±4px) ; le CSS applique `translate3d(var(--magnet-x), var(--magnet-y), 0)` avec transition de retour. Monté seulement si `(pointer: fine)` et pas `prefers-reduced-motion`.
- **Rationale**: 2 custom properties + 1 transition = composited ; aucune dépendance ; désactivation media-query native.
- **Alternatives considered**: springs Anime.js (sur-ingénierie pour ±4px).

## D4 — Entrée hero : étendre l'orchestrateur existant

- **Decision**: la séquence d'entrée vit dans `use-hero-animation.hook` (orchestrateur déjà en place depuis la migration récente), Anime.js timeline pour la cascade (H1 → sous-titre → CTAs → laptop), uniquement transform/opacity.
- **Rationale**: l'orchestrateur centralise déjà l'état d'animation du hero ; une timeline Anime.js y est idiomatique (lib déjà présente) ; un seul endroit pour le fallback reduced-motion.
- **Alternatives considered**: animations CSS à délais fixes (moins coordonnable avec l'état existant de l'orchestrateur).

## D5 — Vocabulaire motion centralisé

- **Decision**: `app/styles/motion.css.ts` exporte durées (`fast 150ms / base 300ms / slow 600ms`) et easings nommés (signature : `cubic-bezier(.22,1,.36,1)` déjà utilisé par project-card → promu en token).
- **Rationale**: l'easing signature existe déjà de facto dans project-card ; le nommer supprime les valeurs magiques et garantit la cohérence P1/P2.
- **Alternatives considered**: laisser inline (incohérences garanties à terme).

## D6 — Focus visible : `:focus-visible` + outline, pas box-shadow

- **Decision**: `outline: 2px solid` couleur d'accent + `outline-offset: 2px` sur `:focus-visible` ; pas de ring box-shadow.
- **Rationale**: outline ne déclenche pas de layout/paint des voisins, survit aux `overflow: hidden` (vs box-shadow rognée), standard React Aria (`data-focus-visible` dispo si besoin).
- **Alternatives considered**: box-shadow ring (rognée par `overflow: hidden` des cards).

## D7 — Baseline Lighthouse

- **Decision**: avant P1 : `bun run build` + serveur local de prod + 3 runs Lighthouse (mêmes flags), médiane consignée dans `specs/001-premium-polish/baseline-lighthouse.md`. Comparaison après chaque lot ; zéro régression sinon retrait/retravail.
- **Rationale**: exigence explicite du propriétaire (zéro régression) ; les rapports historiques à la racine ne sont pas comparables (conditions inconnues).
- **Alternatives considered**: comparer à la prod live (variance réseau → non reproductible).
