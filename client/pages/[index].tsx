import {useEffect, useState} from "react";
import {useRouter} from "next/router";

export default function fileDownloadPage(){
    const [loading,setLoading]=useState(true);
    const [fileData,setFileData]=useState({
        fileName:"",
        fileLocation:""
    })

    const fileID = useRouter().query.index;

    useEffect(()=>{
        if(fileID){
            fetch(`http://localhost:5000/getFile/${fileID}`).then(res=>res.json()).then(data=>{
                setFileData(data)
                setLoading(false)
            })
        }
        },[fileID])

    return <>
    {loading && <p>loading...</p>}

    {!loading && <a href={fileData.fileLocation} download="file">{fileData.fileName}</a>}
    </>
}