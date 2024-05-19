"use client";
import Image from "next/image";

const AboutSection = () => {
  return (
    <section className="text-white" id="about"
             style={{
               "padding-bottom": "150px"
             }}>
      <div className="md:grid md:grid-cols-2 gap-8 items-center py-8 px-4 xl:gap-16 sm:py-16 xl:px-16">
        <Image src="/images/landsat2.jpg" width={500} height={500} />
        <div className="mt-4 md:mt-0 text-left flex flex-col h-full">
          <h2 className="text-4xl font-bold text-white mb-4">About</h2>
          <p className="text-base lg:text-lg">
            Our web application harnesses advanced computational technologies to optimize solar energy installations in Ukraine. By integrating AI with satellite imagery and meteorological data, we offer precise site suitability analyses and performance forecasting. Our tool is invaluable for energy businesses and private homeowners alike, aiding in strategic planning, operational management, and financial decision-making. This technology promotes sustainable development, enhances energy independence, and mitigates environmental impacts, especially crucial in times of infrastructure vulnerability.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
