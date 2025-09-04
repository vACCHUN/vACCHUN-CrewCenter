import Nav from "../components/Nav";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import "../App.css";
import { throwError } from "../utils/throwError";
import config from "../config";
import FileCard from "../components/FilesPage/FileCard";
import { useEffect, useState } from "react";
import { FileInfo } from "../types/files";
import Loading from "../components/Loading";
const API_URL = config.API_URL;
import useAuth from "../hooks/useAuth";

export default function FilesPage() {
  const [backblazeFiles, setBackblazeFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useAuth();
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");

  const getUploadedFiles = () => {
    setLoading(true);
    axios
      .get(`${API_URL}/files/list`)
      .then((data) => {
        const files = data.data.files;
        setBackblazeFiles(files);
      })
      .catch((error) => {
        throwError("Error loading fileinfo: ", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getUploadedFiles();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (uploadFile) {
      setUploadMessage("Please wait...")
      console.log("Uploading file...");

      const formData = new FormData();
      formData.append("file", uploadFile);

      try {
        const { data } = await axios.post(`${API_URL}/files/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (data.success) {
          setUploadMessage("Upload successful.");
        } else {
          setUploadMessage("Upload failed.");
        }
      } catch (error) {
        setUploadMessage("Upload failed.");
        throwError("Error in file upload: ", error);
      } finally {
        getUploadedFiles();
      }
    }
  };

  return (
    <>
      <Nav />

      <div className="py-8 px-3">
        {isAdmin ? (
          <div>
            <div className="flex flex-col gap-2">
              <p>{uploadMessage}</p>
              <input id="file" type="file" onChange={handleFileChange} />
              <button className="w-min bg-awesomecolor hover:bg-blue-950 text-white p-1 px-2 rounded-lg" onClick={handleUpload}>
                Upload
              </button>
            </div>
          </div>
        ) : (
          <></>
        )}
        <h1 className="text-2xl">File manager</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 px-2 py-5 gap-3 ">
          {loading ? (
            <Loading message="Loading files..." />
          ) : (
            backblazeFiles.map((file, index) => {
              return <FileCard fileId={file.id} refresh={getUploadedFiles} fileName={file.fileName} fileSize={file.sizeMb} contentType={file.contentType} uploadDate={file.uploadDate} key={index} />;
            })
          )}

          <FileCard fileId={""} isLink={true} refresh={getUploadedFiles} fileName={"Poci website"} fileSize={0} contentType={""} uploadDate={"2025-05-04"} />
        </div>
      </div>
    </>
  );
}
