import { jsPDF } from "jspdf";
import "jspdf-autotable";
import fs from "fs";

function generatePDF() {
  const doc = new jsPDF({
    orientation: "p",
    unit: "pt",
    format: "letter"
  });

  const columns = [
    { title: "COL1", dataKey: "col1" },
    { title: "COL2", dataKey: "col2" },
    { title: "COL3", dataKey: "col3" },
    { title: "COL4", dataKey: "col4" }
  ];

  const rows = [
    {
      "col1": "data-cell_r2_c1",
      "col2": "data-cell_r2_c2",
      "col3": "data-cell3_r2_c3",
      "col4": "data-cell4_r2_c4"
    },
    {
      "col1": "data-cell_r3_c1",
      "col2": "data-cell_r3_c2",
      "col3": "data-cell3_r3_c3",
      "col4": "data-cell4_r3_c4"
    }
  ];

  doc.autoTable(columns, rows);

  const filePath = "./pdfs/prueba.pdf";

  fs.writeFile(filePath, doc.output(), function (error) {
    if (error) {
      console.error("Error al guardar el archivo:", error);
    } else {
      console.log("El archivo se ha guardado correctamente en:", filePath);
    }
  });
}

generatePDF();