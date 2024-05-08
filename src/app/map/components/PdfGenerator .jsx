import React from 'react';
import {jsPDF} from "jspdf";
import 'jspdf-autotable';
import {v4 as uuidv4} from 'uuid';
import {
    generateEnergyOutputTable,
    generateLandscapeStatsTable,
    generateLandTypesTable
} from '../../utils/map/map-utils.js'


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

const PdfGenerator = ({data, triggerDownload}) => {
    if (!triggerDownload) {
        return null;
    }

    const generatePdf = () => {
        const doc = new jsPDF();

        setTextForDoc(doc, 105, 20, 16, 'times', 'bold', {align: 'center'},
            'Landscape Analysis Report')

        setTextForDoc(doc, 10, 30, 12, 'times', 'bold', {},
            'Your Polygon')

        const coordsText = `Coordinates:\n${formatCoordinates(data.coordinates)}`;

        setTextForDoc(doc, 10, 40, 10, 'times', 'normal', {}, coordsText)

        startY = 50 + (10 * data.coordinates.length / 2);

        if (data.suitable_polygon_area) {
            setTextForDoc(doc, 10, defineY(doc), 10, 'times', 'normal', {},
                `Your polygon area: ${data.initial_polygon_area.toFixed(5)} km²`)
        }

        setTextForDoc(doc, 10, defineY(doc), 12, 'times', 'bold', {},
            'Your Polygon Landscape Types Classification')

        setTextForDoc(doc, 10, defineY(doc), 10, 'times', 'normal', {},
            'This document describes the specifications of the land cover data products.')
        if (data.area && data.area !== []) {
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

        if (data.crop && data.crop.length > 0) {
            const suitableCoordsText = `Coordinates:\n${formatCoordinates(data.crop)}`;

            setTextForDoc(doc, 10, defineY(doc), 10, 'times', 'normal', {}, suitableCoordsText)
            if (data.suitable_polygon_area) {
                setTextForDoc(doc, 10, defineY(doc, 10 + (10 * data.crop.length / 2)), 10, 'times', 'normal', {},
                    `Suitable polygon area: ${data.suitable_polygon_area.toFixed(5)} km²`)
            }
        } else {
            setTextForDoc(doc, 10, defineY(doc), 10, 'times', 'normal', {},
                `Sorry, but there isnt suitable territory for installing solar panels inside your polygon`)
        }

        /***************************************/


        setTextForDoc(doc, 10, defineY(doc, 20), 12, 'times', 'bold', {},
            'Energy Output Prediction')

        setTextForDoc(doc, 10, defineY(doc), 10, 'times', 'normal', {},
            'This document contains information on how much energy can be generated by solar panels in a given area. Please note that the calculations')

        setTextForDoc(doc, 10, defineY(doc, 5), 10, 'times', 'normal', {},
            'are approximate and have been based on constant values, which may differ from the values for the type of panel you choose.')

        setTextForDoc(doc, 10, defineY(doc, 5), 10, 'times', 'normal', {},
            'Detailed information on the calculations can be found in the document on the following pages.')

        if (data.energy_output_stats.panels) {
            setTextForDoc(doc, 10, defineY(doc), 10, 'times', 'normal', {},
                `Number of Solar Panels can be installed: ${data.energy_output_stats.panels}`)
        }

        if (data.energy_output_stats.panels_area) {
            setTextForDoc(doc, 10, defineY(doc), 10, 'times', 'normal', {},
                `Solar Panels Area: ${data.energy_output_stats.panels_area.toFixed(2)} m²`)
        }

        if (data.energy_output_stats && data.energy_output_stats !== {}) {
            if (data.energy_output_stats.month_energy_stats && data.energy_output_stats.month_energy_stats !== []) {
                doc.autoTable({
                    head: [['Month', 'Output kWt',]],
                    body: generateEnergyOutputTable(data.energy_output_stats.month_energy_stats, data.energy_output_stats.yearly_energy),
                    startY: defineY(doc),
                });
            }
        } else {
            setTextForDoc(doc, 10, defineY(doc), 10, 'times', 'normal', {},
                `We are sorry to inform, but we unable to generate energy output prediction for your polygon `)
        }

        /**************************************************************************************************************/

        doc.addPage();
        startY = 10
        setTextForDoc(doc, 10, startY, 12, 'times', 'bold', {},
            'Energy Output Formula')

        setTextForDoc(doc, 10, defineY(doc, 10), 10, 'times', 'normal', {},
            `The global formula to estimate the electricity generated in output of a photovoltaic system is:

           E = A * r * H * PR

            E = Energy (kWh)
            A = Total solar panel Area (m2)
            r = solar panel yield or efficiency(%) 
            H = Annual average solar radiation on tilted panels (shadings not included)
            PR = Performance ratio, coefficient for losses (range between 0.5 and 0.9, default value = 0.75)
            
    r is the yield of the solar panel given by the ratio : electrical power (in kWp) of one solar panel divided by the area of one panel.
    The unit of the nominal power of the photovoltaic panel in these conditions is called "Watt-peak"
    (Wp or kWp=1000 Wp or MWp=1000000 Wp).
    
    H  is the annual average solar radiation on tilted panels. 
    
    PR : PR (Performance Ratio) is a very important value to evaluate the quality of a photovoltaic installation because it gives 
    the performance of the installation independently of the orientation, inclination of the panel. It includes all losses.
    
    ------------------------------
    
    Please note:
    We take as standard in our calculations 
    the PV module 250 Wp with an area of 1.6 m2 and 15.6% solar panel yield.
    Also what is the peculiarity of our calculations:
        - we use the above formula to calculate first the output for each month of the year and then the total for the
            whole year. In this case H is the average solar radiation for the month, which we use for the weather conditions of your polygon. 
        - we pay special attention to the calculation of PR value and in its calculation we take into account losses 
            caused by temperature, wind speed and precipitation, which we calculate on the basis of statistical weather data of your polygon.
    
    ------------------------------`)

        /**************************************************************************************************************/

        doc.addPage();

        setTextForDoc(doc, 10, 30, 12, 'times', 'bold', {},
            'Landscape Types')

        doc.autoTable({
            head: [['ID', 'Name', 'Description', 'Suitable']],
            body: generateLandTypesTable(),
            startY: 40,
        });


        /**************************************************************************************************************/


        setTextForDoc(doc, 10, doc.internal.pageSize.getHeight() - 10, 10, 'times', 'bold', {},
            `Date of Generation: ${7}`)

        doc.save(`report-${uuidv4()}.pdf`);
    };

    generatePdf();

    return null;
};

export default PdfGenerator;
