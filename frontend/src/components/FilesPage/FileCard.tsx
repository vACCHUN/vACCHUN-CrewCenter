import { contentTypeToExt, removeExtension } from "../../utils/fileUtils";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import config from "../../config";
import { throwError } from "../../utils/throwError";
import { useState } from "react";
import Loading from "../Loading";
import PDFEmbed from "./PDFEmbed";
import api from "../../axios";

const API_URL = config.API_URL;

type FileCardParams = {
  fileName: string;
  contentType: string;
  fileSize: number;
  uploadDate: string;
  link?: boolean | string;
  fileId: string;
  refresh: () => void;
};

function FileCard({ fileName, contentType, fileSize, uploadDate, link = false, fileId, refresh }: FileCardParams) {
  const { userData, isAdmin } = useAuth();
  const [isDeleted, setIsDeleted] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const fileExtension = contentTypeToExt(contentType).toUpperCase();

  const handleDelete = async () => {
    try {
      setIsDeleted(true);
      const res = await api.delete(`/files/remove/${fileId}`, {
        headers: {
          Authorization: `Bearer ${userData?.access_token}`,
        },
      });
      refresh();
      if (!res) {
        alert("Error while removing file.");
      }
    } catch (error) {
      throwError("Error removing file: ", error);
    }
  };

  const handleDownload = async () => {
    if (!link) {
      try {
        setIsLoading(true);

        if (fileExtension === "PDF") {
          setIsLoading(true);
          try {
            const res = await api.get(`/files/download/${fileId}`, {
              responseType: "arraybuffer",
              headers: {
                Authorization: `Bearer ${userData?.access_token}`,
              },
            });

            const blob = new Blob([res.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            setPdfUrl(url);
            setIsEmbedOpen(true);
          } catch (error) {
            throwError("Error downloading PDF: ", error);
          } finally {
            setIsLoading(false);
          }
        } else {
          const res = await api.get(`/files/download/${fileId}`, {
            responseType: "arraybuffer",
            headers: {
              Authorization: `Bearer ${userData?.access_token}`,
            },
          });

          if (!res.data) {
            alert("Error while downloading file.");
            return;
          }
          const blob = new Blob([res.data], { type: "application/octet-stream" });
          const url = window.URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();

          link.remove();
          window.URL.revokeObjectURL(url);
        }
      } catch (error) {
        throwError("Error downloading file: ", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      const destination = typeof link === "string" ? link : "https://cc.vacchun.hu";
      window.open(destination, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      <div className="border border-solid border-slate-400 p-2 rounded-md">
        {isDeleted ? (
          <Loading message="Deleting item..." isFixed={false} />
        ) : (
          <>
            <div className="grid grid-cols-2 py-1">
              <div>
                <span className="p-1 bg-awesomecolor text-white rounded-md px-2 border-rounded-md">{link ? "LINK" : fileExtension}</span>
              </div>
              <div className="flex justify-end">
                <span className="text-awesomecolor">{uploadDate}</span>
              </div>
            </div>

            <h2 className="text-lg font-bold truncate max-w-full" title={fileName}>
              {removeExtension(fileName)}
            </h2>

            <div className="pb-1 flex">
              {!link ? (
                <p>File size: {fileSize}mb</p>
              ) : (
                <a href={typeof link == "string" ? link : "#"} className="text-md truncate max-w-full text-slate-500">
                  {link}
                </a>
              )}
            </div>

            <div className="w-full flex gap-1 bottom-0">
              <button onClick={handleDownload} className="bg-awesomecolor hover:bg-blue-950 w-full rounded-lg py-1 text-white">
                {"Open"}
              </button>
              {isAdmin && !link ? (
                <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 w-20 rounded-lg py-1 text-white">
                  X
                </button>
              ) : (
                <></>
              )}
            </div>
          </>
        )}
      </div>

      {isLoading ? (
        <div className="fixed z-50 top-0 left-0 inset-0 flex items-center justify-center bg-white bg-opacity-80">
          <Loading message="Downloading file..." />
        </div>
      ) : (
        <div className="absolute">
          {isEmbedOpen && pdfUrl.length > 0 ? (
            <PDFEmbed
              handleClose={() => {
                setIsEmbedOpen(false);
                if (pdfUrl) {
                  window.URL.revokeObjectURL(pdfUrl);
                }
              }}
              url={pdfUrl}
            />
          ) : (
            <></>
          )}
        </div>
      )}
    </>
  );
}

export default FileCard;
