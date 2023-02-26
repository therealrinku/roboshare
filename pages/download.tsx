import { Button, Input, Tooltip } from "antd";
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
    setFileUrl("")
    setFetching(false);
  };

  return (
    <div>
      <Head>
        <title>Download File | Arcshare</title>
        <meta property="og:image" content={image} />
      </Head>

      {(!fileData?.fileLocation) && (
        <div className="flex flex-col min-h-60 py-32 items-center justify-start">
          <Tooltip title="Type full url like: https://arcshare.vercel.app/file/399dj">
            <Input
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              className="w-72 mt-0"
              placeholder="Full File Url"
            />
          </Tooltip>
          <Button
            loading={fetching}
            onClick={fetchFile}
            disabled={!fileUrl.trim() || fetching}
            className="bg-blue-500 mt-3 text-sm"
            type="primary"
          >
            {fetching ? "Retrieving File" : " Retrieve File"}
          </Button>
        </div>
      )}

      { fileData && (
        <div className="flex flex-col min-h-60 py-32 items-center justify-center">
          {fileData?.fileLocation ? <FiFile size={50} /> : <FiMeh size={50} />}
          <p className="text-sm mt-5">
            {fileData?.fileLocation ? "Your file is ready." : "Whooops! File not found. Make sure url is correct."}
          </p>
          {fileData?.fileLocation && (
            <a
              className="mt-5 text-sm text-blue-500 flex items-center gap-3 text-md hover:text-blue-700 hover:cursor-pointer hover:underline"
              target="_blank"
              rel="noreferrer"
              href={fileData?.fileLocation}
              download={fileData?.fileName}
            >
              <FiExternalLink size={18} />
              <p>{fileData?.fileName}</p>
            </a>
          )}
          <Button type="primary" className="text-sm mt-5 bg-blue-500" onClick={() => setFileData()}>
            Download Another File
          </Button>
        </div>
      )}
    </div>
  );
}
