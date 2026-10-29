# QA audit of published 9701 (Chemistry) lessons

Auditor: `codebuff-deploy-fix` (role: auditor, assigned by `fathom-lesson-lead` at 20:09).
Date: 2026-10-29. Scope: **all 124 lessons currently published on `main`** under
`content/subjects/9701/lessons/`. Standards applied: `docs/CONTENT_GUIDE.md` §2 (one main
concept, 1–2 lessons per objective, 2–3 check blocks, 4–6 questions), §3 (questions),
§5 (provenance), `CLAUDE.md`, `docs/AGENT_COORDINATION.md`.

## Method, and what it can and cannot prove

Every published lesson was parsed and measured automatically: objective count, question
count, check-block count, question-placement, minutes, word count, presence of teaching
blocks (`explain`/`definition`/`intuition`/`example`/`diagram`), provenance status, and a
search of the **parsed** text for raw control characters and leaked LaTeX commands
(`ext{`, `ightarrow`, `rac{`).

Two metrics were tried and **discarded as unsound**, which is worth recording because both
produced confident-looking false positives:

- Scanning raw file bytes for control characters flagged 120 of 124 lessons. The cause was
  CRLF line endings, not corruption. Only the *parsed* text is meaningful.
- Counting sentences per paragraph flagged 82 lessons as "wall of text". It was counting
  numbered method steps and table rows as prose; the worst-offending file was a tidy
  four-step method plus a right/wrong table. It is recorded as context only and drives no
  verdict.

Structural metrics cannot detect "cryptic". I therefore read several lessons in full
(`gases-mr-determination`, `bonding-structure-giant-metallic`,
`chemical-formulas-writing-ionic-formulas`, `period-3-chemical-chlorides-and-bonding`).
All four were well built: objective, plain-language explanation, an intuition block with an
analogy that also states where the analogy breaks, a precise definition, a diagram with
full `alt` text, and a worked example with steps. **That is a sample, not a proof for all
124**; the per-lesson verdicts below are structural.

## Headline counts

| Verdict | Count | Meaning |
| --- | --- | --- |
| OK | 111 | Structure meets the guide |
| THIN | 13 | Fewer questions than the guide asks, or too many objectives in one lesson |
| BROKEN | 0 | No control characters, no leaked LaTeX, valid YAML, questions placed |
| MISLEADING | 0 found | Requires reading; none found in the sampled lessons |

**No lesson was unpublished.** The evidence supports expansion and re-review, not deletion,
and the assignment said to delete only what the evidence supports.

## Findings

**F1 — Nine published lessons are still `status: draft` (no review at all).**
All nine are the `bronsted-lowry-*` unit: `bronsted-lowry-common-acids-bases`,
`-indicators`, `-neutralisation`, `-ph-scale`, `-reactions`, `-salts`, `-strong-weak`,
`-theory`, `-titration-curves`. They reached `main` without an `ai-checked` pass, so the
publication gate (`publish.sh` only selects `ai-checked`) was bypassed. Their content may be
fine — this is a provenance defect, not evidence of bad teaching.

**F2 — Eleven published lessons record that their second pass was done by the writer.**
`bonding-structure-conductivity-solubility`, `-deduction`, `-giant-ionic`, `-giant-metallic`,
`-giant-molecular`, `-melting-points`, `-simple-molecular`, `gases-ideal-gas-model`,
`gases-mr-determination`, `gases-pressure-collisions`, `gases-pv-nrt`. Their notes say the
review was "a second, adversarial AI pass (same agent as the writer, not a human teacher)".
The wording is honest, but a self-review is not the independent review that `ai-checked` is
supposed to mean, so these eleven need a genuinely different reviewer.

**F3 — Thirteen lessons are structurally thin.** Two distinct causes:

- *Granularity (7 lessons, one per multi-objective topic):* `atoms-particles-in-the-atom`
  (5 objectives in one lesson), `atoms-isotopes` (4), `atoms-electrons-in-boxes` (4),
  `atoms-first-ionisation-energy` (4), `atoms-electronic-configurations` (3),
  `atoms-shells-subshells-orbitals` (3), `atoms-successive-ionisation-energies` (3),
  `effect-temperature-boltzmann` (3), `period-3-chemical-chlorides-and-bonding` (3). The
  guide asks for one main concept and typically 1–2 lessons per objective.
- *Too few questions (4 lessons):* `bonding-structure-giant-metallic` (2),
  `bonding-structure-deduction` (3), `gases-mr-determination` (3),
  `bronsted-lowry-titration-curves` (3).

**F4 — No corruption is live.** Zero lessons contain control characters or leaked LaTeX
commands. Independently verified for the lesson the user's screenshot showed
(`period-3-chemical-chlorides-and-bonding`): its database row was last written at
19:36:21Z, and the rendered page shows 18 real `→` glyphs with no `extNaCl`/`ightarrow`.

## Recommended actions (for the leader)

1. Assign a **different** agent to review the eleven F2 lessons and the nine F1 drafts;
   only then may they honestly carry `ai-checked`.
2. Split the seven multi-objective lessons (F3) across new lessons rather than padding them.
3. Give the four low-question lessons two or three more questions each.
4. Do not unpublish anything on this evidence. If the leader decides otherwise, the slugs
   above are the complete list that any deletion would apply to.

## Per-lesson table

Columns: verdict, lesson, topic, objectives carried, questions, check blocks, minutes,
words, teaching blocks, provenance status, evidence.

| Verdict | Lesson | Topic | Obj | Q | Checks | Min | Words | Teaching | Status | Evidence / note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| THIN | gases-mr-determination | 4.1 | 1 | 3 | 3 | 4 | 725 | 5 | ai-checked | 3 questions (guide: 4-6) |
| THIN | bonding-structure-giant-metallic | 4.2 | 1 | 2 | 2 | 3 | 808 | 5 | ai-checked | 2 questions (guide: 4-6) |
| THIN | bronsted-lowry-titration-curves | 7.2 | 1 | 3 | 3 | 6 | 837 | 8 | draft | 3 questions (guide: 4-6) |
| THIN | effect-temperature-boltzmann | 8.2 | 3 | 5 | 5 | 6 | 988 | 6 | ai-checked | 3 objectives in one lesson |
| THIN | bonding-structure-deduction | 4.2 | 1 | 3 | 3 | 4 | 1011 | 4 | ai-checked | 3 questions (guide: 4-6) |
| THIN | atoms-shells-subshells-orbitals | 1.3 | 3 | 6 | 6 | 5 | 1136 | 8 | ai-checked | 3 objectives in one lesson |
| THIN | atoms-particles-in-the-atom | 1.1 | 5 | 6 | 6 | 5 | 1158 | 7 | ai-checked | 5 objectives in one lesson |
| THIN | atoms-electrons-in-boxes | 1.3 | 4 | 6 | 6 | 4 | 1196 | 6 | ai-checked | 4 objectives in one lesson |
| THIN | atoms-first-ionisation-energy | 1.4 | 4 | 6 | 6 | 4 | 1281 | 5 | ai-checked | 4 objectives in one lesson |
| THIN | atoms-electronic-configurations | 1.3 | 3 | 7 | 7 | 5 | 1297 | 6 | ai-checked | 3 objectives in one lesson |
| THIN | atoms-isotopes | 1.2 | 4 | 6 | 6 | 4 | 1332 | 6 | ai-checked | 4 objectives in one lesson |
| THIN | atoms-successive-ionisation-energies | 1.4 | 3 | 6 | 6 | 5 | 1491 | 7 | ai-checked | 3 objectives in one lesson |
| THIN | period-3-chemical-chlorides-and-bonding | 9.2 | 3 | 7 | 7 | 7 | 1987 | 4 | ai-checked | 3 objectives in one lesson |
| OK | intermolecular-forces-strengths | 3.6 | 1 | 4 | 4 | 3 | 500 | 2 | ai-checked | structure meets guide |
| OK | rate-reaction-calculations | 8.1 | 1 | 4 | 4 | 4 | 600 | 4 | ai-checked | structure meets guide |
| OK | bronsted-lowry-ph-scale | 7.2 | 1 | 4 | 4 | 4 | 619 | 6 | draft | structure meets guide |
| OK | dot-cross-ionic | 3.7 | 1 | 4 | 4 | 4 | 649 | 4 | ai-checked | structure meets guide |
| OK | rate-reaction-meaning-and-collisions | 8.1 | 1 | 4 | 4 | 4 | 669 | 5 | ai-checked | structure meets guide |
| OK | intermolecular-forces-types | 3.6 | 1 | 4 | 4 | 4 | 679 | 5 | ai-checked | structure meets guide |
| OK | intermolecular-forces-water-properties | 3.6 | 1 | 4 | 4 | 4 | 687 | 4 | ai-checked | structure meets guide |
| OK | rate-reaction-concentration-pressure | 8.1 | 1 | 4 | 4 | 4 | 709 | 4 | ai-checked | structure meets guide |
| OK | dot-cross-octet-exceptions | 3.7 | 1 | 4 | 4 | 4 | 715 | 4 | ai-checked | structure meets guide |
| OK | dot-cross-multiple-covalent | 3.7 | 1 | 5 | 5 | 4 | 721 | 4 | ai-checked | structure meets guide |
| OK | intermolecular-forces-hydrogen-bonding | 3.6 | 2 | 4 | 4 | 4 | 741 | 5 | ai-checked | structure meets guide |
| OK | dot-cross-single-covalent | 3.7 | 1 | 5 | 5 | 4 | 752 | 4 | ai-checked | structure meets guide |
| OK | intermolecular-forces-polarity | 3.6 | 1 | 4 | 4 | 4 | 752 | 4 | ai-checked | structure meets guide |
| OK | dot-cross-coordinate-bonds | 3.7 | 1 | 4 | 4 | 4 | 794 | 4 | ai-checked | structure meets guide |
| OK | gases-pv-nrt | 4.1 | 1 | 5 | 5 | 5 | 798 | 5 | ai-checked | independent review not recorded (reviewer = writer) |
| OK | bronsted-lowry-common-acids-bases | 7.2 | 2 | 5 | 5 | 3 | 818 | 6 | draft | structure meets guide |
| OK | bronsted-lowry-neutralisation | 7.2 | 1 | 4 | 4 | 4 | 827 | 5 | draft | structure meets guide |
| OK | bronsted-lowry-strong-weak | 7.2 | 1 | 4 | 4 | 5 | 833 | 7 | draft | structure meets guide |
| OK | atoms-orbital-shapes | 1.3 | 1 | 5 | 5 | 3 | 933 | 5 | ai-checked | structure meets guide |
| OK | chemical-formulas-writing-ionic-formulas | 2.3 | 1 | 7 | 7 | 5 | 992 | 6 | ai-checked | structure meets guide |
| OK | chemical-formulas-compound-ions | 2.3 | 1 | 6 | 6 | 4 | 1004 | 4 | ai-checked | structure meets guide |
| OK | bronsted-lowry-salts | 7.2 | 1 | 5 | 5 | 4 | 1009 | 6 | draft | structure meets guide |
| OK | bronsted-lowry-theory | 7.2 | 1 | 6 | 6 | 4 | 1022 | 8 | draft | structure meets guide |
| OK | bonding-structure-conductivity-solubility | 4.2 | 1 | 4 | 4 | 4 | 1034 | 3 | ai-checked | independent review not recorded (reviewer = writer) |
| OK | relative-masses-molecular-and-formula-mass | 2.1 | 1 | 6 | 6 | 4 | 1047 | 7 | ai-checked | structure meets guide |
| OK | bronsted-lowry-reactions | 7.2 | 1 | 6 | 6 | 5 | 1081 | 7 | draft | structure meets guide |
| OK | covalent-bonding-double-and-triple-bonds | 3.4 | 1 | 5 | 5 | 4 | 1091 | 5 | ai-checked | structure meets guide |
| OK | shapes-molecules-bigger-molecules | 3.5 | 2 | 6 | 6 | 5 | 1103 | 7 | ai-checked | structure meets guide |
| OK | bronsted-lowry-indicators | 7.2 | 1 | 5 | 5 | 4 | 1114 | 6 | draft | structure meets guide |
| OK | bonding-structure-giant-ionic | 4.2 | 1 | 4 | 4 | 4 | 1120 | 5 | ai-checked | independent review not recorded (reviewer = writer) |
| OK | gases-ideal-gas-model | 4.1 | 1 | 4 | 4 | 4 | 1133 | 5 | ai-checked | independent review not recorded (reviewer = writer) |
| OK | mole-avogadro-mass-moles-particles | 2.2 | 1 | 7 | 7 | 5 | 1145 | 6 | ai-checked | structure meets guide |
| OK | chemical-formulas-balancing-equations | 2.3 | 1 | 6 | 6 | 5 | 1152 | 7 | ai-checked | structure meets guide |
| OK | chemical-formulas-empirical-from-data | 2.3 | 2 | 6 | 6 | 5 | 1154 | 7 | ai-checked | structure meets guide |
| OK | bonding-structure-simple-molecular | 4.2 | 1 | 4 | 4 | 4 | 1161 | 6 | ai-checked | independent review not recorded (reviewer = writer) |
| OK | shapes-molecules-predicting-shapes | 3.5 | 1 | 7 | 7 | 5 | 1163 | 7 | ai-checked | structure meets guide |
| OK | chemical-formulas-predicting-ion-charges | 2.3 | 1 | 6 | 6 | 4 | 1170 | 5 | ai-checked | structure meets guide |
| OK | chemical-formulas-combustion-analysis | 2.3 | 1 | 6 | 6 | 5 | 1171 | 5 | ai-checked | structure meets guide |
| OK | covalent-bonding-hybridisation | 3.4 | 1 | 5 | 5 | 5 | 1174 | 8 | ai-checked | structure meets guide |
| OK | bonding-structure-melting-points | 4.2 | 1 | 4 | 4 | 4 | 1199 | 5 | ai-checked | independent review not recorded (reviewer = writer) |
| OK | chemical-formulas-water-of-crystallisation | 2.3 | 2 | 6 | 6 | 5 | 1204 | 7 | ai-checked | structure meets guide |
| OK | reacting-masses-concentration | 2.4 | 1 | 7 | 7 | 5 | 1204 | 7 | ai-checked | structure meets guide |
| OK | chemical-formulas-empirical-and-molecular | 2.3 | 1 | 7 | 7 | 4 | 1209 | 8 | ai-checked | structure meets guide |
| OK | chemical-formulas-ionic-equations | 2.3 | 1 | 6 | 6 | 5 | 1225 | 8 | ai-checked | structure meets guide |
| OK | atoms-beams-in-electric-fields | 1.1 | 2 | 5 | 5 | 4 | 1234 | 5 | ai-checked | structure meets guide |
| OK | gases-pressure-collisions | 4.1 | 1 | 4 | 4 | 4 | 1239 | 7 | ai-checked | independent review not recorded (reviewer = writer) |
| OK | covalent-bonding-sigma-and-pi | 3.4 | 1 | 7 | 7 | 5 | 1241 | 9 | ai-checked | structure meets guide |
| OK | bonding-structure-giant-molecular | 4.2 | 1 | 4 | 4 | 5 | 1243 | 7 | ai-checked | independent review not recorded (reviewer = writer) |
| OK | shapes-molecules-vsepr-basics | 3.5 | 1 | 7 | 7 | 5 | 1253 | 9 | ai-checked | structure meets guide |
| OK | reacting-masses-gas-volumes | 2.4 | 1 | 6 | 6 | 5 | 1258 | 7 | ai-checked | structure meets guide |
| OK | reacting-masses-percentage-yield | 2.4 | 1 | 6 | 6 | 4 | 1269 | 6 | ai-checked | structure meets guide |
| OK | atoms-atomic-and-ionic-radius | 1.1 | 1 | 6 | 6 | 5 | 1280 | 6 | ai-checked | structure meets guide |
| OK | enthalpy-change-standard-conditions | 5.1 | 1 | 6 | 6 | 6 | 1282 | 5 | ai-checked | structure meets guide |
| OK | period-3-chemical-oxygen-chlorine-water | 9.2 | 1 | 6 | 6 | 6 | 1284 | 5 | ai-checked | structure meets guide |
| OK | chemical-equilibria-kp-expressions | 7.1 | 1 | 6 | 6 | 10 | 1285 | 6 | ai-checked | structure meets guide |
| OK | covalent-bonding-bond-strength-and-reactivity | 3.4 | 1 | 6 | 6 | 5 | 1296 | 7 | ai-checked | structure meets guide |
| OK | shapes-molecules-lone-pairs | 3.5 | 1 | 7 | 7 | 5 | 1303 | 7 | ai-checked | structure meets guide |
| OK | covalent-bonding-expanded-octets | 3.4 | 1 | 6 | 6 | 4 | 1320 | 8 | ai-checked | structure meets guide |
| OK | hess-law-formation-cycles | 5.2 | 2 | 6 | 6 | 8 | 1320 | 7 | ai-checked | structure meets guide |
| OK | reacting-masses-titration-calculations | 2.4 | 1 | 6 | 6 | 5 | 1320 | 6 | ai-checked | structure meets guide |
| OK | period-3-chemical-oxidation-numbers | 9.2 | 1 | 6 | 6 | 5 | 1335 | 4 | ai-checked | structure meets guide |
| OK | reacting-masses-burning-hydrocarbons | 2.4 | 1 | 6 | 6 | 5 | 1335 | 6 | ai-checked | structure meets guide |
| OK | redox-processes-oxidation-numbers | 6.1 | 1 | 6 | 6 | 8 | 1338 | 9 | ai-checked | structure meets guide |
| OK | mole-avogadro-the-mole | 2.2 | 1 | 6 | 6 | 4 | 1341 | 8 | ai-checked | structure meets guide |
| OK | rate-reaction-collision-theory | 8.1 | 2 | 6 | 6 | 6 | 1379 | 5 | ai-checked | structure meets guide |
| OK | hess-law-bond-energies | 5.2 | 2 | 6 | 6 | 7 | 1399 | 7 | ai-checked | structure meets guide |
| OK | metallic-bonding-sea-of-electrons | 3.3 | 1 | 6 | 6 | 5 | 1401 | 8 | ai-checked | structure meets guide |
| OK | redox-processes-electron-transfer | 6.1 | 2 | 6 | 6 | 8 | 1413 | 9 | ai-checked | structure meets guide |
| OK | rate-reaction-measuring | 8.1 | 1 | 6 | 6 | 6 | 1422 | 5 | ai-checked | structure meets guide |
| OK | atoms-ionisation-energy-trends | 1.4 | 2 | 6 | 6 | 5 | 1430 | 7 | ai-checked | structure meets guide |
| OK | chemical-equilibria-kc-kp-calculations | 7.1 | 1 | 6 | 6 | 10 | 1451 | 6 | ai-checked | structure meets guide |
| OK | ionic-bonding-electrostatic-attraction | 3.2 | 2 | 6 | 6 | 4 | 1455 | 8 | ai-checked | structure meets guide |
| OK | redox-processes-balancing-equations | 6.1 | 1 | 7 | 7 | 9 | 1455 | 7 | ai-checked | structure meets guide |
| OK | hess-law-combustion-cycles | 5.2 | 2 | 6 | 6 | 7 | 1467 | 7 | ai-checked | structure meets guide |
| OK | covalent-bonding-shared-pairs | 3.4 | 1 | 7 | 7 | 5 | 1471 | 8 | ai-checked | structure meets guide |
| OK | redox-processes-disproportionation | 6.1 | 1 | 6 | 6 | 8 | 1472 | 9 | ai-checked | structure meets guide |
| OK | reacting-masses-deducing-stoichiometry | 2.4 | 1 | 6 | 6 | 5 | 1474 | 7 | ai-checked | structure meets guide |
| OK | hess-law-route-independence | 5.2 | 1 | 6 | 6 | 7 | 1481 | 7 | ai-checked | structure meets guide |
| OK | redox-processes-special-cases-roman-numerals | 6.1 | 2 | 8 | 8 | 8 | 1483 | 8 | ai-checked | structure meets guide |
| OK | electronegativity-bonding-ionic-or-covalent | 3.1 | 1 | 6 | 6 | 5 | 1509 | 9 | ai-checked | structure meets guide |
| OK | kinetics-catalysis-types | 8.3 | 1 | 6 | 6 | 7 | 1511 | 6 | ai-checked | structure meets guide |
| OK | ionic-bonding-describing-ionic-compounds | 3.2 | 2 | 7 | 7 | 5 | 1526 | 6 | ai-checked | structure meets guide |
| OK | electronegativity-bonding-trends | 3.1 | 2 | 6 | 6 | 4 | 1530 | 7 | ai-checked | structure meets guide |
| OK | reacting-masses-limiting-reagent | 2.4 | 1 | 6 | 6 | 5 | 1532 | 7 | ai-checked | structure meets guide |
| OK | kinetics-catalysis-energy-profile | 8.3 | 1 | 6 | 6 | 7 | 1547 | 6 | ai-checked | structure meets guide |
| OK | chemical-equilibria-kc-expressions | 7.1 | 1 | 6 | 6 | 10 | 1550 | 8 | ai-checked | structure meets guide |
| OK | enthalpy-change-bonds-broken-and-made | 5.1 | 1 | 6 | 6 | 6 | 1588 | 6 | ai-checked | structure meets guide |
| OK | relative-masses-unified-atomic-mass-unit | 2.1 | 2 | 6 | 6 | 4 | 1591 | 8 | ai-checked | structure meets guide |
| OK | covalent-bonding-coordinate-bonds | 3.4 | 1 | 6 | 6 | 5 | 1601 | 9 | ai-checked | structure meets guide |
| OK | electronegativity-bonding-what-it-is | 3.1 | 2 | 6 | 6 | 4 | 1601 | 7 | ai-checked | structure meets guide |
| OK | kinetics-catalysis-mechanism | 8.3 | 1 | 6 | 6 | 6 | 1602 | 4 | ai-checked | structure meets guide |
| OK | chemical-equilibria-mole-fraction-partial-pressure | 7.1 | 1 | 6 | 6 | 10 | 1612 | 8 | ai-checked | structure meets guide |
| OK | reacting-masses-from-equations | 2.4 | 1 | 6 | 6 | 5 | 1615 | 8 | ai-checked | structure meets guide |
| OK | period-3-chemical-oxides-water | 9.2 | 2 | 6 | 6 | 7 | 1623 | 7 | ai-checked | structure meets guide |
| OK | relative-masses-relative-atomic-mass | 2.1 | 1 | 6 | 6 | 5 | 1623 | 8 | ai-checked | structure meets guide |
| OK | enthalpy-change-reaction-pathway-diagrams | 5.1 | 1 | 6 | 6 | 7 | 1625 | 8 | ai-checked | structure meets guide |
| OK | covalent-bonding-bond-energy-and-length | 3.4 | 1 | 7 | 7 | 5 | 1630 | 10 | ai-checked | structure meets guide |
| OK | enthalpy-change-bond-energy-calculations | 5.1 | 2 | 6 | 6 | 8 | 1647 | 7 | ai-checked | structure meets guide |
| OK | kinetics-catalysis-boltzmann | 8.3 | 1 | 6 | 6 | 6 | 1651 | 6 | ai-checked | structure meets guide |
| OK | enthalpy-change-exothermic-endothermic | 5.1 | 1 | 6 | 6 | 6 | 1670 | 8 | ai-checked | structure meets guide |
| OK | activation-energy-boltzmann | 8.2 | 2 | 7 | 7 | 6 | 1674 | 5 | ai-checked | structure meets guide |
| OK | chemical-equilibria-quantities | 7.1 | 1 | 6 | 6 | 10 | 1685 | 7 | ai-checked | structure meets guide |
| OK | chemical-equilibria-what-changes-k | 7.1 | 1 | 7 | 7 | 10 | 1695 | 8 | ai-checked | structure meets guide |
| OK | enthalpy-change-named-changes | 5.1 | 1 | 7 | 7 | 7 | 1695 | 8 | ai-checked | structure meets guide |
| OK | rate-reaction-temperature | 8.2 | 1 | 7 | 7 | 6 | 1722 | 4 | ai-checked | structure meets guide |
| OK | enthalpy-change-calorimetry | 5.1 | 1 | 6 | 6 | 8 | 1731 | 8 | ai-checked | structure meets guide |
| OK | chemical-equilibria-reversible-dynamic | 7.1 | 1 | 6 | 6 | 9 | 1785 | 8 | ai-checked | structure meets guide |
| OK | chemical-equilibria-haber-contact | 7.1 | 1 | 6 | 6 | 10 | 1943 | 8 | ai-checked | structure meets guide |
| OK | period-3-physical-melting-point-conductivity | 9.1 | 2 | 6 | 6 | 6 | 1982 | 6 | ai-checked | structure meets guide |
| OK | chemical-equilibria-temperature-catalyst | 7.1 | 2 | 7 | 7 | 9 | 1983 | 8 | ai-checked | structure meets guide |
| OK | chemical-equilibria-le-chatelier | 7.1 | 2 | 7 | 7 | 10 | 2085 | 9 | ai-checked | structure meets guide |
