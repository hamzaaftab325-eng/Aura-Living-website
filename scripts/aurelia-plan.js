// AURELIA — Premium Home Decor E-Commerce Frontend Architecture Plan
// Production-grade Word document generator
// Palette: IG-1 Ink Gold (black bg + gold accent + white text)
// Recipe: R1 (Pure Paragraph Cover, Left-Aligned) — best for premium long titles

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  PageBreak, Header, Footer, PageNumber, NumberFormat,
  AlignmentType, HeadingLevel, WidthType, BorderStyle, ShadingType,
  PageOrientation, TableOfContents, TableLayoutType, SectionType,
  LevelFormat, Break,
} = require("docx");
const fs = require("fs");
const path = require("path");

// ════════════════════════════════════════════════════════════════
// PALETTE — IG-1 Ink Gold (extended for AURELIA brand)
// ════════════════════════════════════════════════════════════════
const P = {
  // IG-1 base
  bg: "0E0E0E",          // rich black (cover background)
  primary: "FFFFFF",     // white headings on dark
  accent: "C9A84C",      // brand gold

  // Cover-specific colors
  cover: {
    titleColor: "FFFFFF",
    subtitleColor: "C9A84C",
    metaColor: "B8B0A0",
    footerColor: "8A8275",
  },

  // Body palette (light backgrounds, dark text)
  body: {
    heading: "0A0A0A",       // deepest black for headings
    body: "1A1A1A",          // rich black for body text
    muted: "5A5A5A",          // muted gray for captions
    accent: "8A6B26",         // dark gold for inline emphasis on light bg
    accentBright: "C9A84C",  // bright gold for dark sections
    surfaceLight: "FAF8F2",  // warm cream surface
    surfaceMid: "F0EBDC",    // mid-warm surface
    border: "D8CFB8",        // soft gold-tinted border
    borderDark: "1A1A1A",    // dark border
  },

  // Table palette
  table: {
    headerBg: "0E0E0E",       // black header
    headerText: "C9A84C",     // gold text on black header
    altRow: "FAF8F2",          // alternating row (warm cream)
    accentLine: "C9A84C",      // gold accent line
    innerLine: "E8E1CC",      // soft gold-tinted inner line
  },
};

// ════════════════════════════════════════════════════════════════
// BORDER + SHADING CONSTANTS
// ════════════════════════════════════════════════════════════════
const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: NB, bottom: NB, left: NB, right: NB };
const allNoBorders = { top: NB, bottom: NB, left: NB, right: NB, insideHorizontal: NB, insideVertical: NB };

// ════════════════════════════════════════════════════════════════
// COVER TITLE LAYOUT HELPERS (from design-system.md)
// ════════════════════════════════════════════════════════════════
function splitTitleLines(title, charsPerLine) {
  if (title.length <= charsPerLine) return [title];
  const breakAfter = new Set([..." \t-_/:"]);
  const lines = [];
  let remaining = title;
  while (remaining.length > charsPerLine) {
    let breakAt = -1;
    for (let i = charsPerLine; i >= Math.floor(charsPerLine * 0.6); i--) {
      if (i < remaining.length && breakAfter.has(remaining[i - 1])) { breakAt = i; break; }
    }
    if (breakAt === -1) {
      const limit = Math.min(remaining.length, Math.ceil(charsPerLine * 1.3));
      for (let i = charsPerLine + 1; i < limit; i++) {
        if (breakAfter.has(remaining[i - 1])) { breakAt = i; break; }
      }
    }
    if (breakAt === -1) breakAt = charsPerLine;
    lines.push(remaining.slice(0, breakAt).trim());
    remaining = remaining.slice(breakAt).trim();
  }
  if (remaining) lines.push(remaining);
  if (lines.length > 1 && lines[lines.length - 1].length <= 2) {
    const last = lines.pop();
    lines[lines.length - 1] += last;
  }
  return lines;
}

function calcTitleLayout(title, maxWidthTwips, preferredPt = 40, minPt = 24) {
  // For English titles, each Latin char ≈ pt × 11 twips wide
  const charWidth = (pt) => pt * 11;
  const charsPerLine = (pt) => Math.floor(maxWidthTwips / charWidth(pt));
  let titlePt = preferredPt;
  let lines;
  while (titlePt >= minPt) {
    const cpl = charsPerLine(titlePt);
    if (cpl < 4) { titlePt -= 2; continue; }
    lines = splitTitleLines(title, cpl);
    if (lines.length <= 3) break;
    titlePt -= 2;
  }
  if (!lines || lines.length > 3) {
    const cpl = charsPerLine(minPt);
    lines = splitTitleLines(title, cpl);
    titlePt = minPt;
  }
  return { titlePt, titleLines: lines };
}

function calcCoverSpacing(params) {
  const {
    titleLineCount = 1, titlePt = 36, hasSubtitle = false,
    hasEnglishLabel = false, metaLineCount = 0,
    fixedHeight = 800, pageHeight = 16838,
  } = params;
  const SAFETY = 1200;
  const usableHeight = pageHeight - SAFETY;
  const titleHeight = titleLineCount * (titlePt * 23 + 200);
  const subtitleHeight = hasSubtitle ? (12 * 23 + 600) : 0;
  const englishLabelHeight = hasEnglishLabel ? (9 * 23 + 600) : 0;
  const metaHeight = metaLineCount * (10 * 23 + 100);
  const implicitParaHeight = 3 * 300;
  const contentHeight = titleHeight + subtitleHeight + englishLabelHeight + metaHeight + fixedHeight + implicitParaHeight;
  const remainingSpace = usableHeight - contentHeight;
  const safeRemaining = Math.max(remainingSpace, 400);
  const FOOTER_MIN = 800;
  const rawTop = Math.floor(safeRemaining * 0.45);
  const rawBottom = Math.floor(safeRemaining * 0.45);
  const bottomSpacing = Math.max(rawBottom, FOOTER_MIN);
  const topSpacing = Math.max(rawTop - Math.max(0, FOOTER_MIN - rawBottom), 400);
  return { topSpacing, bottomSpacing };
}

// ════════════════════════════════════════════════════════════════
// COVER BUILDER — Recipe R1 (Pure Paragraph, Left-Aligned) + IG-1 palette
// ════════════════════════════════════════════════════════════════
function buildCover(config) {
  const padL = 1200, padR = 800;
  const availableWidth = 11906 - padL - padR - 300;
  const { titlePt, titleLines } = calcTitleLayout(config.title, availableWidth, 38, 26);
  const titleSize = titlePt * 2;

  const spacing = calcCoverSpacing({
    titleLineCount: titleLines.length, titlePt,
    hasSubtitle: !!config.subtitle, hasEnglishLabel: !!config.englishLabel,
    metaLineCount: (config.metaLines || []).length,
    fixedHeight: 400,
  });

  const accentLeft = { style: BorderStyle.SINGLE, size: 8, color: P.accent, space: 12 };
  const children = [];

  // 1. Top whitespace
  children.push(new Paragraph({ spacing: { before: spacing.topSpacing } }));

  // 2. English label with accent bottom border
  if (config.englishLabel) {
    children.push(new Paragraph({
      indent: { left: padL, right: padR }, spacing: { after: 500 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: P.accent, space: 8 } },
      children: [new TextRun({
        text: config.englishLabel.split("").join("  "),
        size: 18, color: P.accent,
        font: { ascii: "Calibri" }, characterSpacing: 40,
      })],
    }));
  }

  // 3. Main title (dynamic font size + smart line breaks)
  for (let i = 0; i < titleLines.length; i++) {
    children.push(new Paragraph({
      indent: { left: padL },
      spacing: { after: i < titleLines.length - 1 ? 100 : 300, line: Math.ceil(titlePt * 23), lineRule: "atLeast" },
      children: [new TextRun({
        text: titleLines[i], size: titleSize, bold: true,
        color: P.cover.titleColor, font: { ascii: "Georgia" },
      })],
    }));
  }

  // 4. Subtitle
  if (config.subtitle) {
    children.push(new Paragraph({
      indent: { left: padL }, spacing: { after: 800 },
      children: [new TextRun({
        text: config.subtitle, size: 26, color: P.cover.subtitleColor,
        italics: true, font: { ascii: "Georgia" },
      })],
    }));
  }

  // 5. Meta info lines with left accent border
  for (const line of (config.metaLines || [])) {
    children.push(new Paragraph({
      indent: { left: padL + 200 }, spacing: { after: 80 },
      border: { left: accentLeft },
      children: [new TextRun({
        text: line, size: 22, color: P.cover.metaColor,
        font: { ascii: "Calibri" },
      })],
    }));
  }

  // 6. Bottom whitespace
  children.push(new Paragraph({ spacing: { before: spacing.bottomSpacing } }));

  // 7. Footer with top accent separator
  children.push(new Paragraph({
    indent: { left: padL, right: padR },
    border: { top: { style: BorderStyle.SINGLE, size: 2, color: P.accent, space: 8 } },
    spacing: { before: 200 },
    children: [
      new TextRun({ text: config.footerLeft || "", size: 18, color: P.cover.footerColor, font: { ascii: "Calibri" } }),
      new TextRun({ text: "                                        " }),
      new TextRun({ text: config.footerRight || "", size: 18, color: P.cover.footerColor, font: { ascii: "Calibri" } }),
    ],
  }));

  return [new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: allNoBorders,
    rows: [new TableRow({
      height: { value: 16838, rule: "exact" },
      children: [new TableCell({
        shading: { type: ShadingType.CLEAR, fill: P.bg },
        borders: noBorders,
        children,
      })],
    })],
  })];
}

// ════════════════════════════════════════════════════════════════
// CONTENT HELPERS
// ════════════════════════════════════════════════════════════════
const ENGLISH_FONT = { ascii: "Georgia" };
const SANS_FONT = { ascii: "Calibri" };

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 480, after: 240, line: 312 },
    children: [new TextRun({
      text, bold: true, size: 36, color: P.body.heading, font: SANS_FONT,
    })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 360, after: 180, line: 312 },
    children: [new TextRun({
      text, bold: true, size: 28, color: P.body.heading, font: SANS_FONT,
    })],
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 280, after: 140, line: 312 },
    children: [new TextRun({
      text, bold: true, size: 24, color: P.body.accent, font: SANS_FONT,
    })],
  });
}

function p(text, opts = {}) {
  return new Paragraph({
    alignment: opts.alignment || AlignmentType.JUSTIFIED,
    spacing: { after: 160, line: 312 },
    children: [new TextRun({
      text, size: 22, color: P.body.body, font: SANS_FONT,
    })],
  });
}

// Rich paragraph with mixed runs (for bold/italic emphasis)
function pr(runs, opts = {}) {
  return new Paragraph({
    alignment: opts.alignment || AlignmentType.JUSTIFIED,
    spacing: { after: 160, line: 312 },
    children: runs.map(r => {
      if (typeof r === "string") return new TextRun({ text: r, size: 22, color: P.body.body, font: SANS_FONT });
      return new TextRun({
        text: r.text,
        bold: r.bold || false,
        italics: r.italics || false,
        size: r.size || 22,
        color: r.color || P.body.body,
        font: r.font || SANS_FONT,
      });
    }),
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    bullet: { level },
    spacing: { after: 80, line: 312 },
    children: [new TextRun({ text, size: 22, color: P.body.body, font: SANS_FONT })],
  });
}

// Bullet with mixed runs (for bold lead-ins like "Feature: explanation")
function bulletRich(runs, level = 0) {
  return new Paragraph({
    bullet: { level },
    spacing: { after: 80, line: 312 },
    children: runs.map(r => {
      if (typeof r === "string") return new TextRun({ text: r, size: 22, color: P.body.body, font: SANS_FONT });
      return new TextRun({
        text: r.text, bold: r.bold || false, italics: r.italics || false,
        size: r.size || 22, color: r.color || P.body.body, font: r.font || SANS_FONT,
      });
    }),
  });
}

function numberedItem(text, ref) {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 80, line: 312 },
    children: [new TextRun({ text, size: 22, color: P.body.body, font: SANS_FONT })],
  });
}

function spacer(height = 200) {
  return new Paragraph({ spacing: { before: height }, children: [] });
}

// Section divider (gold accent line)
function divider() {
  return new Paragraph({
    indent: { left: 1000, right: 1000 },
    spacing: { before: 200, after: 200 },
    border: { top: { style: BorderStyle.SINGLE, size: 12, color: P.accent, space: 4 } },
    children: [],
  });
}

// Code block (monospace, light surface)
function codeBlock(code) {
  const lines = code.split("\n");
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: P.body.border },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: P.body.border },
      left: { style: BorderStyle.SINGLE, size: 12, color: P.accent },
      right: NB, insideHorizontal: NB, insideVertical: NB,
    },
    rows: [new TableRow({
      cantSplit: false,
      children: [new TableCell({
        shading: { type: ShadingType.CLEAR, fill: P.body.surfaceLight },
        margins: { top: 200, bottom: 200, left: 240, right: 200 },
        children: lines.map(line => new Paragraph({
          spacing: { line: 280, after: 0 },
          children: [new TextRun({
            text: line || " ",
            size: 18, color: P.body.body, font: { ascii: "Consolas" },
          })],
        })),
      })],
    })],
  });
}

// Caption (small italic gray text)
function caption(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 80, after: 240 },
    children: [new TextRun({
      text, italics: true, size: 18, color: P.body.muted, font: SANS_FONT,
    })],
  });
}

// Table builder — black header + gold text, alternating warm-cream rows
function dataTable(headers, rows, colPercents) {
  if (!colPercents) {
    const w = Math.floor(100 / headers.length);
    colPercents = headers.map(() => w);
  }
  const headerRow = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: headers.map((text, i) => new TableCell({
      width: { size: colPercents[i], type: WidthType.PERCENTAGE },
      shading: { type: ShadingType.CLEAR, fill: P.table.headerBg },
      margins: { top: 120, bottom: 120, left: 140, right: 140 },
      children: [new Paragraph({
        children: [new TextRun({
          text, bold: true, size: 20, color: P.table.headerText, font: SANS_FONT,
        })],
      })],
    })),
  });

  const dataRows = rows.map((row, rowIdx) => new TableRow({
    cantSplit: true,
    children: row.map((cell, i) => new TableCell({
      width: { size: colPercents[i], type: WidthType.PERCENTAGE },
      shading: rowIdx % 2 === 1 ? { type: ShadingType.CLEAR, fill: P.table.altRow } : undefined,
      margins: { top: 100, bottom: 100, left: 140, right: 140 },
      children: [new Paragraph({
        children: [new TextRun({
          text: String(cell), size: 19, color: P.body.body, font: SANS_FONT,
        })],
      })],
    })),
  }));

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 8, color: P.table.accentLine },
      bottom: { style: BorderStyle.SINGLE, size: 8, color: P.table.accentLine },
      left: NB, right: NB,
      insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: P.table.innerLine },
      insideVertical: NB,
    },
    rows: [headerRow, ...dataRows],
  });
}

// "Callout" — a gold-bordered highlight box for important notes
function callout(label, text) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: P.accent },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: P.accent },
      left: { style: BorderStyle.SINGLE, size: 24, color: P.accent },
      right: { style: BorderStyle.SINGLE, size: 4, color: P.body.border },
      insideHorizontal: NB, insideVertical: NB,
    },
    rows: [new TableRow({
      cantSplit: true,
      children: [new TableCell({
        shading: { type: ShadingType.CLEAR, fill: P.body.surfaceLight },
        margins: { top: 180, bottom: 180, left: 240, right: 200 },
        children: [
          new Paragraph({
            spacing: { after: 80 },
            children: [new TextRun({
              text: label, bold: true, size: 20, color: P.body.accent, font: SANS_FONT,
              characterSpacing: 30,
            })],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: 312 },
            children: [new TextRun({
              text, size: 21, color: P.body.body, font: SANS_FONT,
            })],
          }),
        ],
      })],
    })],
  });
}

// ════════════════════════════════════════════════════════════════
// PAGE NUMBER FOOTERS
// ════════════════════════════════════════════════════════════════
function romanFooter() {
  return new Footer({
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: "— ", size: 18, color: P.body.muted, font: SANS_FONT }),
        new TextRun({ children: [PageNumber.CURRENT], size: 18, color: P.body.muted, font: SANS_FONT }),
        new TextRun({ text: " —", size: 18, color: P.body.muted, font: SANS_FONT }),
      ],
    })],
  });
}

function arabicFooter() {
  return new Footer({
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: "AURELIA  |  ", size: 18, color: P.body.muted, font: SANS_FONT, characterSpacing: 30 }),
        new TextRun({ children: [PageNumber.CURRENT], size: 18, color: P.body.accent, font: SANS_FONT, bold: true }),
      ],
    })],
  });
}

function bodyHeader() {
  return new Header({
    children: [new Paragraph({
      alignment: AlignmentType.RIGHT,
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: P.accent, space: 4 } },
      children: [new TextRun({
        text: "AURELIA  ·  Frontend Architecture Plan",
        size: 18, color: P.body.muted, font: SANS_FONT, characterSpacing: 20, italics: true,
      })],
    })],
  });
}

// Export the module — content sections come from separate files
module.exports = {
  P, NB, noBorders, allNoBorders,
  buildCover, h1, h2, h3, p, pr, bullet, bulletRich, numberedItem,
  spacer, divider, codeBlock, caption, dataTable, callout,
  romanFooter, arabicFooter, bodyHeader,
  // re-export docx primitives we use
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  PageBreak, Header, Footer, PageNumber, NumberFormat,
  AlignmentType, HeadingLevel, WidthType, BorderStyle, ShadingType,
  PageOrientation, TableOfContents, TableLayoutType, SectionType, Break,
};
