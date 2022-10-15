import type {NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {useState} from "react";
import Link from "next/link";

const Home: NextPage = () => {
    const [files, setFiles] = useState([]);
    const [uploadedFileId, setUploadedFileId] = useState('');

    const uploadFile = (e) => {
        e.preventDefault();

        if (files[0]) {
            const data = new FormData();
            data.append('file', files[0])

            fetch("http://localhost:5000/uploadFile", {
                method: "POST",
                body: data,
            })
                .then((res) => res.json())
                .then((data: { fileId: string }) => setUploadedFileId(data.fileId));
        }
    }

    return (
        <div className={styles.container}>
            <h4>Arcshare</h4>
            <p>Upload files and share anywhere instantly</p>

            <form encType="multipart/form-data" onSubmit={uploadFile}>
                <input type="file" onChange={(e: any) => setFiles(e.target.files)}/>
                <button type="submit">Upload</button>
            </form>

            {uploadedFileId && <>
                <p>Your file is uploaded</p>
                <p>You can access it with this link:<Link href={`/${uploadedFileId}`}>localhost:3000/{uploadedFileId}</Link>
                </p>
            </>
            }

            <br/>

        </div>
    )
}

export default Home
