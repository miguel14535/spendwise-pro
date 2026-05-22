import jsPDF from "jspdf";

import * as XLSX from "xlsx";

import { saveAs } from "file-saver";

function ActionButtons({ transactions }) {

  function exportPDF() {

    const doc = new jsPDF();

    doc.setFontSize(20);

    doc.text(
      "SpendWise Pro - Relatório",
      20,
      20
    );

    let y = 40;

    transactions.forEach((item) => {

      doc.text(
        `${item.description} | ${item.category} | R$ ${item.amount}`,
        20,
        y
      );

      y += 10;
    });

    doc.save("spendwise-report.pdf");
  }

  function exportExcel() {

    const worksheet =
      XLSX.utils.json_to_sheet(
        transactions
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Relatório"
    );

    const excelBuffer =
      XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

    const fileData =
      new Blob(
        [excelBuffer],
        {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        }
      );

    saveAs(
      fileData,
      "spendwise-report.xlsx"
    );
  }

  return (
    <div className="actions-row">

      <button
        className="action-btn pdf"
        onClick={exportPDF}
      >
        Exportar PDF
      </button>

      <button
        className="action-btn excel"
        onClick={exportExcel}
      >
        Exportar Excel
      </button>

    </div>
  );
}

export default ActionButtons;