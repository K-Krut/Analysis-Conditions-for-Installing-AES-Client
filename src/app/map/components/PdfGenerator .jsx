import React from 'react';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { v4 as uuidv4 } from 'uuid';

function generateTable(arr) {
    return arr.map(item => [
        item.name,
        item.id,
        item.area.toFixed(3),
        item.percentage.toFixed(2)
    ]);
}

const PdfGenerator = ({ data, triggerDownload }) => {
    if (!triggerDownload) {
        return null;
    }

    const generatePdf = () => {
        const doc = new jsPDF();

        doc.setFontSize(14);
        doc.setFont('times', 'bold');
        doc.text('Landscape Analysis Report', 105, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.setFont('times', 'bold');
        doc.text('Landscape Types Classification', 10, 30);

        doc.setFontSize(10);
        doc.setFont('times', 'normal');
        doc.text('This document describes the specifications of the land cover data products.', 10, 40);

        doc.autoTable({
            head: [['Type', 'Type ID', 'Area', 'Percentage']],
            body: generateTable(data.area),
            startY: 50,
        });

        doc.setFontSize(10);
        doc.text('Date of Generation', 10, doc.lastAutoTable.finalY + 10);

        doc.save(`report-${uuidv4()}.pdf`);
    };

    generatePdf();

    return null;
};

export default PdfGenerator;
