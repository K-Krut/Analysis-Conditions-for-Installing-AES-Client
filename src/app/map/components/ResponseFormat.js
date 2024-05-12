import {
    formatCoordinatesHTML,
    generateTextTableLandscape, generateTextTableWeather
} from "@/app/utils/map/map-utils";

const formatResponseData = (data) => {
    return `Your Polygon
    
    Your polygon area: ${data.initial_polygon_area.toFixed(5)} km²
    
    Coordinates:\n${formatCoordinatesHTML(data.coordinates)}
    
    Your Polygon Landscape Types Classification
    
${generateTextTableLandscape(data.area)}
   

Suitable Territory Polygon
    
    Suitable polygon area: ${data.suitable_polygon_area.toFixed(5)} km²
    
    Coordinates:\n${formatCoordinatesHTML(data.crop)}
    
    
Energy Output Prediction
This document contains information on how much energy can be generated by solar panels in a given area. Please note that the calculations
are approximate and have been based on constant values, which may differ from the values for the type of panel you choose.

${generateTextTableWeather(data?.energy_output_stats?.month_energy_stats)}
    `
};

export default formatResponseData;