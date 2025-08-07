import {
  getEndpoint,
  getAuthHeader,
  eraseCookie,
  _getJsonApiResult,
} from "./constants.js";

export async function getSelf() {
  const response = await fetch(getEndpoint("/api/users/self"), {
    method: "GET",
    headers: {
      Authorization: getAuthHeader(),
    },
  });

  if (response.status === 401) eraseCookie("token");

  if (!response.ok) return null;

  return await response.json();
}

export async function getUsers() {
  return _getJsonApiResult(
    await fetch(getEndpoint(`/api/users/all`), {
      method: "GET",
      headers: {
        Authorization: getAuthHeader(),
      },
    }),
  );
}

export async function getUsersinUnit(userIds) {
    const queryString = userIds
        .map((id) => `userIdArray=${encodeURIComponent(id)}`)
        .join('&');

    const url = getEndpoint(`/api/users/array?${queryString}`);

    return _getJsonApiResult(
        await fetch(url, {
            method: "GET",
            headers: {
                Authorization: getAuthHeader(),
                "Content-Type": "application/json",
            },
        })
    );
}

export async function getUsersByUnitId(UnitId) {
    return _getJsonApiResult(
        await fetch(getEndpoint(`/api/users/units/${UnitId}`), {
            method: "GET",
            headers: {
                Authorization: getAuthHeader(),
            },
        }),
    );
}

export async function uploadUserPfp(b64, fileType) {
  return _getJsonApiResult(
    await fetch(getEndpoint(`/api/users/self/pfp`, { fileType: fileType }), {
      method: "POST",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/octet-stream",
      },
      body: b64,
    }),
  );
}

export async function getUserPfp() {
  return _getJsonApiResult(
    await fetch(getEndpoint(`/api/users/self/pfp`), {
      method: "GET",
      headers: {
        Authorization: getAuthHeader(),
      },
    }),
  );
}


export async function getUsersPfp(uid) {
    return _getJsonApiResult(
        await fetch(getEndpoint(`/api/users/${uid}/pfp`), {
            method: "GET",
            headers: {
                Authorization: getAuthHeader(),
            },
        }),
    );
}


export async function changeUserPassword(oldPassword, newPassword) {
  return _getJsonApiResult(
    await fetch(getEndpoint(`/api/users/self/changepwd`), {
      method: "POST",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        oldPassword: oldPassword,
        newPassword: newPassword,
      }),
    }),
  );
}

export async function changeUser(options, uid = null) {
  return _getJsonApiResult(
    await fetch(
      getEndpoint(uid == null ? `/api/users/self` : `/api/users/${uid}`),
      {
        method: "PUT",
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
      },
    ),
  );
}

export async function createNewUser(newUser) {
  return _getJsonApiResult(
    await fetch(getEndpoint(`/api/users`), {
      method: "POST",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    }),
  );
}

export async function deleteUser(uid) {
  return _getJsonApiResult(
    await fetch(getEndpoint(`/api/users/${uid}`), {
      method: "DELETE",
      headers: {
        Authorization: getAuthHeader(),
      },
    }),
  );
}

export async function sendPwdResetCode(user) {
  return _getJsonApiResult(
    await fetch(getEndpoint(`/api/users/self/pwd/sendcode`, { user: user }), {
      method: "POST",
      headers: {
        Authorization: getAuthHeader(),
      },
    }),
  );
}

export async function checkCode(verificationId, code) {
  const result = await fetch(
    getEndpoint(`/api/users/self/pwd/checkcode`, {
      verificationId: verificationId,
      code: code,
    }),
    {
      method: "POST",
      headers: {
        Authorization: getAuthHeader(),
      },
    },
  );

  return result.ok;
}

export async function resetPwdWithVerification(verificationId, code, newPwd) {
  const result = await fetch(getEndpoint(`/api/users/self/pwd/reset`), {
    method: "POST",
    headers: {
      Authorization: getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      codeId: verificationId,
      code: code,
      newPassword: newPwd,
    }),
  });

  return result.ok;
}

export async function resetSelfUserPfp(selfFullName) {
  const result = await fetch(
    `https://avatar.iran.liara.run/username?username=${encodeURIComponent(selfFullName)}`,
    {
      method: "GET",
    },
  );

  if (!result.ok) {
    return;
  }

  const arrayBuffer = await result.arrayBuffer();

  const base64String = btoa(
    String.fromCharCode(...new Uint8Array(arrayBuffer)),
  );

  await uploadUserPfp(base64String, "png");
}
