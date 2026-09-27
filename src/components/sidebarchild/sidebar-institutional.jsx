import React from 'react';

const SidebarInstitutional = () => {
    const GeneralLinks2 = [
        {
            title: "Yönetimi Gözden Geçir",
            links: [
                { text: "YGG Toplantı Tutanağı", href: "/ygg/toplanti-tutanagi" },
                { text: "Prosedür", href: "/ygg/prosedur" },
            ],
            indexins: 44
        }, {
            title: "İç Denetim",
            links: [
                { text: "Yıllık İç Denetim Planı", href: "/ic-denetim/cizelge" },
                { text: "İç Denetim Raporu", href: "/ic-denetim/rapor" },
                { text: "Prosedür", href: "/ic-denetim/prosedur" },
            ],
            indexins: 45
        }, {
            title: "Bakım Faaliyet",
            links: [
                { text: "Yıllık Bakım Planı", href: "/bakim/plani" },
                { text: "Prosedür", href: "/bakim/prosedur" },
            ],
            indexins: 46
        }, {
            title: "Yasal ve Diğer Şartlar",
            links: [
                { text: "Yasal İzinler ve Diğer Şartlar", href: "/yasal/izinler-ve-diger-sartlar" },
                { text: "Uygunluk Değerlendirme Formu", href: "/yasal/uygunluk" },
                { text: "Prosedür", href: "/yasal/prosedur" },
            ],
            indexins: 47
        }, {
            title: "Sözleşme Prosedürü",
            links: [
                { text: "Gizlilik Taahhütnamesi", href: "/sozlesme/gizlilik" },
                { text: "Kişisel Veri Güvenliği Taahhütnamesi", href: "/sozlesme/kisisel-veriler" },
                { text: "Takip Çizelgesi", href: "/sozlesme/takip-cizelge" },
                { text: "Prosedür", href: "/sozlesme/prosedur" },
            ],
            indexins: 48
        }, {
            title: "Proje İzleme",
            links: [
                { text: "Toplantı Tutanağı", href: "/proje-izleme/toplanti-tutanagi" },
                { text: "İzleme Raporu", href: "/proje-izleme/izleme-raporu" },
                { text: "İzleme Raporu 2", href: "/proje-izleme/izleme-raporu-2" },
                { text: "Prosedür", href: "/proje-izleme/prosedur" },
            ],
            indexins: 49
        }, {
            title: "Satın Alma",
            links: [
                { text: "Satın Alma Talep Formu", href: "/satin-alma/talep-formu" },
                { text: "Onaylı Tedarikçi Listesi", href: "/satin-alma/onayli-tedarikciler" },
                { text: "Tedarikçi Değerlendirme Formu", href: "/satin-alma/tedarikci-degerlendirme" },
                { text: "Satın Alma Prosedürü", href: "/satin-alma/prosedur" },
            ],
            indexins: 50
        }, {
            title: "Kiralama",
            links: [
                { text: "Sözleşme 1", href: "/kiralama/sozlesme1" },
                { text: "Sözleşme 2", href: "/kiralama/sozlesme2" },
                { text: "Sözleşme 3", href: "/kiralama/sozlesme3" },
                { text: "Yerleşim Tutanağı", href: "/kiralama/yerlesim-tutanagi" },
                { text: "Prosedür", href: "/kiralama/prosedur" },
            ],
            indexins: 51
        }, {
            title: "Başvuru Değerlendirmesi",
            links: [
                { text: "Başvuru Değerlendirme Formu", href: "/basvuru/degerlendirme-formu" },
                { text: "Başvuru Değerlendirme Formu 2", href: "/basvuru/degerlendirme-formu2" },
                { text: "Başvuru Bilgileri", href: "/basvuru/basvuru-bilgileri" },
                { text: "Dikkat Edilmesi Gereken Hususlar", href: "/basvuru/dikkat-edilmesi-gerekenler" },
                { text: "İmza Formu", href: "/basvuru/imza" },
                { text: "Koşullar", href: "/basvuru/kosullar" },
                { text: "Toplantı Tutanak Formu", href: "/basvuru/toplanti-tutanak-formu" },
                { text: "Prosedür", href: "/basvuru/prosedur" },
            ],
            indexins: 52
        }
    ];

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
                    Kurumsal
                </button>
            </h2>
            <div id="flush-collapseGeneral2" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExampleParent">
                <div className="accordion-body">
                     {/* İÇ AKORDİYON KAPSAYICISI */}
                    <div className="accordion accordion-flush" id="nestedAccordionGen2">
                        {GeneralLinks2.map((item) => (
                            <div className="accordion-item" key={`gen2-item-${item.indexins}`}>
                                <h2 className="accordion-header">
                                    <button
                                        className="accordion-button collapsed"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target={`#nested-collapse-gen2-${item.indexins}`}
                                        aria-expanded="false"
                                        aria-controls={`nested-collapse-gen2-${item.indexins}`}
                                    >
                                        {item.title}
                                    </button>
                                </h2>
                                <div
                                    id={`nested-collapse-gen2-${item.indexins}`}
                                    className="accordion-collapse collapse"
                                    data-bs-parent="#nestedAccordionGen2"
                                >
                                    <div className="accordion-body">
                                        <div className="d-flex flex-column gap-2">
                                            {item.links.map((link, linkIndex) => (
                                                <a key={`gen2-link-${linkIndex}`} className="text-decoration-none" href={link.href}>
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
