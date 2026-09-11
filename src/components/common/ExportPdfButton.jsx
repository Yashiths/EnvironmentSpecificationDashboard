import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, LoaderCircle } from 'lucide-react';

export const ExportPdfButton = ({ targetId, filename, categoryLabel, activeClient }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    const target = document.getElementById(targetId);
    const table = target?.querySelector('table');
    if (!table) return;

    setIsExporting(true);
    try {
      const rawHeaders = [...table.querySelectorAll('thead th')].map((cell) => cell.innerText.trim());
      const includedColumns = rawHeaders
        .map((header, index) => ({ header, index }))
        .filter(({ header }) => !/^actions?$/i.test(header));
      const headers = includedColumns.map(({ header }) => header);
      const body = [...table.querySelectorAll('tbody tr')]
        .map((row) => {
          const cells = [...row.querySelectorAll('td')];
          return includedColumns.map(({ index }) => cells[index]?.innerText.trim() || '');
        })
        .filter((row) => row.length > 0 && row.some(Boolean));
      const pdf = new jsPDF({ orientation: headers.length > 5 ? 'landscape' : 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();

      pdf.setFillColor(15, 31, 55);
      pdf.rect(0, 0, pageWidth, 28, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(15);
      pdf.text('ENVIRONMENT SPECIFICATION REPORT', 14, 11);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.text(`${categoryLabel} - ${activeClient}`, 14, 18);
      pdf.setFontSize(8);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, 14, 24);

      autoTable(pdf, {
        startY: 35,
        head: [headers],
        body,
        theme: 'grid',
        styles: {
          font: 'helvetica',
          fontSize: 8,
          textColor: [31, 41, 55],
          cellPadding: 3,
          overflow: 'linebreak',
          valign: 'top'
        },
        headStyles: {
          fillColor: [15, 31, 55],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        tableLineColor: [203, 213, 225],
        tableLineWidth: 0.2,
        margin: { left: 14, right: 14, bottom: 18 },
        didDrawPage: (pageData) => {
          const pageHeight = pdf.internal.pageSize.getHeight();
          pdf.setDrawColor(203, 213, 225);
          pdf.line(14, pageHeight - 13, pageWidth - 14, pageHeight - 13);
          pdf.setTextColor(71, 85, 105);
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(8);
          pdf.text('Confidential - Production Banking Environment Specification', 14, pageHeight - 7);
          pdf.text(`Page ${pageData.pageNumber}`, pageWidth - 14, pageHeight - 7, { align: 'right' });
        }
      });

      pdf.save(`${filename}.pdf`);
      window.dispatchEvent(new CustomEvent('app-toast', { detail: { type: 'success', message: 'PDF exported successfully.' } }));
    } catch (error) {
      window.dispatchEvent(new CustomEvent('app-toast', { detail: { type: 'error', message: 'Unable to export PDF.' } }));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-wait disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
    >
      {isExporting ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
      {isExporting ? 'Exporting...' : 'Export PDF'}
    </button>
  );
};
