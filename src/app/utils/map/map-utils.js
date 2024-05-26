export const landscape_types_details = [
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

export function generateLandscapeStatsTable(arr) {
    return arr.map(item => [
        item.name,
        item.id,
        item.area.toFixed(5).toLocaleString('en-US'),
        item.percentage.toFixed(0)
    ]);
}

export function generateLandTypesTable(arr = landscape_types_details) {
    return arr.map(item => [
        item.id,
        item.name,
        item.details,
        item.suitable ? "Yes" : "No"
    ])
}

export function formatCoordinatesHTML(coords) {
    if (!Array.isArray(coords)) {
        return '[]';
    }
    const groupedCoords = [];
    for (let i = 0; i < coords.length; i += 3) {
        let group = `    [${coords[i][0]}, ${coords[i][1]}]`;
        if (coords[i + 1]) {
            group += `, [${coords[i + 1][0]}, ${coords[i + 1][1]}]`;
        }
        if (coords[i + 2]) {
            group += `, [${coords[i + 2][0]}, ${coords[i + 2][1]}]`;
        }
        groupedCoords.push(group);
    }
    return `[\n${groupedCoords.join(',\n')}\n]`;
}

export const generateTextTableLandscape = (data) => {
    const headers = ['Type', 'Type ID', 'Area km²', 'Percentage %'];
    let columnWidths = headers.map(header => header.length);

    data.forEach(item => {
        columnWidths[0] = Math.max(columnWidths[0], item.name.length);
        columnWidths[1] = Math.max(columnWidths[1], item.id.toString().length);
        columnWidths[2] = Math.max(columnWidths[2], item.area.toFixed(5).toString().length);
        columnWidths[3] = Math.max(columnWidths[3], item.percentage.toFixed(0).toString().length);
    });

    const createRow = (cells) => {
        return cells.map((cell, index) => cell.toString().padEnd(columnWidths[index], ' ')).join(' | ') + '\n';
    };

    let tableText = createRow(headers);
    tableText += '-'.repeat(columnWidths.reduce((a, b) => a + b + 3, -3)) + '\n';

    data.forEach(item => {
        tableText += createRow([
            item.name,
            item.id,
            item.area.toFixed(5),
            item.percentage.toFixed(0)

        ]);
    });
    tableText += '-'.repeat(columnWidths.reduce((a, b) => a + b + 3, -3)) + '\n';
    return tableText;
};
