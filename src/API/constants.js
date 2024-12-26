export const apiHost = "http://localhost:5293";
export const getAuthHeader = () => "Bearer " + getCookie("token");
export const getEndpoint = (ep, queryDict = null) => apiHost + ep + (queryDict != null ? parseQueryParameters(queryDict) : "");

export const _getJsonApiResult = async (httpResult) => {
    if (httpResult.status === 401)
        eraseCookie("token");

    if (!httpResult.ok)
        return null;

    const txt = await  httpResult.text();

    try {
        return JSON.parse(txt);
    } catch {
        return txt;
    }
};

function parseQueryParameters(dictionary) {
    return '?' + Object.entries(dictionary)
        .map(([key, value]) => encodeURIComponent(key) + '=' + encodeURIComponent(value))
        .join('&');
}

export function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
export function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
export function eraseCookie(name) {
    document.cookie = name+'=; Max-Age=-99999999;';
}