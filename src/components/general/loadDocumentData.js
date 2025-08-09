import { getDocumentFromId } from "../../API/Documents";
import {
    getRevision,
    acceptDocumentRevision,
    rejectDocumentRevision,
} from "../../API/DocumentRevision";
import { DMode } from "../../Helpers/DMode";

export const loadDocumentData = async ({ mode, id, setters = {}, onAfterLoad }) => {
    if (mode === DMode.Create || !id) return;

    let doc = await (mode === DMode.ViewRevision
        ? getRevision(id)
        : getDocumentFromId(id, true));

    if (mode !== DMode.ViewRevision) {
        doc = {
            ...doc.document,
            attachments: doc.attachments,
            fields: doc.fields,
        };
    } else {
        const _tempDoc = await getDocumentFromId(doc.revision.documentId, false);
        doc = {
            ..._tempDoc.document,
            attachments: _tempDoc.attachments,
            fields: doc.fields,
            revision: doc.revision,
        };
    }

    if (!doc) return;

    setters.setData?.(doc);
    setters.setTitle?.(doc.title);
    setters.setUnit?.(doc.department);
    setters.setManuelId?.(doc.manuelId);

    if (mode === DMode.Edit && setters.setFileList) {
        setters.setFileList(
            doc.attachments.map((a) => ({
                attachmentId: a.attachmentID,
                b64: null,
                extension: a.extension,
                fileName: a.fileName,
                type: a.type,
            }))
        );
    }

    const elements = document.querySelectorAll("[field-short-name]");
    elements.forEach((element) => {
        const fieldShortName = element.getAttribute("field-short-name");
        element.value = doc.fields[fieldShortName]?.value ?? "";
    });

    if (onAfterLoad) onAfterLoad(doc);
};

export const handleRevisionResult = async ({ data, isRejected, redirectUrl }) => {
    if (!data?.revision) return;



    if (isRejected) {
        await rejectDocumentRevision(
            data.revision.documentId,
            data.revision.id,
            null
        );
    } else {
        await acceptDocumentRevision(
            data.revision.documentId,
            data.revision.id
        );
    }

    if (redirectUrl) {
        window.location.href = redirectUrl;
    }
};