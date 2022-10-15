const fileInput = document.getElementsByTagName("input")[0];

const submitButton = document.getElementsByTagName("button")[0];

submitButton.addEventListener("click", () => {
    const file = fileInput.files[0];

    const data = new FormData();
    data.append('file',file)

    if (file) {
        fetch("http://localhost:3000/uploadFile", {
            method: "POST",
            body: data,
//            headers: {
//                "Content-Type": "multipart/form-data",
//            },
        })
            .then((res) => res.json())
            .then((data) => console.log(data));
    } else {
        alert("no file selected");
    }
});
