import {_getJsonApiResult, getAuthHeader, getEndpoint} from "./constants.js";

export async function deleteAgendaEvent(eventId)
{
    return _getJsonApiResult(await fetch(getEndpoint(`/api/agenda`, {id: eventId.toString()}), {
        method: "DELETE",
        headers: {
            "Authorization": getAuthHeader()
        }
    }));
}

export async function getAgendaEvents(year, month)
{
    return _getJsonApiResult(await fetch(getEndpoint(`/api/agenda`, {year: year.toString(), month: month.toString()}), {
        method: "GET",
        headers: {
            "Authorization": getAuthHeader()
        }
    }));
}

export async function createNewAgendaEvent(event)
{
    return _getJsonApiResult(await fetch(getEndpoint(`/api/agenda`), {
        method: "POST",
        headers: {
            "Authorization": getAuthHeader(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(event)
    }));
}

export async function updateAgendaEvent(eventId, event)
{
    return _getJsonApiResult(await fetch(getEndpoint(`/api/agenda`, {id: eventId}), {
        method: "PUT",
        headers: {
            "Authorization": getAuthHeader(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(event)
    }));
}