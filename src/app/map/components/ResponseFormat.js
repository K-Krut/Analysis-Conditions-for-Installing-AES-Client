import {formatCoordinates, formatCoordinatesHTML, generateLandscapeStatsTable} from "@/app/utils/map/map-utils";

const formatResponseData = (data) => {
    return `Your Polygon
    
    Your polygon area: ${data.initial_polygon_area.toFixed(5)} km²
    
    Your Polygon Landscape Types Classification
    ${generateLandscapeStatsTable(data.area)}
    
    
    ----------------------------------------
    
    
Suitable Territory Polygon
    
    Suitable polygon area: ${data.suitable_polygon_area.toFixed(5)} km²
    
    Coordinates:\n${formatCoordinatesHTML(data.crop)}
    `
};

export default formatResponseData;