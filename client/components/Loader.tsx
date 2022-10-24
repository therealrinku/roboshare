import styles from "../styles/Loader.module.css";
import {useEffect,useState} from "react";

export default function Loader(){
    return <div className={styles.loader}><div></div><div></div><div></div><div></div></div>
}