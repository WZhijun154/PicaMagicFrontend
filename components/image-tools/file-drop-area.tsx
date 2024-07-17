import React from "react";
import { useDropzone, DropzoneOptions, FileWithPath } from "react-dropzone";
import { showErrorNotification } from "../../utils/notify";

interface FileDropAreaProps {
  allowFileTypes?: string[];
  children?: React.ReactNode;
  dropAction?: (files: File[]) => void;
}

export const FileDropArea: React.FC<FileDropAreaProps> = ({
  children,
  allowFileTypes,
  dropAction,
}) => {
  const onDrop = (acceptedFiles: FileWithPath[]) => {
    acceptedFiles.forEach(async (file) => {
      if (allowFileTypes && !allowFileTypes.includes(file.type)) {
        showErrorNotification("Invalid file type: " + file.name);
        return;
      }
    });

    dropAction && dropAction(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  } as DropzoneOptions);

  return (
    <div {...getRootProps()} className="overflow-clip">
      <input {...getInputProps()} />
      <div className="relative">
        {children}
        {isDragActive && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xl font-bold rounded-lg">
            Drop Here
          </div>
        )}
      </div>
    </div>
  );
};
