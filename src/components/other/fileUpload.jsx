import React, { Fragment } from "react";
import { SvgBin, Svgdoc, SvgDownload } from "../documents/generalcomp.jsx";
import { generateRandomId } from "../../Helpers/HelperFunctions.js";
import { getDocumentAttachmentFromAID } from "../../API/DocumentAttachment.js";

function FileUpload({ fileList, type, onUpload, onRemove, canUpload }) {
  const fileUploadInputId = generateRandomId(5);

  const downloadFile = (file) => {
    (async () => {
      if (file.b64 == null)
        file.b64 = await getDocumentAttachmentFromAID(file.attachmentId, true);

      if (!file.b64 || !file.fileName || !file.extension) {
        console.error("Invalid file object");
        return;
      }

      const byteCharacters = atob(file.b64);
      const byteNumbers = Array.from(byteCharacters, (char) =>
        char.charCodeAt(0),
      );
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: `application/octet-stream` });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${file.fileName}.${file.extension}`;
      document.body.appendChild(link);
      link.click();

      URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
    })();
  };

  return (
    <Fragment>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {fileList
          .filter((f) => f.type === type)
          .map((file, index) => (
            <li key={index} className="create-doc-li">
              <span
                style={{
                  color: "#563EC1",
                  display: "flex",
                  gap: "5px",
                  alignItems: "center",
                }}
              >
                <Svgdoc />
                {file.fileName + "." + file.extension}
              </span>
              <div style={{ display: "flex" }}>
                <button
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "red",
                  }}
                  onClick={() => {
                    downloadFile(file);
                  }}
                >
                  <SvgDownload />
                </button>
                <button
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "red",
                  }}
                  onClick={() => {
                    onRemove(file);
                  }}
                >
                  <SvgBin />
                </button>
              </div>
            </li>
          ))}
      </ul>
      {canUpload && (
        <div
          className="create-doc-li-flex"
          onClick={() => document.getElementById(fileUploadInputId).click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            onUpload({ target: { files: e.dataTransfer.files } }, type);
          }}
        >
          <p style={{ margin: 0, fontSize: "14px" }}>
            <Svgdoc />
            <span style={{ marginLeft: "6px" }} />
            Dosyalarınızı buraya sürükleyip bırakın <br />
            veya{" "}
            <span style={{ color: "#6200ea", fontWeight: "bold" }}>Seçin</span>
          </p>
          <input
            id={fileUploadInputId}
            type="file"
            multiple
            onChange={(e) => onUpload(e, type)}
            style={{ display: "none" }}
          />
        </div>
      )}
    </Fragment>
  );
}

export default FileUpload;
