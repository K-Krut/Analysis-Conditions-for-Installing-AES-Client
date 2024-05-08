import React from 'react';
import {jsPDF} from "jspdf";
import 'jspdf-autotable';
import {v4 as uuidv4} from 'uuid';
import {generateLandscapeStatsTable, generateLandTypesTable} from '../../utils/map/map-utils.js'


function formatCoordinates(coords) {
    const groupedCoords = [];
    for (let i = 0; i < coords.length; i += 2) {
        if (coords[i + 1]) {
            groupedCoords.push(`    [${coords[i][0]}, ${coords[i][1]}], [${coords[i + 1][0]}, ${coords[i + 1][1]}]`);
        } else {
            groupedCoords.push(`    [${coords[i][0]}, ${coords[i][1]}]`);
        }
    }
    return `[\n${groupedCoords.join(',\n')}\n]`;
}

function setTextForDoc(doc, x, y, fontSize=12, fontName='times', fontStyle='normal', textOptions={}, text) {
    doc.setFontSize(fontSize);
    doc.setFont(fontName, fontStyle);
    doc.text(text, x, y, textOptions);
}

let startY = 0;

function defineY(doc, add_y=10, new_page=false) {
    if (new_page) {
        doc.addPage();
        startY = 10;
    } else {
        let y = startY + add_y
        if (y > 280) {
            doc.addPage();
            startY = 10;
        } else {
            startY = y
        }
    }
    return startY
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

        startY = 50 + (10 * data.coordinates.length / 2);

        setTextForDoc(doc,10, defineY(doc), 12, 'times', 'bold', {},
            'Your Polygon Landscape Types Classification')

        setTextForDoc(doc,10, defineY(doc), 10, 'times', 'normal', {},
            'This document describes the specifications of the land cover data products.')

        doc.autoTable({
            head: [['Type', 'Type ID', 'Area km²', 'Percentage %']],
            body: generateLandscapeStatsTable(data.area),
            startY: defineY(doc),
        });

        /***************************************/

        defineY(doc, 20)

        setTextForDoc(doc,10, defineY(doc, 10, true), 12, 'times', 'bold', {},
            'Suitable Territory Polygon')

        const suitableCoordsText = `Coordinates:\n${formatCoordinates(data.crop)}`;

        setTextForDoc(doc,10, defineY(doc, 10), 10, 'times', 'normal', {}, suitableCoordsText)


        /**************************************************************************************************************/

        // doc.addPage();
        //
        // setTextForDoc(doc,10, 30, 12, 'times', 'bold', {},
        //     'Landscape Types')
        //
        // doc.autoTable({
        //     head: [['ID', 'Name', 'Description', 'Suitable']],
        //     body: generateLandTypesTable(),
        //     startY: 40,
        // });


        /**************************************************************************************************************/

        doc.addPage();

        setTextForDoc(doc,10, 30, 12, 'times', 'bold', {},
            'Landscape Types')

        doc.autoTable({
            head: [['ID', 'Name', 'Description', 'Suitable']],
            body: generateLandTypesTable(),
            startY: 40,
        });



        /**************************************************************************************************************/


        setTextForDoc(doc,10, doc.internal.pageSize.getHeight() - 10, 10, 'times', 'bold', {},
            `Date of Generation: ${7}`)

        doc.save(`report-${uuidv4()}.pdf`);
    };

    generatePdf();

    return null;
};

export default PdfGenerator;
