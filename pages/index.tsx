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
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import storage from "../firebase";
import Link from "next/link";
import Nav from "../components/Nav";
import { message, Progress } from "antd";

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
      message.error(err.message);
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(window.location.origin + `/file/${uploadedFileId}`);
    message.success("Copied Url")
  };

  return (
    <div>
      <Nav />

      {!uploadedFileId && !uploading && (
        <div {...getRootProps()} className="flex flex-col min-h-96 items-center  justify-center border-dotted border-2 w-screen max-w-lg mx-auto m-5 p-5 rounded-md">
          <IoFolderOpenOutline size={40} className="mb-3"/>
          <input {...getInputProps()} />
          <span className="text-sm flex gap-1"><p className="underline text-blue-500 hover:cursor-pointer">Browse</p> or drop file here</span>
        </div>
      )}

      {uploading &&  <Progress className="flex justify-center mt-10" type="circle" percent={progress} />}

      {uploadedFileId && (
        <div className="flex flex-col items-center justify-center border-dotted border-2 w-screen max-w-lg mx-auto m-5 p-5 h-full rounded-md">
          <IoHappyOutline size={50} className="mb-3"/>
          <p className="text-sm">
            File has been uploaded.
            You can share it with the link below.
          </p>
          <div>
            <Link href={`/file/${uploadedFileId}`}>
              <a className="ml-10 underline hover:text-blue-500 text-md flex items-center gap-2 mt-3" >
                <IoOpenOutline size={15} />
                {typeof window !== "undefined" ? window?.origin + "/file/" + uploadedFileId : " "}
              </a>
            </Link>

            <section className="flex items-center gap-3 mt-5 ml-5">
              <button onClick={copyLinkToClipboard} className="flex items-center gap-2 border border-violet-500 rounded-md py-2 px-3">
                <IoReaderOutline />
                Copy link
              </button>
              <button onClick={() => setUploadedFileId("")} className="flex items-center gap-2 border border-violet-500 rounded-md py-2 px-3">
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
