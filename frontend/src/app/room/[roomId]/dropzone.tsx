"use client";
import { useEffect, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import Papa from "papaparse";
import { Modal, Table, Checkbox, Button } from "antd";

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
