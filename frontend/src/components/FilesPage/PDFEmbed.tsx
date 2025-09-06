import { useState } from "react";
import Loading from "../Loading";

type PDFEmbedParams = {
  url: string;
  handleClose: () => void;
};

function PDFEmbed({ url, handleClose }: PDFEmbedParams) {
  const [isLoading, setIsLoading] = useState(true);


  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  if (!url) return <Loading message="Loading PDF..." />;

  return (
    <>
      <div className={`fixed top-0 left-0 z-50 w-screen h-screen`}>
        <button
          onClick={handleClose}
          className={`z-50 flex justify-center bg-red-500 text-white cursor-pointer w-full hover:bg-red-600 ${isLoading ? "hidden" : "visible"}`}
        >
          Close
        </button>

        {isLoading && (
          <div className="fixed z-50 top-0 left-0 inset-0 flex items-center justify-center bg-white bg-opacity-80">
            <Loading message="Loading PDF..." />
          </div>
        )}

        <iframe src={url} title="PDF Viewer" className="w-full h-full" onLoad={handleIframeLoad} style={{ visibility: isLoading ? "hidden" : "visible" }} />
      </div>
    </>
  );
}

export default PDFEmbed;
