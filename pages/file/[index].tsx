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
      <h4>Arcshare</h4>
      <div>{fileData.fileLocation ? "Your file is ready!!" : "Ooops! File not found! Make sure url is correct."}</div>

      {fileData.fileLocation && (
        <div className={styles.downloadSection}>
          <a target="_blank" rel="noreferrer" href={fileData.fileLocation} download={fileData.fileName}>
            <img src="https://img.icons8.com/windows/2x/download.png" alt="download_icon" />
            {fileData.fileName}
          </a>
        </div>
      )}
    </div>
  );
}

export const getServerSideProps = async (context: any) => {
  const fileId = context.params.index;
  const url = process.env.NODE_ENV !== "production" ? process.env.localUrl : process.env.productionUrl;
  const data = await fetch(`${url}/api/getFile/${fileId}`).then((res) => res.json());

  return {
    props: {
      fileData: data,
    },
  };
};
