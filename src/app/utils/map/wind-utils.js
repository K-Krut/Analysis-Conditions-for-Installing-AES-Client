export function generateWindEnergyOutputTable(data, yearly_energy, yearly_energy_one_turbine) {  // [['Month', 'Avg. Wind Speed', 'Max. Wind Speed', 'Output mWt 1 Turbine', 'Output mWt',]],
    let months = data.map(item => [
        new Date(2022, item.month - 1).toLocaleString('en-US', {month: 'long'}),
        item.average_wind_speed,
        item.max_wind_speed,
        (item.energy_one_turbine / 1000).toLocaleString('en-US') ,
        (item.energy / 1000).toLocaleString('en-US')
    ])
    return [
        ...months,
        ...[["Sum", '', '', yearly_energy_one_turbine.toLocaleString('en-US')]],
        ...[["Sum", '', '', '', yearly_energy.toLocaleString('en-US')]]
    ]
}


export const WIND_ENERGY_OUTPUT_FORMULA_EN =
    `The global formula to estimate the electricity generated in output of a wind system is:

            E = ½ * ρ * A * w³ * Cp / 1000

            E = Energy (kWh)
            ρ - denotes the air density (in kilograms per cubic meter, kg/m³).
            A = π * r² - is the swept area (in square meters, m²)
                r = is the radius of the rotor (in meters, m)
            w = wind speed in meters per second for each hour of the period for which the energy is counted
            Cp stands for the power coefficient, represents the efficiency of the wind turbine in capturing the wind’s energy (0.4 - 0.59)
            
    
    ------------------------------
    
    Please note:
    We take as standard in our calculations 
    the Vestas V112-3.45 MW with a required area of 0.25 km2 and r = 50m - radius of the rotor 
    Cp = 0.4 
    ρ = 1.225 
    
    ------------------------------`
