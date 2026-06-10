# Feature Specification: Premium Polish Pass

**Feature Branch**: `001-premium-polish`

**Created**: 2026-06-10

**Status**: Draft

**Input**: User description: "Premium polish pass du portfolio : élever la qualité perçue sans refonte — micro-interactions (focus-visible, hover states, fix zoom image project-card, CTA hero magnetic), motion orchestrée (entrée hero séquencée, scroll reveals avec stagger), rythme typographique et espacement, harmonisation matière/lumière (ombres, glows, bordures). Contraintes : zéro nouvelle dépendance, zéro régression Lighthouse, prefers-reduced-motion partout, mobile au même niveau, GPU-only transforms."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Micro-interactions impeccables (Priority: P1)

Un recruteur ou un pair technique parcourt le site à la souris ou au clavier. Chaque élément interactif (boutons, cartes projet, tags, liens) répond de façon nette et cohérente : un état survol distinct, un état focus clavier visible, un retour au clic. Les CTAs du hero attirent subtilement le curseur (effet « magnetic » discret). Rien ne semble mort ou oublié.

**Why this priority**: C'est le signal premium le plus immédiat et le moins risqué — des quick wins visibles dès le premier survol, dont un bug avéré (zoom image des cartes projet inopérant).

**Independent Test**: Parcourir la home et /labs au survol puis entièrement au clavier (Tab) ; chaque élément interactif montre un état hover et un focus visible distincts ; le zoom image des cartes projet fonctionne ; les CTAs hero suivent légèrement le curseur sur desktop.

**Acceptance Scenarios**:

1. **Given** la home chargée sur desktop, **When** le visiteur survole une carte projet, **Then** l'image zoome visiblement (état repos ≠ état survol) en plus de l'inclinaison et du reflet existants.
2. **Given** une navigation au clavier, **When** le focus atteint un bouton, un tag ou un lien, **Then** un anneau de focus visible et cohérent avec l'identité visuelle apparaît.
3. **Given** le hero sur desktop, **When** le curseur approche un CTA, **Then** le CTA se déplace subtilement vers le curseur (±4px max) et revient en place quand le curseur s'éloigne.
4. **Given** un appareil tactile ou une préférence « réduire les animations », **When** le visiteur interagit, **Then** l'effet magnetic est absent et les états press/focus restent pleinement fonctionnels.

---

### User Story 2 - Arrivée et défilement orchestrés (Priority: P2)

Le visiteur arrive sur la home : le hero se révèle en séquence intentionnelle (titre, puis sous-titre, puis CTAs, puis l'ordinateur 3D). En défilant, chaque section apparaît avec un léger décalé entre ses cartes, donnant une impression de mise en scène plutôt que d'apparition brute.

**Why this priority**: Le plus gros impact sur la qualité perçue globale, mais plus de surface de risque (perf, fluidité Firefox) — donc après les quick wins.

**Independent Test**: Recharger la home : l'entrée du hero est séquencée et fluide ; défiler jusqu'à chaque section : les cartes se révèlent en stagger sans à-coups ni décalage de mise en page ; activer « réduire les animations » : tout est visible immédiatement sans mouvement.

**Acceptance Scenarios**:

1. **Given** un premier chargement de la home, **When** le hero s'affiche, **Then** ses éléments apparaissent en séquence ordonnée avec un easing commun, sans décalage de mise en page.
2. **Given** un défilement vers une section (projets, compétences, expériences), **When** la section entre dans le viewport, **Then** son label, son titre puis ses cartes se révèlent avec un décalé de 70ms par élément (plafonné à ~400ms par section), à 60fps sur Firefox et Chrome.
3. **Given** `prefers-reduced-motion` activé, **When** la page se charge ou défile, **Then** tout le contenu est immédiatement visible sans animation d'entrée.
4. **Given** une section déjà vue, **When** le visiteur remonte puis redescend, **Then** la section ne rejoue pas son animation d'entrée (pas d'effet gadget répétitif).

---

### User Story 3 - Rythme typographique et respiration (Priority: P3)

Le visiteur perçoit une mise en page aérée et rythmée : espacements verticaux réguliers entre sections, titres display qui respirent, numérotation terminal cohérente (`_01 / PROJECTS_`…) qui structure la lecture sur desktop comme sur mobile.

**Why this priority**: Renforce le premium « par le vide » mais dépend du vocabulaire visuel stabilisé par P1/P2.

**Independent Test**: Comparer visuellement chaque section sur mobile et desktop : espacements issus de l'échelle de tokens uniquement, numérotation terminal présente et uniforme sur tous les headers de section, hiérarchie de titres stricte.

**Acceptance Scenarios**:

1. **Given** la home sur tout breakpoint, **When** on inspecte les espacements entre sections et autour des titres, **Then** ils suivent un rythme régulier issu de l'échelle de tokens, sans valeur arbitraire.
2. **Given** les headers de section, **When** on les compare, **Then** ils partagent le même format de label terminal (numérotation, casse, espacement de lettres).
3. **Given** un affichage mobile, **When** on parcourt la page, **Then** la respiration verticale est équivalente à celle du desktop (pas de sections tassées).

---

### User Story 4 - Matière et lumière unifiées (Priority: P4)

Les surfaces du site (cartes projet, cartes expérience, fiches labs, footers) partagent un même vocabulaire d'ombres, de glows et de bordures : discret au repos, affirmé au survol, sans néon agressif. La page labs parle le même langage visuel que la home.

**Why this priority**: Finition d'harmonisation — précieuse mais invisible tant que les interactions et le motion ne sont pas en place.

**Independent Test**: Comparer côte à côte cartes projet, cartes expérience et fiches labs : ombres au repos et au survol issues du même vocabulaire, bordures unifiées sur 2-3 valeurs nommées, identité gold/cyan/violet intacte.

**Acceptance Scenarios**:

1. **Given** les différents types de cartes du site, **When** on les compare au repos et au survol, **Then** elles suivent la même logique d'ombre/glow (repos discret → survol affirmé).
2. **Given** la page labs, **When** on la parcourt après la home, **Then** la continuité de matière (grain, bordures, glows) est perceptible, sans rupture de style.
3. **Given** l'ensemble du site, **When** on audite les glows, **Then** ils restent réservés aux CTAs, au hero et aux états de survol — jamais décoratifs généralisés.

### Edge Cases

- Visiteur avec `prefers-reduced-motion` : aucune animation d'entrée, magnetic désactivé, contenu intégralement visible — sur toutes les stories.
- Appareil tactile (pas de hover) : chaque information ou affordance révélée au survol reste accessible (visible par défaut ou au focus/tap).
- Fenêtre redimensionnée pendant une animation d'entrée : pas de décalage de mise en page ni d'état bloqué à mi-animation.
- Navigation retour (bfcache) : la page restaurée n'est pas figée dans un état pré-animation (contenu invisible).
- JavaScript lent ou différé : le contenu est visible par défaut ; les animations d'entrée ne doivent jamais laisser la page blanche si le script tarde.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Tout élément interactif du site DOIT présenter trois états distincts : repos, survol et focus clavier visible, cohérents avec l'identité visuelle.
- **FR-002**: Le zoom d'image au survol des cartes projet DOIT être perceptible (l'état repos et l'état survol ne peuvent pas être identiques).
- **FR-003**: Les CTAs du hero DOIVENT présenter un effet magnetic subtil (déplacement ≤ 4px vers le curseur) sur desktop uniquement, désactivé sur tactile et avec `prefers-reduced-motion`.
- **FR-004**: L'entrée du hero DOIT être séquencée (titre → sous-titre → CTAs → élément 3D) avec un easing commun et sans décalage de mise en page.
- **FR-005**: Chaque section de la home DOIT se révéler à l'entrée dans le viewport avec un décalé entre ses éléments, une seule fois par visite de page.
- **FR-006**: Toute animation introduite DOIT être désactivée par `prefers-reduced-motion`, le contenu restant intégralement visible.
- **FR-007**: Les espacements verticaux entre et dans les sections DOIVENT suivre l'échelle de tokens existante, sans valeur arbitraire.
- **FR-008**: Les headers de section DOIVENT partager un format de label terminal uniforme (numérotation, casse, espacement de lettres).
- **FR-009**: Les surfaces (cartes, fiches, footers) DOIVENT partager un vocabulaire unifié d'ombres, de glows et de bordures, limité à un petit ensemble de valeurs nommées.
- **FR-010**: La page labs DOIT adopter le même vocabulaire de matière que la home (grain, bordures, glows).
- **FR-011**: Le contenu DOIT rester visible par défaut si les scripts d'animation ne s'exécutent pas ou tardent.
- **FR-012**: Aucune dépendance nouvelle ne DOIT être ajoutée ; aucun contenu (bio, projets, liens) ne DOIT être inventé ou modifié.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% des éléments interactifs présentent des états repos / survol / focus distincts, vérifiés par un parcours complet souris + clavier de la home et de /labs.
- **SC-002**: Les scores Lighthouse (Performance, Accessibility, Best Practices, SEO) après le chantier sont supérieurs ou égaux aux scores avant chantier — zéro régression, mesuré dans les mêmes conditions locales.
- **SC-003**: Les animations d'entrée et de scroll tiennent 60fps sur Chrome et Firefox desktop (aucune frame > 32ms imputable aux animations lors d'un enregistrement de défilement complet).
- **SC-004**: CLS inchangé ou amélioré : les reveals n'introduisent aucun décalage de mise en page mesurable.
- **SC-005**: Avec `prefers-reduced-motion`, 100% du contenu est visible sans animation, vérifié sur les deux pages.
- **SC-006**: Sur mobile, chaque finition a un équivalent perceptible (états tactiles, rythme vertical, matière) — aucune amélioration exclusivement hover.
- **SC-007**: Les vérifications qualité du projet (typecheck, lint, tests) passent à 100% après chaque lot livré.

## Assumptions

- Le périmètre est strictement du polish : aucun nouveau composant majeur, aucune refonte de section, aucune nouvelle page.
- L'ordre de livraison validé est : micro-interactions (P1) → motion orchestrée (P2) → typo/rythme (P3) → matière/lumière (P4), chaque lot livrable indépendamment.
- L'effet magnetic sur les CTAs hero est validé par le propriétaire du site (réponse explicite « Oui »).
- La tolérance Lighthouse est zéro régression : toute finition qui coûte des points est retirée ou retravaillée.
- Les invariants de la direction artistique (grain SVG du hero, blobs gold/cyan/violet, typo display du H1, glows subtils) sont intouchables.
- La numérotation terminal des headers de section est un ajout léger accepté si elle n'existe pas encore partout.
- Le cadrage initial détaillé se trouve dans `SPEC.md` à la racine ; le présent document est la source de vérité speckit pour la suite (plan, tasks, implement).
