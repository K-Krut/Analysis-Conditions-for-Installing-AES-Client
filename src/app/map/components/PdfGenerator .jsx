import React from 'react';
import {jsPDF} from "jspdf";
import 'jspdf-autotable';
import {v4 as uuidv4} from 'uuid';

let landscape_types_details = [
    {
        "id": 0,
        "name": "Unknown",
        "details": "No or not enough satellite data available.",
        "suitable": false
    },
    {
        "id": 20,
        "name": "Shrubs",
        "details": "Woody perennial plants with persistent and woody stems and without any defined main stem being less than 5 m tall. The shrub foliage can be either evergreen or deciduous.",
        "suitable": false
    },
    {
        "id": 30,
        "name": "Herbaceous vegetation",
        "details": "Plants without persistent stem or shoots above ground and lacking definite firm structure. Tree and shrub cover is less than 10 %.",
        "suitable": true
    },
    {
        "id": 40,
        "name": "Cultivated and managed vegetation / agriculture",
        "details": "Cultivated and managed vegetation / agriculture. Lands covered with temporary crops followed by harvest and a bare soil period (e.g., single and multiple cropping systems). Note that perennial woody crops will be classified as the appropriate forest or shrub land cover type.",
        "suitable": true
    },
    {
        "id": 50,
        "name": "Urban / built up",
        "details": "Urban / built up. Land covered by buildings and other man-made structures.",
        "suitable": false
    },
    {
        "id": 60,
        "name": "Bare / sparse vegetation",
        "details": "Lands with exposed soil, sand, or rocks and never has more than 10 % vegetated cover during any time of the year.",
        "suitable": true
    },
    {
        "id": 70,
        "name": "Snow and ice",
        "details": "Lands under snow or ice cover throughout the year.",
        "suitable": false
    },
    {
        "id": 80,
        "name": "Permanent water bodies",
        "details": "Lakes, reservoirs, and rivers. Can be either fresh or salt-water bodies.",
        "suitable": false
    },
    {
        "id": 90,
        "name": "Herbaceous wetland",
        "details": "Herbaceous wetland. Lands with a permanent mixture of water and herbaceous or woody vegetation. The vegetation can be present in either salt, brackish, or fresh water.",
        "suitable": false
    },
    {
        "id": 100,
        "name": "Moss and lichen",
        "details": "Moss and lichen.",
        "suitable": true
    },
    {
        "id": 111,
        "name": "Closed forest",
        "details": "Closed forest, evergreen needle leaf. Tree canopy >70 %, almost all needle leaf trees remain green all year. Canopy is never without green foliage.",
        "suitable": false
    },
    {
        "id": 112,
        "name": "Closed forest",
        "details": "Closed forest, evergreen broad leaf. Tree canopy >70 %, almost all broadleaf trees remain green year round. Canopy is never without green foliage.",
        "suitable": false
    },
    {
        "id": 113,
        "name": "Closed forest",
        "details": "Closed forest, deciduous needle leaf. Tree canopy >70 %, consists of seasonal needle leaf tree communities with an annual cycle of leaf-on and leaf-off periods.",
        "suitable": false
    },
    {
        "id": 114,
        "name": "Closed forest",
        "details": "Closed forest, deciduous broad leaf. Tree canopy >70 %, consists of seasonal broadleaf tree communities with an annual cycle of leaf-on and leaf-off periods.",
        "suitable": false
    },
    {
        "id": 115,
        "name": "Closed forest, mixed.",
        "details": "Closed forest, mixed.",
        "suitable": false
    },
    {
        "id": 116,
        "name": "Closed forest",
        "details": "Closed forest, not matching any of the other definitions.",
        "suitable": false
    },
    {
        "id": 121,
        "name": "Open forest",
        "details": "Open forest, evergreen needle leaf. Top layer- trees 15-70 % and second layer- mixed of shrubs and grassland, almost all needle leaf trees remain green all year. Canopy is never without green foliage.",
        "suitable": false
    },
    {
        "id": 122,
        "name": "Open forest, evergreen broad leaf",
        "details": "Open forest, evergreen broad leaf. Top layer- trees 15-70 % and second layer- mixed of shrubs and grassland, almost all broadleaf trees remain green year round. Canopy is never without green foliage.",
        "suitable": false
    },
    {
        "id": 123,
        "name": "Open forest, deciduous needle leaf",
        "details": "Open forest, deciduous needle leaf. Top layer- trees 15-70 % and second layer- mixed of shrubs and grassland, consists of seasonal needle leaf tree communities with an annual cycle of leaf-on and leaf-off periods.",
        "suitable": false
    },
    {
        "id": 124,
        "name": "Open forest, deciduous needle leaf",
        "details": "Open forest, deciduous broad leaf. Top layer- trees 15-70 % and second layer- mixed of shrubs and grassland, consists of seasonal broadleaf tree communities with an annual cycle of leaf-on and leaf-off periods.",
        "suitable": false
    },
    {
        "id": 125,
        "name": "Open forest, mixed",
        "details": "Open forest, mixed.",
        "suitable": false
    },
    {
        "id": 126,
        "name": "Open forest",
        "details": "Open forest, not matching any of the other definitions.",
        "suitable": false
    },
    {
        "id": 200,
        "name": "Oceans, seas",
        "details": "Oceans, seas. Can be either fresh or salt-water bodies.",
        "suitable": false
    },
]

function generateLandscapeStatsTable(arr) {
    return arr.map(item => [
        item.name,
        item.id,
        item.area.toFixed(3),
        item.percentage.toFixed(2)
    ]);
}

function generateLandTypesTable(arr=landscape_types_details) {
    return arr.map(item => [
        item.id,
        item.name,
        item.details,
        item.suitable ? "Yes" : "No"
    ])
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

        setTextForDoc(doc,105, 20, 12, 'times', 'normal', {align: 'center'},
            'Landscape Analysis Report')

        setTextForDoc(doc,10, 30, 12, 'times', 'bold', {},
            'Your Polygon')

        setTextForDoc(doc,10, 60, 10, 'times', 'normal', {},
            `Coordinates: ${data.coordinates}`)

        setTextForDoc(doc,10, 70, 12, 'times', 'bold', {},
            'Your Polygon Landscape Types Classification')

        setTextForDoc(doc,10, 80, 10, 'times', 'normal', {},
            'This document describes the specifications of the land cover data products.')

        doc.autoTable({
            head: [['Type', 'Type ID', 'Area km²', 'Percentage %']],
            body: generateLandscapeStatsTable(data.area),
            startY: 90,
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
