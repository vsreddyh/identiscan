import React, { useState, useRef, useEffect } from "react";

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
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"],
  ];

  const containerStyle = {
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    padding: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    width: "100%",
    maxWidth: "500px",
    margin: "0 auto",
  };

  const rowStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "4px",
  };

  const getKeyButtonStyle = (width) => ({
    width: `${width}px`,
    height: `${width * 1.25}px`,
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "4px",
    fontSize: "0.875rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });

  const deleteButtonStyle = {
    width: "80px",
    height: "40px",
    backgroundColor: "#fee2e2",
    border: "1px solid #e5e7eb",
    borderRadius: "4px",
    fontSize: "0.875rem",
    marginTop: "8px",
    cursor: "pointer",
  };

  return (
    <div style={containerStyle}>
      {keyboardLayout.map((row, rowIndex) => (
        <div key={rowIndex} style={rowStyle}>
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              style={getKeyButtonStyle(keyWidth)}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "8px",
        }}
      >
        <button onClick={onDelete} style={deleteButtonStyle}>
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
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const containerStyle = {
    width: "100%",
    maxWidth: "500px",
    height: "100vh",
    margin: "0 auto",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    overflow: "hidden",
  };

  const contentStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  };

  const headingStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "16px",
  };

  const inputContainerStyle = {
    marginBottom: "16px",
    width: "100%",
  };

  const inputLabelStyle = {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: 500,
    marginBottom: "8px",
    textAlign: "center",
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    textAlign: "center",
    fontSize: "1.25rem",
    letterSpacing: "0.025em",
    border: "1px solid #e5e7eb",
    borderRadius: "4px",
  };

  const buttonStyle = (isEnabled) => ({
    width: "100%",
    maxWidth: "500px",
    padding: "10px",
    backgroundColor: isEnabled ? "#3b82f6" : "#a1a1aa",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: isEnabled ? "pointer" : "not-allowed",
    marginTop: "16px",
  });

  const handleKeyPress = (key) => {
    setRollNumber((prev) => prev + key);
  };

  const handlePhysicalKeyboard = (e) => {
    const key = e.key;
    if (/^[a-zA-Z0-9]$/.test(key)) {
      setRollNumber((prev) => prev + key.toLowerCase());
    } else if (key === "Backspace") {
      setRollNumber((prev) => prev.slice(0, -1));
    }
  };

  const handleDeleteKey = () => {
    setRollNumber((prev) => prev.slice(0, -1));
  };

  const startCameraAndCapture = async () => {
    if (!rollNumber) return;

    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 4096 },
          height: { ideal: 4096 },
        },
      });

      // Set video source
      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // Wait for video to be ready
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = resolve;
        });

        // Short delay to ensure camera is fully initialized
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Capture photo
        capturePhoto(stream);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError("Could not access camera. Please check permissions.");
    }
  };

  const capturePhoto = (stream) => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");

      // Set canvas to match video dimensions
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;

      // Capture image
      context.drawImage(videoRef.current, 0, 0);

      // Convert to data URL
      const imageDataUrl = canvasRef.current.toDataURL("image/jpeg");
      setCapturedImage(imageDataUrl);

      // Stop video stream
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  return (
    <div style={containerStyle} onKeyDown={handlePhysicalKeyboard} tabIndex={0}>
      <div style={contentStyle}>
        <h1 style={headingStyle}>Student Photo Capture</h1>

        <div style={inputContainerStyle}>
          <label htmlFor="rollNumber" style={inputLabelStyle}>
            Roll Number
          </label>
          <input
            id="rollNumber"
            type="text"
            value={rollNumber}
            readOnly
            placeholder="Enter your roll number"
            style={inputStyle}
          />
        </div>

        {cameraError && (
          <div
            style={{
              color: "red",
              textAlign: "center",
              marginBottom: "16px",
            }}
          >
            {cameraError}
          </div>
        )}

        {capturedImage && (
          <div
            style={{
              width: "100%",
              maxWidth: "500px",
              marginBottom: "16px",
            }}
          >
            <img
              src={capturedImage}
              alt="Captured"
              style={{
                width: "100%",
                borderRadius: "8px",
              }}
            />
          </div>
        )}

        <video
          ref={videoRef}
          style={{ display: "none" }}
          autoPlay
          playsInline
        />

        <VirtualKeyboard
          onKeyPress={handleKeyPress}
          onDelete={handleDeleteKey}
        />
      </div>

      {!capturedImage && (
        <button
          onClick={startCameraAndCapture}
          style={buttonStyle(!!rollNumber)}
          disabled={!rollNumber}
        >
          Capture Photo
        </button>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default App;
