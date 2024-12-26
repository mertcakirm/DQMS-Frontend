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

export function getContainedRoles(perms)
{
    return Object.entries(ActionPerm).slice(1).map(([key, value]) => ({
        title: getPermTitle(value),
        name: key,
        value
    }));
}

export function createPerms(array)
{
    var perms = 0;
    array.forEach(perm => perms |= perm);
    return perm;
}

export function addPerm(perms, newPerm)
{
    return perms | newPerm;
}

export function removePerm(perms, removePerm)
{
    return perms ^ removePerm;
}

export function checkPerm(perms, checkFor)
{
    return (perms & checkFor) === checkFor;
}

export function checkPerms(perms, checkForArray)
{
    return checkForArray.some(p => checkPerm(perms, p));
}


export function checkPermFromRole(role, checkFor)
{
    if (role == null)
        return false;

    return checkPerm(role.permissions ?? 0, checkFor);
}

export function checkPermsFromRole(role, checkForArray)
{
    if (role == null)
        return false;

    return checkPerms(role.permissions ?? 0, checkForArray);
}