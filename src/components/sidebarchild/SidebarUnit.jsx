
const SidebarUnit = () => {
    const GeneralLinks3=[
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
                {text: "Yıllık Bakım Planı", href: "#"},
                {text: "Bakım Raporları", href: "#"},
            ],
            indexun:30
        },
    ]
    return (
        <div className="accordion-item">
            <h2 className="accordion-header">
                <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseGeneral3"
                    aria-expanded="false"
                    aria-controls="flush-collapseGeneral3"
                >
                    <svg style={{marginRight:'5px'}} width="32" height="32" viewBox="0 0 45 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M31.8189 25.27C34.3877 25.6725 37.2189 25.2525 39.2064 24.01C41.8502 22.365 41.8502 19.67 39.2064 18.025C37.2002 16.7825 34.3314 16.3625 31.7627 16.7825M13.1252 25.27C10.5564 25.6725 7.7252 25.2525 5.7377 24.01C3.09395 22.365 3.09395 19.67 5.7377 18.025C7.74395 16.7825 10.6127 16.3625 13.1814 16.7825M33.7502 12.53C33.6377 12.5125 33.5064 12.5125 33.3939 12.53C30.8064 12.4425 28.7439 10.465 28.7439 8.015C28.7439 5.5125 30.9002 3.5 33.5814 3.5C36.2627 3.5 38.4189 5.53 38.4189 8.015C38.4002 10.465 36.3377 12.4425 33.7502 12.53ZM11.1939 12.53C11.3064 12.5125 11.4377 12.5125 11.5502 12.53C14.1377 12.4425 16.2002 10.465 16.2002 8.015C16.2002 5.5125 14.0439 3.5 11.3627 3.5C8.68144 3.5 6.52519 5.53 6.52519 8.015C6.54394 10.465 8.60644 12.4425 11.1939 12.53ZM22.5002 25.6025C22.3877 25.585 22.2564 25.585 22.1439 25.6025C19.5564 25.515 17.4939 23.5375 17.4939 21.0875C17.4939 18.585 19.6502 16.5725 22.3314 16.5725C25.0127 16.5725 27.1689 18.6025 27.1689 21.0875C27.1502 23.5375 25.0877 25.5325 22.5002 25.6025ZM17.0439 31.115C14.4002 32.76 14.4002 35.455 17.0439 37.1C20.0439 38.9725 24.9564 38.9725 27.9564 37.1C30.6002 35.455 30.6002 32.76 27.9564 31.115C24.9752 29.26 20.0439 29.26 17.0439 31.115Z"
                            stroke="url(#paint0_linear_353_1586)" strokeWidth="1.5" strokeLinecap="round"
                            strokeLinejoin="round"/>
                        <defs>
                            <linearGradient id="paint0_linear_353_1586" x1="22.4721" y1="3.5" x2="22.4721" y2="38.5044"
                                            gradientUnits="userSpaceOnUse">
                                <stop stopColor="#17199F"/>
                                <stop offset="1" stopColor="#D232AF"/>
                            </linearGradient>
                        </defs>
                    </svg>

                    Birim
                </button>
            </h2>
            <div id="flush-collapseGeneral3" className="accordion-collapse collapse"
                 data-bs-parent="#accordionFlushExampleParent">
                <div className="accordion-body">
                    <div className="accordion-body-child">
                        {GeneralLinks3.map((item) => (
                            <div className="accordion-item" key={item.indexun}>
                                <h2 className="accordion-header">
                                    <button
                                        className="accordion-button collapsed"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target={`#flush-collapse${item.indexun}`}
                                        aria-expanded="false"
                                        aria-controls={`flush-collapse${item.indexun}`}
                                    >
                                        {item.icon}
                                        {item.title}
                                    </button>
                                </h2>
                                <div
                                    id={`flush-collapse${item.indexun}`}
                                    className="accordion-collapse collapse"
                                    data-bs-parent={`#flush-collapseGeneral3`}
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

export default SidebarUnit;
