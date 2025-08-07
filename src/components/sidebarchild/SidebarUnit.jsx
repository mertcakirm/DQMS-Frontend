const SidebarUnit = () => {
    const GeneralLinks3 = [
        {
            title: "Birimler",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" style={{marginRight: '5px'}} width="24" height="24"
                     viewBox="0 0 24 24" fill="url(#paint0_linear_106_44)">
                    <path
                        d="M22 8v12h-16v-12h16zm2-2h-20v16h20v-16zm-8 11.677v.323h-8v-.333c-.004-.89.035-1.398 1.059-1.634 1.123-.259 2.23-.491 1.697-1.473-1.577-2.911-.449-4.56 1.244-4.56 1.662 0 2.816 1.588 1.244 4.56-.518.976.551 1.208 1.697 1.473 1.028.237 1.063.748 1.059 1.644zm4-7.677h-3v2h3v-2zm0 3h-3v2h3v-2zm0 3h-3v2h3v-2zm2-12h-20v16h1v-15h19v-1zm-2-2h-20v16h1v-15h19v-1z"/>
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
                {text: "Birimleri Yönet", href: "#"},
                {text: "Birim İstatistikleri", href: "#"},
            ],
            indexun: 301
        },
        {
            title: "Kullanıcılar",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" style={{marginRight: '5px'}} width="24" height="24"
                     viewBox="0 0 24 24" fill="url(#paint0_linear_106_44)">
                    <path
                        d="M20.822 18.096c-3.439-.794-6.641-1.49-5.09-4.418 4.719-8.912 1.251-13.678-3.732-13.678-5.081 0-8.464 4.949-3.732 13.678 1.597 2.945-1.725 3.641-5.09 4.418-2.979.688-3.178 2.143-3.178 4.663l.005 1.241h10.483l.704-3h1.615l.704 3h10.483l.005-1.241c.001-2.52-.198-3.975-3.177-4.663zm-8.231 1.904h-1.164l-.91-2h2.994l-.92 2z"/>
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
                {text: "Kullanıcı Yönetimi", href: "#"},
                {text: "Kullanıcı İstatistikleri", href: "#"},
            ],
            indexun: 323
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
                    <svg style={{marginRight: '5px'}} width="32" height="32" viewBox="0 0 45 42" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
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

                    Birimler ve Kullanıcılar
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
