import Head from "next/head";
import { Fragment, useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import { MdDownload, MdDownloading, MdOutlineFileDownloadDone } from "react-icons/md";
import { apiUrl } from "../constants";
import QRCode from "react-qr-code";

async function fetchFile(fileId: string) {
  if (!fileId) {
    return null;
  }

  const data = await fetch(`${apiUrl}/api/getFile/${fileId}`).then((res) => res.json());
  return data;
}

interface Props {
  fetchedFileData: {
    fileLocation: string;
    fileName: string;
  };
}

export default function FileDownloadPage({ fetchedFileData }: Props) {
  const [fileUrl, setFileUrl] = useState("");
  const [fetching, setFetching] = useState(false);
  const [fileData, setFileData]: any = useState(fetchedFileData);

  async function getFile() {
    const fileId = fileUrl.slice(fileUrl.indexOf("?"))?.split("=")?.[1];
    setFetching(true);
    const fileData = await fetchFile(fileId);
    setFileData(fileData);
    setFileUrl("");
    setFetching(false);
  }

  return (
    <Fragment>
      {/* don't have file */}
      {!fileData && (
        <Fragment>
          <Head>
            <title>Download | Roboshare</title>
          </Head>

          <div className="flex min-h-60 py-32 items-center justify-center">
            <input
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              className="w-72 truncate mt-0 text-sm rounded-none w-72 border outline-none pr-4 pl-2 py-[5px] border-r-0"
              placeholder="Full file url"
              disabled={fetching}
            />

            <button
              onClick={getFile}
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
        </Fragment>
      )}

      {/* have file */}
      {fileData && (
        <Fragment>
          <Head>
            <title>{fileData.fileName}</title>
          </Head>

          <div className="flex flex-col min-h-60 py-32 items-center justify-center ">
            <p className="text-sm">Your file is ready!</p>

            <div className="my-5 flex justify-center">
              <QRCode value={fileUrl} />
            </div>

            <a
              className="mt-5 flex items-center text-sm text-green-500 flex items-center gap-2 text-md hover:text-green-600 hover:cursor-pointer hover:underline"
              target="_blank"
              rel="noreferrer"
              href={fileData.fileLocation}
              download={fileData.fileName}
            >
              <FiExternalLink className="mb-4" size={16} />
              <p className="max-w-[300px] truncate">{fileData.fileName}</p>
            </a>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}

export const getServerSideProps = async (context: any) => {
  const { file_id } = context.query;

  const data = await fetchFile(file_id);

  return {
    props: {
      fetchedFileData: data,
    },
  };
};
