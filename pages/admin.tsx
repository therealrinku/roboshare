import { useEffect, useState } from "react";
import { AiFillLock } from "react-icons/ai";
import styles from "../styles/Admin.module.css";
import { ref, listAll, getDownloadURL, deleteObject } from "firebase/storage";
import storage from "../firebase";

const url = process.env.NODE_ENV !== "production" ? process.env.localUrl : process.env.productionUrl;

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
  const [files, setFiles]: any = useState([]);

  const logIn = () => {
    if (password === process.env.adminPassword) {
      setIsAuthenticated(true);
      setIsPasswordInvalid(false);
    } else {
      setIsPasswordInvalid(true);
    }
  };

  const getFiles = async () => {
    const storageRef = ref(storage, "files/");
    const filesList: any = await listAll(storageRef);
    const data: any = [];
    for (let file of filesList.items) {
      const storageRef = ref(storage, file?._location?.path_);
      const url = await getDownloadURL(storageRef).then((url) => url);
      data.push({ fileName: file?._location?.path_?.replace("files/", ""), url });
    }
    setFiles(data);
  };

  useEffect(() => {
    if (isAuthenticated) {
      getFiles();
    }
  }, [isAuthenticated]);

  const onDelete = (fileLocation: string) => {
    const answer = confirm("Are you sure?");
    if (answer) {
      deleteObject(ref(storage, fileLocation))
        .then(() => {
          fetch(`${url}/api/deleteFile`, {
            method: "POST",
            body: JSON.stringify({ fileUrl: fileLocation }),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then(() => {
              alert("Successfully deleted the file!");
              getFiles();
            })
            .catch((err) => alert(err.message));
        })
        .catch((err) => alert(err.message));
    }
  };

  return (
    <div className={styles.AdminPage}>
      {!isAuthenticated && (
        <div>
          <h5>
            <AiFillLock size={25} />
            <p>Admin Panel</p>
          </h5>
          <input
            type="password"
            placeholder="Type access password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button onClick={logIn}>Log In</button>
          {isPasswordInvalid && <p style={{ color: "red", fontSize: "15px" }}>Invalid password, try again : )</p>}
        </div>
      )}

      {isAuthenticated && (
        <div>
          <h5 style={{ marginBottom: "20px" }}>Admin Panel</h5>
          {files.map((file: any, i: number) => {
            return (
              <div style={{ display: "flex", alignItems: "center", fontSize: "15px" }} key={i}>
                <span>#{i + 1} - </span>
                <p style={{ marginLeft: "10px" }}>{file.fileName}</p>
                <a href={file.url} target="_blank" style={{ color: "Blue", marginLeft: "10px" }}>
                  Link
                </a>
                <button
                  onClick={() => onDelete(file.url)}
                  style={{ border: "none", marginLeft: "0px", background: "inherit", color: "red", marginTop: "0px" }}
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
