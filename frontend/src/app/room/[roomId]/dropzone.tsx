"use client";
import { useState } from "react";
import Dropzone from "react-dropzone";
import Papa from "papaparse";

const DropzoneComponent: React.FC = () => {
  const [isUploadSuccessful, setIsUploadSuccessful] = useState(false);
  const [wrongFileFormatProvided, setwrongFileFormatProvided] = useState(false);

  const handleFileDrop = (acceptedFiles: any[]) => {
    const selectedFile = acceptedFiles[0];

    // 1. Basic validation
    if (selectedFile.type === "text/csv") {
      console.log("Uploaded file:", selectedFile);
      setIsUploadSuccessful(true);
      // Parse the CSV file using PapaParse
      Papa.parse(selectedFile, {
        complete: (results) => {
          const parsedData = results.data;
          console.log("Parsed CSV data:", parsedData);
        },
      });
    } else {
      // Not a CSV file
      setIsUploadSuccessful(false);
      setwrongFileFormatProvided(true);
    }

    // 2. File Upload Logic (replace with your implementation):

    // You can access the uploaded file object here
    // - selectedFile.name (original filename)
    // - selectedFile.type (MIME type)
    // - selectedFile.size (file size in bytes)

    // Implement your file upload logic here (e.g., send to server)
  };
  return (
    <Dropzone onDrop={handleFileDrop}>
      {({ getRootProps, getInputProps }) => (
        <section {...getRootProps()}>
          <div className="dropzone-inner flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-4 py-8 hover:border-gray-500">
            <input {...getInputProps()} />
            <p className="dropzone-prompt mt-4 text-center text-gray-500">
              Drag 'n' drop a CSV file from JIRA here, or click to select
            </p>
            {isUploadSuccessful && (
              <div className="checkmark-container mt-4">
                <svg
                  className="h-6 w-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
            {/* Display error message if applicable */}
            {wrongFileFormatProvided && (
              <p className="upload-error mt-4 text-center text-red-500">
                Please upload a CSV file.
              </p>
            )}
          </div>
        </section>
      )}
    </Dropzone>
  );
};
export default DropzoneComponent;
