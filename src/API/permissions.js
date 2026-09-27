export const ActionPerm = Object.freeze({
    None: 0,
    DocumentCreate: 2 << 0,
    DocumentDelete: 2 << 1,
    DocumentViewAll: 2 << 2,
    DocumentRevisionCreate: 2 << 3,
    DocumentAddUsers: 2 << 4,
    RoleManage: 2 << 5,
    DocumentModify: 2 << 6,
    UserDelete: 2 << 7,
    UserCreate: 2 << 8,
    UserModify: 2 << 9,
    SendMail: 2 << 10
});

// 4094 full yetki
export function getPermTitle(perm) {
    const permTitles = {
        [ActionPerm.None]: "Yetki Yok",
        [ActionPerm.DocumentCreate]: "Doküman Oluşturma",
        [ActionPerm.DocumentDelete]: "Doküman Silme",
        [ActionPerm.DocumentViewAll]: "Tüm Dokümanları Görüntüleme",
        [ActionPerm.DocumentRevisionCreate]: "Revizyon Oluşturma",
        [ActionPerm.DocumentAddUsers]: "Döküman Paylaşma",
        [ActionPerm.RoleManage]: "Rolleri Yönetme",
        [ActionPerm.DocumentModify]: "Dokümanı Düzenleme",
        [ActionPerm.UserDelete]: "Kullanıcı Silme",
        [ActionPerm.UserCreate]: "Kullanıcı Oluşturma",
        [ActionPerm.UserModify]: "Kullanıcı Düzenleme",
        [ActionPerm.SendMail]: "E-Posta Gönderme",
    };

    return permTitles[perm] || "Bilinmeyen Yetki";
}

// Tüm yetki listesini döndürür
export function getContainedRoles() {
    return Object.entries(ActionPerm).slice(1).map(([key, value]) => ({
        title: getPermTitle(value),
        name: key,
        value
    }));
}

// Array içindeki tüm yetkileri birleştirir
export function createPerms(array) {
    return array.reduce((perms, currentPerm) => perms | currentPerm, 0);
}

// Mevcut yetkilere yeni yetki ekler
export function addPerm(perms, newPerm) {
    return perms | newPerm;
}

// Mevcut yetkilerden istenen yetkiyi güvenli bir şekilde siler
export function removePerm(perms, permToRemove) {
    return perms & ~permToRemove; 
}

// Belirli bir yetkinin olup olmadığını kontrol eder
export function checkPerm(perms, checkFor) {
    return (perms & checkFor) === checkFor;
}

// Array içindeki yetkilerden HERHANGİ BİRİNE sahip mi kontrol eder
export function checkPerms(perms, checkForArray) {
    return checkForArray.some(p => checkPerm(perms, p));
}

// Obje veya doğrudan sayı (roleValue) gönderildiğinde yetki kontrolü yapar
export function checkPermFromRole(roleOrValue, checkFor) {
    if (roleOrValue == null) return false;
    
    const perms = typeof roleOrValue === 'number' ? roleOrValue : (roleOrValue.permissions ?? 0);
    return checkPerm(perms, checkFor);
}

// Obje veya doğrudan sayı gönderildiğinde çoklu yetki kontrolü yapar
export function checkPermsFromRole(roleOrValue, checkForArray) {
    if (roleOrValue == null) return false;
    
    const perms = typeof roleOrValue === 'number' ? roleOrValue : (roleOrValue.permissions ?? 0);
    return checkPerms(perms, checkForArray);
}
