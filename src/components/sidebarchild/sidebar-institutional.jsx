import React from 'react';

const SidebarInstitutional = () => {
    const GeneralLinks2=[
        {
            title: "Bakım Faaliyet",
            icon: (
                <svg style={{marginRight: '5px'}} width="24" height="24" viewBox="0 0 24 24" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M20 9.6C20 5.6 18.4 4 14.4 4H9.6C5.6 4 4 5.6 4 9.6V14.4C4 18.4 5.6 20 9.6 20M16.35 8C15.8 7.3 14.88 7 13.5 7H10.5C8 7 7 8 7 10.5V13.5C7 14.88 7.3 15.8 7.99 16.35M8.01 4V2M12 4V2M16 4V2M20 8H22M8.01 20V22M2 8H4M2 12H4M2 16H4M18.3 17C18.3 17.8781 17.5881 18.59 16.71 18.59C15.8319 18.59 15.12 17.8781 15.12 17C15.12 16.1219 15.8319 15.41 16.71 15.41C17.5881 15.41 18.3 16.1219 18.3 17ZM11.41 17.46V16.53C11.41 15.98 11.86 15.53 12.41 15.53C13.37 15.53 13.76 14.85 13.28 14.02C13 13.54 13.17 12.92 13.65 12.65L14.56 12.12C14.98 11.87 15.52 12.02 15.77 12.44L15.83 12.54C16.31 13.37 17.09 13.37 17.57 12.54L17.63 12.44C17.88 12.02 18.42 11.88 18.84 12.12L19.75 12.65C20.23 12.93 20.4 13.54 20.12 14.02C19.64 14.85 20.03 15.53 20.99 15.53C21.54 15.53 21.99 15.98 21.99 16.53V17.46C21.99 18.01 21.54 18.46 20.99 18.46C20.03 18.46 19.64 19.14 20.12 19.97C20.4 20.45 20.23 21.07 19.75 21.34L18.84 21.87C18.42 22.12 17.88 21.97 17.63 21.55L17.57 21.45C17.09 20.62 16.31 20.62 15.83 21.45L15.77 21.55C15.52 21.97 14.98 22.11 14.56 21.87L13.65 21.34C13.17 21.06 13 20.45 13.28 19.97C13.76 19.14 13.37 18.46 12.41 18.46C11.86 18.47 11.41 18.02 11.41 17.46Z"
                        stroke="url(#paint0_linear_106_44)" strokeWidth="1.5" strokeMiterlimit="10"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                        <linearGradient id="paint0_linear_106_44" x1="12" y1="2" x2="12" y2="22"
                                        gradientUnits="userSpaceOnUse">
                            <stop stopColor="#17199F"/>
                            <stop offset="1" stopColor="#D232AF"/>
                        </linearGradient>
                    </defs>
                </svg>
            ),
            links: [
                {text: "Yıllık Bakım Planı", href: "/bakim/plani"},
                {text: "Prosedür", href: "/bakim/prosedur"},
            ],
            indexins:45
        },
    ]

    return (
        <div className="accordion-item">
            <h2 className="accordion-header">
                <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseGeneral2"
                    aria-expanded="false"
                    aria-controls="flush-collapseGeneral2"
                >
                    <svg style={{marginRight:'5px'}} width="32" height="32" viewBox="0 0 44 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M1.83301 39.4167H42.1663M36.2631 39.4346V31.4437M3.84963 39.4167V10.8038C3.84963 7.20256 5.68306 5.39294 9.33139 5.39294H20.753C24.4014 5.39294 26.2163 7.20256 26.2163 10.8038V39.4167M10.633 14.7813H19.708M10.633 21.5H19.708M15.1247 39.4167V32.6979M36.2997 19.5113C34.063 19.5113 32.2663 21.2671 32.2663 23.453V27.52C32.2663 29.7058 34.063 31.4617 36.2997 31.4617C38.5363 31.4617 40.333 29.7058 40.333 27.52V23.453C40.333 21.2671 38.5363 19.5113 36.2997 19.5113Z"
                            stroke="url(#paint0_linear_353_1584)" strokeWidth="1.5" strokeMiterlimit="10"
                            strokeLinecap="round" strokeLinejoin="round"/>
                        <defs>
                            <linearGradient id="paint0_linear_353_1584" x1="21.9997" y1="5.39294" x2="21.9997"
                                            y2="39.4346" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#17199F"/>
                                <stop offset="1" stopColor="#D232AF"/>
                            </linearGradient>
                        </defs>
                    </svg>

                    Kurumsal
                </button>
            </h2>
            <div id="flush-collapseGeneral2" className="accordion-collapse collapse"
                 data-bs-parent="#accordionFlushExampleParent">
                <div className="accordion-body">
                    <div className="accordion-body-child">
                        {GeneralLinks2.map((item) => (
                            <div className="accordion-item" key={item.indexins}>
                                <h2 className="accordion-header">
                                    <button
                                        className="accordion-button collapsed"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target={`#flush-collapse${item.indexins}`}
                                        aria-expanded="false"
                                        aria-controls={`flush-collapse${item.indexins}`}
                                    >
                                        {item.icon}
                                        {item.title}
                                    </button>
                                </h2>
                                <div
                                    id={`flush-collapse${item.indexins}`}
                                    className="accordion-collapse collapse"
                                    data-bs-parent={`#flush-collapseGeneral2`}
                                >
                                    <div className="accordion-body">
                                        <div className="accordion-body-child">
                                            {item.links.map((link, linkIndex) => (
                                                <a key={linkIndex} className="accordion-body-child-a"
                                                   href={link.href}>
                                                    {link.text}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SidebarInstitutional;
