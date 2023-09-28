import { Button, Input } from "antd";
import Head from "next/head";
import { useState } from "react";
import { FiExternalLink, FiFile, FiMeh } from "react-icons/fi";

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

  const apiUrl = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://arcshare.vercel.app";

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
        <title>Download File | Arcshare</title>
        <meta property="og:image" content={image} />
      </Head>

      {!fileData?.fileLocation && (
        <div className="flex flex-col min-h-60 py-32 items-center justify-start">
          <Input
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            className="w-72 mt-0 rounded-none w-72"
            placeholder="Full File Url"
          />
          <Button
            loading={fetching}
            onClick={fetchFile}
            disabled={!fileUrl.trim() || fetching}
            className="disabled:opacity-75 bg-green-500 mt-3 text-sm rounded-none w-72 hover:bg-green-600 text-white"
            type="ghost"
          >
            {fetching ? "Retrieving File" : " Retrieve File"}
          </Button>
        </div>
      )}

      {fileData && (
        <div className="flex flex-col min-h-60 py-32 items-center justify-center">
          {fileData?.fileLocation ? <FiFile size={50} /> : <FiMeh size={50} />}
          <p className="text-sm mt-5">
            {fileData?.fileLocation ? "Your file is ready." : "Whooops! File not found. Make sure url is correct."}
          </p>
          {fileData?.fileLocation && (
            <a
              className="text-sm text-green-500 flex items-center gap-2 text-md hover:text-green-600 hover:cursor-pointer hover:underline"
              target="_blank"
              rel="noreferrer"
              href={fileData?.fileLocation}
              download={fileData?.fileName}
            >
              <FiExternalLink size={16} />
              <p>{fileData?.fileName}</p>
            </a>
          )}
          <Button
            type="ghost"
            className="text-sm mt-5 bg-green-500 hover:bg-green-600 text-white font-inherit rounded-none"
            onClick={() => setFileData()}
          >
            Download Another File
          </Button>
        </div>
      )}
    </div>
  );
}
