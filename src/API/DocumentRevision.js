import {_getJsonApiResult, getAuthHeader, getEndpoint} from "./constants.js";

export const RevisionState = Object.freeze({
    Pending: 0,
    Accepted: 1,
    Rejected: 2
});

export async function createDocumentRevision(documentId, fieldsDictionary)
{
    return _getJsonApiResult(await fetch(getEndpoint(`/api/documents/${documentId}/revision`), {
        method: "POST",
        headers: {
            "Authorization": getAuthHeader(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(fieldsDictionary)
    }));
}

export async function acceptDocumentRevision(documentId, revisionId)
{
    return _getJsonApiResult(await fetch(getEndpoint(`/api/documents/${documentId}/revision/${revisionId}/accept`), {
        method: "POST",
        headers: {
            "Authorization": getAuthHeader()
        }
    }));
}

export async function rejectDocumentRevision(documentId, revisionId, note = null)
{
    return _getJsonApiResult(await fetch(getEndpoint(`/api/documents/${documentId}/revision/${revisionId}/reject`), {
        method: "POST",
        headers: {
            "Authorization": getAuthHeader(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(note ?? "")
    }));
}

export async function getSelfRevisions()
{
    return _getJsonApiResult(await fetch(getEndpoint(`/api/documents/revisions/my`), {
        method: "GET",
        headers: {
            "Authorization": getAuthHeader()
        }
    }));
}

export async function getRevision(revisionId)
{
    return _getJsonApiResult(await fetch(getEndpoint(`/api/documents/revisions/${revisionId}`), {
        method: "GET",
        headers: {
            "Authorization": getAuthHeader()
        }
    }));
}

export async function getAllRevision(page = 1, maxPerPage = 10)
{
    return _getJsonApiResult(await fetch(getEndpoint(`/api/documents/revisions?page=${encodeURIComponent(page)}&max=${encodeURIComponent(maxPerPage)}`), {
        method: "GET",
        headers: {
            "Authorization": getAuthHeader()
        }
    }));
}

export async function sendDocumentRevisionRequest(documentId, note)
{
    return _getJsonApiResult(await fetch(getEndpoint(`/api/documents/${documentId}/revision/request`), {
        method: "POST",
        headers: {
            "Authorization": getAuthHeader(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(note)
    }));
}

export async function getRevisionRequest(requestId)
{
    return _getJsonApiResult(await fetch(getEndpoint(`/api/documents/revision/requests/${requestId}`), {
        method: "GET",
        headers: {
            "Authorization": getAuthHeader()
        }
    }));
}

export async function deleteRevisionRequest(requestId)
{
    return _getJsonApiResult(await fetch(getEndpoint(`/api/documents/revision/requests/${requestId}`), {
        method: "DELETE",
        headers: {
            "Authorization": getAuthHeader()
        }
    }));
}

export async function getSelfRevisionRequestsForDocument(documentId, page = 1, maxPerPage = 10)
{
    return _getJsonApiResult(await fetch(getEndpoint(`/api/documents/${documentId}/revision/request/my?page=${encodeURIComponent(page)}&max=${encodeURIComponent(maxPerPage)}`), {
        method: "GET",
        headers: {
            "Authorization": getAuthHeader()
        }
    }));
}

export async function getSelfRevisionRequests(page = 1, maxPerPage = 10)
{
    return _getJsonApiResult(await fetch(getEndpoint(`/api/documents/revision/requests/my?page=${encodeURIComponent(page)}&max=${encodeURIComponent(maxPerPage)}`), {
        method: "GET",
        headers: {
            "Authorization": getAuthHeader()
        }
    }));
}

export async function getDocumentRevisionRequests(documentId, page = 1, maxPerPage = 10)
{
    return _getJsonApiResult(await fetch(getEndpoint(`/api/documents/${documentId}/revision/requests?page=${encodeURIComponent(page)}&max=${encodeURIComponent(maxPerPage)}`), {
        method: "GET",
        headers: {
            "Authorization": getAuthHeader()
        }
    }));
}

export async function getRevisionRequestsFromStatus(status, page = 1, maxPerPage = 30)
{
    return _getJsonApiResult(await fetch(getEndpoint(`/api/documents/revision/requests?page=${encodeURIComponent(page)}&max=${encodeURIComponent(maxPerPage)}&statusType=${status}`), {
        method: "GET",
        headers: {
            "Authorization": getAuthHeader()
        }
    }));
}

export async function acceptRevisionRequest(requestId, note = null)
{
    return _getJsonApiResult(await fetch(getEndpoint(`/api/documents/revision/requests/${requestId}/accept`), {
        method: "POST",
        headers: {
            "Authorization": getAuthHeader(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(note)
    }));
}

export async function rejectRevisionRequest(requestId, note = null)
{
    return _getJsonApiResult(await fetch(getEndpoint(`/api/documents/revision/requests/${requestId}/reject`), {
        method: "POST",
        headers: {
            "Authorization": getAuthHeader(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(note)
    }));
}
