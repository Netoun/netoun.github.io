# Quickstart — Vérifier le Premium Polish Pass

## Setup

```bash
bun run dev                          # localhost:5173
bun run typecheck && bun run lint    # gates après chaque lot
bun run test
```

Baseline perf (à faire AVANT le lot P1) :

```bash
bun run build
# servir le build de prod localement, puis 3 runs Lighthouse → médiane
# consigner dans specs/001-premium-polish/baseline-lighthouse.md
```

## Vérification par lot

### P1 — Micro-interactions

1. Souris : survoler chaque carte projet → l'image zoome (repos ≠ hover) ; boutons, tags, liens footer ont tous un hover net.
2. Clavier : `Tab` sur toute la home et /labs → anneau de focus visible partout, jamais supprimé.
3. Hero desktop : approcher un CTA → il glisse vers le curseur (≤4px) et revient.
4. DevTools → Rendering → « Emulate prefers-reduced-motion » : magnetic absent, états focus intacts.
5. Mode responsive (tactile) : pas de magnetic, affordances visibles sans hover.

### P2 — Motion orchestrée

1. Recharger `/` : hero en séquence (titre → sous-titre → CTAs → laptop), aucun layout shift.
2. Défiler : chaque section se révèle en stagger, une seule fois (remonter/redescendre = pas de replay).
3. Performance panel (Chrome **et** Firefox) : enregistrer un scroll complet → aucune frame > 32ms imputable aux reveals.
4. Reduced-motion émulé : tout visible immédiatement, zéro mouvement.
5. JS désactivé (DevTools) : tout le contenu visible.
6. Naviguer vers /labs puis bouton retour : page restaurée sans contenu invisible.

### P3 — Typographie & rythme

1. Comparer les espacements entre sections (desktop + 375px) : rythme régulier, pas de section tassée sur mobile.
2. Headers de section : même format `_0N / LABEL_` partout (Doto, même letterSpacing).
3. Vérifier hiérarchie h1 unique → h2 sections.

### P4 — Matière & lumière

1. Côte à côte project-card / experience-card / fiches labs : même logique d'ombre au repos et au survol.
2. /labs après la home : continuité de matière, pas de rupture.
3. Audit glows : uniquement CTAs, hero, hovers.

## Gate final (chaque lot)

```bash
bun run typecheck && bun run lint && bun run test
bun run build   # + Lighthouse, comparer à la baseline : zéro régression
```
