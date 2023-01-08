import { IoDownloadOutline } from "react-icons/io5";
import Nav from "../../components/Nav";
import styles from "../../styles/Home.module.css";

interface Props {
  fileData: {
    fileLocation: string;
    fileName: string;
  };
}

export default function FileDownloadPage({ fileData }: Props) {
  return (
    <div className={styles.container}>
      <Nav />

      <div className={styles.downloadSection}>
        <p>{fileData.fileLocation ? "Your file is ready!!" : "Ooops! File not found! Make sure url is correct."}</p>

        {fileData.fileLocation && (
          <a target="_blank" rel="noreferrer" href={fileData.fileLocation} download={fileData.fileName}>
            <IoDownloadOutline size={20} />
            <p>{fileData.fileName}</p>
          </a>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps = async (context: any) => {
  const fileId = context.params.index;
  const data = await fetch(`/api/getFile/${fileId}`).then((res) => res.json());

  return {
    props: {
      fileData: data,
    },
  };
};
