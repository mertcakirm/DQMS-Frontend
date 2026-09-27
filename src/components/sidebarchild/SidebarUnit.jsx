import React from 'react';

const SidebarUnit = () => {
    const GeneralLinks3 = [
        {
            title: "Birimler",
            links: [
                { text: "Birimleri Yönet", href: "/birim/yonet" },
            ],
            indexun: 301
        },
        {
            title: "Kullanıcılar",
            links: [
                { text: "Kullanıcı Yönetimi", href: "/kullanici/yonet" },
            ],
            indexun: 323
        }
    ];

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
                    Birimler ve Kullanıcılar
                </button>
            </h2>
            <div id="flush-collapseGeneral3" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExampleParent">
                <div className="accordion-body">
                     {/* İÇ AKORDİYON KAPSAYICISI */}
                    <div className="accordion accordion-flush" id="nestedAccordionGen3">
                        {GeneralLinks3.map((item) => (
                            <div className="accordion-item" key={`gen3-item-${item.indexun}`}>
                                <h2 className="accordion-header">
                                    <button
                                        className="accordion-button collapsed"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target={`#nested-collapse-gen3-${item.indexun}`}
                                        aria-expanded="false"
                                        aria-controls={`nested-collapse-gen3-${item.indexun}`}
                                    >
                                        {item.title}
                                    </button>
                                </h2>
                                <div
                                    id={`nested-collapse-gen3-${item.indexun}`}
                                    className="accordion-collapse collapse"
                                    data-bs-parent="#nestedAccordionGen3"
                                >
                                    <div className="accordion-body">
                                        <div className="d-flex flex-column gap-2">
                                            {item.links.map((link, linkIndex) => (
                                                <a key={`gen3-link-${linkIndex}`} className="text-decoration-none" href={link.href}>
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
