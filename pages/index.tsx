import styles from "../styles/Home.module.css";
import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import {
  IoFolderOpenOutline,
  IoArrowUpCircleOutline,
  IoHappyOutline,
  IoOpenOutline,
  IoReaderOutline,
} from "react-icons/io5";
import { useDropzone } from "react-dropzone";
import Loader from "../components/Loader";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import storage from "../firebase";
import Link from "next/link";
import Nav from "../components/Nav";

export default function Home() {
  const [uploadedFileId, setUploadedFileId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: any) => {
    const file = acceptedFiles[0];

    try {
      setUploading(true);
      const storageRef = ref(storage, `files/${file.name.replaceAll("'", "")}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(progress);
        },
        (error) => console.log(error, "something went fishy."),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            const data = {
              downloadUrl: downloadURL,
              fileName: file.name.replaceAll("'", ""),
            };

            fetch(`/api/addFileToDb`, {
              method: "POST",
              body: JSON.stringify(data),
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((res) => res.json())
              .then((data: { fileId: string }) => {
                setUploadedFileId(data.fileId);
                setUploading(false);
              });
          });
        }
      );
    } catch (err: any) {
      alert(err.message);
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(window.location.origin + `/file/${uploadedFileId}`);
    alert("Copied file url!");
  };

  return (
    <div className={styles.container}>
      <Nav />

      {!uploadedFileId && !uploading && (
        <div {...getRootProps()} className={styles.dropzone}>
          <IoFolderOpenOutline color="white" size={50} />
          <input {...getInputProps()} />
          <span>Click here to select file or simply drop file</span>
        </div>
      )}

      {uploading && <Loader progress={progress} />}

      {uploadedFileId && (
        <div className={styles.uploadedView}>
          <IoHappyOutline color="white" size={50} />
          <p>
            Hurray file has been uploaded.
            <br />
            You can share it with the link below.
          </p>
          <div>
            <Link href={`/file/${uploadedFileId}`}>
              <a className={styles.underline}>
                <IoOpenOutline color="white" size={15} style={{ marginBottom: "-2px", marginRight: "5px" }} />
                {typeof window !== "undefined" ? window?.origin + "/file/" + uploadedFileId : " "}
              </a>
            </Link>

            <section style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "20px" }}>
              <button onClick={copyLinkToClipboard}>
                <IoReaderOutline />
                Copy link
              </button>
              <button onClick={() => setUploadedFileId("")}>
                <IoArrowUpCircleOutline />
                Upload another
              </button>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
