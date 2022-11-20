import styles from "../styles/Loader.module.css";

export default function Loader({ progress }: any) {
  return (
    <>
      <div className={styles.loader}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p style={{ color: "white   " }}>Uploading...{progress + "%"}</p>
    </>
  );
}
