import React from 'react';

const SidebarInstitutional = () => {
    const GeneralLinks2 = [
        {
            title: "Yönetimi Gözden Geçir",
            icon: (
                <svg style={{marginRight: '5px'}} width="28" height="26" viewBox="0 0 28 26" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M15.4583 15.1667H20.4167M10.5 19.5H20.4167M24.5 7.58333V18.4167C24.5 21.6667 22.75 23.8333 18.6667 23.8333H9.33333C5.25 23.8333 3.5 21.6667 3.5 18.4167V7.58333C3.5 4.33333 5.25 2.16666 9.33333 2.16666H18.6667C22.75 2.16666 24.5 4.33333 24.5 7.58333ZM18.0833 2.16666V10.6816C18.0833 11.1583 17.4766 11.3966 17.1033 11.0825L14.3967 8.76419C14.175 8.56919 13.825 8.56919 13.6033 8.76419L10.8967 11.0825C10.5234 11.3966 9.91667 11.1583 9.91667 10.6816V2.16666H18.0833Z"
                        stroke="url(#paint0_linear_102_370)" strokeWidth="1.5" strokeMiterlimit="10"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                        <linearGradient id="paint0_linear_102_370" x1="14" y1="2.16666" x2="14"
                                        y2="23.8333" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#17199F"/>
                            <stop offset="1" stopColor="#D232AF"/>
                        </linearGradient>
                    </defs>
                </svg>
            ),
            links: [
                {text: "YGG Toplantı Tutanağı", href: "/ygg/toplanti-tutanagi"},
                {text: "Prosedür", href: "/ygg/prosedur"},
            ],
            indexins: 44

        }, {
            title: "İç Denetim",
            icon: (
                <svg style={{ marginRight: '5px' }} width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.4126 9.66667H9.66675V8.33751C9.66675 4.10834 11.3584 2.41667 15.5876 2.41667H20.6626C24.8917 2.41667 26.5834 4.10834 26.5834 8.33751V13.4125C26.5834 17.6417 24.8917 19.3333 20.6626 19.3333H19.3334V15.5875M13.4126 9.66667C17.6417 9.66667 19.3334 11.3583 19.3334 15.5875M13.4126 9.66667H8.33758C4.10841 9.66667 2.41675 11.3583 2.41675 15.5875V20.6625C2.41675 24.8917 4.10841 26.5833 8.33758 26.5833H13.4126C17.6417 26.5833 19.3334 24.8917 19.3334 20.6625V15.5875M7.34684 18.125L9.70309 20.4812L14.4035 15.7687" stroke="url(#paint0_linear_102_319)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                        <linearGradient id="paint0_linear_102_319" x1="14.5001" y1="2.41667" x2="14.5001" y2="26.5833" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#17199F"/>
                            <stop offset="1" stopColor="#D232AF"/>
                        </linearGradient>
                    </defs>
                </svg>
            ),
            links: [
                { text: "Yıllık İç Denetim Planı", href: "/ic-denetim/cizelge" },
                { text: "İç Denetim Raporu", href: "/ic-denetim/rapor" },
                {text: "Prosedür", href: "/ic-denetim/prosedur"},

            ],
            indexins: 45
        },{
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
            indexins: 46
        }, {
            title: "Yasal ve Diğer Şartlar",
            icon: (
                <svg style={{marginRight: '5px'}} width="24" height="24" viewBox="0 0 24 24" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M12 5.49001V20.49M7.75 8.49001H5.5M8.5 11.49H5.5M22 16.74V4.67001C22 3.47001 21.02 2.58001 19.83 2.68001H19.77C17.67 2.86001 14.48 3.93001 12.7 5.05001L12.53 5.16001C12.24 5.34001 11.76 5.34001 11.47 5.16001L11.22 5.01001C9.44 3.90001 6.26 2.84001 4.16 2.67001C2.97 2.57001 2 3.47001 2 4.66001V16.74C2 17.7 2.78 18.6 3.74 18.72L4.03 18.76C6.2 19.05 9.55 20.15 11.47 21.2L11.51 21.22C11.78 21.37 12.21 21.37 12.47 21.22C14.39 20.16 17.75 19.05 19.93 18.76L20.26 18.72C21.22 18.6 22 17.7 22 16.74Z"
                        stroke="url(#paint0_linear_284_822)" strokeWidth="1.5" strokeLinecap="round"
                        strokeLinejoin="round"/>
                    <defs>
                        <linearGradient id="paint0_linear_284_822" x1="12" y1="2.66241" x2="12"
                                        y2="21.3325" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#17199F"/>
                            <stop offset="1" stopColor="#D232AF"/>
                        </linearGradient>
                    </defs>
                </svg>
            ),
            links: [
                {text: "Yasal İzinler ve Diğer Şartlar", href: "/yasal/izinler-ve-diger-sartlar"},
                {text: "Uygunluk Değerlendirme Formu", href: "/yasal/uygunluk"},
                {text: "Prosedür", href: "/yasal/prosedur"},

            ],
            indexins: 47
        }, {
            title: "Sözleşme Prosedürü",
            icon: (
                <svg style={{marginRight: '5px'}} width="24" height="24" viewBox="0 0 33 31" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M17.2975 10.0881L19.7313 6.47141C20.845 4.80516 23.1137 4.72763 24.7637 6.27763L29.1363 10.3851C30.7038 11.8447 30.6075 14.131 28.9438 15.1256L25.0938 17.4118L17.2975 10.0881ZM17.2975 10.0881L14.8913 9.94601M25.0938 17.3989L25.4238 22.7205C25.74 25.6914 24.64 26.7247 21.6425 27.0605L9.65251 28.391C7.12251 28.6622 5.3075 26.9573 5.61 24.5935L6.9575 13.8985M6.9575 13.8985C7.57625 14.1052 8.23625 14.2085 8.9375 14.2085C10.505 14.2085 11.9213 13.666 13.0075 12.7618C13.4888 12.3743 13.9013 11.9093 14.2313 11.3927C14.52 10.9406 14.74 10.4627 14.8913 9.94601M6.9575 13.8985C5.555 13.4593 4.38624 12.5552 3.64374 11.3927C3.07999 10.5143 2.75 9.481 2.75 8.396C2.75 6.56183 3.64375 4.9214 5.07375 3.86223C6.1325 3.0614 7.48 2.5835 8.9375 2.5835C12.3613 2.5835 15.125 5.17975 15.125 8.396C15.125 8.92558 15.0425 9.45518 14.8913 9.94601M7.26 26.841L11.6325 22.7205M8.96501 10.566V6.22601M11.22 8.396H6.6"
                        stroke="url(#paint0_linear_504_1199)" strokeWidth="1.5" strokeMiterlimit="10"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                        <linearGradient id="paint0_linear_504_1199" x1="16.5021" y1="2.5835" x2="16.5021" y2="28.4193"
                                        gradientUnits="userSpaceOnUse">
                            <stop stopColor="#17199F"/>
                            <stop offset="1" stopColor="#D232AF"/>
                        </linearGradient>
                    </defs>
                </svg>
            ),
            links: [
                {text: "Gizlilik Taahhütnamesi", href: "/sozlesme/gizlilik"},
                {text: "Kişisel Veri Güvenliği Taahhütnamesi", href: "/sozlesme/kisisel-veriler"},
                {text: "Takip Çizelgesi", href: "/sozlesme/takip-cizelge"},
                {text: "Prosedür", href: "/sozlesme/prosedur"},

            ],
            indexins: 48
        }, {
            title: "Proje İzleme",
            icon: (
                <svg style={{marginRight: '5px'}} width="24" height="24" viewBox="0 0 38 36" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M14.1392 3L14.1867 5.29504C14.2183 6.51004 15.2792 7.5 16.5617 7.5H21.3433C22.6575 7.5 23.7183 6.48 23.7183 5.25V3M26.9167 25.5L23.75 28.5L26.9167 31.5M31.6667 25.5L34.8333 28.5L31.6667 31.5M20.5833 33H12.6667C7.125 33 4.75 30 4.75 25.5V10.5C4.75 6 7.125 3 12.6667 3H25.3333C30.875 3 33.25 6 33.25 10.5V21"
                        stroke="url(#paint0_linear_504_1246)" strokeWidth="1.5" strokeMiterlimit="10"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                        <linearGradient id="paint0_linear_504_1246" x1="19.7917" y1="3" x2="19.7917" y2="33"
                                        gradientUnits="userSpaceOnUse">
                            <stop stopColor="#17199F"/>
                            <stop offset="1" stopColor="#D232AF"/>
                        </linearGradient>
                    </defs>
                </svg>

            ),
            links: [
                {text: "Toplantı Tutanağı", href: "/proje-izleme/toplanti-tutanagi"},
                {text: "İzleme Raporu", href: "/proje-izleme/izleme-raporu"},
                {text: "İzleme Raporu 2", href: "/proje-izleme/izleme-raporu-2"},
                {text: "Prosedür", href: "/proje-izleme/prosedur"},

            ],
            indexins: 49
        }, {
            title: "Satın Alma",
            icon: (
                <svg style={{marginRight: '5px'}} width="24" height="24" viewBox="0 0 33 32" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M10.3124 10.2267V8.93334C10.3124 5.93334 12.8011 2.98668 15.8949 2.70668C19.5799 2.36001 22.6874 5.17334 22.6874 8.68001V10.52M21.3062 16H21.3185M11.6798 16H11.6922M12.3749 29.3333H20.6249C26.1524 29.3333 27.1424 27.1867 27.4311 24.5733L28.4624 16.5733C28.8336 13.32 27.8711 10.6667 21.9999 10.6667H10.9999C5.12863 10.6667 4.16613 13.32 4.53738 16.5733L5.56863 24.5733C5.85738 27.1867 6.84738 29.3333 12.3749 29.3333Z"
                        stroke="url(#paint0_linear_504_1220)" strokeWidth="1.5" strokeLinecap="round"
                        strokeLinejoin="round"/>
                    <defs>
                        <linearGradient id="paint0_linear_504_1220" x1="16.4999" y1="2.67773" x2="16.4999" y2="29.3333"
                                        gradientUnits="userSpaceOnUse">
                            <stop stopColor="#17199F"/>
                            <stop offset="1" stopColor="#D232AF"/>
                        </linearGradient>
                    </defs>
                </svg>

            ),
            links: [
                {text: "Satın Alma Talep Formu", href: "/satin-alma/talep-formu"},
                {text: "Onaylı Tedarikçi Listesi", href: "/satin-alma/onayli-tedarikciler"},
                {text: "Tedarikçi Değerlendirme Formu", href: "/satin-alma/tedarikci-degerlendirme"},
                {text: "Satın Alma Prosedürü", href: "/satin-alma/prosedur"},
            ],
            indexins: 50
        }, {
            title: "Kiralama",
            icon: (
                <svg style={{marginRight: '5px'}} width="24" height="24" viewBox="0 0 36 33" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M4.51507 15.4275V21.6013C4.51507 27.775 7.21507 30.25 13.9501 30.25H22.0351C28.7701 30.25 31.4701 27.775 31.4701 21.6013V15.4275M18.0001 16.5C20.7451 16.5 22.7701 14.4513 22.5001 11.935L21.5101 2.75H14.5051L13.5001 11.935C13.2301 14.4513 15.2551 16.5 18.0001 16.5ZM27.4651 16.5C30.4951 16.5 32.7151 14.245 32.4151 11.4813L31.9951 7.7C31.4551 4.125 29.9551 2.75 26.0251 2.75H21.4501L22.5001 12.3888C22.7551 14.6575 24.9901 16.5 27.4651 16.5ZM8.46007 16.5C10.9351 16.5 13.1701 14.6575 13.4101 12.3888L14.4601 2.75H9.88507C5.95507 2.75 4.45507 4.125 3.91507 7.7L3.51007 11.4813C3.21007 14.245 5.43007 16.5 8.46007 16.5ZM18.0001 23.375C15.4951 23.375 14.2501 24.5163 14.2501 26.8125V30.25H21.7501V26.8125C21.7501 24.5163 20.5051 23.375 18.0001 23.375Z"
                        stroke="url(#paint0_linear_504_1266)" strokeWidth="1.5" strokeLinecap="round"
                        strokeLinejoin="round"/>
                    <defs>
                        <linearGradient id="paint0_linear_504_1266" x1="17.9626" y1="2.75" x2="17.9626" y2="30.25"
                                        gradientUnits="userSpaceOnUse">
                            <stop stopColor="#17199F"/>
                            <stop offset="1" stopColor="#D232AF"/>
                        </linearGradient>
                    </defs>
                </svg>

            ),
            links: [
                {text: "Sözleşme 1", href: "/kiralama/sozlesme1"},
                {text: "Sözleşme 2", href: "/kiralama/sozlesme2"},
                {text: "Sözleşme 3", href: "/kiralama/sozlesme3"},
                {text: "Yerleşim Tutanağı", href: "/kiralama/yerlesim-tutanagi"},
                {text: "Prosedür", href: "/kiralama/prosedur"},
            ],
            indexins: 51
        }, {
            title: "Başvuru Değerlendirmesi",
            icon: (
                <svg style={{marginRight: '5px'}} width="24" height="24" viewBox="0 0 32 31" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M1.39917 30.0832C1.39917 24.4394 7.49505 19.8748 15 19.8748M30.8334 30.0832L29.25 28.6248M22.9167 8.20817C22.9167 12.2352 19.3723 15.4998 15 15.4998C10.6278 15.4998 7.08338 12.2352 7.08338 8.20817C7.08338 4.18109 10.6278 0.916504 15 0.916504C19.3723 0.916504 22.9167 4.18109 22.9167 8.20817ZM29.8834 24.5415C29.8834 27.1188 27.615 29.2082 24.8167 29.2082C22.0185 29.2082 19.75 27.1188 19.75 24.5415C19.75 21.9642 22.0185 19.8748 24.8167 19.8748C27.615 19.8748 29.8834 21.9642 29.8834 24.5415Z"
                        stroke="url(#paint0_linear_794_623)" strokeWidth="1.5" strokeLinecap="round"
                        strokeLinejoin="round"/>
                    <defs>
                        <linearGradient id="paint0_linear_794_623" x1="16.1163" y1="0.916504" x2="16.1163" y2="30.0832"
                                        gradientUnits="userSpaceOnUse">
                            <stop stopColor="#17199F"/>
                            <stop offset="1" stopColor="#D232AF"/>
                        </linearGradient>
                    </defs>
                </svg>
            ),
            links: [
                {text: "Başvuru Değerlendirme Formu", href: "/basvuru/degerlendirme-formu"},
                {text: "Başvuru Değerlendirme Formu 2", href: "/basvuru/degerlendirme-formu2"},
                {text: "Başvuru Bilgileri", href: "/basvuru/basvuru-bilgileri"},
                {text: "Dikkat Edilmesi Gereken Hususlar", href: "/basvuru/dikkat-edilmesi-gerekenler"},
                {text: "İmza Formu", href: "/basvuru/imza"},
                {text: "Koşullar", href: "/basvuru/kosullar"},
                {text: "Toplantı Tutanak Formu", href: "/basvuru/toplanti-tutanak-formu"},
                {text: "Prosedür", href: "/basvuru/prosedur"},
            ],
            indexins: 52
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
                    <svg style={{marginRight: '5px'}} width="32" height="32" viewBox="0 0 44 43" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
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
