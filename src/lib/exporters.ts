// 报告导出工具：PDF / Word / Excel / Mindmap
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  Table,
  TableCell,
  TableRow,
  WidthType,
  TextRun,
  AlignmentType,
  ImageRun,
} from "docx";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import type { AssessmentRecord, Scale } from "@/lib/types";

/** 把 HTMLElement 渲染到 PDF，支持跨页 */
export async function exportToPDF(element: HTMLElement, filename: string = "评估报告.pdf"): Promise<void> {
  // 临时设置背景白以避免透明
  const originalBg = element.style.backgroundColor;
  element.style.backgroundColor = "#fdfaf3";
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#fdfaf3",
      useCORS: true,
      logging: false,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 24;
    const renderWidth = pageWidth - margin * 2;
    const renderHeight = (canvas.height / canvas.width) * renderWidth;
    let heightLeft = renderHeight;
    let position = margin;

    pdf.addImage(imgData, "PNG", margin, position, renderWidth, renderHeight);
    heightLeft -= pageHeight - margin * 2;
    while (heightLeft > 0) {
      pdf.addPage();
      position = margin - (renderHeight - heightLeft);
      pdf.addImage(imgData, "PNG", margin, position, renderWidth, renderHeight);
      heightLeft -= pageHeight - margin * 2;
    }
    pdf.save(filename);
  } finally {
    element.style.backgroundColor = originalBg;
  }
}

/** 结构化报告 → Word 文档（.docx） */
export function exportToWord(
  report: { record: AssessmentRecord; scale: Scale; interpretation?: string; patientTags?: string[] },
  filename: string = "评估报告.docx",
): void {
  const { record, scale, interpretation, patientTags } = report;
  const dateStr = new Date(record.takenAt).toLocaleString("zh-CN");
  const ratio = record.maxScore ? Math.round((record.totalScore / record.maxScore) * 100) : 0;

  const children: (Paragraph | Table)[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: `${scale.title} 评估报告`, bold: true, size: 36 })],
    }),
    new Paragraph({ children: [new TextRun({ text: `康衡康复评估平台 · 报告生成于 ${dateStr}`, size: 18, color: "888888" })] }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),

    new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "一、患者基本信息", bold: true })] }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        rowKV("患者姓名", record.patientName),
        rowKV("评估量表", `${scale.title}（${scale.abbr}）`),
        rowKV("评估日期", dateStr),
        rowKV("适用场景", scale.scenario),
        rowKV("亚专科", record.category),
        ...(patientTags && patientTags.length ? [rowKV("标签", patientTags.join("，"))] : []),
      ],
    }),

    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "二、评估结果", bold: true })] }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        rowKV("总分", `${record.totalScore} / ${record.maxScore}（${ratio}%）`),
        rowKV("分级", `${record.grade}（${toneZh(record.tone)}）`),
      ],
    }),

    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "三、维度明细", bold: true })] }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            headerCell("维度"),
            headerCell("得分"),
            headerCell("满分"),
            headerCell("百分比"),
          ],
        }),
        ...record.dimensionScores.map((d) =>
          new TableRow({
            children: [
              bodyCell(d.dimension),
              bodyCell(String(d.score)),
              bodyCell(String(d.max)),
              bodyCell(d.max ? `${Math.round((d.score / d.max) * 100)}%` : "—"),
            ],
          }),
        ),
      ],
    }),

    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "四、题目作答明细", bold: true })] }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [headerCell("题目"), headerCell("维度"), headerCell("选择"), headerCell("得分")],
        }),
        ...scale.questions.map((q) => {
          const score = record.answers[q.id];
          const opt = q.options.find((o) => o.score === score);
          return new TableRow({
            children: [
              bodyCell(q.text),
              bodyCell(q.dimension),
              bodyCell(opt?.label ?? "—"),
              bodyCell(score !== undefined ? String(score) : "—"),
            ],
          });
        }),
      ],
    }),

    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "五、临床解读与建议", bold: true })] }),
    new Paragraph({
      children: [
        new TextRun({ text: interpretation ?? defaultInterpretation(record, scale), size: 22 }),
      ],
    }),
  ];

  const doc = new Document({
    creator: "康衡康复评估平台",
    title: `${scale.title} 评估报告`,
    sections: [{ children }],
  });

  Packer.toBlob(doc).then((blob) => saveAs(blob, filename));
}

/** 结构化报告 → Excel 工作簿 */
export function exportToExcel(
  report: { record: AssessmentRecord; scale: Scale; interpretation?: string; patientTags?: string[] },
  filename: string = "评估报告.xlsx",
): void {
  const { record, scale } = report;
  const wb = XLSX.utils.book_new();

  // Sheet 1: 概览
  const summary = [
    ["字段", "内容"],
    ["患者姓名", record.patientName],
    ["评估量表", `${scale.title}（${scale.abbr}）`],
    ["评估日期", new Date(record.takenAt).toLocaleString("zh-CN")],
    ["亚专科", record.category],
    ["总分", record.totalScore],
    ["满分", record.maxScore],
    ["百分比", record.maxScore ? `${Math.round((record.totalScore / record.maxScore) * 100)}%` : ""],
    ["分级", record.grade],
    ["色调", toneZh(record.tone)],
  ];
  const summarySheet = XLSX.utils.aoa_to_sheet(summary);
  summarySheet["!cols"] = [{ wch: 12 }, { wch: 36 }];
  XLSX.utils.book_append_sheet(wb, summarySheet, "概览");

  // Sheet 2: 维度明细
  const dimRows: (string | number)[][] = [["维度", "得分", "满分", "百分比"]];
  for (const d of record.dimensionScores) {
    dimRows.push([d.dimension, d.score, d.max, d.max ? Math.round((d.score / d.max) * 100) : 0]);
  }
  const dimSheet = XLSX.utils.aoa_to_sheet(dimRows);
  dimSheet["!cols"] = [{ wch: 18 }, { wch: 10 }, { wch: 10 }, { wch: 10 }];
  XLSX.utils.book_append_sheet(wb, dimSheet, "维度明细");

  // Sheet 3: 题目作答
  const qRows: (string | number)[][] = [["题号", "维度", "题目", "选择项", "得分"]];
  scale.questions.forEach((q, i) => {
    const score = record.answers[q.id];
    const opt = q.options.find((o) => o.score === score);
    qRows.push([String(i + 1), q.dimension, q.text, opt?.label ?? "未作答", score !== undefined ? score : ""]);
  });
  const qSheet = XLSX.utils.aoa_to_sheet(qRows);
  qSheet["!cols"] = [{ wch: 6 }, { wch: 14 }, { wch: 50 }, { wch: 28 }, { wch: 8 }];
  XLSX.utils.book_append_sheet(wb, qSheet, "题目作答");

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/octet-stream" });
  saveAs(blob, filename);
}

/** 思维导图：基于 SVG 自绘 + PNG 导出 */
export async function exportToMindmap(
  report: { record: AssessmentRecord; scale: Scale; patientName?: string; interpretation?: string },
  filename: string = "评估脑图.png",
): Promise<void> {
  const svg = renderMindmapSVG(report);
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("SVG 加载失败"));
      img.src = url;
    });
    const canvas = document.createElement("canvas");
    const W = 1200;
    const H = 800;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 不可用");
    ctx.fillStyle = "#fdfaf3";
    ctx.fillRect(0, 0, W, H);
    ctx.drawImage(img, 0, 0, W, H);
    canvas.toBlob((b) => {
      if (b) saveAs(b, filename);
    }, "image/png");
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** 返回 SVG 文本，可供独立组件使用 */
export function renderMindmapSVG(report: { record: AssessmentRecord; scale: Scale; patientName?: string; interpretation?: string }): string {
  const { record, scale, patientName, interpretation } = report;
  const cx = 600;
  const cy = 400;
  const title = `${scale.title} 评估脑图`;
  const patient = patientName ?? record.patientName;
  const ratio = record.maxScore ? Math.round((record.totalScore / record.maxScore) * 100) : 0;

  // 中心节点
  const centerLabel = `${patient}\n${record.totalScore}/${record.maxScore}（${ratio}%）\n${record.grade}`;

  // 维度子节点
  const dimensions = record.dimensionScores.map((d) => ({
    label: d.dimension,
    detail: `${d.score}/${d.max}`,
    tone: d.max && (d.score / d.max) >= 0.7 ? "good" : d.max && (d.score / d.max) >= 0.4 ? "warn" : "bad",
  }));

  // 围绕中心节点排布
  const radius = 240;
  const positions = dimensions.map((_, i) => {
    const angle = (Math.PI * 2 * i) / Math.max(dimensions.length, 1) - Math.PI / 2;
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  });

  // 中心节点
  const centerLines = centerLabel.split("\n").map((line, i) =>
    `<text x="${cx}" y="${cy - 8 + i * 18}" text-anchor="middle" font-size="14" font-weight="600" fill="#3f3a32" font-family="-apple-system, sans-serif">${escapeXml(line)}</text>`,
  ).join("");

  // 连线 + 子节点
  const nodes = dimensions.map((d, i) => {
    const pos = positions[i];
    const color = d.tone === "good" ? "#0d9488" : d.tone === "warn" ? "#d97706" : "#e06b5e";
    const fill = d.tone === "good" ? "#ccfbf1" : d.tone === "warn" ? "#fef3c7" : "#fde2dd";
    return `
      <line x1="${cx}" y1="${cy}" x2="${pos.x}" y2="${pos.y}" stroke="${color}" stroke-width="1.5" stroke-dasharray="2 3" opacity="0.6" />
      <circle cx="${pos.x}" cy="${pos.y}" r="38" fill="${fill}" stroke="${color}" stroke-width="1.5" />
      <text x="${pos.x}" y="${pos.y - 4}" text-anchor="middle" font-size="11" font-weight="600" fill="#3f3a32" font-family="-apple-system, sans-serif">${escapeXml(d.label)}</text>
      <text x="${pos.x}" y="${pos.y + 12}" text-anchor="middle" font-size="10" fill="#7d756a" font-family="-apple-system, sans-serif">${escapeXml(d.detail)}</text>
    `;
  }).join("");

  const interp = interpretation ?? defaultInterpretation(record, scale);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <style>
      .title { font: 700 20px -apple-system, "PingFang SC", sans-serif; fill: #3f3a32; }
      .sub { font: 400 12px -apple-system, "PingFang SC", sans-serif; fill: #7d756a; }
    </style>
  </defs>
  <rect x="0" y="0" width="1200" height="800" fill="#fdfaf3" />
  <text x="600" y="48" text-anchor="middle" class="title">${escapeXml(title)}</text>
  <text x="600" y="68" text-anchor="middle" class="sub">${escapeXml(scale.abbr)} · ${escapeXml(new Date(record.takenAt).toLocaleString("zh-CN"))}</text>

  <circle cx="${cx}" cy="${cy}" r="68" fill="#fef3c7" stroke="#d97706" stroke-width="2" />
  ${centerLines}

  ${nodes}

  <foreignObject x="80" y="700" width="1040" height="80">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font:12px -apple-system, 'PingFang SC', sans-serif; color:#7d756a; line-height:1.6; text-align:center; padding:0 80px;">
      ${escapeXml(interp)}
    </div>
  </foreignObject>
</svg>`;
}

function rowKV(k: string, v: string): TableRow {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 30, type: WidthType.PERCENTAGE },
        children: [new Paragraph({ children: [new TextRun({ text: k, bold: true })] })],
      }),
      new TableCell({
        width: { size: 70, type: WidthType.PERCENTAGE },
        children: [new Paragraph({ children: [new TextRun({ text: v })] })],
      }),
    ],
  });
}
function headerCell(text: string): TableCell {
  return new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, color: "FFFFFF" })] })],
    shading: { fill: "0d9488" },
  });
}
function bodyCell(text: string): TableCell {
  return new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text, size: 18 })] })],
  });
}

function toneZh(tone: "good" | "warn" | "bad"): string {
  return tone === "good" ? "良好" : tone === "warn" ? "中等" : "受损";
}

function defaultInterpretation(record: AssessmentRecord, scale: Scale): string {
  return record.tone === "good"
    ? `该患者本次 ${scale.title} 评估得分为 ${record.totalScore}/${record.maxScore}，分级为「${record.grade}」，功能状态良好。建议进入维持性训练并定期复评，关注维度短板以防退步。`
    : record.tone === "warn"
      ? `该患者本次评估得分为 ${record.totalScore}/${record.maxScore}，分级为「${record.grade}」，存在中度功能受限。建议基于短板维度生成针对性康复计划，4–6 周后复评。`
      : `该患者本次评估得分为 ${record.totalScore}/${record.maxScore}，分级为「${record.grade}」，功能受损明显。建议立即制定个性化康复计划，必要时结合临床路径与多学科转介。`;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
