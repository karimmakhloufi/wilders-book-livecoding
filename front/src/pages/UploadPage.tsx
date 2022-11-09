import { useState } from "react";
import axios from "axios";

const UploadPage = () => {
  const [file, setFile] = useState<File>();
  console.log("file", file);
  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        if (file) {
          const url = "http://localhost:8000/upload";
          const formData = new FormData();
          formData.append("file", file, file.name);
          try {
            const response = await axios.post(url, formData);
            console.log(response);
          } catch (err) {
            console.log("error", err);
          }
        } else {
          alert("select a file to upload");
        }
      }}
    >
      <h1>React File Upload</h1>
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            setFile(e.target.files[0]);
          }
        }}
      />
      <button type="submit">Upload</button>
    </form>
  );
};

export default UploadPage;
