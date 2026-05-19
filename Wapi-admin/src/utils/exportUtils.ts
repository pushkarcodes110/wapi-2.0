/* eslint-disable @typescript-eslint/no-explicit-any */
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type ExportFormat = "csv" | "excel" | "pdf";

export interface ExportColumn {
  header: string;
  key: string; // supports nested paths like 'user.email'
}

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export const exportData = ({
  data,
  columns,
  filename = "export",
  format,
}: {
  data: any[];
  columns: ExportColumn[];
  filename?: string;
  format: ExportFormat;
}) => {
  const headers = columns.map((col) => col.header);
  const rows = data.map((item) =>
    columns.map((col) => {
      let value = getNestedValue(item, col.key);
      if (typeof value === "number") {
        // Round to 2 decimal places if it's a float
        value = Number.isInteger(value) ? value : value.toFixed(2);
      }
      return value === null || value === undefined ? "" : String(value);
    })
  );

  if (format === "csv") {
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((val) => `"${val.replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else if (format === "excel") {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((item) => {
        const row: any = {};
        columns.forEach((col) => {
          row[col.header] = getNestedValue(item, col.key);
        });
        return row;
      })
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  } else if (format === "pdf") {
    const doc = new jsPDF({
      orientation: columns.length > 5 ? "landscape" : "portrait",
      unit: "mm",
      format: "a4",
    });

    autoTable(doc, {
      head: [headers],
      body: rows,
      theme: "striped",
      headStyles: {
        fillColor: [52, 73, 94],
        fontSize: 10,
        halign: "center",
      },
      bodyStyles: {
        fontSize: 9,
        valign: "middle",
      },
      columnStyles: {
        // Add specific column widths if needed, or let autotable handle it with wrap
      },
      margin: { top: 20 },
      didDrawPage: (data) => {
        // Add title on each page
        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.text(filename.replace(/_/g, " ").toUpperCase(), data.settings.margin.left, 10);
      },
      styles: {
        overflow: "linebreak",
        cellPadding: 2,
      },
    });
    doc.save(`${filename}.pdf`);
  }
};
