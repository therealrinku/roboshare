import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { AiOutlineFileAdd } from "react-icons/ai";
import { useDropzone } from "react-dropzone";
import Loader from "../components/Loader";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import uniqid from "uniqid";
import storage from "../firebase";
import Link from "next/link";

export default function Home<NextPage>() {
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
            const url = process.env.NODE_ENV !== "production" ? process.env.localUrl : process.env.productionUrl;
            const data = {
              downloadUrl: downloadURL,
              fileName: file.name.replaceAll("'", ""),
            };

            fetch(`${url}/api/addFileToDb`, {
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
      <Link href="/">
        <a className={styles.homeLink}>Arcshare</a>
      </Link>
      <p>Upload and share files anywhere instantly.</p>

      {!uploadedFileId && !uploading && (
        <div {...getRootProps()} className={styles.dropzone}>
          <AiOutlineFileAdd size={50} />
          <input {...getInputProps()} />
          <span>Click here to select file or simply drop file</span>
        </div>
      )}

      {uploading && (
        <>
          <Loader />
          <p>{progress} %</p>
        </>
      )}

      {uploadedFileId && (
        <div className={styles.uploadedView}>
          <p style={{ color: "green" }}>Hooray! Your file is uploaded.</p>
          <p>You can share it with the link below.</p>
          <Link href={`/file/${uploadedFileId}`}>
            <a className={styles.underline}>
              {window.origin}/file/{uploadedFileId}
            </a>
          </Link>
          <button onClick={copyLinkToClipboard}>Copy</button>
        </div>
      )}
    </div>
  );
}
