import React, { useState, useEffect } from "react";
import logo from "./assets/logo.png";
import fileIcon from "./assets/file-icon.png";
import "./App.css";
import axios from "axios";

const FrontendUI = () => {
  const [phrases, setPhrases] = useState([
    "the photos",
    "the movie",
    "the project",
    "the receipts",
  ]);
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [archiveUrl, setArchiveUrl] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [phrases.length]);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const newFiles = Array.from(event.dataTransfer.files);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleSend = async () => {
    if (files.length === 0) return;
  
    setLoading(true);
  
    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));
  
    try {
      const response = await axios.post("https://sendme-d6vx.onrender.com/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      setLoading(false);
  
      if (response.status === 200) {
        console.log("Upload successful:", response.data);
        setArchiveUrl(response.data.archiveUrl || ""); // Save the link
        setUploaded(true);
      }
    } catch (error) {
      setLoading(false);
      console.error("Upload failed:", error);
      setError(true); // Show error page
    }
  };
  

  const handleLinkClick = () => {
    navigator.clipboard.writeText(archiveUrl);// Copy the link to clipboard
    setLinkCopied(true);
  };

  const resetState = () => {
    setFiles([]);
    setUploaded(false);
    setError(false);
    setLinkCopied(false);
  };

  return (
    <div className="container">
      {!uploaded && !error ? (
        <>
          <div className="section section-1">
            <div className="logo">
              <img src={logo} alt="send me" className="logo" />
            </div>
            <div className="subtitle">{phrases[currentPhrase]}</div>
          </div>
          <div className="section section-2">
            {!loading && (
              <div className="instruction">
                drag & drop the stuff you wanna send
              </div>
            )}
            <div
              className={`dropzone ${files.length > 0 ? "filled" : ""}`}
              onClick={() => document.getElementById("file-input").click()}
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
            >
            {loading ? (
              <div className="loading-text">sending your stuff...</div>
            ) : files.length === 0 ? (
                <>
                  <div></div>
                  <div className="plus">+</div>
                  <div className="click-me">
                    or click me! I'm a giant button
                  </div>
                </>
              ) : (
                <>
                  <div className="file-icons">
                    {files.map((file, index) => (
                      <div key={index} className="file-container">
                        <img src={fileIcon} alt="File" className="file-icon" />
                        <div className="file-name">
                          {file.name.length > 15
                            ? `${file.name.slice(0, 12)}...`
                            : file.name}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="add-more-stuff">
                    + add more stuff
                  </div>
                </>
            )}
            <input
              id="file-input"
              type="file"
              multiple
              onChange={handleFileChange}
              className="file-input"
            />
          </div>
            {files.length > 0 && !loading && (
              <button className="send-button" onClick={handleSend}>
                send
              </button>
            )}
            {loading && (
              <div className="loading-bar-container">
                <div className="loading-bar"></div>
              </div>
            )}
          </div>
        </>
      ) : uploaded ? (
        <div className="final-page">
          <div className="small-logo">
            <img src={logo} alt="send me" className="small-logo" />
          </div>
          {!linkCopied ? (
            <div className="clickable-link" onClick={handleLinkClick}>
              click me!
            </div>
          ) : (
            <>
              <div className="after-copy">
                <div></div>
                <div className="link-copied">
                  <h1>link copied</h1>
                  <p>share with your friend!</p>
                </div>
                <button className="reset-button" onClick={resetState}>
                  send more stuff
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="error-page">
          <div className="small-logo">
            <img src={logo} alt="send me" className="small-logo" />
          </div>
          <div className="error-text">
            <h1>oops!</h1>
            <p>your stuff didn't upload</p>
          </div>
          <button className="reset-button" onClick={resetState}>
              Try Again
            </button>
        </div>
      )}
    </div>
  );
};

export default FrontendUI;
