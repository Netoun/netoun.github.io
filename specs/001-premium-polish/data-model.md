# Data Model — Premium Polish Pass

Pas de données métier (site statique, contenu inchangé). Les « entités » de ce chantier sont des vocabulaires de design partagés :

## Motion Tokens (`app/styles/motion.css.ts`)

| Champ | Valeurs | Règle |
|-------|---------|-------|
| `duration` | `fast` 150ms · `base` 300ms · `slow` 600ms | Toute transition/animation référence un token |
| `easing` | `signature` cubic-bezier(.22,1,.36,1) · `out` ease-out | Un seul easing signature pour les reveals/hovers |

## Interaction State (par élément interactif)

| État | Déclencheur | Contrainte |
|------|-------------|-----------|
| rest | défaut | visible sans JS |
| hover | pointer fine | transform/opacity/couleur only |
| focus-visible | clavier | outline 2px accent + offset, jamais supprimé |
| active/press | clic/tap | retour ≤ duration.fast |
| disabled | prop | opacity réduite, curseur not-allowed |

Relation : chaque primitive (Button, Tag, TerminalButtons, liens cards/footer) implémente les 5 états ; les états hover-only doivent avoir un équivalent focus/tap.

## Reveal State (par section, hook `use-reveal`)

| État | Transition | Règle |
|------|-----------|-------|
| `idle` | montage JS (avant paint) | sans JS : jamais appliqué → contenu visible |
| `revealed` | entrée viewport (une fois) | transform/opacity, stagger `--reveal-index` × 70ms, plafonné ~400ms/section |
| `static` | `prefers-reduced-motion` ou bfcache restore | état final immédiat, aucune animation |

Transitions : `idle → revealed` (IntersectionObserver) ; `* → static` (media query / pageshow). Jamais `revealed → idle` (no replay).

## Surface Tokens (P4, `theme.css.ts`)

| Champ | Valeurs cibles | Règle |
|-------|----------------|-------|
| `border` | `subtle` · `strong` (2-3 max, color-mix nommés) | remplace les color-mix ad hoc |
| `shadow` | `restCard` · `hoverCard` (+ glows existants) | repos discret → hover affirmé, même courbe partout |
