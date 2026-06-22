---
Task ID: AURELIA-PLAN-001
Agent: Super Z (main agent)
Task: Generate a deep (40-60 page) production-grade frontend architecture plan as a Word document for AURELIA, a premium home-decor e-commerce site targeting Pakistani customers. Stack: Next.js 16 + TypeScript + Tailwind + GSAP + Framer Motion + Lenis. Theme: Gold + Black + White. Mobile-first with beautiful parallax on all devices. No inline styles — global design system only. Cover 0-100% of frontend: all pages, all components, SEO, accessibility, performance, deployment, 2026 standards.

Work Log:
- Loaded docx skill (SKILL.md, create.md route, design-system.md, common-rules.md, report scene, docx-js-core.md, toc.md).
- Asked user 8 clarifying questions; locked: Fashion→Home Decor (lamps/plants/candles), Brand→Propose (chose "AURELIA"), Language→English, Payments→COD+JazzCash+Easypaisa+Cards+Bank, Format→Word, Depth→Deep (40-60pp), Scope→Frontend-only plan now (Supabase+Next.js backend later), Mobile-first with parallax.
- Delegated 2026 web standards research to a general-purpose subagent (18 web searches + 5 deep reads). Returned ~6,090-word research report covering Next.js 16 PPR, GSAP/Motion/Lenis integration, e-commerce UX, gold/black design systems, SEO 2026, performance, WCAG 2.2, Pakistan-specific UX, deployment, folder structure.
- Locked design tokens: IG-1 Ink Gold palette (#0E0E0E black bg + #C9A84C gold + #FFFFFF white), Fraunces (display serif) + Inter (body sans), 8px spacing grid, restrained radii, custom cubic-bezier(0.22, 1, 0.36, 1) ease curve.
- Modular script architecture: aurelia-plan.js (palette, helpers, R1 cover with IG-1 palette, content helpers), aurelia-content-1.js through aurelia-content-6.js (15 chapters + 3 appendices), aurelia-build.js (assembly with 3-section page numbering: cover/Roman/Arabic).
- Generated docx via `node scripts/aurelia-build.js`. Initial failure: YAML template-literal interpolation of `${{ secrets.* }}` in CI config codeBlock — escaped `$` to fix.
- Ran add_toc_placeholders.py --auto: 135 headings extracted, 135 bookmarks added, 135 TOC placeholder entries inserted, exit code 0.
- Ran postcheck.py: 6/9 passed, 0 errors, 2 warnings (1 empty para+PageBreak after TOC which is mandatory per skill rules; line-spacing differences from code blocks/tables which is intentional). Consolas font warning noted.
- Converted to PDF via LibreOffice for verification: 71 pages, A4. Exceeds 40-60 page target.

Stage Summary:
- Final deliverables in /home/z/my-project/download/:
  * AURELIA-Frontend-Architecture-Plan.docx (87 KB) — primary deliverable, editable Word format
  * AURELIA-Frontend-Architecture-Plan.pdf (910 KB, 71 pages) — PDF version for sharing/preview
- Document structure: Cover (R1 + IG-1 Ink Gold palette) → Abstract + TOC (Roman numerals) → 15 chapters + 3 appendices (Arabic numerals from 1)
- Chapters: 1) Executive Summary, 2) Market Context, 3) Technical Architecture, 4) Folder Structure, 5) Design System, 6) Animation Strategy, 7) Page-by-Page Blueprint (25 routes specified), 8) Component Inventory, 9) SEO Strategy, 10) Performance Strategy, 11) Accessibility WCAG 2.2 AA, 12) Pakistani Market UX, 13) Deployment & DevOps, 14) Implementation Roadmap (9-week, 5-phase), 15) Risk Analysis, Appendices A/B/C (design tokens CSS, dependency manifest, glossary)
- Brand name proposed: AURELIA (from Latin "aureus" = golden) — encodes the gold theme and the warmth/light/life of the three product categories (lamps, plants, candles)
- All scripts persisted in /home/z/my-project/scripts/ for future iteration (aurelia-plan.js, aurelia-content-1.js through aurelia-content-6.js, aurelia-build.js)
