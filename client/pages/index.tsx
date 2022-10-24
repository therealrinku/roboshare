import type {NextPage} from 'next'
import styles from '../styles/Home.module.css'
import {useState, useCallback, useEffect} from "react";
import {useRouter} from "next/router";
import {AiOutlineFileAdd} from "react-icons/ai";
import {useDropzone} from 'react-dropzone'
import Loader from "../components/Loader";

export default function Home<NextPage>() {
    const [uploadedFileId, setUploadedFileId] = useState('');
    const [uploading,setUploading]=useState(false);
    const router = useRouter()

    const onDrop = useCallback((acceptedFiles:any) => {
        const file = acceptedFiles[0];
        const data = new FormData()
        data.append("file", file)

        try {
            setUploading(true)
            fetch("https://ar3share.herokuapp.com/uploadFile", {
                method: "POST",
                body: data,
            })
                .then((res) => res.json())
            .then((data: { fileId: string }) => {
                setUploadedFileId(data.fileId);
                setUploading(false);
            });
        } catch (err:any) {
            alert(err.message)
            setUploading(false)
        }

    }, [])

    const {getRootProps, getInputProps} = useDropzone({onDrop})

    const copyLinkToClipboard = () => {
        navigator.clipboard.writeText(window.location.origin + `/file/${uploadedFileId}`);
        alert("Copied file url!")
    }

    return (
        <div className={styles.container}>
            <h4>Arcshare</h4>
            <p>Upload and share files anywhere instantly.</p>

            {!uploadedFileId && !uploading && <div {...getRootProps()} className={styles.dropzone}>
                <AiOutlineFileAdd size={50  }/>
                <input {...getInputProps()} />
                <span>Click here to select file or simply drop file</span>
            </div>
            }

            {uploading && <Loader/>}

            {uploadedFileId && <div className={styles.uploadedView}>
                <p style={{color:"green"}}>Hooray! Your file is uploaded.</p>
                <p>You can share it with this link below.</p>
                <button onClick={() => router.push(`/file/${uploadedFileId}`)}>{window.origin}/file/{uploadedFileId}</button>
                <button onClick={copyLinkToClipboard}>Copy</button>

            </div>
            }
        </div>
    )
}
