// AURELIA Plan — Main assembly script
// Generates the final .docx by combining cover + TOC + all chapters + appendices

const H = require("./aurelia-plan.js");
const C1 = require("./aurelia-content-1.js");
const C2 = require("./aurelia-content-2.js");
const C3 = require("./aurelia-content-3.js");
const C4 = require("./aurelia-content-4.js");
const C5 = require("./aurelia-content-5.js");
const C6 = require("./aurelia-content-6.js");

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
  englishLabel: "FRONTEND ARCHITECTURE PLAN",
  title: "AURELIA",
  subtitle: "A Premium Home Decor E-Commerce Frontend Architecture Plan for the Pakistani Market",
  metaLines: [
    "Brand: AURELIA — Light, Life, and Living Beauty",
    "Niche: Premium Home Decor (Lamps, Plants, Candles)",
    "Market: Islamic Republic of Pakistan",
    "Stack: Next.js 16 + GSAP + Framer Motion + Lenis",
    "Aesthetic: Gold and Black with Warm White Backgrounds",
    "Version: 1.0  |  June 2026",
  ],
  footerLeft: "AURELIA  ·  PREMIUM HOME DECOR",
  footerRight: "CONFIDENTIAL  ·  v1.0",
};

// ════════════════════════════════════════════════════════════════
// TOC + ABSTRACT (Section 2 — Front Matter, Roman numerals)
// ════════════════════════════════════════════════════════════════
function buildFrontMatter() {
  return [
    // Abstract
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
      children: [new TextRun({
        text: "  ", size: 16,
      })],
    }),
    p("This document is the complete frontend architecture plan for AURELIA, a premium home-decor e-commerce storefront targeting the Pakistani market. AURELIA specialises in three curated product categories — artisanal lamps, living plants, and hand-poured candles — and is positioned as the first Pakistani-owned, premium-curated home-decor brand online. The plan covers the full scope of the frontend: the technical stack (Next.js 16, TypeScript, Tailwind CSS, GSAP, Framer Motion, Lenis), the production-grade folder structure, the complete design system (gold and black palette with warm white backgrounds, fluid typography, restrained spacing), the animation strategy (parallax, scroll-triggered reveals, magnetic buttons, smooth scroll), a page-by-page blueprint for all twenty-five frontend routes, a comprehensive component inventory, the 2026 SEO strategy with schema.org structured data, the performance strategy with Core Web Vitals targets, the WCAG 2.2 AA accessibility strategy, Pakistani-specific UX patterns (cash-on-delivery-first checkout, WhatsApp integration, mobile-first design), the Vercel deployment strategy, a five-phase nine-week implementation roadmap, and a risk analysis. The full-stack implementation (Supabase database, Next.js Server Actions) will be addressed in a separate document once the frontend foundation specified here is in place."),

    p("This document is intended for the engineering team building AURELIA and for stakeholders reviewing the technical direction. It is detailed enough to enable implementation without further design input and structured to allow non-sequential review of specific concerns. All decisions are grounded in 2026 web standards research and in the specific realities of the Pakistani e-commerce market."),

    spacer(360),

    // TOC title — NOT a Heading style (prevents self-indexing)
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

    // TableOfContents element
    new TableOfContents("Table of Contents", {
      hyperlink: true,
      headingStyleRange: "1-3",
    }),

    // Mandatory refresh hint
    new Paragraph({
      spacing: { before: 240 },
      children: [new TextRun({
        text: "Note: This Table of Contents is generated via field codes. To refresh page numbers after editing, right-click the TOC and select \"Update Field\" then \"Update entire table.\"",
        italics: true, size: 18, color: P.body.muted, font: { ascii: "Calibri" },
      })],
    }),

    // Mandatory PageBreak after TOC
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

// ════════════════════════════════════════════════════════════════
// BUILD THE DOCUMENT
// ════════════════════════════════════════════════════════════════
const bodyChildren = [
  ...C1.chapter1(),
  ...C1.chapter2(),
  ...C2.chapter3(),
  ...C2.chapter4(),
  ...C3.chapter5(),
  ...C3.chapter6(),
  ...C4.chapter7(),
  ...C5.chapter8(),
  ...C5.chapter9(),
  ...C5.chapter10(),
  ...C5.chapter11(),
  ...C6.chapter12(),
  ...C6.chapter13(),
  ...C6.chapter14(),
  ...C6.chapter15(),
  ...C6.appendices(),
];

const doc = new Document({
  creator: "AURELIA Engineering",
  title: "AURELIA — Frontend Architecture Plan v1.0",
  description: "Premium Home Decor E-Commerce Frontend Architecture Plan for the Pakistani Market",
  styles: {
    default: {
      document: {
        run: {
          font: { ascii: "Calibri" },
          size: 22, color: P.body.body,
        },
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
    // ─── Section 1: Cover (no footer, no page number) ───
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838, orientation: PageOrientation.PORTRAIT },
          margin: { top: 0, bottom: 0, left: 0, right: 0 },
        },
      },
      children: buildCover(coverConfig),
    },
    // ─── Section 2: Front matter (TOC + Abstract) — Roman numerals ───
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
    // ─── Section 3: Body — Arabic numerals starting from 1 ───
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
const outputPath = "/home/z/my-project/download/AURELIA-Frontend-Architecture-Plan.docx";
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log("[OK] Document generated successfully:");
  console.log("     " + outputPath);
  console.log("     Size: " + (buffer.length / 1024).toFixed(1) + " KB");
}).catch((err) => {
  console.error("[ERROR] Failed to generate document:");
  console.error(err);
  process.exit(1);
});
