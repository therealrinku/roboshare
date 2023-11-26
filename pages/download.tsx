import Head from "next/head";
import { FiExternalLink, FiFile } from "react-icons/fi";
import { MdDoNotDisturb } from "react-icons/md";

interface Props {
  fileData: {
    fileLocation: string;
    fileName: string;
  };
}

export default function FileDownloadPage({ fileData }: Props) {
  return (
    <div>
      <Head>
        <title>{fileData.fileName}</title>
      </Head>

      <div className="flex flex-col min-h-60 py-32 items-center justify-center ">
        {fileData ? <FiFile size={50} /> : <MdDoNotDisturb size={50} />}

        <p className="text-sm mt-5">
          {fileData ? "Your file is ready." : "Whooops! File not found. \nMake sure url is correct."}
        </p>

        {fileData && (
          <a
            className="mt-3 flex items-center text-sm text-green-500 flex items-center gap-2 text-md hover:text-green-600 hover:cursor-pointer hover:underline"
            target="_blank"
            rel="noreferrer"
            href={fileData.fileLocation}
            download={fileData.fileName}
          >
            <FiExternalLink className="mb-3" size={17} />
            <p>{fileData.fileName}</p>
          </a>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps = async (context: any) => {
  const { file_id } = context.query;

  if (!file_id) {
    return {
      props: {
        fileData: {},
      },
    };
  }

  const apiUrl = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://roboshare.vercel.app";
  const data = await fetch(`${apiUrl}/api/getFile/${file_id}`).then((res) => res.json());

  return {
    props: {
      fileData: data ?? {},
    },
  };
};
