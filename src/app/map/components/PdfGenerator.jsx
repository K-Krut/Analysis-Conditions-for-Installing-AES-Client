import React, {useEffect} from 'react';
import {jsPDF} from "jspdf";
import 'jspdf-autotable';
import {v4 as uuidv4} from 'uuid';
import {
    generateLandscapeStatsTable,
    generateLandTypesTable
} from '../../utils/map/map-utils.js'

import {
    generateEnergyOutputTable,
    ENERGY_OUTPUT_FORMULA_EN, RECOMMENDATIONS_STR
} from '../../utils/map/solar-utils.js'

import {
    generateWindEnergyOutputTable,
    WIND_ENERGY_OUTPUT_FORMULA_EN
} from "@/app/utils/map/wind-utils";


function formatCoordinates(coords) {
    if (!Array.isArray(coords)) {
        return '[]';
    }
    const groupedCoords = [];
    for (let i = 0; i < coords?.length; i += 2) {
        if (coords[i + 1]) {
            groupedCoords.push(`    [${coords[i][0]}, ${coords[i][1]}], [${coords[i + 1][0]}, ${coords[i + 1][1]}]`);
        } else {
            groupedCoords.push(`    [${coords[i][0]}, ${coords[i][1]}]`);
        }
    }
    return `[\n${groupedCoords.join(',\n')}\n]`;
}

function setTextForDoc(doc, x, y, fontSize = 12, fontName = 'times', fontStyle = 'normal', textOptions = {}, text) {
    doc.setFontSize(fontSize);
    doc.setFont(fontName, fontStyle);
    doc.text(text, x, y, textOptions);
}

let startY = 0;

function defineY(doc, add_y = 10, new_page = false) {
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


const PdfGenerator = ({ data, shouldGeneratePdf, onDownloadCompleted }) => {

    useEffect(() => {
        if (shouldGeneratePdf) {
            const generatePdf = () => {
                const doc = new jsPDF();

                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();

                doc.setFont('times', 'bold');
                doc.setFontSize(22);
                doc.text('Landscape Analysis Report', pageWidth / 2, pageHeight / 2, {align: 'center'});

                /**************************************************************************************************************/

                doc.addPage();

                setTextForDoc(doc, 105, defineY(doc), 16, 'times', 'bold', {align: 'center'},
                    'Landscape Analysis Report')

                setTextForDoc(doc, 10, defineY(doc), 12, 'times', 'bold', {},
                    'Your Polygon')

                if (data?.initial_polygon_area !== undefined) {
                    setTextForDoc(doc, 10, defineY(doc), 10, 'times', 'normal', {},
                        `Your polygon area: ${data.initial_polygon_area.toFixed(5)} km²`)
                }

                setTextForDoc(doc, 10, defineY(doc), 10, 'times', 'normal', {}, `Coordinates:\n${formatCoordinates(data.coordinates)}`)

                if (data?.coordinates) {
                    setTextForDoc(doc, 10, defineY(doc, 20 + (10 * data?.coordinates?.length / 2)), 12, 'times', 'bold', {},
                        'Your Polygon Landscape Types Classification')
                } else {
                    setTextForDoc(doc, 10, defineY(doc, 20), 12, 'times', 'bold', {},
                        'Your Polygon Landscape Types Classification')
                }

                setTextForDoc(doc, 10, defineY(doc), 10, 'times', 'normal', {},
                    'This document describes the specifications of the land cover data products.')

                if (data.area && Array.isArray(data.area)) {
                    doc.autoTable({
                        head: [['Type', 'Type ID', 'Area km²', 'Percentage %']],
                        body: generateLandscapeStatsTable(data.area),
                        startY: defineY(doc),
                    });
                } else {
                    setTextForDoc(doc, 10, defineY(doc), 10, 'times', 'normal', {},
                        `We are sorry to inform, but we unable to generate landscape statistics for your polygon `)
                }

                /**************************************************************************************************************/

                defineY(doc, 20)

                setTextForDoc(doc, 10, defineY(doc, 10, true), 12, 'times', 'bold', {},
                    'Suitable Territory Polygon')

                if (data.suitable_polygon_area) {
                    setTextForDoc(doc, 10, defineY(doc), 10, 'times', 'normal', {},
                        `Suitable polygon area: ${data.suitable_polygon_area.toFixed(5)} km²`)
                }

                if (data.crop && Array.isArray(data.crop)) {

                    const suitableCoordsText = `Coordinates:\n${formatCoordinates(data.crop)}`;

                    setTextForDoc(doc, 10, defineY(doc), 10, 'times', 'normal', {}, suitableCoordsText)

                } else {
                    setTextForDoc(doc, 10, defineY(doc), 10, 'times', 'normal', {},
                        `Sorry, but there isnt suitable territory for installing solar panels inside your polygon`)
                }

                /***************************************/

                if (data?.energy_output_stats && data?.energy_output_stats !== {}) {
                    if (data.type === "wind") {
                        windPfd(doc, data?.energy_output_stats)
                    } else {
                        solarPfd(doc, data?.energy_output_stats)
                    }
                } else {
                    setTextForDoc(doc, 10, defineY(doc), 10, 'times', 'normal', {},
                        `We are sorry to inform, but we unable to generate energy output prediction for your polygon `)
                }

                /**************************************************************************************************************/

                doc.addPage();

                setTextForDoc(doc, 10, 30, 12, 'times', 'bold', {}, 'Landscape Types')

                doc.autoTable({
                    head: [['ID', 'Name', 'Description', 'Suitable']],
                    body: generateLandTypesTable(),
                    startY: 40,
                });


                /**************************************************************************************************************/


                setTextForDoc(doc, 10, doc.internal.pageSize.getHeight() - 10, 10, 'times', 'bold', {},
                    `Date of Generation: ${new Date().toISOString().slice(0, 10)}`)

                doc.save(`report-${uuidv4()}.pdf`);

                onDownloadCompleted();

            };

            generatePdf();
        }
    }, [shouldGeneratePdf, onDownloadCompleted]);

    return null;

};


function solarPfd(doc, response) {
    // if (data.crop && Array.isArray(data.crop)) {
    //     let y = 20 + (10 * (data?.crop?.length / 2))
    //     setTextForDoc(doc, 10, defineY(doc, y ? y : 20), 12, 'times', 'bold', {},
    //         'Energy Output Prediction')
    // } else {
    //     setTextForDoc(doc, 10, defineY(doc, 20), 12, 'times', 'bold', {},
    //         'Energy Output Prediction')
    // }
    doc.addPage();

    setTextForDoc(doc, 10, defineY(doc), 12, 'times', 'bold', {},
        'Energy Output Prediction')

    setTextForDoc(doc, 10, defineY(doc), 10, 'times', 'normal', {},
        'This document contains information on how much energy can be generated by solar panels in a given area. Please note that the calculations')

    setTextForDoc(doc, 10, defineY(doc, 5), 10, 'times', 'normal', {},
        'are approximate and have been based on constant values, which may differ from the values for the type of panel you choose.')

    setTextForDoc(doc, 10, defineY(doc, 5), 10, 'times', 'normal', {},
        'Detailed information on the calculations can be found in the document on the following pages.')

    if (response?.panels) {
        setTextForDoc(doc, 10, defineY(doc), 10, 'times', 'normal', {},
            `Number of Solar Panels can be installed: ${response?.panels ? response?.panels : 0}`)
    }

    if (response?.panels_area) {
        setTextForDoc(doc, 10, defineY(doc), 10, 'times', 'normal', {},
            `Solar Panels Area: ${response?.panels_area.toFixed(2)} m²`)
    }

    if (response?.month_energy_stats && response?.month_energy_stats !== []) {
        doc.autoTable({
            head: [['Month', 'Output kWt',]],
            body: generateEnergyOutputTable(response?.month_energy_stats, response?.yearly_energy),
            startY: defineY(doc),
        });
    }


    /**************************************************************************************************************/

    doc.addPage();

    startY = 10

    setTextForDoc(doc, 10, startY, 12, 'times', 'bold', {},
        'Recommendations and useful resources')

    setTextForDoc(doc, 10, defineY(doc, 10), 10, 'times', 'normal', {},
        RECOMMENDATIONS_STR)

    /**************************************************************************************************************/

    doc.addPage();

    startY = 10

    setTextForDoc(doc, 10, startY, 12, 'times', 'bold', {},
        'Energy Output Formula')

    setTextForDoc(doc, 10, defineY(doc, 10), 10, 'times', 'normal', {},
        ENERGY_OUTPUT_FORMULA_EN)

}

function windPfd(doc, response) {
    doc.addPage();

    setTextForDoc(doc, 10, defineY(doc), 12, 'times', 'bold', {},
        'Energy Output Prediction')

    setTextForDoc(doc, 10, defineY(doc), 10, 'times', 'normal', {},
        `This document contains information on how much energy can be generated by wind turbines in a given area. Please note that the calculations
        are approximate and have been based on constant values, which may differ from the values for the type of wind turbine you choose.`)

    setTextForDoc(doc, 10, defineY(doc, 15), 10, 'times', 'normal', {},
        'Detailed information on the calculations can be found in the document on the following pages.')

    if (response?.turbines) {
        setTextForDoc(doc, 10, defineY(doc), 10, 'times', 'normal', {},
            `Number of Wind Turbines can be installed: ${response?.turbines ? response?.turbines : 0}`)
    }

    if (response?.wind_turbine_area) {
        setTextForDoc(doc, 10, defineY(doc), 10, 'times', 'normal', {},
            `Area Required for one Wind Turbine: ${response?.wind_turbine_area} km²`)
    }

    if (response?.month_energy_stats && response?.month_energy_stats !== []) {
        doc.autoTable({
            head: [['Month', 'Avg. Wind Speed', 'Max. Wind Speed', 'Output mWt 1 Turbine', 'Output mWt',]],
            body: generateWindEnergyOutputTable(response?.month_energy_stats, response?.yearly_energy, response?.yearly_energy_one_turbine),
            startY: defineY(doc),
        });
    }

    /**************************************************************************************************************/

    if (response?.month_energy_stats && response?.month_energy_stats !== []) {
        doc.addPage()
        setTextForDoc(doc, 10, defineY(doc), 12, 'times', 'bold', {},
            'Wind Roses')
        addImagesPage(doc, response?.month_energy_stats)
    }

    /**************************************************************************************************************/

    doc.addPage();

    startY = 10

    setTextForDoc(doc, 10, startY, 12, 'times', 'bold', {}, 'Energy Output Formula')

    setTextForDoc(doc, 10, defineY(doc, 10), 10, 'times', 'normal', {},
        WIND_ENERGY_OUTPUT_FORMULA_EN)

}

function addImagesPage(doc, data) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    const contentWidth = (pageWidth - 3 * margin) / 2;
    const contentHeight = contentWidth / 1.33;
    let xPosition = margin;
    let yPosition = margin;

    for (let i = 0; i < data.length; i++) {
        if (yPosition + contentHeight + 20 > pageHeight) {
            doc.addPage();
            yPosition = margin;
        }

        doc.addImage(data[i]?.wind_rose_base_64, 'PNG', xPosition, yPosition, contentWidth, contentHeight);
        let dateStr = new Date(2022, data[i]?.month - 1).toLocaleString('en-US', {month: 'long'})
        doc.text(dateStr, xPosition, yPosition + contentHeight + 10, { maxWidth: contentWidth });

        if (xPosition === margin) {
            xPosition += contentWidth + margin;
        } else {
            xPosition = margin;
            yPosition += contentHeight + 20;
        }
    }
}


export default PdfGenerator;
