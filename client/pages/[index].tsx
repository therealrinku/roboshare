import {useState} from "react";
import {useRouter} from "next/router";

export default function fileDownloadPage(){
    const [loading,setLoading]=useState(true);
    const router = useRouter();

    console.log(router.query.index)




    return <>
      <p>{router.query.index}</p>
    </>
}