import { useState, useCallback } from "react";
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
import { FiFile } from "react-icons/fi";

export default function Home() {
  const [uploadedFileId, setUploadedFileId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile]: any = useState();

  const onDrop = useCallback((acceptedFiles: any) => {
    const file = acceptedFiles[0];
    setSelectedFile(file);

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
        (error) => message.error(error.message),
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
    message.success("Copied Url");
  };

  return (
    <div>
      <Nav />

      {!uploadedFileId && !uploading && (
        <div
          {...getRootProps()}
          className="flex flex-col min-h-60 max-w-screen-lg w-5/6 py-32 items-center  justify-center border-dotted border-2 border-violet-500 w-screen mx-auto m-5 p-5 rounded-md"
        >
          <IoFolderOpenOutline size={40} className="mb-3" />
          <input {...getInputProps()} />
          <span className="text-sm flex gap-1 text-lg mt-5">
            <p className="text-blue-500 hover:cursor-pointer">Browse</p> or drop file here
          </span>
        </div>
      )}

      {uploading && (
        <div className="flex flex-col min-h-60 max-w-screen-lg w-5/6 py-32 items-center  justify-center border-dotted border-2 w-screen mx-auto m-5 p-5 rounded-md">
          {selectedFile && (
            <p className="flex gap-2 items-center">
              <FiFile />
              {selectedFile?.name}
            </p>
          )}
          <Progress
            strokeColor="violet"
            className="w-inherit flex justify-center mt-12"
            type="dashboard"
            percent={progress}
          />
        </div>
      )}

      {uploadedFileId && (
        <div className="flex flex-col min-h-60 max-w-screen-lg w-5/6 py-32 items-center justify-center border-dotted border-violet-500 border-2 mx-auto m-5 p-5 rounded-md">
          <IoHappyOutline size={50} className="mb-3" />
          <p className="text-sm">File has been uploaded. You can share it with the link below.</p>
          <div>
            <Link href={`/file/${uploadedFileId}`}>
              <a className="ml-12 text-blue-500 hover:text-blue-500 text-md flex items-center gap-2 mt-3">
                <IoOpenOutline size={15} />
                {typeof window !== "undefined" ? window?.origin + "/file/" + uploadedFileId : " "}
              </a>
            </Link>

            <section className="flex items-center gap-3 mt-5 ml-5">
              <button
                onClick={copyLinkToClipboard}
                className="flex text-sm items-center gap-2 border border-violet-500 rounded-md py-2 px-3 hover:border-violet-800"
              >
                <IoReaderOutline size={18}/>
                Copy link
              </button>
              <button
                onClick={() => setUploadedFileId("")}
                className="flex text-sm items-center gap-2 border border-violet-500 rounded-md py-2 px-3 hover:border-violet-800"
              >
                <IoArrowUpCircleOutline size={18}/>
                Upload another
              </button>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
