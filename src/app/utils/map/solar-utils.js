export function generateEnergyOutputTable(data, year) {
    let months = data.map(item => [
        new Date(item.date).toLocaleString('en-US', {month: 'long'}),
        item.energy.toLocaleString('en-US')
    ])
    return [...months, ...[["Sum", year.toLocaleString('en-US')]]]
}

export const generateSolarTextTable = (data) => {
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



export const RECOMMENDATIONS_STR = `Here are some recommendations and useful resources:
    - LAW OF UKRAINE On Alternative Energy Sources: https://zakon.rada.gov.ua/laws/show/555-15#Text
    - LAW OF UKRAINE On the Electricity Market: https://zakon.rada.gov.ua/laws/show/2019-19#Text
    - Please note that if you are planning to build a solar panel power plant, you do not need to decide on the type of your power plant. 
        We recommend that you familiarize yourself with the types of solar power plants in detail here: 
        https://www.solargarden.com.ua/typy-sonyachnyh-elektrostantsiy-ih-efektyvnist-perevahy-i-nedoliky/
    - There are many types of solar panels with different technical characteristics. Monocrystalline panels, for example, 
        usually have higher efficiency than polycrystalline panels, but can be more expensive. You can learn about the types 
        of solar panels here: 
                https://www.greenmatch.co.uk/blog/2015/09/types-of-solar-panels, 
                https://www.solarchoice.net.au/solar-panels/sizes/
    - Pay attention to quality and safety standards when choosing components for your solar system. 
    This will ensure the reliability and durability of the installation. Information on standards can be found at 
    the National Standardization Body of Ukraine or on the websites of certification agencies.
    `
export const ENERGY_OUTPUT_FORMULA_EN =
    `The global formula to estimate the electricity generated in output of a photovoltaic system is:

           E = A * r * H * PR

            E = Energy (kWh)
            A = Total solar panel Area (m2)
            r = solar panel yield or efficiency(%) 
            H = Monthly average solar radiation on tilted panels (shadings not included)
            PR = Performance ratio, coefficient for losses (range between 0.5 and 0.9, default value = 0.75)
            
    r is the yield of the solar panel given by the ratio : electrical power (in kWp) of one solar panel divided by the area of one panel.
    The unit of the nominal power of the photovoltaic panel in these conditions is called "Watt-peak"
    (Wp or kWp=1000 Wp or MWp=1000000 Wp).
    
    H  is the monthly average solar radiation on tilted panels. 
    
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