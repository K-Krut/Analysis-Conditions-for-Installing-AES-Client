import React from 'react';
import {ENERGY_OUTPUT_FORMULA_EN} from "@/app/utils/map/solar-utils";
import {WIND_ENERGY_OUTPUT_FORMULA_EN} from "@/app/utils/map/wind-utils";


export default function WindEnergyOutputFormula() {
    return (
        <>
            <section className="lg:py-16"
                     style={{
                         width: "60%",
                         marginLeft: 'auto',
                         marginRight: 'auto',
                     }}>
                <h1 className="text-[#ADB7BE] text-base sm:text-lg mb-6 lg:text-xl">Wind Energy Output Prediction Formula</h1>
                <pre style={{
                    whiteSpace: 'pre-wrap',
                    color: 'rgba(222,216,216,0.85)'
                }}>
                    {WIND_ENERGY_OUTPUT_FORMULA_EN}
                </pre>
            </section>
        </>
    );
}