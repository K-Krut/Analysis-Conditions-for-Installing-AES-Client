import React from 'react';
import {jsPDF} from "jspdf";
import 'jspdf-autotable';
import {v4 as uuidv4} from 'uuid';
import {generateLandscapeStatsTable, generateLandTypesTable} from '../../utils/map/map-utils.js'


function formatCoordinates(coords) {
    return `[\n${coords.map(point =>
        `    [${point[0]}, ${point[1]}]`
    ).join(',\n')}\n]` ? coords : `[]`;
}

function setTextForDoc(doc, x, y, fontSize=12, fontName='times', fontStyle='normal', textOptions={}, text) {
    doc.setFontSize(fontSize);
    doc.setFont(fontName, fontStyle);
    doc.text(text, x, y, textOptions);
}


const PdfGenerator = ({data, triggerDownload}) => {
    if (!triggerDownload) {
        return null;
    }

    const generatePdf = () => {
        const doc = new jsPDF();

        setTextForDoc(doc,105, 20, 16, 'times', 'bold', {align: 'center'},
            'Landscape Analysis Report')

        setTextForDoc(doc,10, 30, 12, 'times', 'bold', {},
            'Your Polygon')

        const coordsText = `Coordinates:\n${formatCoordinates(data.coordinates)}`;

        setTextForDoc(doc,10, 40, 10, 'times', 'normal', {}, coordsText)

        let startY = doc.getTextDimensions(coordsText).h + 60;

        if (startY > 280) {
            doc.addPage();
            startY = 10;
        }

        setTextForDoc(doc,10, startY + 10, 12, 'times', 'bold', {},
            'Your Polygon Landscape Types Classification')

        setTextForDoc(doc,10, startY + 20, 10, 'times', 'normal', {},
            'This document describes the specifications of the land cover data products.')

        doc.autoTable({
            head: [['Type', 'Type ID', 'Area km²', 'Percentage %']],
            body: generateLandscapeStatsTable(data.area),
            startY: startY + 30,
        });

        /**************************************************************************************************************/

        doc.addPage();

        setTextForDoc(doc,10, 30, 12, 'times', 'bold', {},
            'Landscape Types')

        doc.autoTable({
            head: [['ID', 'Name', 'Description', 'Suitable']],
            body: generateLandTypesTable(),
            startY: 40,
        });

        setTextForDoc(doc,10, doc.internal.pageSize.getHeight() - 10, 10, 'times', 'bold', {},
            `Date of Generation: ${7}`)

        doc.save(`report-${uuidv4()}.pdf`);
    };

    generatePdf();

    return null;
};

export default PdfGenerator;
