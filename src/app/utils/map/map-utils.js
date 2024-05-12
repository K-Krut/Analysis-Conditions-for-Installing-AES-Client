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

export function generateEnergyOutputTable(data, year) {
    let months = data.map(item => [
        new Date(item.date).toLocaleString('en-US', {month: 'long'}),
        item.energy.toLocaleString('en-US')
    ])
    return [...months, ...[["Sum", year.toLocaleString('en-US')]]]
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
    let columnWidths = headers.map(header => header.length); // Начальная инициализация ширин колонок по заголовкам

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

export const generateTextTableWeather = (data) => {
    const headers = ['Month', 'Energy Output (kWh)'];
    let columnWidths = headers.map(header => header.length);

    const rows = data.map(item => {
        const month = new Date(item.date).toLocaleString('en-US', { month: 'long' });
        const energy = item.energy.toLocaleString('en-US');
        columnWidths[0] = Math.max(columnWidths[0], month.length);
        columnWidths[1] = Math.max(columnWidths[1], energy.length);
        return [month, energy];
    });

    const totalEnergy = data.reduce((sum, item) => sum + item.energy, 0);
    const totalRow = ["Sum", totalEnergy.toLocaleString('en-US')];
    columnWidths[1] = Math.max(columnWidths[1], totalRow[1].length);

    const createRow = (cells) => {
        return cells.map((cell, index) => cell.toString().padEnd(columnWidths[index], ' ')).join(' | ') + '\n';
    };

    let tableText = createRow(headers) + '-'.repeat(columnWidths.reduce((a, b) => a + b + 3, -3)) + '\n';
    rows.forEach(row => {
        tableText += createRow(row);
    });
    tableText += createRow(totalRow);

    return tableText;
};

export const ENERGY_OUTPUT_FORMULA_EN =
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
    
    ------------------------------`


export const ENERGY_OUTPUT_FORMULA_UK =
    `Формула для оцінки виробленої електроенергії фотовольтаїчною системою:

           E = A * r * H * PR

            E = Енергія (кВт·год)
            A = Загальна площа сонячних панелей (м2)
            r = ККД сонячної панелі (%) 
            H = Річна середня сонячна радіація на нахилених панелях (без врахування тіней)
            PR = Коефіцієнт продуктивності, коефіцієнт втрат (від 0.5 до 0.9, стандартне значення = 0.75)
            
    r — це ККД сонячної панелі, який визначається як відношення: електрична потужність (у кВт·пік) однієї сонячної панелі до площі цієї панелі.
    Одиниця номінальної потужності фотовольтаїчної панелі в цих умовах називається "Ват-пік"
    (Вп або кВп=1000 Вп або МВп=1000000 Вп).
    
    H — це річна середня сонячна радіація на нахилених панелях.
    
    PR : Коефіцієнт продуктивності (PR) є дуже важливим значенням для оцінки якості фотовольтаїчної установки, оскільки він визначає
    продуктивність установки незалежно від орієнтації та нахилу панелі. Він включає всі втрати.
    
    ------------------------------
    
    Зверніть увагу:
    У наших розрахунках ми приймаємо за стандарт модуль ПВ 250 Вп з площею 1.6 м2 та ККД сонячної панелі 15.6%.
    Особливість наших розрахунків:
        - ми використовуємо вищевказану формулу для розрахунку спочатку виходу за кожен місяць року, а потім загального за
            весь рік. У цьому випадку H — це середня сонячна радіація за місяць, яку ми використовуємо для погодних умов вашого полігону.
        - ми приділяємо особливу увагу розрахунку значення PR, і в його розрахунок ми враховуємо втрати,
            спричинені температурою, швидкістю вітру та опадами, які ми розраховуємо на основі статистичних погодних даних вашого полігону.
    
    ------------------------------
`