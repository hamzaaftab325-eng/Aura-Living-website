// Aura Living Execution Plan — build script (v1.0)
// Companion to the Aura Living Frontend Architecture Plan v1.1
const H = require("./aurelia-plan.js");
const C = require("./aura-execution-plan-content.js");

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  PageBreak, Header, Footer, PageNumber, NumberFormat,
  AlignmentType, HeadingLevel, WidthType, BorderStyle, ShadingType,
  PageOrientation, TableOfContents, TableLayoutType, SectionType, Break,
  buildCover, romanFooter, arabicFooter, bodyHeader,
  h1, h2, h3, p, pr, bullet, bulletRich, spacer, divider, codeBlock, caption, dataTable, callout,
  P,
} = H;

const fs = require("fs");
const path = require("path");

// ════════════════════════════════════════════════════════════════
// COVER CONFIG
// ════════════════════════════════════════════════════════════════
const coverConfig = {
  englishLabel: "EXECUTION PLAN",
  title: "Aura Living",
  subtitle: "A Sprint-by-Sprint Build Plan for the Aura Living Frontend — Companion to the v1.1 Architecture Plan",
  metaLines: [
    "Brand: Aura Living — Light, Life, and Living Beauty",
    "Niche: Premium Home Decor (Lamps, Plants, Candles)",
    "Market: Islamic Republic of Pakistan",
    "Structure: 5 Phases · 11 Sprints · 9 Weeks",
    "Pause Points: 11 (5 major checkpoints)",
    "Version: 1.0  |  June 2026",
  ],
  footerLeft: "Aura Living  ·  PREMIUM HOME DECOR",
  footerRight: "EXECUTION PLAN  ·  v1.0",
};

// ════════════════════════════════════════════════════════════════
// FRONT MATTER (Abstract + TOC)
// ════════════════════════════════════════════════════════════════
function buildFrontMatter() {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 240, after: 360 },
      children: [new TextRun({
        text: "ABSTRACT",
        bold: true, size: 28, color: P.body.heading,
        font: { ascii: "Calibri" }, characterSpacing: 80,
      })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: P.accent, space: 8 } },
      children: [new TextRun({ text: "  ", size: 16 })],
    }),
    p("This document is the execution plan for building the Aura Living frontend described in the v1.1 Frontend Architecture Plan. Where the architecture plan specifies what to build and why, this execution plan specifies the order in which to build it, the deliverables that mark each sprint complete, and the decision gates at which the build pauses for review. The plan preserves the five-phase, nine-week structure from Chapter 14 of the architecture plan and decomposes each phase into specific sprints: four sprints in Phase 1 (Foundation), five sprints in Phase 2 (Core Pages), two sprints in Phase 3 (Animations), two sprints in Phase 4 (SEO and Performance), and two sprints in Phase 5 (Pre-Launch QA), for a total of eleven sprints."),

    p("Each sprint follows the same structure: a single-sentence goal, a numbered task list with concrete actions, a files-created count with key examples, binary acceptance criteria, and a pause point (where applicable) at which the build stops for stakeholder sign-off. Eleven pause points are placed at the moments where course correction is cheapest: after the scaffold, after the design tokens, after each major page, and at the end of each phase. Five of these are major checkpoints (Phase 1 sign-off, Phase 2 sign-off, Phase 3 sign-off, Phase 4 sign-off, and GO LIVE) that warrant a live walkthrough rather than async review."),

    p("The plan also documents six prerequisites that must be in place before Sprint 1.1 begins (GitHub repo, Vercel account, domain, image assets, brand wordmark, architecture plan access) and a Definition of Done checklist for each of the five phases. This document is the operational counterpart to the architecture plan and should be read alongside it; every sprint references the architecture plan by chapter number for the underlying decisions."),

    spacer(360),

    // TOC title
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 480, after: 360 },
      children: [new TextRun({
        text: "TABLE OF CONTENTS",
        bold: true, size: 32, color: P.body.heading,
        font: { ascii: "Calibri" }, characterSpacing: 60,
      })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 360 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: P.accent, space: 4 } },
      children: [new TextRun({ text: "  ", size: 16 })],
    }),

    new TableOfContents("Table of Contents", {
      hyperlink: true,
      headingStyleRange: "1-3",
    }),

    new Paragraph({
      spacing: { before: 240 },
      children: [new TextRun({
        text: "Note: This Table of Contents is generated via field codes. To refresh page numbers after editing, right-click the TOC and select \"Update Field\" then \"Update entire table.\"",
        italics: true, size: 18, color: P.body.muted, font: { ascii: "Calibri" },
      })],
    }),

    new Paragraph({ children: [new PageBreak()] }),
  ];
}

// ════════════════════════════════════════════════════════════════
// BUILD DOCUMENT
// ════════════════════════════════════════════════════════════════
const bodyChildren = [
  ...C.chapter1(),
  ...C.chapter2(),
  ...C.chapter3(),
  ...C.chapter4(),
  ...C.chapter5(),
  ...C.chapter6(),
  ...C.chapter7(),
  ...C.chapter8(),
  ...C.chapter9(),
];

const doc = new Document({
  creator: "Aura Living Engineering",
  title: "Aura Living — Execution Plan v1.0",
  description: "Sprint-by-sprint build plan companion to the Aura Living Frontend Architecture Plan v1.1",
  styles: {
    default: {
      document: {
        run: { font: { ascii: "Calibri" }, size: 22, color: P.body.body },
        paragraph: { spacing: { line: 312 } },
      },
      heading1: {
        run: { font: { ascii: "Calibri" }, size: 36, bold: true, color: P.body.heading },
        paragraph: { spacing: { before: 480, after: 240, line: 312 }, outlineLevel: 0 },
      },
      heading2: {
        run: { font: { ascii: "Calibri" }, size: 28, bold: true, color: P.body.heading },
        paragraph: { spacing: { before: 360, after: 180, line: 312 }, outlineLevel: 1 },
      },
      heading3: {
        run: { font: { ascii: "Calibri" }, size: 24, bold: true, color: P.body.accent },
        paragraph: { spacing: { before: 280, after: 140, line: 312 }, outlineLevel: 2 },
      },
    },
  },
  sections: [
    // Section 1: Cover
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838, orientation: PageOrientation.PORTRAIT },
          margin: { top: 0, bottom: 0, left: 0, right: 0 },
        },
      },
      children: buildCover(coverConfig),
    },
    // Section 2: Front matter (Roman numerals)
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: {
          size: { width: 11906, height: 16838, orientation: PageOrientation.PORTRAIT },
          margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
          pageNumbers: { start: 1, formatType: NumberFormat.UPPER_ROMAN },
        },
      },
      footers: { default: romanFooter() },
      children: buildFrontMatter(),
    },
    // Section 3: Body (Arabic numerals)
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: {
          size: { width: 11906, height: 16838, orientation: PageOrientation.PORTRAIT },
          margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
          pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL },
        },
      },
      headers: { default: bodyHeader() },
      footers: { default: arabicFooter() },
      children: bodyChildren,
    },
  ],
});

// ════════════════════════════════════════════════════════════════
// PACK AND WRITE
// ════════════════════════════════════════════════════════════════
const outputPath = "/home/z/my-project/download/Aura-Living-Execution-Plan-v1.0.docx";
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log("[OK] Execution plan generated successfully:");
  console.log("     " + outputPath);
  console.log("     Size: " + (buffer.length / 1024).toFixed(1) + " KB");
}).catch((err) => {
  console.error("[ERROR] Failed to generate document:");
  console.error(err);
  process.exit(1);
});
