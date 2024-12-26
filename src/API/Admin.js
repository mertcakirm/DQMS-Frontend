import { _getJsonApiResult, getAuthHeader, getEndpoint } from "./constants.js";

export async function sendManuelMail(mailDto) {
  return _getJsonApiResult(
    await fetch(getEndpoint(`/api/mails`), {
      method: "POST",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mailDto),
    }),
  );
}

export async function getManuelMails() {
  return _getJsonApiResult(
    await fetch(getEndpoint(`/api/mails`), {
      method: "GET",
      headers: {
        Authorization: getAuthHeader(),
      },
    }),
  );
}

export async function deleteManuelMail(mid) {
  return _getJsonApiResult(
    await fetch(getEndpoint(`/api/mails/${mid}`), {
      method: "DELETE",
      headers: {
        Authorization: getAuthHeader(),
      },
    }),
  );
}

export async function getDashboard() {
  return _getJsonApiResult(
    await fetch(getEndpoint(`/api/dashboard`), {
      method: "GET",
      headers: {
        Authorization: getAuthHeader(),
      },
    }),
  );
}
