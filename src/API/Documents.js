import {_getJsonApiResult, getAuthHeader, getEndpoint} from "./constants.js";

export async function createDocument(document)
{
    return _getJsonApiResult(await fetch(getEndpoint(`/api/documents`), {
        method: "POST",
        headers: {
            "Authorization": getAuthHeader(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(document)
    }));
}


export async function getAllDocuments(page = 1, maxPerPage = 10, search = null, typeFilterArray = null, fieldsArray = null)
{
    const queryArray = [`page=${encodeURIComponent(page)}`, `max=${encodeURIComponent(maxPerPage)}`];

    if (search != null)
        queryArray.push(`search=${encodeURIComponent(search)}`);

    if (typeFilterArray != null)
    {
        typeFilterArray.forEach(t => {
            queryArray.push(`typeFilter=${encodeURIComponent(t)}`);
        });
    }

    if (fieldsArray != null)
    {
        fieldsArray.forEach(f => {
            queryArray.push(`fields=${encodeURIComponent(f)}`);
        });
    }

    return _getJsonApiResult(await fetch(getEndpoint(`/api/documents?${queryArray.join('&')}`), {
        method: "GET",
        headers: {
            "Authorization": getAuthHeader()
        }
    }));
}

export async function getFirstDocumentFromShortName(shortName)
{
    return _getJsonApiResult(await fetch(getEndpoint(`/api/documents/first?shortName=${encodeURIComponent(shortName)}`), {
        method: "GET",
        headers: {
            "Authorization": getAuthHeader()
        }
    }));
}

export async function getMultipleDocumentsFromShortName(shortName, page = 1, maxPerPage = 10)
{
    return _getJsonApiResult(await fetch(getEndpoint(`/api/documents/multiple?shortName=${encodeURIComponent(shortName)}&page=${encodeURIComponent(page)}&max=${encodeURIComponent(maxPerPage)}`), {
        method: "GET",
        headers: {
            "Authorization": getAuthHeader()
        }
    }));
}

export async function getSelfDocuments(page = 1, maxPerPage = 10)
{
    return _getJsonApiResult(await fetch(getEndpoint(`/api/documents/my?page=${encodeURIComponent(page)}&max=${encodeURIComponent(maxPerPage)}`), {
        method: "GET",
        headers: {
            "Authorization": getAuthHeader()
        }
    }));
}

export async function getDocumentFromId(documentId, getFields = true)
{
    return _getJsonApiResult(await fetch(getEndpoint(`/api/documents/${documentId}?getFields=${getFields === true ? "true" : "false"}`), {
        method: "GET",
        headers: {
            "Authorization": getAuthHeader()
        }
    }));
}

export async function deleteDocument(documentId)
{
    return _getJsonApiResult(await fetch(getEndpoint(`/api/documents/${documentId}`), {
        method: "DELETE",
        headers: {
            "Authorization": getAuthHeader()
        }
    }));
}

export async function changeDocument(documentId, newFieldsDictionary)
{
    return _getJsonApiResult(await fetch(getEndpoint(`/api/documents/${documentId}`), {
        method: "PUT",
        headers: {
            "Authorization": getAuthHeader(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newFieldsDictionary)
    }));
}

export async function getDocumentSharedToMe(page = 1, maxPerPage = 10)
{
    return _getJsonApiResult(await fetch(getEndpoint(`/api/documents/shared?page=${encodeURIComponent(page)}&max=${encodeURIComponent(maxPerPage)}`), {
        method: "GET",
        headers: {
            "Authorization": getAuthHeader()
        }
    }));
}