import React from 'react';

const SidebarGeneral = () => {
    const GeneralLinks1 = [
        {
            title: "Dökümanlar",
            icon: (
                <svg style={{ marginRight: '5px' }} width="29" height="25" viewBox="0 0 29 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M26.5834 11.4583V17.7083C26.5834 21.875 25.3751 22.9167 20.5417 22.9167H8.45841C3.62508 22.9167 2.41675 21.875 2.41675 17.7083V7.29168C2.41675 3.12501 3.62508 2.08334 8.45841 2.08334H10.2709C12.0834 2.08334 12.4822 2.54168 13.1709 3.33334L14.9834 5.41668C15.4426 5.93751 15.7084 6.25001 16.9167 6.25001H20.5417C25.3751 6.25001 26.5834 7.29168 26.5834 11.4583Z" stroke="url(#paint0_linear_102_345)" strokeWidth="1.5" strokeMiterlimit="10"/>
                    <defs>
                        <linearGradient id="paint0_linear_102_345" x1="14.5001" y1="2.08334" x2="14.5001" y2="22.9167" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#17199F"/>
                            <stop offset="1" stopColor="#D232AF"/>
                        </linearGradient>
                    </defs>
                </svg>
            ),
            links: [
                { text: "Doküman Oluştur", href: "/dokuman/olustur" },
                { text: "Doküman Listesi", href: "/dokuman/listesi" },
                { text: "Döküman Arşiv Süresi", href: "/dokuman/arsiv-suresi" },
                { text: "Dış Kaynaklı Döküman Listesi", href: "/dokuman/dis-kaynakli" },
                { text: "Benimle Paylaşılan Dokümanlar", href: "/dokuman/dokumanlarim" },
                { text: "Onay Bekleyen Revizyonlar", href: "/onay-bekleyen-revizyonlar" },
                {text: "Prosedür", href: "/dokuman/prosedur"},

            ]
        },{
            title: "Düzeltici Faaliyet",
            icon: (
                <svg style={{marginRight: '5px'}} width="26" height="21" viewBox="0 0 26 21" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M3.25 9.625C3.25 10.36 3.9325 11.2087 4.76667 11.5062L12.1225 14.1487C12.6858 14.35 13.325 14.35 13.8775 14.1487L21.2333 11.5062C22.0675 11.2087 22.75 10.36 22.75 9.625M3.25 14C3.25 14.8137 3.84583 15.5487 4.76667 15.8812L12.1225 18.5237C12.6858 18.725 13.325 18.725 13.8775 18.5237L21.2333 15.8812C22.1542 15.5487 22.75 14.8137 22.75 14M14.0942 2.555L20.4858 4.8475C22.3275 5.50375 22.3275 6.58875 20.4858 7.245L14.0942 9.5375C13.3683 9.8 12.1767 9.8 11.4508 9.5375L5.05917 7.245C3.2175 6.58875 3.2175 5.50375 5.05917 4.8475L11.4508 2.555C12.1767 2.2925 13.3683 2.2925 14.0942 2.555Z"
                        stroke="url(#paint0_linear_102_307)" strokeWidth="1.5" strokeLinecap="round"
                        strokeLinejoin="round"/>
                    <defs>
                        <linearGradient id="paint0_linear_102_307" x1="13" y1="2.35812" x2="13"
                                        y2="18.6747" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#17199F"/>
                            <stop offset="1" stopColor="#D232AF"/>
                        </linearGradient>
                    </defs>
                </svg>
            ),
            links: [
                {text: "Düzeltici Faaliyet Formu", href: "/duzeltici-faaliyet/form"},
                {text: "Düzeltici Faaliyet Çizelgesi", href: "/duzeltici-faaliyet/cizelge"},
                {text: "Prosedür", href: "/duzeltici-faaliyet/prosedur"},

            ]
        },{
            title: "Risk Analizi",
            icon: (
                <svg style={{marginRight: '5px'}} width="28" height="21" viewBox="0 0 28 21" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M2.33325 1.75H25.6666M9.33325 19.25L13.9999 17.5M13.9999 17.5V14.875M13.9999 17.5L18.6666 19.25M8.74992 9.625L12.4249 7.32375C12.7166 7.14 13.1016 7.1925 13.2999 7.4375L14.6999 9.1875C14.8983 9.4325 15.2833 9.47625 15.5749 9.30125L19.2499 7M6.88324 14.875H21.1049C23.3216 14.875 24.4882 14 24.4882 12.3375V1.75H3.48824V12.3375C3.49991 14 4.66658 14.875 6.88324 14.875Z"
                        stroke="url(#paint0_linear_103_30)" strokeWidth="1.5" strokeMiterlimit="10"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                        <linearGradient id="paint0_linear_103_30" x1="13.9999" y1="1.75" x2="13.9999"
                                        y2="19.25" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#17199F"/>
                            <stop offset="1" stopColor="#D232AF"/>
                        </linearGradient>
                    </defs>
                </svg>
            ),
            links: [
                {text: "ISG Risk Değerlendirme Formu", href: "/risk/isg"},
                {text:"Süreç Risk Değerlendirme Formu",href: "/risk/surec"},
                {text: "Prosedür", href: "/risk/prosedur"},
            ]
        },{
            title: "Processlerin Analizi ve Hedefler",
            icon: (
                <svg style={{marginRight: '5px'}} width="26" height="21" viewBox="0 0 26 21" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M21.6666 12.8625C20.6591 16.9138 15.8491 19.8538 10.3782 19.1363C6.27238 18.6025 2.96822 15.9338 2.29655 12.6175C1.41905 8.21625 5.03738 4.33125 10.0316 3.50875M19.8465 10.5C22.6632 10.5 23.8332 9.625 22.7932 6.755C22.0891 4.82125 20.0307 3.15875 17.6366 2.59C14.0832 1.75 12.9999 2.695 12.9999 4.97V7.49C12.9999 9.625 14.0832 10.5 16.2499 10.5H19.8465Z"
                        stroke="url(#paint0_linear_103_66)" strokeWidth="1.5" strokeLinecap="round"
                        strokeLinejoin="round"/>
                    <defs>
                        <linearGradient id="paint0_linear_103_66" x1="12.6665" y1="2.28732" x2="12.6665"
                                        y2="19.2444" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#17199F"/>
                            <stop offset="1" stopColor="#D232AF"/>
                        </linearGradient>
                    </defs>
                </svg>
            ),
            links: [
                {text: "SWOT Analizi", href: "/process/swot"},
                {text: "PESTLE Analizi", href: "/process/pestle"},
                {text: "İlgili Taraf İhtiyaç ve Beklentileri Tablosu", href: "/process/ihtiyac-ve-beklentiler"},
                {text: "Hedef Performans Takip Tablosu", href: "/process/hedef-performans"},
                {text: "Prosedür", href: "/process/prosedur"},
            ]
        },{
            title: "Ramak Kala Kaza Olay Bildirimi",
            icon: (
                <svg style={{marginRight: '5px'}} width="24" height="24" viewBox="0 0 24 24" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M16.9699 14.44C18.3399 14.67 19.8499 14.43 20.9099 13.72C22.3199 12.78 22.3199 11.24 20.9099 10.3C19.8399 9.59001 18.3099 9.35 16.9399 9.59M6.99994 14.44C5.62994 14.67 4.11994 14.43 3.05994 13.72C1.64994 12.78 1.64994 11.24 3.05994 10.3C4.12994 9.59001 5.65994 9.35 7.02994 9.59M17.9999 7.16C17.9399 7.15 17.8699 7.15 17.8099 7.16C16.4299 7.11 15.3299 5.98 15.3299 4.58C15.3299 3.15 16.4799 2 17.9099 2C19.3399 2 20.4899 3.16 20.4899 4.58C20.4799 5.98 19.3799 7.11 17.9999 7.16ZM5.96994 7.16C6.02994 7.15 6.09994 7.15 6.15994 7.16C7.53994 7.11 8.63994 5.98 8.63994 4.58C8.63994 3.15 7.48994 2 6.05994 2C4.62994 2 3.47994 3.16 3.47994 4.58C3.48994 5.98 4.58994 7.11 5.96994 7.16ZM11.9999 14.63C11.9399 14.62 11.8699 14.62 11.8099 14.63C10.4299 14.58 9.32994 13.45 9.32994 12.05C9.32994 10.62 10.4799 9.47 11.9099 9.47C13.3399 9.47 14.4899 10.63 14.4899 12.05C14.4799 13.45 13.3799 14.59 11.9999 14.63ZM9.08994 17.78C7.67994 18.72 7.67994 20.26 9.08994 21.2C10.6899 22.27 13.3099 22.27 14.9099 21.2C16.3199 20.26 16.3199 18.72 14.9099 17.78C13.3199 16.72 10.6899 16.72 9.08994 17.78Z"
                        stroke="url(#paint0_linear_284_826)" strokeWidth="1.5" strokeLinecap="round"
                        strokeLinejoin="round"/>
                    <defs>
                        <linearGradient id="paint0_linear_284_826" x1="11.9849" y1="2" x2="11.9849"
                                        y2="22.0025" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#17199F"/>
                            <stop offset="1" stopColor="#D232AF"/>
                        </linearGradient>
                    </defs>
                </svg>
            ),
            links: [
                {text: "Ramak Kala Takip Listesi", href: "/ramak-kala/takip-listesi"},
                {text: "Ramak Kala Olay Bildirim Formu", href: "/ramak-kala/olay-bildirim-formu"},
                {text: "Kaza Olay Takip listesi", href: "/ramak-kala/kaza-olay-takip"},
                {text: "Kaza Olay Takip Bildirim Formu", href: "/ramak-kala/kaza-olay-takip-formu"},
                {text: "Prosedür", href: "/ramak-kala/prosedur"},


            ]
        },{
            title: "Çevre ve Atık Yönetimi",
            icon: (
                <svg style={{marginRight: '5px'}} width="24" height="24" viewBox="0 0 24 24" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M12.0001 7.89005L10.9301 9.75005C10.6901 10.1601 10.8901 10.5001 11.3601 10.5001H12.6301C13.1101 10.5001 13.3001 10.8401 13.0601 11.2501L12.0001 13.1101M8.50011 22.0001C10.7901 21.3501 13.2101 21.3501 15.5001 22.0001M8.30011 18.0401V16.8801C6.00011 15.4901 4.11011 12.7801 4.11011 9.90005C4.11011 4.95005 8.66011 1.07005 13.8001 2.19005C16.0601 2.69005 18.0401 4.19005 19.0701 6.26005C21.1601 10.4601 18.9601 14.9201 15.7301 16.8701V18.0301C15.7301 18.3201 15.8401 18.9901 14.7701 18.9901H9.26011C8.16011 19.0001 8.30011 18.5701 8.30011 18.0401Z"
                        stroke="url(#paint0_linear_284_837)" strokeWidth="1.5" strokeLinecap="round"
                        strokeLinejoin="round"/>
                    <defs>
                        <linearGradient id="paint0_linear_284_837" x1="11.9995" y1="1.99597"
                                        x2="11.9995" y2="22.0001" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#17199F"/>
                            <stop offset="1" stopColor="#D232AF"/>
                        </linearGradient>
                    </defs>
                </svg>
            ),
            links: [
                {text: "Yönerge 1", href: "/cevre/yonerge1"},
                {text: "Yönerge 2", href: "/cevre/yonerge2"},
                {text: "Atık Takip Formu", href: "/cevre/atik-takip"},
                {text: "Prosedür", href: "/cevre/prosedur"},
            ]
        },{
            title: "Acil Durumlar",
            icon: (
                <svg style={{marginRight: '5px'}} width="24" height="24" viewBox="0 0 24 24" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M2 22H22M12 2V3M4 4L5 5M20 4L19 5M12 6C7.03 6 3 10.03 3 15V22H21V15C21 10.03 16.97 6 12 6Z"
                        stroke="url(#paint0_linear_284_849)" strokeWidth="1.5" strokeLinecap="round"
                        strokeLinejoin="round"/>
                    <defs>
                        <linearGradient id="paint0_linear_284_849" x1="12" y1="2" x2="12" y2="22"
                                        gradientUnits="userSpaceOnUse">
                            <stop stopColor="#17199F"/>
                            <stop offset="1" stopColor="#D232AF"/>
                        </linearGradient>
                    </defs>
                </svg>
            ),
            links: [
                {text: "Acil Durum Eylem Planı", href: "/acil-durum/eylem"},
                {text: "Acil Durum Tatbikatı Değerlendirme Formu", href: "/acil-durum/tatbikat"},
                {text: "Acil Durum Tatbikatı Değerlendirme Formu Çevre", href: "/acil-durum/tatbikat-cevre"},
                {text: "Prosedür", href: "/acil-durum/prosedur"},
            ]
        },
        {
            title: "İş Sağlığı ve Güvenliği Yönetim",
            icon: (
                <svg style={{marginRight: '5px'}} width="24" height="24" viewBox="0 0 33 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M14.4237 2.69451L7.56247 4.95409C5.98122 5.47367 4.68872 7.11699 4.68872 8.60324V17.5811C4.68872 19.007 5.76124 20.8799 7.06749 21.7378L12.98 25.6166C14.9187 26.8974 18.1087 26.8974 20.0474 25.6166L25.96 21.7378C27.2662 20.8799 28.3387 19.007 28.3387 17.5811V8.60324C28.3387 7.11699 27.0462 5.47367 25.465 4.95409L18.6037 2.69451C17.435 2.31993 15.565 2.31993 14.4237 2.69451Z"
                        stroke="url(#paint0_linear_504_1177)" strokeWidth="1.5" strokeLinecap="round"
                        strokeLinejoin="round"/>
                    <path
                        d="M16.5 13.1949C16.445 13.1949 16.3762 13.1949 16.3212 13.1949C15.0287 13.1587 13.9975 12.2162 13.9975 11.0683C13.9975 9.89619 15.0837 8.94159 16.4175 8.94159C17.7512 8.94159 18.8375 9.89619 18.8375 11.0683C18.8237 12.2283 17.7925 13.1587 16.5 13.1949Z"
                        stroke="url(#paint1_linear_504_1177)" strokeWidth="1.5" strokeLinecap="round"
                        strokeLinejoin="round"/>
                    <path
                        d="M13.7637 16.5783C12.4437 17.3516 12.4437 18.6204 13.7637 19.3937C15.2625 20.2758 17.7237 20.2758 19.2225 19.3937C20.5425 18.6204 20.5425 17.3516 19.2225 16.5783C17.7375 15.6962 15.2762 15.6962 13.7637 16.5783Z"
                        stroke="url(#paint2_linear_504_1177)" strokeWidth="1.5" strokeLinecap="round"
                        strokeLinejoin="round"/>
                    <defs>
                        <linearGradient id="paint0_linear_504_1177" x1="16.5137" y1="2.41357" x2="16.5137" y2="26.5772"
                                        gradientUnits="userSpaceOnUse">
                            <stop stopColor="#17199F"/>
                            <stop offset="1" stopColor="#D232AF"/>
                        </linearGradient>
                        <linearGradient id="paint1_linear_504_1177" x1="16.5137" y1="2.41357" x2="16.5137" y2="26.5772"
                                        gradientUnits="userSpaceOnUse">
                            <stop stopColor="#17199F"/>
                            <stop offset="1" stopColor="#D232AF"/>
                        </linearGradient>
                        <linearGradient id="paint2_linear_504_1177" x1="16.5137" y1="2.41357" x2="16.5137" y2="26.5772"
                                        gradientUnits="userSpaceOnUse">
                            <stop stopColor="#17199F"/>
                            <stop offset="1" stopColor="#D232AF"/>
                        </linearGradient>
                    </defs>
                </svg>

            ),
            links: [
                {text: "İş Sağlığı ve Güvenliği Yönetim", href: "/is-sagligi-ve-guvenligi/zimmet"},
                {text: "Prosedür", href: "/is-sagligi-ve-guvenligi/prosedur"},
            ]
        },
    ];

    return (
        <div className="accordion-item">
            <h2 className="accordion-header">
                <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseGeneral1"
                    aria-expanded="false"
                    aria-controls="flush-collapseGeneral1"
                >
                    <svg style={{marginRight: '5px'}} width="32" height="32" viewBox="0 0 38 40" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M32.3636 12.9166H5.63709M22.9587 19.1666C19.6738 19.1666 15.042 19.1666 15.042 19.1666M32.4587 13.7527V30.625C32.4587 32.581 30.9523 34.1666 29.0941 34.1666H8.90658C7.04837 34.1666 5.54199 32.581 5.54199 30.625V13.7527C5.54199 13.2029 5.66361 12.6606 5.8972 12.1688L8.20911 7.30165C8.63656 6.40176 9.51034 5.83331 10.4661 5.83331H27.5345C28.4903 5.83331 29.3641 6.40176 29.7915 7.30165L32.1034 12.1688C32.337 12.6606 32.4587 13.2029 32.4587 13.7527Z"
                            stroke="url(#paint0_linear_353_1568)" strokeWidth="2" strokeLinecap="round"
                            strokeLinejoin="round"/>
                        <defs>
                            <linearGradient id="paint0_linear_353_1568" x1="19.0003" y1="5.83331" x2="19.0003"
                                            y2="34.1666" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#17199F"/>
                                <stop offset="1" stopColor="#D232AF"/>
                            </linearGradient>
                        </defs>
                    </svg>

                    Genel
                </button>
            </h2>
            <div id="flush-collapseGeneral1" className="accordion-collapse collapse"
                 data-bs-parent="#accordionFlushExampleParent">
                <div className="accordion-body">
                    <div className="accordion-body-child">
                        {GeneralLinks1.map((item, index) => (
                            <div className="accordion-item" key={index}>
                                <h2 className="accordion-header">
                                    <button
                                        className="accordion-button collapsed"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target={`#flush-collapse${index}`}
                                        aria-expanded="false"
                                        aria-controls={`flush-collapse${index}`}
                                    >
                                        {item.icon}
                                        {item.title}
                                    </button>
                                </h2>
                                <div
                                    id={`flush-collapse${index}`}
                                    className="accordion-collapse collapse"
                                    data-bs-parent={`#flush-collapseGeneral1`}
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

export default SidebarGeneral;
