import React from "react";
import { StyleSheet } from "react-native";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts?.pdfMake?.vfs || pdfFonts?.vfs; // Evitar errores con vfs

const DownloadButton = ({ data }) => {
  const generatePDF = () => {
    if (!Array.isArray(data) || data.length === 0) {
      console.error("Error: No hay datos para exportar a PDF.");
      return;
    }

    // Transformar los datos en una tabla para el PDF
    const tableBody = [
      ["Tipo de delito", "Subtipo", "Modalidad", "Entidad", "Municipio", "Enero", "Febrero", "Total"], // Encabezados
      ...data.map(item => [
        item["Tipo de delito"],
        item["Subtipo de delito"],
        item.Modalidad,
        item.Entidad,
        item.Municipio,
        item.Enero,
        item.Febrero,
        parseInt(item.Enero || "0") + parseInt(item.Febrero || "0") // Total
      ]),
    ];

    const docDefinition = {
      content: [
        { text: "Reporte de Crímenes en México", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*", "*", "*", "auto", "auto", "auto"],
            body: tableBody,
          },
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true, marginBottom: 10 },
      },
    };

    pdfMake.createPdf(docDefinition).download("reporte_crimenes.pdf");
  };

  return (
    <button onClick={generatePDF} style={styles.boton}>
      Descargar Informe
    </button>
  );
};

export default DownloadButton;

const styles = StyleSheet.create({
    boton: {
        display: 'flex',
        width: "50%",
        backgroundColor: 'Green',
        color: 'white',
        borderRadius: 3,
        alignSelf:'center',
    },
});