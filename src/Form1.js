import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Form1 = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    axios.get('http://localhost:8180/')
      .then(res => {
        setData(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('image', file);

    axios.post('http://localhost:8180/upload', formData)
      .then(res => {
        if (res.data.Status === "Success") {
          console.log("Uploaded successfully");
          // Refresh data after upload
          axios.get('http://localhost:8180/')
            .then(res => {
              setData(res.data);
            })
            .catch(err => console.log(err));
        } else {
          console.log("Upload failed");
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <div className='container1'>
      <input type="file" onChange={handleFile} />
      <button onClick={handleUpload}>Upload</button>
      <br />
      {/* Render each image */}
      {data.map((item, index) => (
        <div key={index} className="card">
          <img src={`http://localhost:8180/images/${item.img}`} alt="uploaded" className="card-image" />
          <div className="card-content">
          {/* Additional content or text can go here */}
        </div>
      </div>
))}
    </div>
  );
};

export default Form1;
