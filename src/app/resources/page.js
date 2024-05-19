"use client"

import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import LandscapeTypeTable from "@/app/resources/components/LandTypesTable";
import EnergyOutputFormula from "@/app/resources/components/EnergyOutputFormula";
import Head from "next/head";

export default function Resources() {
    return (
        <>
            <Head>
                <title>{'Resources | Solar Navigator'}</title>
            </Head>
        <main className="flex min-h-screen flex-col bg-[#121212]">
            <Navbar />
            <div className="container mt-24 mx-auto px-12 py-4 relative">
                <EnergyOutputFormula />
                <LandscapeTypeTable />
            </div>
            <Footer />
        </main>
            </>
    );
}