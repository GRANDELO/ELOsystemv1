import React, { useState } from "react";
import QrReader from "modern-react-qr-reader";

const QRScannerPage = () => {
  const [scannedCode, setScannedCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleScan = (data) => {
    if (data) {
      setScannedCode(data); // Update scanned code
      setErrorMessage(""); // Clear errors
    }
  };

  const handleError = (err) => {
    console.error(err);
    setErrorMessage("Error scanning QR code. Please try again.");
  };

  return (
    <div className="qr-container">
      <h1 className="qr-header">QR Code Scanner</h1>
      <div className="qr-reader">
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: "300px" }}
        />
      </div>

      {scannedCode && (
        <div className="qr-result">
          <h2>Scanned Code:</h2>
          <p>{scannedCode}</p>
        </div>
      )}

      {errorMessage && (
        <div className="qr-error">
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
};

export default QRScannerPage;
