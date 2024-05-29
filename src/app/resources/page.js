"use client"

import Head from "next/head";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import LandscapeTypeTable from "@/app/resources/components/LandTypesTable";
import SolarEnergyOutputFormula from "@/app/resources/components/SolarEnergyOutputFormula";
import WindEnergyOutputFormula from "@/app/resources/components/WindEnergyOutputFormula";

export default function Resources() {
    return (
        <>
            <Head>
                <title>{'Resources | Solar Navigator'}</title>
            </Head>
            <main className="flex min-h-screen flex-col bg-[#121212]">
                <Navbar/>
                <div className="container mt-24 mx-auto px-12 py-4 relative">
                    <SolarEnergyOutputFormula/>
                    <WindEnergyOutputFormula/>
                    <LandscapeTypeTable/>
                </div>
                <Footer/>
            </main>
        </>
    );
}