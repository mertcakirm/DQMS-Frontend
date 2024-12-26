import {_getJsonApiResult, getAuthHeader, getEndpoint} from "./constants.js";

export async function getDocumentShares(documentId)
{
    return _getJsonApiResult(await fetch(getEndpoint(`/api/documents/${documentId}/share`), {
        method: "GET",
        headers: {
            "Authorization": getAuthHeader()
        }
    }));
}

export async function removeDocumentShares(documentId, uidArray)
{
    return _getJsonApiResult(await fetch(getEndpoint(`/api/documents/${documentId}/share?${uidArray.map(str => "users=" + encodeURIComponent(str)).join('&')}`), {
        method: "DELETE",
        headers: {
            "Authorization": getAuthHeader()
        }
    }));
}

export async function createDocumentShares(documentId, shareArray)
{
    return _getJsonApiResult(await fetch(getEndpoint(`/api/documents/${documentId}/share`), {
        method: "POST",
        headers: {
            "Authorization": getAuthHeader(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(shareArray)
    }));
}