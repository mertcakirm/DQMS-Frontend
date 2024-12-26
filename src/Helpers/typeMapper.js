export const DocumentType = Object.freeze({
  Document: "document",
  Swot: "swot",
  ISGRisk: "isgRisk",
  ProcessRisk: "processRisk",
  YGGMeeting: "yggmeeting",
  PESTLE: "pestle",
  ExternalDoc: "externaldoc",
  Needs: "needs",
  CorrectiveAction: "correctiveAction",
  Performance: "performance",
  Legal: "legal",
  Suitability: "suitability",
  Incident: "incident",
  Wastle: "wastle",
  EmergencyDrill: "emergencyDrill",
  EmergencyAction: "emergencyAction",
  AccidentIncident: "accidentincident",
  Audit: "audit",
  MainTenance: "maintenance",
  EmergencyDrillEnvi: "emergencyDrillEnvi",
  Revision: "revision",
  ArchiveDoc: "ArchiveDoc",
  HireCont1: "HireCont1",
  HireCont2: "HireCont2",
  HireCont3: "HireCont3",
  SettlementReport: "SettlementReport",
  Procedur: "Procedur",
  MattersConsideration: "MattersConsideration",
  MeetingMinutes: "meetingMinutes",
  Signature: "signature",
  ApplicationEvaluationForm: "applicationEvaluationForm",
  ApplicationEvaluationForm2: "applicationEvaluationForm2",
  Conditions: "conditions",
  PurchaseRequestForm: "purchaseRequestForm",
  ApprovedSupplierList: "approvedSupplierList",
  TrackingChart: "trackingChart",
  PrivacyCommitment: "privacyCommitment",
  PersonalData: "personalData",
  SupplierEvaluationForm: "supplierEvaluationForm",
  PurchasingProcedure: "purchasingProcedure",
  Debit: "debit",
  MonitoringReport: "monitoringReport",
  MonitoringReport2: "monitoringReport2",
  MeetingMinutesMonitor: "meetingMinutesmonitor",
});

export function getTypeTitle(documentType) {
  switch (documentType) {
    case DocumentType.Document:
      return "Döküman";
    case DocumentType.ExternalDoc:
      return "Dış Kaynaklı Doküman";
    case DocumentType.Swot:
      return "Swot Analizi";
    case DocumentType.ISGRisk:
      return "ISG Risk Analizi";
    case DocumentType.ProcessRisk:
      return "Süreç Risk Analizi";
    case DocumentType.YGGMeeting:
      return "YGG Toplantı Tutanağı";
    case DocumentType.PESTLE:
      return "Pestle Analizi";
    case DocumentType.Needs:
      return "İhtiyaç ve Beklentiler";
    case DocumentType.CorrectiveAction:
      return "Düzeltici Faaliyet";
    case DocumentType.Performance:
      return "Hedef Performans";
    case DocumentType.Legal:
      return "Yasal İzinler ve Diğer Şartlar";
    case DocumentType.Suitability:
      return "Uygunluk Formu";
    case DocumentType.Incident:
      return "Ramak Kala Olay Bildirimi";
    case DocumentType.Wastle:
      return "Atık Takibi";
    case DocumentType.EmergencyDrillEnvi:
      return "Acil Durum Tatbikat Değerlendirmesi Çevre";
    case DocumentType.EmergencyDrill:
      return "Acil Durum Tatbikat Değerlendirmesi";
    case DocumentType.EmergencyAction:
      return "Acil Durum Eylem Planı";
    case DocumentType.AccidentIncident:
      return "Kaza Olay Takip Dokümanı";
    case DocumentType.Audit:
      return "İç Denetim Raporu";
    case DocumentType.MainTenance:
      return "Yıllık Bakım Planı";
    case DocumentType.Revision:
      return "Revizyon Talep Formu";
    case DocumentType.ArchiveDoc:
      return "Doküman Arşiv Süresi Formu";
    case DocumentType.HireCont1:
      return "Kiralama Sözleşmesi 1";
    case DocumentType.HireCont2:
      return "Kiralama Sözleşmesi 2";
    case DocumentType.HireCont3:
      return "Kiralama Sözleşmesi 3";
    case DocumentType.SettlementReport:
      return "Yerleşim Tutanağı";
    case DocumentType.Procedur:
      return "Prosedür";
    case DocumentType.MattersConsideration:
      return "Dikkat Edilmesi Gereken Hususlar Formu";
    case DocumentType.MeetingMinutes:
      return "Toplantı Tutanak Formu";
    case DocumentType.Signature:
      return "İmza Formu";
    case DocumentType.ApplicationEvaluationForm:
      return "Başvuru Değerlendirme Formu - 1";
    case DocumentType.ApplicationEvaluationForm2:
      return "Başvuru Değerlendirme Formu - 2";
    case DocumentType.Conditions:
      return "Koşullar";
    case DocumentType.PurchaseRequestForm:
      return "Satın Alma Talep Formu";
    case DocumentType.ApprovedSupplierList:
      return "Onaylı Tedarikçi Listesi";
    case DocumentType.TrackingChart:
      return "Sözleşme Takip Listesi";
    case DocumentType.PrivacyCommitment:
      return "Gizlilik Taahütnamesi";
    case DocumentType.PersonalData:
      return "Kişisel Veri Güvenliği Taahütnamesi";
    case DocumentType.SupplierEvaluationForm:
      return "Tedarikçi Değerlendirme Formu";
    case DocumentType.PurchasingProcedure:
      return "Satın Alma Prosedürü";
    case DocumentType.Debit:
      return "KKD Zimmet ve Taahhüt Formu";
    case DocumentType.MonitoringReport:
      return "Başvuru İzleme Raporu 1";
    case DocumentType.MonitoringReport2:
      return "Başvuru İzleme Raporu 2";
    case DocumentType.MeetingMinutesMonitor:
      return "Proje İzleme Toplantı Tutanağı";
  }
}

export function getTypeUrl(documentType) {
  switch (documentType) {
    case DocumentType.Document:
      return "/dokuman/olustur";
    case DocumentType.ExternalDoc:
      return "/dokuman/dis-kaynakli";
    case DocumentType.Swot:
      return "/process/swot";
    case DocumentType.ISGRisk:
      return "/risk/isg";
    case DocumentType.ProcessRisk:
      return "/risk/surec";
    case DocumentType.YGGMeeting:
      return "/ygg/toplanti-tutanagi";
    case DocumentType.PESTLE:
      return "/process/pestle";
    case DocumentType.Needs:
      return "/process/ihtiyac-ve-beklentiler";
    case DocumentType.CorrectiveAction:
      return "/duzeltici-faaliyet/form";
    case DocumentType.Performance:
      return "/process/hedef-performans";
    case DocumentType.Legal:
      return "/yasal/izinler-ve-diger-sartlar";
    case DocumentType.Suitability:
      return "/yasal/uygunluk";
    case DocumentType.Incident:
      return "/ramak-kala/olay-bildirim-formu";
    case DocumentType.Wastle:
      return "/cevre/atik-takip";
    case DocumentType.EmergencyDrillEnvi:
      return "/acil-durum/tatbikat-cevre";
    case DocumentType.EmergencyDrill:
      return "/acil-durum/tatbikat";
    case DocumentType.EmergencyAction:
      return "/acil-durum/eylem";
    case DocumentType.AccidentIncident:
      return "/ramak-kala/kaza-olay-takip";
    case DocumentType.Audit:
      return "/ic-denetim/rapor";
    case DocumentType.MainTenance:
      return "/bakim/plani";
    case DocumentType.Revision:
      return "/revizyon-talebi";
    case DocumentType.ArchiveDoc:
      return "/dokuman/arsiv-suresi";
    case DocumentType.HireCont1:
      return "/kiralama/sozlesme1";
    case DocumentType.HireCont2:
      return "/kiralama/sozlesme2";
    case DocumentType.HireCont3:
      return "/kiralama/sozlesme3";
    case DocumentType.SettlementReport:
      return "/kiralama/yerlesim-tutanagi";
    case DocumentType.Procedur:
      return "/dokuman/prosedur";
    case DocumentType.MattersConsideration:
      return "/basvuru/dikkat-edilmesi-gerekenler";
    case DocumentType.MeetingMinutes:
      return "/basvuru/toplanti-tutanak-formu";
    case DocumentType.Signature:
      return "/basvuru/imza";
    case DocumentType.ApplicationEvaluationForm:
      return "/basvuru/degerlendirme-formu";
    case DocumentType.ApplicationEvaluationForm2:
      return "/basvuru/degerlendirme-formu2";
    case DocumentType.Conditions:
      return "/basvuru/kosullar";
    case DocumentType.PurchaseRequestForm:
      return "/satin-alma/talep-formu";
    case DocumentType.ApprovedSupplierList:
      return "/satin-alma/onayli-tedarikciler";
    case DocumentType.TrackingChart:
      return "/sozlesme/takip-cizelge";
    case DocumentType.PrivacyCommitment:
      return "/sozlesme/gizlilik";
    case DocumentType.PersonalData:
      return "/sozlesme/kisisel-veriler";
    case DocumentType.SupplierEvaluationForm:
      return "/satin-alma/tedarikci-degerlendirme";
    case DocumentType.PurchasingProcedure:
      return "/satin-alma/prosedur";
    case DocumentType.Debit:
      return "/is-sagligi-ve-guvenligi/zimmet";
    case DocumentType.MonitoringReport:
      return "/proje-izleme/izleme-raporu";
    case DocumentType.MonitoringReport2:
      return "/proje-izleme/izleme-raporu-2";
    case DocumentType.MeetingMinutesMonitor:
      return "/proje-izleme/toplanti-tutanagi";
    default:
      return null;
  }
}
