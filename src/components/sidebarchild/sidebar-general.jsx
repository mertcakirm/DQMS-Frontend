import React from 'react';

const SidebarGeneral = () => {
    const GeneralLinks1 = [
        {
            title: "Dökümanlar",
            links: [
                { text: "Doküman Oluştur", href: "/dokuman/olustur" },
                { text: "Doküman Listesi", href: "/dokuman/listesi" },
                { text: "Döküman Arşiv Süresi", href: "/dokuman/arsiv-suresi" },
                { text: "Dış Kaynaklı Döküman Listesi", href: "/dokuman/dis-kaynakli" },
                { text: "Benimle Paylaşılan Dokümanlar", href: "/dokuman/dokumanlarim" },
                { text: "Onay Bekleyen Revizyonlar", href: "/onay-bekleyen-revizyonlar" },
                { text: "Prosedür", href: "/dokuman/prosedur" },
            ]
        }, {
            title: "Düzeltici Faaliyet",
            links: [
                { text: "Düzeltici Faaliyet Formu", href: "/duzeltici-faaliyet/form" },
                { text: "Düzeltici Faaliyet Çizelgesi", href: "/duzeltici-faaliyet/cizelge" },
                { text: "Prosedür", href: "/duzeltici-faaliyet/prosedur" },
            ]
        }, {
            title: "Risk Analizi",
            links: [
                { text: "ISG Risk Değerlendirme Formu", href: "/risk/isg" },
                { text: "Süreç Risk Değerlendirme Formu", href: "/risk/surec" },
                { text: "Prosedür", href: "/risk/prosedur" },
            ]
        }, {
            title: "Processlerin Analizi ve Hedefler",
            links: [
                { text: "SWOT Analizi", href: "/process/swot" },
                { text: "PESTLE Analizi", href: "/process/pestle" },
                { text: "İlgili Taraf İhtiyaç ve Beklentileri Tablosu", href: "/process/ihtiyac-ve-beklentiler" },
                { text: "Hedef Performans Takip Tablosu", href: "/process/hedef-performans" },
                { text: "Prosedür", href: "/process/prosedur" },
            ]
        }, {
            title: "Ramak Kala Kaza Olay Bildirimi",
            links: [
                { text: "Ramak Kala Takip Listesi", href: "/ramak-kala/takip-listesi" },
                { text: "Ramak Kala Olay Bildirim Formu", href: "/ramak-kala/olay-bildirim-formu" },
                { text: "Kaza Olay Takip listesi", href: "/ramak-kala/kaza-olay-takip" },
                { text: "Kaza Olay Takip Bildirim Formu", href: "/ramak-kala/kaza-olay-takip-formu" },
                { text: "Prosedür", href: "/ramak-kala/prosedur" },
            ]
        }, {
            title: "Çevre ve Atık Yönetimi",
            links: [
                { text: "Yönerge 1", href: "/cevre/yonerge1" },
                { text: "Yönerge 2", href: "/cevre/yonerge2" },
                { text: "Atık Takip Formu", href: "/cevre/atik-takip" },
                { text: "Prosedür", href: "/cevre/prosedur" },
            ]
        }, {
            title: "Acil Durumlar",
            links: [
                { text: "Acil Durum Eylem Planı", href: "/acil-durum/eylem" },
                { text: "Acil Durum Tatbikatı Değerlendirme Formu", href: "/acil-durum/tatbikat" },
                { text: "Acil Durum Tatbikatı Değerlendirme Formu Çevre", href: "/acil-durum/tatbikat-cevre" },
                { text: "Prosedür", href: "/acil-durum/prosedur" },
            ]
        }, {
            title: "İş Sağlığı ve Güvenliği Yönetim",
            links: [
                { text: "İş Sağlığı ve Güvenliği Yönetim", href: "/is-sagligi-ve-guvenligi/zimmet" },
                { text: "Prosedür", href: "/is-sagligi-ve-guvenligi/prosedur" },
            ]
        }
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
                    Genel
                </button>
            </h2>
            <div id="flush-collapseGeneral1" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExampleParent">
                <div className="accordion-body">
                    {/* İÇ AKORDİYON KAPSAYICISI */}
                    <div className="accordion accordion-flush" id="nestedAccordionGen1">
                        {GeneralLinks1.map((item, index) => (
                            <div className="accordion-item" key={`gen1-item-${index}`}>
                                <h2 className="accordion-header">
                                    <button
                                        className="accordion-button collapsed"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target={`#nested-collapse-gen1-${index}`}
                                        aria-expanded="false"
                                        aria-controls={`nested-collapse-gen1-${index}`}
                                    >
                                        {item.title}
                                    </button>
                                </h2>
                                <div
                                    id={`nested-collapse-gen1-${index}`}
                                    className="accordion-collapse collapse"
                                    data-bs-parent="#nestedAccordionGen1" 
                                >
                                    <div className="accordion-body">
                                        <div className="d-flex flex-column gap-2">
                                            {item.links.map((link, linkIndex) => (
                                                <a key={`gen1-link-${linkIndex}`} className="text-decoration-none" href={link.href}>
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
