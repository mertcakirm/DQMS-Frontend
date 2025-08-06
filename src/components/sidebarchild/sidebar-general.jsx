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
        {
            title: "Sözleşme Prosedürü",
            icon: (
                <svg style={{marginRight: '5px'}} width="24" height="24" viewBox="0 0 33 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.2975 10.0881L19.7313 6.47141C20.845 4.80516 23.1137 4.72763 24.7637 6.27763L29.1363 10.3851C30.7038 11.8447 30.6075 14.131 28.9438 15.1256L25.0938 17.4118L17.2975 10.0881ZM17.2975 10.0881L14.8913 9.94601M25.0938 17.3989L25.4238 22.7205C25.74 25.6914 24.64 26.7247 21.6425 27.0605L9.65251 28.391C7.12251 28.6622 5.3075 26.9573 5.61 24.5935L6.9575 13.8985M6.9575 13.8985C7.57625 14.1052 8.23625 14.2085 8.9375 14.2085C10.505 14.2085 11.9213 13.666 13.0075 12.7618C13.4888 12.3743 13.9013 11.9093 14.2313 11.3927C14.52 10.9406 14.74 10.4627 14.8913 9.94601M6.9575 13.8985C5.555 13.4593 4.38624 12.5552 3.64374 11.3927C3.07999 10.5143 2.75 9.481 2.75 8.396C2.75 6.56183 3.64375 4.9214 5.07375 3.86223C6.1325 3.0614 7.48 2.5835 8.9375 2.5835C12.3613 2.5835 15.125 5.17975 15.125 8.396C15.125 8.92558 15.0425 9.45518 14.8913 9.94601M7.26 26.841L11.6325 22.7205M8.96501 10.566V6.22601M11.22 8.396H6.6" stroke="url(#paint0_linear_504_1199)" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                        <linearGradient id="paint0_linear_504_1199" x1="16.5021" y1="2.5835" x2="16.5021" y2="28.4193" gradientUnits="userSpaceOnUse">
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

            ]
        },
        {
            title: "Satın Alma",
            icon: (
                <svg style={{marginRight: '5px'}} width="24" height="24" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            ]
        },

        {
            title: "Proje İzleme",
            icon: (
                <svg style={{marginRight: '5px'}} width="24" height="24" viewBox="0 0 38 36" fill="none" xmlns="http://www.w3.org/2000/svg">
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

            ]
        },
        {
            title: "Kiralama",
            icon: (
                <svg style={{marginRight: '5px'}} width="24" height="24" viewBox="0 0 36 33" fill="none" xmlns="http://www.w3.org/2000/svg">
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

            ]
        }, {
            title: "Başvuru Değerlendirmesi",
            icon: (
                <svg style={{marginRight: '5px'}} width="24" height="24" viewBox="0 0 32 31" fill="none" xmlns="http://www.w3.org/2000/svg">
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
