import { getEndpoint, getAuthHeader, eraseCookie, _getJsonApiResult } from "./constants.js";

export async function getRole(roleId)
{
    return _getJsonApiResult(await fetch(getEndpoint(`/api/roles/${roleId}`), {
        method: "GET",
        headers: {
            "Authorization": getAuthHeader()
        },
    }));
}

export async function getAllRoles()
{
   return _getJsonApiResult(await fetch(getEndpoint(`/api/roles`), {
        method: "GET",
        headers: {
            "Authorization": getAuthHeader()
        },
    }));
}

export async function createRole(roleName, permissions)
{
    return _getJsonApiResult(await fetch(getEndpoint(`/api/roles`), {
        method: "POST",
        headers: {
            "Authorization": getAuthHeader(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: roleName,
            permissions: permissions
        })
    }));
}

export async function updateRole(roleId, roleName, permissions)
{
    return _getJsonApiResult(await fetch(getEndpoint(`/api/roles/${roleId}`), {
        method: "PUT",
        headers: {
            "Authorization": getAuthHeader(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: roleName,
            permissions: permissions
        })
    }));
}

export async function deleteRole(roleId)
{
    return _getJsonApiResult(await fetch(getEndpoint(`/api/roles/${roleId}`), {
        method: "DELETE",
        headers: {
            "Authorization": getAuthHeader()
        }
    }));
}