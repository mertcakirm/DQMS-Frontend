import {_getJsonApiResult, getAuthHeader, getEndpoint} from "./constants.js";

export async function getAllUnits()
{
    return _getJsonApiResult(await fetch(getEndpoint(`/api/units/all`), {
        method: "GET",
        headers: {
            "Authorization": getAuthHeader()
        },
    }));
}

export async function getUnitById(id)
{
    return _getJsonApiResult(await fetch(getEndpoint(`/api/units/${id}`), {
        method: "GET",
        headers: {
            "Authorization": getAuthHeader()
        },
    }));
}


export async function deleteUnitById(id) {
    return _getJsonApiResult(
        await fetch(getEndpoint(`/api/units/${id}`), {
            method: "DELETE",
            headers: {
                Authorization: getAuthHeader(),
            },
        }),
    );
}

export async function createUnitRequest(unit) {
    return _getJsonApiResult(
        await fetch(getEndpoint(`/api/units`), {
            method: "POST",
            headers: {
                Authorization: getAuthHeader(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(unit),
        }),
    );
}
