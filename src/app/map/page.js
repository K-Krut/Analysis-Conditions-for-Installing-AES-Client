"use client"

import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/app/map/components/MapComponent'), { ssr: false });

export default function Map() {
    return (
        <main className="flex min-h-screen flex-col bg-[#121212]">
            <Navbar />
            <div className="container mt-24 mx-auto px-12 py-4 relative"> {/* Добавлено relative */}
                <MapComponent />
            </div>
            <Footer />
        </main>
    );
}