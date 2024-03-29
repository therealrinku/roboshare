import { useState, useCallback, Fragment } from "react";
import { IoArrowUpCircleOutline, IoReaderOutline } from "react-icons/io5";
import { useDropzone } from "react-dropzone";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import storage from "../firebase";
import { FiFile, FiHardDrive } from "react-icons/fi";
import QRCode from "react-qr-code";
import Loader from "../components/Loader";
import { MdOutlineQrCodeScanner } from "react-icons/md";
import Message from "../components/Message";

export default function Home() {
  const [uploadedFileId, setUploadedFileId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile]: any = useState();
  const [message, setMessage] = useState("");
  const [showQR, setShowQR] = useState(false);

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
        (error) => setMessage(error.message),
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
      setMessage(err.message);
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(window.location.origin + `/download?file_id=${uploadedFileId}`);
    setMessage("Copied file link successfully");
  };

  return (
    <Fragment>
      {/* step1: upload view */}
      {!uploadedFileId && !uploading && (
        <div
          {...getRootProps()}
          className="flex h-full flex-col min-h-60 max-w-screen-lg py-32 items-center  justify-center"
        >
          <FiFile size={50} className="mb-3" />
          <input {...getInputProps()} />
          <span className="text-sm flex gap-1 mt-5">
            <p className="text-green-500 hover:cursor-pointer">Open</p> or drop file here.
          </span>
        </div>
      )}

      {/* step2: upload progress view */}
      {uploading && (
        <div className="flex flex-col min-h-60 py-32 items-center justify-center">
          {selectedFile && (
            <p className="flex gap-2 items-center text-sm">
              <FiFile />
              {selectedFile?.name}
            </p>
          )}
          <Loader progress={progress} />
        </div>
      )}

      {/* step3: upload success view */}
      {uploadedFileId && (
        <div className="flex flex-col py-10 items-center ">
          <FiHardDrive size={50} />
          <p className="mt-5 mb-7 text-sm">File has been uploaded successfully.</p>

          <section className="flex flex-col md:flex-row justify-center items-center gap-3">
            <div className="flex items-center">
              <button
                onClick={copyLinkToClipboard}
                className="flex px-4 py-[5px] items-center gap-1 text-sm bg-green-500 hover:bg-green-600 text-white font-inherit rounded-none"
              >
                <IoReaderOutline size={18} />
                Copy link
              </button>
              <button
                onClick={() => setShowQR((prev) => !prev)}
                className="flex px-3 border-l py-[6px] items-center gap-1 text-sm bg-green-500 hover:bg-green-600 text-white font-inherit rounded-none"
              >
                <MdOutlineQrCodeScanner size={18} />
              </button>
            </div>

            <button
              onClick={() => setUploadedFileId("")}
              className="flex px-4 py-[5px] items-center gap-1 text-sm bg-green-500 hover:bg-green-600 text-white font-inherit rounded-none"
            >
              <IoArrowUpCircleOutline size={18} />
              Upload another file
            </button>
          </section>

          {showQR && (
            <div className="my-10 flex justify-center">
              <QRCode value={`https://roboshare.vercel.app/download?file_id=${uploadedFileId}`} />
            </div>
          )}
        </div>
      )}

      <Message message={message} />
    </Fragment>
  );
}
