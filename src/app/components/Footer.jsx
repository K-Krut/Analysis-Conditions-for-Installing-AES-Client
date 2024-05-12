import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="footer border z-10 border-t-[#33353F] border-l-transparent border-r-transparent text-white bg-[#121212]"
            style={{
                position: "fixed",
                bottom: "0",
                width: "100%",
            }}
    >
      <div className="container p-8 flex justify-between">
        <span>
            <Image
                src="/images/1-07.png"
                width={50}
                height={50}
            />
        </span>
        <p className="text-slate-600">All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
