import type {NextPage} from 'next'
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import styles from "../styles/Home.module.css";

export default function fileDownloadPage<NextPage>() {
    const [loading, setLoading] = useState(true);
    const [fileData, setFileData] = useState({
        fileName: "",
        fileLocation: ""
    })

    const fileID = useRouter().query.index;

    useEffect(() => {
        if (fileID) {
            try {
                fetch(`http://localhost:5000/getFile/${fileID}`).then(res => res.json()).then(data => {
                    setFileData(data)
                    setLoading(false)
                })
            } catch (err) {
                alert(err.message)
            }
        }
    }, [fileID])

    return <div className={styles.container}>
        <h4>Arcshare</h4>
        <p>
            {loading ? "Loading...." : fileData.fileLocation
                ? "Your file is ready!!" : "Ooops! File not found! Make sure url is correct."}
        </p>

        {!loading && fileData.fileLocation && <div className={styles.downloadSection}>
            <a target="_blank" href={fileData.fileLocation} download={fileData.fileName}>
                <img src="https://img.icons8.com/windows/2x/download.png" alt="download_icon"/>{fileData.fileName}
            </a>
        </div>}
    </div>
}