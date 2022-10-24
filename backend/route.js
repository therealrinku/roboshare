const router = require("express").Router();
const storage = require("./firebase");
const multer = require("multer");
const {readFileSync} = require("node:fs");
const {ref, getDownloadURL, uploadBytesResumable} = require("firebase/storage")
const db = require("./db");
const uniqid = require("uniqid");
const upload = multer({dest: "uploads/"})

router.get("/getFile/:fileId", (req, response) => {
    const { fileId } = req.params;

    try {
        const query = `SELECT file_name,file_location from files WHERE file_id::text = '${fileId}'::text`;
        db.query(query).then(res => response.status(200).json({success: true,fileName:res.rows[0]?.file_name, fileLocation: res.rows[0]?.file_location}))
    } catch (err) {
        response.status(200).json({success: false, message: err.message})
    }
})

router.post("/uploadFile", upload.single("file"), ({file}, response) => {
    try {
        const storageRef = ref(storage, `files/${file.originalname}`);
        const uploadTask = uploadBytesResumable(storageRef, readFileSync(file.path), {contentType: file.mimetype});

        uploadTask.on("state_changed", (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                console.log(progress, "progress")
            }, (error) => {
                console.log("error");
            }, () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    const query = `INSERT INTO files(file_name,file_id,file_location) VALUES ('${file.originalname}','${uniqid()}','${downloadURL}') returning file_id`
                    db.query(query).then(res => response.status(200).json({success: true, fileId: res.rows[0]?.file_id}))
                });
            }
        );
    } catch (err) {
        response.status(200).json({success: false, message: err.message})
    }
});

module.exports = router;
