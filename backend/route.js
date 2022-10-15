const router = require("express").Router();
const storage = require("./firebase");
const multer = require("multer");
const {readFileSync} = require("node:fs");
const {ref, getDownloadURL, uploadBytesResumable} = require("firebase/storage")
const db = require("./db");

const upload = multer({dest: "uploads/"})

router.post("/uploadFile", upload.single("file"), ({file}, response) => {
    try {
        const storageRef = ref(storage, `files/${file.originalname}`);
        const uploadTask = uploadBytesResumable(storageRef, readFileSync(file.path), {contentType: file.mimetype});

        uploadTask.on("state_changed", (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                console.log(progress, "progress")
            }, (error) => {
                alert(error);
            }, () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    const query = `INSERT INTO files(file_location) VALUES ('${downloadURL}') returning file_id`
                    db.query(query).then(res => response.status(200).json({success: true, fileId: res.rows[0]?.file_id}))
                });
            }
        );
    } catch (err) {
        response.status(200).json({success: false, message: err.message})
    }
});

module.exports = router;
