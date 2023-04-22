import { Button } from "antd";
import Head from "next/head";
import { useRouter } from "next/router";
import { FiExternalLink, FiFile, FiMeh } from "react-icons/fi";
interface Props {
  fileData: {
    fileLocation: string;
    fileName: string;
  };
}

export default function FileDownloadPage({ fileData }: Props) {
  const router = useRouter();
  return (
    <div>
      <Head>
        <title>{fileData?.fileName}</title>
      </Head>

      <div className="flex flex-col min-h-60 py-32 items-center justify-center ">
        {fileData?.fileLocation ? <FiFile size={50} /> : <FiMeh size={50} />}

        <p className="text-sm mt-5">
          {fileData?.fileLocation ? "Your file is ready." : "Whooops! File not found. Make sure url is correct."}
        </p>

        {fileData?.fileLocation && (
          <a
            className="mt-5 flex items-center text-sm text-blue-500 flex items-center gap-3 text-md hover:text-blue-700 hover:cursor-pointer hover:underline"
            target="_blank"
            rel="noreferrer"
            href={fileData?.fileLocation}
            download={fileData?.fileName}
          >
            <FiExternalLink size={18} />
            <p>{fileData?.fileName}</p>
          </a>
        )}

        <Button type="primary" className="text-sm mt-5 bg-blue-500" onClick={() => router.push("/download")}>
          Download Another File
        </Button>
      </div>
    </div>
  );
}

export const getServerSideProps = async (context: any) => {
  const fileId = context.params.index;
  const apiUrl = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://arcshare.vercel.app";
  const data = await fetch(`${apiUrl}/api/getFile/${fileId}`).then((res) => res.json());

  return {
    props: {
      fileData: data,
    },
  };
};
