import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

import CheckIcon from '../assets/images/checked.png';

const checkReport: any = {
  'insecure-code-detection': 'Insecure Code Detection',
  'sbom': 'SBOM',
  'criticality_score': 'Criticality Score',
  'scorecard': 'Scorecard',
  'sast': 'SAST',
  'License Compliance': 'License Compliance',
  'dast': 'DAST',
  'LLM Benchmark': 'LLM Benchmark',
  'Security Benchmark': 'Security Benchmark'
};

// Function to generate the PDF
export function generatePdfFromJson(getOsarReport: any, filename: string, attested = false) {
  const doc: any = new jsPDF();
  let yOffset = 20; // Initial vertical offset for the content

  // Title
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(34, 139, 34); // Set title color to green
  doc.text("Open Source Assessment Report (OSAR)", 105, yOffset, { align: 'center' });
  const imgWidth = 13; // Width of the image
  const imgHeight = 13; // Height of the image
  const imgX = 185; // X position (aligned right of the title)
  const imgY = yOffset - 9; // Y position (aligned vertically with the title)

  // Adding the image right next to the title text
  if (attested) doc.addImage(CheckIcon, "PNG", imgX, imgY, imgWidth, imgHeight);
  yOffset += 15;

  // Add a subtitle
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0); // Reset color for subtitle text
  doc.text(`Schema Version: ${getOsarReport.schema_version}`, 105, yOffset, { align: 'center' });
  yOffset += 15;

  // Asset Details Section
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0); // Reset to black color
  doc.text("Asset Details", 10, yOffset);
  yOffset += 10;

  // Horizontal line separator
  doc.setLineWidth(0.5);
  doc.line(10, yOffset, 200, yOffset);
  yOffset += 10;

  // Asset Details Content
  const asset = getOsarReport.asset;
  const assetDetails = [
    ["Type", asset.type],
    ["Name", asset.name],
    ["Version", asset.version],
    ["Environment", asset.environment],
    ["URL", asset.url]
  ];

  assetDetails.forEach(([key, value]) => {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`${key}:`, 10, yOffset);
    doc.setFont("helvetica", "normal");
    if (key === "URL") {
      // Make URL clickable and styled
      doc.setTextColor(0, 0, 255);
      doc.textWithLink(value, 50, yOffset, { url: value });
    } else {
      doc.setTextColor(0, 0, 0);
      doc.text(value, 50, yOffset);
    }
    yOffset += 8;
  });

  // Loop through each assessment and add content dynamically
  getOsarReport.assessments.forEach((assessment: any) => {
    const toolDetails = assessment.tool;
    const executionDetails = assessment.execution;

    const assessmentDetails = [
      ["Tool Name", toolDetails.name],
      ["Tool Type", toolDetails.type],
      ["Tool Version", toolDetails.version],
      ["Playbook", toolDetails.playbook],
      ["Execution Type", executionDetails.type],
      ["Execution ID", executionDetails.id],
      ["Status", executionDetails.status],
      ["Timestamp", executionDetails.timestamp],
      ["Duration", executionDetails.duration],
      ["Output", executionDetails.output_path]
    ];

    // Check space before Assessment Details section header
    if (yOffset + 30 > 280) {
      doc.addPage();
      yOffset = 20;
    }

    yOffset += 10; // Some space before the next section

    // --- Assessment Details Section Header ---
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text(`${checkReport[toolDetails.type]}`, 10, yOffset);
    yOffset += 10;

    // Horizontal line separator
    doc.setLineWidth(0.5);
    doc.line(10, yOffset, 200, yOffset);
    yOffset += 10;

    // --- Loop through assessmentDetails ---
    assessmentDetails.forEach(([key, value]) => {
    // Check space before each detail row
      if (yOffset + 10 > 280) {
        doc.addPage();
        yOffset = 20;

        // Re-add the Assessment Details section header on the new page
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.text(`${checkReport[toolDetails.type]} (continued)`, 10, yOffset);
        yOffset += 10;
        doc.setLineWidth(0.5);
        doc.line(10, yOffset, 200, yOffset);
        yOffset += 10;
      }

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`${key}:`, 10, yOffset);
      doc.setFont("helvetica", "normal");
      if (key === "Output") {
        // Print "Output:" label
        doc.setTextColor(0, 0, 0);
        doc.text(`${key}:`, 10, yOffset);

        // Make the word "Link" clickable
        doc.setTextColor(0, 0, 255);
        doc.textWithLink("Link", 50, yOffset, { url: value });
      } else {
        doc.setTextColor(0, 0, 0);
        doc.text(value, 50, yOffset);
      }
      yOffset += 8;
    });

    yOffset += 15; // Space before the Assessment Results section

    // --- Assessment Results Section ---
    if (yOffset + 30 > 280) {
      doc.addPage();
      yOffset = 20;
    }

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Assessment Result", 10, yOffset);
    yOffset += 10;

    // Horizontal line separator
    doc.setLineWidth(0.5);
    doc.line(10, yOffset, 200, yOffset);
    yOffset += 10;

    // --- Results Table ---
    const results = assessment.results.map((item: any) => ({
      feature: item.feature,
      aspect: item.aspect,
      attribute: item.attribute,
      value: item.value.toString() // Convert boolean to string for display
    }));

    doc.autoTable({
      startY: yOffset,
      head: [['Feature', 'Aspect', 'Attribute', 'Value']],
      body: results.map((result: any) => [result.feature, result.aspect, result.attribute, result.value]),
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [34, 139, 34] },
      didDrawPage: (data: any) => {
        if (data.pageNumber > 1) {
        // Re-add the Assessment Result header on new pages during table rendering
          doc.setFontSize(16);
          doc.setTextColor(0, 0, 0);
          doc.text(`${checkReport[toolDetails.type]} - Assessment Result (continued)`, 10, 15);
          doc.setLineWidth(0.5);
          doc.line(10, 20, 200, 20);
        }
      }
    });

    // Update yOffset after the table
    yOffset = doc.autoTable.previous.finalY + 10;
  });


  // Save the PDF
  doc.save(`${filename}.pdf`);
}
