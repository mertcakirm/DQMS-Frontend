import { _getJsonApiResult, getAuthHeader, getEndpoint } from "./constants.js";

export async function uploadDocumentAttachment(
  documentId,
  b64,
  extension,
  name,
  type = null,
) {
  const qDict = {
    extension: extension,
    name: name,
  };

  if (type != null) qDict["type"] = type;

  return _getJsonApiResult(
    await fetch(
      getEndpoint(`/api/documents/${documentId}/attachments`, qDict),
      {
        method: "POST",
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/octet-stream",
        },
        body: b64,
      },
    ),
  );
}

export async function deleteDocumentAttachment(documentId, aid) {
  return _getJsonApiResult(
    await fetch(
      getEndpoint(`/api/documents/${documentId}/attachments/${aid}`),
      {
        method: "DELETE",
        headers: {
          Authorization: getAuthHeader(),
        },
      },
    ),
  );
}

export async function getDocumentAttachmentFromAID(aid, isB64 = true) {
  return _getJsonApiResult(
    await fetch(
      getEndpoint(`/api/documents/attachments/${aid}`, {
        b64: isB64,
      }),
      {
        method: "GET",
        headers: {
          Authorization: getAuthHeader(),
        },
      },
    ),
  );
}
