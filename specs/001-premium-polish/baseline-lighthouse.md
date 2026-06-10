# Baseline Lighthouse — avant chantier (T001)

**Date**: 2026-06-10 · **Commit de base**: branche `001-premium-polish` (départ 0fc2344 + modifs locales)
**Conditions**: `bun run build` → `npx serve build/client -l 4173` → `npx lighthouse http://localhost:4173/ --chrome-flags="--headless=new" --only-categories=performance,accessibility,best-practices,seo`, 3 runs, médiane.

| Run | Perf | A11y | Best Practices | SEO | LCP | CLS | TBT |
|-----|------|------|----------------|-----|-----|-----|-----|
| 1 (outlier, cold start) | 53 | 93 | 100 | 100 | 3.8s | 0.008 | 4700ms |
| 2 | 84 | 93 | 100 | 100 | 3.8s | 0.012 | 100ms |
| 3 | 85 | 93 | 100 | 100 | 3.8s | 0.001 | 50ms |

## Baseline retenue (médiane, hors outlier)

| Perf | A11y | Best Practices | SEO | LCP | CLS | TBT |
|------|------|----------------|-----|-----|-----|-----|
| **84** | **93** | **100** | **100** | **3.8s** | **≤0.012** | **≤100ms** |

**Règle de comparaison (SC-002)** : après chaque lot, mêmes conditions, 3 runs, médiane hors outlier ≥ baseline sur les 4 catégories ; CLS ne doit pas dépasser 0.012 ; TBT ne doit pas dépasser ~100ms.

## Résultat final — après US1→US4 (T029)

| Étape | Perf | A11y | BP | SEO | CLS | TBT |
|-------|------|------|----|----|-----|-----|
| Baseline | 84 | 93 | 100 | 100 | ≤0.012 | ≤100ms |
| Après US2 | 84 | 98 | 100 | 100 | ≤0.002 | ≤70ms |
| Après US3 | 84 | 100 | 100 | 100 | ≤0.002 | ≤50ms |
| **Final (US4)** | **85** | **100** | **100** | **100** | **≤0.005** | **≤60ms** |

**SC-002 : PASS** — zéro régression ; Perf +1, A11y +7 (focus-visible global + hiérarchie h1/h2), CLS et TBT améliorés.
