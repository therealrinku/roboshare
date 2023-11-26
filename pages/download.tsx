import { Button, Input } from "antd";
import Head from "next/head";
import { useState } from "react";
import { FiExternalLink, FiFile, FiMeh } from "react-icons/fi";
import { MdDoNotDisturb, MdDownload, MdDownloading, MdOutlineFileDownloadDone } from "react-icons/md";

interface Props {
  fileData: {
    fileLocation: string;
    fileName: string;
  };
  title: any;
  image: any;
}

export default function FileDownloadPage({ title, image }: Props) {
  const [fileUrl, setFileUrl] = useState("");
  const [fetching, setFetching] = useState(false);
  const [fileData, setFileData]: any = useState();

  const apiUrl = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://Roboshare.vercel.app";

  const fetchFile = async () => {
    const fileId = fileUrl.slice(fileUrl.indexOf("file/") + 5);
    setFetching(true);
    const data = await fetch(`${apiUrl}/api/getFile/${fileId}`).then((res) => res.json());
    setFileData(data);
    setFileUrl("");
    setFetching(false);
  };

  return (
    <div>
      <Head>
        <title>Download File | Roboshare</title>
        <meta property="og:image" content={image} />
      </Head>

      {!fileData && (
        <div className="flex min-h-60 py-32 items-center justify-center">
          <input
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            className="w-72 mt-0 text-sm rounded-none w-72 border outline-none pr-4 pl-2 py-[5px] border-r-0"
            placeholder="Full file url"
            disabled={fetching}
          />
          <button
            onClick={fetchFile}
            disabled={!fileUrl.trim() || fetching}
            className="flex px-3 justify-center py-[6.4px] items-center gap-1 text-sm bg-green-500 :not-disabled:hover:bg-green-600 text-white font-inherit rounded-none"
          >
            {fetching ? (
              <MdDownloading size={18} />
            ) : fileData ? (
              <MdOutlineFileDownloadDone size={18} />
            ) : (
              <MdDownload size={18} />
            )}
          </button>
        </div>
      )}

      {fileData && (
        <div className="flex flex-col min-h-60 py-32 items-center justify-center">
          {fileData?.fileLocation ? <FiFile size={50} /> : <MdDoNotDisturb size={50} />}

          <p className="text-sm mt-5">
            {fileData?.fileLocation ? "Your file is ready." : "Whooops! File not found. Make sure url is correct."}
          </p>

          {fileData?.fileLocation && (
            <a
              className="text-sm mt-2 mb-3 text-green-500 flex items-center gap-1 text-md hover:text-green-600 hover:cursor-pointer hover:underline"
              target="_blank"
              rel="noreferrer"
              href={fileData?.fileLocation}
              download={fileData?.fileName}
            >
              <FiExternalLink size={16} />
              <p className="mt-3">{fileData?.fileName || "doo"}</p>
            </a>
          )}

          <button
            className="flex px-4 py-[5px] mt-3 items-center gap-1 text-sm bg-green-500 hover:bg-green-600 text-white font-inherit rounded-none"
            onClick={() => setFileData()}
          >
            Download another file
          </button>
        </div>
      )}
    </div>
  );
}
