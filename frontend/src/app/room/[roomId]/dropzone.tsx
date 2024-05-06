"use client";
import { useEffect, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import Papa from "papaparse";
import { Modal, Table, Checkbox } from "antd";
import { UserStoryApi } from "@/api/userstory-api";
import { Button } from "@/components/ui/button";

const DropzoneComponent: React.FC = () => {
  const [isUploadSuccessful, setIsUploadSuccessful] = useState(false);
  const [wrongFileFormatProvided, setwrongFileFormatProvided] = useState(false);
  const [csvData, setCsvData] = useState<any[]>([]); // State to store CSV data
  const [modalVisible, setModalVisible] = useState(false); // State to manage modal visibility
  const tableRef = useRef<HTMLTableElement>(null);

  const handleFileDrop = (acceptedFiles: any[]) => {
    const selectedFile = acceptedFiles[0];

    // 1. Basic validation
    if (selectedFile.type === "text/csv") {
      console.log("Uploaded file:", selectedFile);
      setIsUploadSuccessful(true);
      setwrongFileFormatProvided(false); 
      
      // Parse the CSV file using PapaParse
      Papa.parse(selectedFile, {
        complete: (results) => {
          const parsedData = results.data;
          console.log("Parsed CSV data:", parsedData);
          setCsvData(parsedData); // Store CSV data in state
          showModal(); 
        },
      });
    } else {
      // Not a CSV file
      setIsUploadSuccessful(false);
      setwrongFileFormatProvided(true);
    }
  };
  
  const showModal = () => {
    setModalVisible(true);
    // Calculate table width and set modal width (when modal opens)
    if (tableRef.current) {
      const tableWidth = tableRef.current.offsetWidth;
      setModalWidth(tableWidth); // Update modal state (optional)
    }
  };

  const importUserStories = () => {
    // Extract room ID from URL (assuming URL format is consistent)
    const url = window.location.href;
    const roomIdMatch = url.match(/\/room\/(\d+)/);
    const roomId = roomIdMatch ? parseInt(roomIdMatch[1]) : null; // Parse as integer
    console.log("Room ID:", roomId);
    if (roomId) {
      const result = UserStoryApi.importUserStories(roomId, csvData);
      console.log("Import result:", result);
    } else {
      console.error("Error: Could not extract room ID from URL");
    }
  };

  const exportUserStories = async () => {
    // Extract room ID from URL (assuming consistent format)
    const url = window.location.href;
    const roomIdMatch = url.match(/\/room\/(\d+)/);
    const roomId = roomIdMatch ? parseInt(roomIdMatch[1]) : null;

    if (!roomId) {
      console.error("Error: Could not extract room ID from URL");
      return; // Exit if room ID cannot be found
    }

    try {
      const result = UserStoryApi.exportUserStories(roomId);
          // Prepare the CSV data
      const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(await result);

      // Create a downloadable blob
      const blob = new Blob([await result], { type: 'text/csv;charset=utf-8' });

      // Simulate a click on a hidden anchor tag to trigger download
      const downloadLink = document.createElement('a');
      downloadLink.href = csvContent;
      downloadLink.download = `user_stories_${roomId}.csv`;
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      console.log("User stories exported successfully!");
      
    } catch (error) {
      console.error("Error exporting user stories:", error);
      // Handle errors appropriately (e.g., display error message to user)
    }
  };

  const [modalWidth, setModalWidth] = useState(0);

  const closeModal = () => {
    setModalVisible(false);
  };

  // Define table columns based on CSV data structure
  const tableColumns = csvData[0] ? csvData[0].slice(0).map((header: any, index: string | number) => {
    // Check if data is objects with matching properties
    const dataIndex = csvData[1] && csvData[1][index] !== undefined ? header : index;

    return {
      title: header,
      dataIndex,
      key: index, // Ensure unique keys
    };
  }) : [];

  const mappedData = csvData.slice(1).map((rowData) => {
    return rowData.reduce((obj: { [x: string]: any; }, value: any, index: string | number) => {
      obj[csvData[0][index]] = value;
      return obj;
    }, {});
  });
  
  return (
    <div>
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
              {wrongFileFormatProvided && (
                <p className="upload-error mt-4 text-center text-red-500">
                  Please upload a CSV file.
                </p>
              )}
            </div>
          </section>
        )}
      </Dropzone>
      <Button onClick={showModal} disabled={!isUploadSuccessful}>
        View CSV Data
      </Button>
      <Button onClick={importUserStories} disabled={!isUploadSuccessful}>
        Import
      </Button>
      <Button onClick={exportUserStories} disabled={!isUploadSuccessful}>
        Export
      </Button>
      <Modal
        title="CSV Data"
        open={modalVisible}
        onCancel={closeModal}
        footer={[
          <Button key="close" onClick={closeModal}>
            Cancel
          </Button>,
          <Button key="confirm" onClick={closeModal}>
            Confirm
          </Button>,

        ]}
        width={modalWidth || "auto"} // Use modal state or 'auto'
      >
        <Table dataSource={mappedData} pagination={false} columns={tableColumns} ref={tableRef} />
      </Modal>
    </div>
  );
};
export default DropzoneComponent;
