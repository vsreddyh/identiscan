import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";
import FormData from "form-data";

const VirtualKeyboard = ({ onKeyPress, onDelete }) => {
  const [keyWidth, setKeyWidth] = useState(32);

  useEffect(() => {
    const updateKeyWidth = () => {
      const screenWidth = window.innerWidth;
      const calculatedWidth = Math.min(Math.max(screenWidth / 15, 24), 40);
      setKeyWidth(calculatedWidth);
    };

    updateKeyWidth();
    window.addEventListener("resize", updateKeyWidth);
    return () => window.removeEventListener("resize", updateKeyWidth);
  }, []);

  const keyboardLayout = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  return (
    <div className="keyboard-container">
      {keyboardLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              className="key-button"
              style={{ width: `${keyWidth}px`, height: `${keyWidth * 1.25}px` }}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
      <div className="delete-button-container">
        <button onClick={onDelete} className="delete-button">
          Delete
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState("enter-roll");
  const [stream, setStream] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const timeoutRef = useRef(null);
  // Handle physical keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (step !== "enter-roll") return;

      if (/^[0-9a-zA-Z]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase());
      } else if (e.key === "Backspace") {
        handleDeleteKey();
      } else if (e.key === "Enter") {
        verifyRollNumber();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, rollNumber]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [stream]);

  const startCountdown = (seconds, onComplete) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setCountdown(seconds);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          return null;
        }
        return prev - 1;
      });
    }, 3000);
    return timer;
  };

  const handleKeyPress = (key) => {
    setRollNumber((prev) => prev + key);
  };

  const handleDeleteKey = () => {
    setRollNumber((prev) => prev.slice(0, -1));
  };

  const verifyRollNumber = () => {
    axios
      .get(
        `${import.meta.env.VITE_SERVER}/admin/checkRoll?rollNumber=${rollNumber}`,
      )
      .then(() => {
        setStep("camera");
        startCamera();
      })
      .catch((err) => {
        setErrorMessage(err.response?.data?.error || "Verification failed");
      });
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 4096 },
          height: { ideal: 4096 },
        },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
        };
      }
      startCountdown(10, () => {
        if (mediaStream) {
          mediaStream.getTracks().forEach((track) => track.stop());
        }
        setErrorMessage("Timeout");
        setStep("enter-roll");
      });
    } catch (err) {
      setErrorMessage("Could not access camera. Please check permissions.");
      setStep("enter-roll");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert the canvas to a Blob instead of base64
      canvas.toBlob(
        (blob) => {
          setCapturedImage(blob);

          if (stream) {
            stream.getTracks().forEach((track) => track.stop());
          }
          setStep("preview");
          startCountdown(10, () => {
            setErrorMessage("Timeout");
            setStep("enter-roll");
          });
        },
        "image/jpeg",
        0.8,
      );
    }
  };

  const submitAttendance = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const formData = new FormData();
    formData.append("rollNumber", rollNumber);
    formData.append("photo", capturedImage);

    axios
      .post(`${import.meta.env.VITE_SERVER}/admin/compare`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        setStep("success");
        timeoutRef.current = setTimeout(() => {
          setStep("enter-roll");
          setCapturedImage(null);
          setRollNumber("");
        }, 3000);
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage(
          err.response?.data?.message || "Failed to mark attendance",
        );
      });
  };

  return (
    <div className="main-container">
      <h1 className="title">Identiscan</h1>

      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div className="input-container">
        <input
          type="text"
          value={rollNumber}
          readOnly
          placeholder="Enter your roll number"
          className="roll-number-input"
        />
      </div>

      {step === "enter-roll" && (
        <>
          <VirtualKeyboard
            onKeyPress={handleKeyPress}
            onDelete={handleDeleteKey}
          />
          <button
            onClick={verifyRollNumber}
            disabled={!rollNumber}
            className={`verify-button ${rollNumber ? "" : "verify-button-disabled"}`}
          >
            Verify
          </button>
        </>
      )}

      {step === "camera" && (
        <div className="camera-container">
          <video ref={videoRef} autoPlay playsInline className="camera-video" />
          <div className="button-container">
            <button onClick={capturePhoto} className="capture-button">
              Capture Photo
            </button>
            <button
              onClick={() => {
                if (stream) {
                  stream.getTracks().forEach((track) => track.stop());
                }
                setStep("enter-roll");
              }}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {step === "preview" && capturedImage && (
        <div className="preview-container">
          <img
            src={URL.createObjectURL(capturedImage)}
            alt="Captured"
            className="preview-image"
            style={{ maxWidth: "100%", maxHeight: "60vh" }}
          />
          <div className="button-container">
            <button onClick={submitAttendance} className="submit-button">
              Submit
            </button>
            <button
              onClick={() => {
                if (timeoutRef.current) {
                  clearTimeout(timeoutRef.current);
                  timeoutRef.current = null;
                }
                setCapturedImage(null);
                setStep("enter-roll");
              }}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {step === "success" && (
        <div className="success-message">Attendance marked successfully!</div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default App;
