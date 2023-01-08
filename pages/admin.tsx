import { useEffect, useState } from "react";
import { FiExternalLink, FiLogOut, FiRefreshCw, FiTrash, FiUnlock } from "react-icons/fi";
import { ref, listAll, getDownloadURL, deleteObject } from "firebase/storage";
import storage from "../firebase";
import { message, Skeleton } from "antd";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
  const [files, setFiles]: any = useState([]);
  const [loading, setLoading] = useState(true);

  const logIn = () => {
    if (password === process.env.adminPassword) {
      setIsAuthenticated(true);
      setIsPasswordInvalid(false);
    } else {
      setIsPasswordInvalid(true);
    }
  };

  const getFiles = async () => {
    setLoading(true);
    const storageRef = ref(storage, "files/");
    const filesList: any = await listAll(storageRef);
    const data: any = [];
    for (let file of filesList.items) {
      const storageRef = ref(storage, file?._location?.path_);
      const url = await getDownloadURL(storageRef).then((url) => url);
      data.push({ fileName: file?._location?.path_?.replace("files/", ""), url });
    }
    setFiles(data);
    setLoading(false);
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
          fetch(`/api/deleteFile`, {
            method: "POST",
            body: JSON.stringify({ fileUrl: fileLocation }),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then(() => {
              message.success("Successfully deleted the file!");
              getFiles();
            })
            .catch((err) => message.error(err.message));
        })
        .catch((err) => message.error(err.message));
    }
  };

  return (
    <div className="w-screen px-10 max-w-screen-md mx-auto">
      {!isAuthenticated && (
        <div className="flex flex-col justify-center items-center h-screen">
          <section className="flex items-center h-10 mt-3 gap-2">
            <input
              className="border-2 h-full px-2 focus:border-violet-500 rounded-md outline-none"
              type="password"
              placeholder="Type access password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <button className="bg-violet-500 hover:bg-violet-600 text-white h-full px-5 rounded-md" onClick={logIn}>
              <FiUnlock />
            </button>
          </section>

          {isPasswordInvalid && <p className="mt-5 text-sm text-red-500">Invalid password, try again : )</p>}
        </div>
      )}

      {loading && <Skeleton className="my-10" active />}

      {isAuthenticated && !loading && (
        <div>
          <section className="flex items-center my-5 gap-3">
            <h5 className="my-2 font-bold">Total {files.length} files</h5>

            <button onClick={getFiles} className="flex items-center gap-2 rounded-md hover:text-violet-500">
              <FiRefreshCw size={18} />
            </button>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setPassword("");
              }}
              className="flex items-center gap-2 rounded-md hover:text-red-500"
            >
              <FiLogOut size={18} />
            </button>
          </section>

          {files.length && (
            <section>
              {files.map((file: any, i: number) => {
                return (
                  <div className="flex items-center gap-2 mb-3 border rounded-md p-2 justify-between" key={i}>
                    <a
                      className="text-sm max-w-75 truncate hover:text-blue-500"
                      rel="noreferrer"
                      href={file.url}
                      target="_blank"
                    >
                      {file.fileName}
                    </a>

                    <section className="flex gap-2">
                      <a
                        className="border border-violet-500 rounded-md p-2 hover:text-violet-700"
                        rel="noreferrer"
                        href={file.url}
                        target="_blank"
                      >
                        <FiExternalLink />
                      </a>
                      <button
                        className="border border-red-500 rounded-md p-2 text-red-500 hover:text-red-700"
                        onClick={() => onDelete(file.url)}
                      >
                        <FiTrash />
                      </button>
                    </section>
                  </div>
                );
              })}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
