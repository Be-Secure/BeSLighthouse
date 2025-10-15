// pdfGenerator.ts
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import CheckIcon from '../assets/images/checked.png'; // imported URL (CRA/Vite/etc)

// ---- Types ----
export interface Asset {
  type?: string;
  name?: string;
  version?: string;
  environment?: string;
  url?: string;
  [k: string]: any;
}
export interface Tool {
  name?: string;
  type?: string;
  version?: string;
  playbook?: string;
  [k: string]: any;
}
export interface Execution {
  type?: string;
  id?: string;
  status?: string;
  timestamp?: string;
  duration?: string;
  output_path?: string;
  [k: string]: any;
}
export interface Result {
  feature?: string;
  aspect?: string;
  attribute?: string;
  value?: any;
  [k: string]: any;
}
export interface Assessment {
  tool?: Tool;
  execution?: Execution;
  results?: Result[];
  [k: string]: any;
}
export interface OSARReport {
  schema_version?: string;
  asset?: Asset;
  assessments?: Assessment[];
  [k: string]: any;
}

// ---- Label mapping (normalized keys) ----
const checkReport: Record<string, string> = {
  'insecure-code-detection': 'Insecure Code Detection',
  'sbom': 'SBOM',
  'criticality_score': 'Criticality Score',
  'scorecard': 'Scorecard',
  'sast': 'SAST',
  'license-compliance': 'License Compliance',
  'dast': 'DAST',
  'llm-benchmark': 'LLM Benchmark',
  'security-benchmark': 'Security Benchmark'
};

// ---- Helpers ----
function safeText(value: unknown): string {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'string') return value;
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}
function mapToolTypeToLabel(toolType?: string): string {
  if (!toolType) return 'Assessment';
  const normalized = toolType.toLowerCase().replace(/\s+/g, '-').replace(/_+/g, '-');
  return checkReport[normalized] ?? checkReport[toolType] ?? toolType;
}

// Load imported URL into an HTMLImageElement so jsPDF.addImage accepts it
async function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = url;
  });
}

// ---- Main generator ----
// Note: function is async because we load the CheckIcon image element before adding it to the PDF.
export async function generatePdfFromJson(
  getOsarReport: OSARReport,
  filename: string,
  attested = false
): Promise<void> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  doc.setProperties({ title: 'Open Source Assessment Report (OSAR)', subject: 'OSAR' });

  let y = 20; // vertical cursor
  const pageBottom = 287; // safe bottom margin for A4
  const leftMargin = 10;
  const rightMargin = 200;

  // Title
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(34, 139, 34);
  doc.text('Open Source Assessment Report (OSAR)', 105, y, { align: 'center' });

  // Attestation icon: load HTMLImageElement from imported URL and draw if attested
  if (attested) {
    try {
      const img = await loadImageFromUrl(CheckIcon);
      const imgW = 13;
      const imgH = 13;
      const imgX = 185;
      const imgY = y - 9;
      // jsPDF accepts HTMLImageElement here
      doc.addImage(img as any, 'PNG', imgX, imgY, imgW, imgH);
    } catch (err) {
      // don't block PDF generation on image load failure
      // console.warn('Could not load CheckIcon', err);
    }
  }

  y += 15;

  // Subtitle: schema version
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(`Schema Version: ${safeText(getOsarReport?.schema_version)}`, 105, y, { align: 'center' });
  y += 15;

  // Asset Details header
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Asset Details', leftMargin, y);
  y += 8;
  doc.setLineWidth(0.5);
  doc.line(leftMargin, y, rightMargin, y);
  y += 8;

  // Asset content
  const asset: Asset = getOsarReport?.asset ?? {};
  const assetDetails: [string, any][] = [
    ['Type', asset.type],
    ['Name', asset.name],
    ['Version', asset.version],
    ['Environment', asset.environment],
    ['URL', asset.url]
  ];

  for (const [k, v] of assetDetails) {
    if (y + 10 > pageBottom) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`${k}:`, leftMargin, y);
    doc.setFont('helvetica', 'normal');

    if (k === 'URL' && v) {
      try {
        doc.setTextColor(0, 0, 255);
        doc.textWithLink(safeText(v), leftMargin + 40, y, { url: String(v) });
      } catch {
        doc.setTextColor(0, 0, 0);
        doc.text(safeText(v), leftMargin + 40, y);
      } finally {
        doc.setTextColor(0, 0, 0);
      }
    } else {
      doc.setTextColor(0, 0, 0);
      doc.text(safeText(v), leftMargin + 40, y);
    }
    y += 8;
  }

  // Assessments
  const assessments: Assessment[] = Array.isArray(getOsarReport?.assessments) ? getOsarReport.assessments : [];

  for (const assessment of assessments) {
    const toolDetails: Tool = assessment?.tool ?? {};
    const executionDetails: Execution = assessment?.execution ?? {};
    const toolLabel = mapToolTypeToLabel(toolDetails.type ?? toolDetails.name);

    // ensure room for header
    if (y + 40 > pageBottom) {
      doc.addPage();
      y = 20;
    }
    y += 8;

    // Section header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(toolLabel, leftMargin, y);
    y += 8;
    doc.setLineWidth(0.5);
    doc.line(leftMargin, y, rightMargin, y);
    y += 8;

    // Assessment details
    const assessmentDetails: [string, any][] = [
      ['Tool Name', toolDetails.name],
      ['Tool Type', toolDetails.type],
      ['Tool Version', toolDetails.version],
      ['Playbook', toolDetails.playbook],
      ['Execution Type', executionDetails.type],
      ['Execution ID', executionDetails.id],
      ['Status', executionDetails.status],
      ['Timestamp', executionDetails.timestamp],
      ['Duration', executionDetails.duration],
      ['Output', executionDetails.output_path]
    ];

    for (const [key, value] of assessmentDetails) {
      if (y + 12 > pageBottom) {
        doc.addPage();
        y = 20;
        // redraw header on new page
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`${toolLabel} (continued)`, leftMargin, y);
        y += 8;
        doc.line(leftMargin, y, rightMargin, y);
        y += 8;
      }

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`${key}:`, leftMargin, y);
      doc.setFont('helvetica', 'normal');

      if (key === 'Output') {
        const out = value ? String(value) : '';
        if (out) {
          try {
            doc.setTextColor(0, 0, 255);
            doc.textWithLink('Link', leftMargin + 40, y, { url: out });
          } catch {
            doc.setTextColor(0, 0, 0);
            doc.text(safeText(out), leftMargin + 40, y);
          } finally {
            doc.setTextColor(0, 0, 0);
          }
        } else {
          doc.setTextColor(0, 0, 0);
          doc.text('-', leftMargin + 40, y);
        }
      } else {
        doc.setTextColor(0, 0, 0);
        doc.text(safeText(value), leftMargin + 40, y);
      }

      y += 8;
    }

    y += 8;

    // Results header
    if (y + 40 > pageBottom) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Assessment Result', leftMargin, y);
    y += 8;
    doc.setLineWidth(0.5);
    doc.line(leftMargin, y, rightMargin, y);
    y += 8;

    // Prepare table body
    const results: Result[] = Array.isArray(assessment?.results) ? assessment.results : [];
    const body = results.map((r) => [
      safeText(r.feature),
      safeText(r.aspect),
      safeText(r.attribute),
      safeText(r.value)
    ]);

    // Table start and repeated header coordination
    const tableStartY = y;
    const repeatedHeaderY = 18; // location of repeated header on continued pages
    const repeatedHeaderHeight = 8;
    const marginTopForTablePages = repeatedHeaderY + repeatedHeaderHeight + 2; // ~28
    const startingPage = (doc as any).getNumberOfPages ? (doc as any).getNumberOfPages() : 1;

    // Call autoTable with margin.top so continued pages leave space for our repeated header
    autoTable(doc, {
      startY: tableStartY,
      head: [['Feature', 'Aspect', 'Attribute', 'Value']],
      body,
      styles: { fontSize: 10, cellPadding: 3, overflow: 'linebreak' },
      headStyles: { fillColor: [34, 139, 34] },
      margin: { left: leftMargin, right: 10, top: marginTopForTablePages },
      didDrawPage: (data: any) => {
        // Only draw the repeated header on pages AFTER the starting page
        if (data.pageNumber > startingPage) {
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0, 0, 0);
          doc.text(`${toolLabel} - Assessment Result (continued)`, leftMargin, repeatedHeaderY);

          const separatorY = repeatedHeaderY + 4;
          doc.setLineWidth(0.5);
          doc.line(leftMargin, separatorY, rightMargin, separatorY);
        }
      },
      didDrawCell: (data: any) => {
        // If value cell looks like URL, render a clickable link
        if (data.section === 'body' && data.column.index === 3) {
          const text = (data.cell.text || []).join('');
          if (/^https?:\/\//i.test(text)) {
            const x = data.cell.x + 2;
            const yCell = data.cell.y + data.cell.height / 2 + 3;
            try {
              doc.setTextColor(0, 0, 255);
              doc.textWithLink(text, x, yCell, { url: text });
              doc.setTextColor(0, 0, 0);
            } catch {
              // ignore
            }
          }
        }
      }
    });

    // Update vertical cursor y from lastAutoTable.finalY (most reliable)
    const lastFinalY = (doc as any).lastAutoTable?.finalY ?? (doc as any).autoTable?.previous?.finalY;
    y = lastFinalY ? lastFinalY + 10 : tableStartY + 10;
  }

  // Save doc
  doc.save(`${filename}.pdf`);
}
