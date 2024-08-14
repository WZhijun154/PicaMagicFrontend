import { showErrorNotification } from "./notify";
import { FileWithPath } from "react-dropzone";
import { uploadFilesEndPoint } from "@/config/endpoint";
import { createClient } from "@/plugins/supabase/client";
import * as tus from "tus-js-client";

export interface UploadMethodProps {
  file: FileWithPath;
  onStart: () => void;
  onProgress: (progress: number) => void;
  onSuccess: (imageUrl: string) => void;
  onError: (error: any) => void;
  onCancel?: () => void;
}

export function uploadToFastAPI({
  file,
  onStart,
  onProgress,
  onSuccess,
  onError,
  onCancel,
}: UploadMethodProps): { promise: Promise<string | null>; cancel: () => void } {
  const xhr = new XMLHttpRequest();

  const promise = new Promise<string | null>((resolve, reject) => {
    onStart();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        onProgress(progress);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        const fileUrl = response.fileUrl;
        onSuccess(fileUrl);
        resolve(fileUrl);
      } else {
        const errorMessage = `Upload failed with status ${xhr.status}`;
        showErrorNotification(errorMessage);
        onError(new Error(errorMessage));
        resolve(null);
      }
    };

    xhr.onerror = () => {
      const errorMessage = "Upload failed due to a network error";
      showErrorNotification(errorMessage);
      onError(new Error(errorMessage));
      reject(new Error(errorMessage));
    };

    xhr.onabort = () => {
      onCancel?.();
      resolve(null);
    };

    xhr.open("PUT", uploadFilesEndPoint, true);
    xhr.setRequestHeader("X-File-Name", file.name);
    // use formdata
    const formData = new FormData();
    formData.append("file", file);
    xhr.withCredentials = true; // allow cookies to be sent with the request
    xhr.send(formData);
  });

  const cancel = () => {
    xhr.abort();
  };

  return { promise, cancel };
}

export function uploadFileToSupabase({
  file,
  preSignedUrl,
  onStart,
  onProgress,
  onSuccess,
  onError,
  onCancel,
}: UploadMethodProps & { preSignedUrl: string }): {
  promise: Promise<string | null>;
  cancel: () => void;
} {
  const xhr = new XMLHttpRequest();

  const promise = new Promise<string | null>((resolve, reject) => {
    onStart();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        onProgress(progress);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        const fileUrl = response.fileUrl;
        onSuccess(fileUrl);
        resolve(fileUrl);
      } else {
        const errorMessage = `Upload failed with status ${xhr.status}`;
        showErrorNotification(errorMessage);
        onError(new Error(errorMessage));
        resolve(null);
      }
    };

    xhr.onerror = () => {
      const errorMessage = "Upload failed due to a network error";
      showErrorNotification(errorMessage);
      onError(new Error(errorMessage));
      reject(new Error(errorMessage));
    };

    xhr.onabort = () => {
      onCancel?.();
      resolve(null);
    };

    xhr.open("PUT", preSignedUrl, true);
    xhr.setRequestHeader("X-File-Name", file.name);
    // use formdata
    const formData = new FormData();
    formData.append("file", file);
    xhr.withCredentials = true; // allow cookies to be sent with the request
    xhr.send(formData);
  });

  const cancel = () => {
    xhr.abort();
  };

  return { promise, cancel };
}

export async function uploadToPresignedUrl({
  file,
  onStart,
  onProgress,
  onSuccess,
  onError,
  onCancel,
  preSignedUrl,
}: UploadMethodProps & { preSignedUrl: string }) {
  return new Promise<void>((resolve, reject) => {
    var upload = new tus.Upload(file, {
      endpoint: preSignedUrl,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true, // Important if you want to allow re-uploading the same file https://github.com/tus/tus-js-client/blob/main/docs/api.md#removefingerprintonsuccess
      metadata: {
        bucketName: preSignedUrl,
        objectName: file.name,
        contentType: file.type,
        cacheControl: "3600",
      },
      chunkSize: 6 * 1024 * 1024, // NOTE: it must be set to 6MB (for now) do not change it
      onError: function (error) {
        onError(error);
        reject(error);
      },
      onProgress: function (bytesUploaded, bytesTotal) {
        var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
        onProgress(parseFloat(percentage));
      },
      onSuccess: function () {
        onSuccess("Hello World");
        resolve();
      },
    });

    // Check if there are any previous uploads to continue.
    return upload.findPreviousUploads().then(function (previousUploads) {
      // Found previous uploads so we select the first one.
      if (previousUploads.length) {
        upload.resumeFromPreviousUpload(previousUploads[0]);
      }

      // Start the upload
      onStart();
      upload.start();
    });
  });
}
