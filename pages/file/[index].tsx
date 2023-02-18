import Head from "next/head";
import { FiExternalLink } from "react-icons/fi";
import Nav from "../../components/Nav";

interface Props {
  fileData: {
    fileLocation: string;
    fileName: string;
    
  };
  title:string;
  image:string;
}

export default function FileDownloadPage({ fileData,title,image }: Props) {
  return (
    <div >
      <Head>
        <title>{title}</title>
        <meta
        property="og:image"
        content={image}
      />
      </Head>
      <Nav />

      <div  className="flex flex-col min-h-60 max-w-screen-lg w-5/6 py-32 items-center justify-center border-dotted border-2 mx-auto m-5 p-5 rounded-md">
        <p className="text-md">{fileData?.fileLocation ? "Your file is ready!!" : "Ooops! File not found! Make sure url is correct."}</p>

        {fileData?.fileLocation && (
          <a className="mt-5 text-sm text-blue-500 flex items-center gap-3 text-md hover:text-blue-700 hover:cursor-pointer hover:underline" target="_blank" rel="noreferrer" href={fileData?.fileLocation} download={fileData?.fileName}>
            <FiExternalLink size={18} />
            <p>{fileData?.fileName}</p>
          </a>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps = async (context: any) => {
  const fileId = context.params.index;
  const apiUrl = process.env.NODE_ENV==="development" ? 'http://localhost:3000' : 'https://arcshare.vercel.app';
  const data = await fetch(`${apiUrl}/api/getFile/${fileId}`).then((res) => res.json());

  const dataa = await fetch(`https://jsonplaceholder.typicode.com/users/2`).then((res) => res.json());

  return {
    props: {
      fileData: data,
      image: "https://picsum.photos/200/300",
      title: dataa.name
    },
  };
};
