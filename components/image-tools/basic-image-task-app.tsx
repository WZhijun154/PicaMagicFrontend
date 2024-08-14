"use client";
import React, { useEffect, useState } from "react";
import { FileDropArea } from "./file-drop-area";
import { uploadToFastAPI } from "@/utils/upload";
import { useAtomValue, useSetAtom } from "jotai";
import { showErrorNotification } from "@/utils/notify";
import { BasicImageTaskInfo, BasicImageTaskStatus } from "@/utils/file";
import { useDisclosure } from "@nextui-org/react";
import { backendBaseUrl } from "@/config/endpoint";
import { FileDropCard } from "./file-drop-card";
import { CardWithThumbnail } from "./card-with-thumbnail";
import { ImageCompareModal } from "./image-compare-modal";
import { Image } from "@nextui-org/image";
import VerticalSteps from "../vertical-stepps";
import { Button } from "@nextui-org/react";
import { Checkbox } from "@nextui-org/react";
import { RadioGroup, Radio } from "@nextui-org/react";
import { useCurrentThemeColor } from "@/hooks/use-current-theme-color";
import { Background } from "../background";
import {
  getPresignedUploadUrl,
  getSignedDownloadUrl,
} from "@/plugins/wasabi/utils";
import AwsS3, { type AwsBody } from "@uppy/aws-s3";
// import { useRef } from "react";
// import { createClient } from "@/plugins/supabase/client";
// import { uploadFileToSupabase } from "@/utils/upload";

import Uppy from "@uppy/core";
// import Tus from "@uppy/tus";
import toast from "react-hot-toast";
import XHRUpload from "@uppy/xhr-upload";
import { runWithConcurrencyLimit, TaskPool } from "@/utils/task-pool";
import { useIsMounted } from "@/hooks/use-is-mounted";

import { sleep } from "@/utils/task-pool";
import { upscaleRealEsrgan } from "@/plugins/replicate/prediction";

let uploadTaskPool = new TaskPool(2);
let processTaskPool = new TaskPool(2);

function Stepper() {
  const stepperColor = useCurrentThemeColor({});
  return (
    <div className="flex flex-col justify-center items-center">
      <VerticalSteps
        color={stepperColor as any}
        steps={[
          {
            title: "Upload",
            description: "Upload an image to get started",
          },
          {
            title: "Process",
            description: "Process the image to remove the background",
          },
          {
            title: "Download",
            description: "Download the processed image",
          },
        ]}
      />
      {/* <Card className="w-[384px] h-[256px] flex flex-col items-center bg-content2/50 text-content-foreground2"></Card> */}
    </div>
  );
}

interface ControlPanelProps {
  color?: "primary" | "warning" | "success" | "secondary" | "danger";
}

function ControlPanel({ color = "primary" }: ControlPanelProps) {
  return (
    <div className="w-[1280px] h-[48px] bg-content2/0 flex flex-row items-center gap-4">
      <Button color={color as any} variant="flat" radius="full">
        <RadioGroup
          label=""
          color={color as any}
          defaultValue="x2"
          orientation="horizontal"
          className="px-2 py-2"
        >
          <Radio value="x2"> Resolution x2 </Radio>
          <Radio value="x4"> Resolution x4 </Radio>
        </RadioGroup>
      </Button>
      <Button color={color as any} variant="flat" radius="full">
        <RadioGroup
          label=""
          color={color as any}
          defaultValue="model-a"
          orientation="horizontal"
          className="px-2 py-2"
        >
          <Radio value="model-a"> Model-A </Radio>
          <Radio value="modal-b"> Model-B </Radio>
          <Radio value="modal-c"> Model-C </Radio>
        </RadioGroup>
      </Button>
      <Button color={color as any} variant="flat" radius="full">
        <Checkbox color={color as any}>Enable face restoration</Checkbox>
      </Button>
      <Button color={color as any} radius="full" isDisabled>
        Download All Processed Image
      </Button>
    </div>
  );
}

const color2background = {
  primary: "gradients/image_tool_full_bg_primary.svg",
  warning: "gradients/image_tool_full_bg_warning.svg",
  success: "gradients/image_tool_full_bg_success.svg",
  secondary: "gradients/image_tool_full_bg_secondary.svg",
  danger: "gradients/image_tool_full_bg_danger.svg",
};

interface BasicImageTaskAppProps {
  filesAtom: any;
  hero: React.ReactNode;
  actionButtonText: string;
  backendMethod: string;
  color?: "primary" | "warning" | "success" | "secondary" | "danger";
}

export default function BasicImageTaskApp({
  filesAtom,
  hero,
  actionButtonText,
  backendMethod,
  color = "primary",
}: BasicImageTaskAppProps) {
  const files = useAtomValue(filesAtom) as BasicImageTaskInfo[];
  const setFiles = useSetAtom(filesAtom);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currentModalFile, setCurrentModalFile] =
    useState<BasicImageTaskInfo | null>(null);

  useEffect(() => {
    files.forEach((file) => {
      if (file.status === BasicImageTaskStatus.READY && file.taskMethod) {
        processTaskPool.addTask(async () => {
          await file.taskMethod();
        });
      }
    });
  }, [files]);

  const setTaskStatus = (
    file: BasicImageTaskInfo,
    status: BasicImageTaskStatus
  ) => {
    setFiles((prev: BasicImageTaskInfo[]) =>
      prev.map((prevFile: BasicImageTaskInfo) =>
        prevFile.fileName === file.fileName
          ? { ...prevFile, status: status }
          : prevFile
      )
    );
  };

  const setProcessedUrl = (file: BasicImageTaskInfo, url: string) => {
    setFiles((prev: BasicImageTaskInfo[]) =>
      prev.map((prevFile: BasicImageTaskInfo) =>
        prevFile.fileName === file.fileName
          ? { ...prevFile, processedUrl: url }
          : prevFile
      )
    );
  };

  const download = (file: BasicImageTaskInfo) => {
    window.location.href =
      backendBaseUrl + "/download?path=" + file.processedUrl;
    return;
  };

  async function processTask(file: BasicImageTaskInfo) {
    setTaskStatus(file, BasicImageTaskStatus.STARTED);
    setTaskStatus(file, BasicImageTaskStatus.IN_PROGRESS);
    // toast.loading("Processing image");
    // return;
    const imageUrl = file.fileUrl;
    // TODO: generalize this
    // const response = await fetch(`${backendBaseUrl}/${backendMethod}`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     image_url: imageUrl,
    //     file_name: file.fileName,
    //   }),
    //   redirect: "follow",
    //   credentials: "include", // Ensure cookies are included
    // });
    await upscaleRealEsrgan({
      image: imageUrl,
      scale: 2,
      faceEnhance: false,
    });

    // if (!response.ok) {
    //   const errorMessage = "Failed to remove background";
    //   setTaskStatus(file, BasicImageTaskStatus.FAILED);
    //   return;
    // }

    // setTaskStatus(file, BasicImageTaskStatus.SUCCEEDED);

    // const result = await response.json();
    // const output = result.output;
    // setProcessedUrl(file, output);
    // console.log(file);
  }

  const onDrop = async (_files: File[]) => {
    // files.forEach(async (file) => {

    // if (error || !data.session) {
    //   // TODO: Handle error
    //   toast.error("You need to login to upload images");
    //   return;
    // }
    // TODO: Failed to use uppy
    // const uppy = new Uppy({ autoProceed: true });
    // uppy.use(Tus, {
    //   endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
    //   headers: {
    //     authorization: `Bearer ${data!.session!.access_token}`,
    //     "x-upsert": "true", // optionally set upsert to true to overwrite existing files
    //   },
    //   uploadDataDuringCreation: true,
    //   chunkSize: 1024 * 1024,

    //   allowedMetaFields: [
    //     "bucketName",
    //     "objectName",
    //     "contentType",
    //     "cacheControl",
    //   ],
    //   limit: 3,
    //   removeFingerprintOnSuccess: true,
    // });

    // uppy.on("file-added", (file) => {
    //   setFiles((prev: BasicImageTaskInfo[]) => {
    //     const newFile = {
    //       fileName: file.name,
    //       fileUrl: "",
    //       progress: 0,
    //       deleteMethod: () => {
    //         uppy.removeFile(file.id);
    //         setFiles((prev: BasicImageTaskInfo[]) =>
    //           prev.filter(
    //             (prevFile: BasicImageTaskInfo) =>
    //               prevFile.fileName !== file.name
    //           )
    //         );
    //       },
    //       taskMethod: () => {},
    //       status: BasicImageTaskStatus.NOT_READY,
    //       processedUrl: "",
    //     };
    //     return [...prev, newFile];
    //   });

    //   const supabaseMetadata = {
    //     bucketName: "test",
    //     objectName: file.name,
    //     contentType: file.type,
    //   };

    //   file.meta = {
    //     ...file.meta,
    //     ...supabaseMetadata,
    //   };
    // });

    // uppy.on("upload-success", (file, response) => {
    //   setFiles((prev: BasicImageTaskInfo[]) =>
    //     prev.map((prevFile: BasicImageTaskInfo) =>
    //       prevFile.fileName === file?.name
    //         ? {
    //             ...prevFile,
    //             fileUrl: response.uploadURL,
    //             status: BasicImageTaskStatus.READY,
    //           }
    //         : prevFile
    //     )
    //   );
    //   setFiles((prev: BasicImageTaskInfo[]) =>
    //     prev.map((prevFile: BasicImageTaskInfo) =>
    //       prevFile.fileName === file?.name
    //         ? { ...prevFile, taskMethod: () => processTask(prevFile) }
    //         : prevFile
    //     )
    //   );
    // });

    // uppy.on("upload-error", (file, error) => {
    //   toast.error("Failed to upload file");
    //   setFiles((prev: BasicImageTaskInfo[]) =>
    //     prev.filter(
    //       (prevFile: { fileName: string }) => prevFile.fileName !== file!.name
    //     )
    //   );
    // });

    // use wasabi
    // let uploadTasks: any[] = [];
    for (const _file of _files) {
      // TODO: upload to fastapi
      // const uploadMethodProps = {
      //   file: file,
      //   onStart: () => {
      //     const deleteMethod = () => {
      //       cancel && cancel();
      //       setFiles((prev: BasicImageTaskInfo[]) =>
      //         prev.filter(
      //           (prevFile: BasicImageTaskInfo) =>
      //             prevFile.fileName !== file.name
      //         )
      //       );
      //     };
      //     setFiles((prev: BasicImageTaskInfo[]) => {
      //       const newFile = {
      //         fileName: file.name,
      //         fileUrl: "",
      //         progress: 0,
      //         deleteMethod,
      //         taskMethod: () => {},
      //         status: BasicImageTaskStatus.NOT_READY,
      //         processedUrl: "",
      //       };
      //       return [...prev, newFile];
      //     });
      //     const reader = new FileReader();
      //     reader.onload = () => {
      //       const fileUrlOnClient = reader.result as string;
      //       const image = new window.Image();
      //       image.onload = () => {
      //         setFiles((prev: BasicImageTaskInfo[]) => {
      //           return prev.map((prevFile: BasicImageTaskInfo) =>
      //             prevFile.fileName === file.name
      //               ? {
      //                   ...prevFile,
      //                   fileUrlOnClient: reader.result as string,
      //                   width: image.width,
      //                   height: image.height,
      //                 }
      //               : prevFile
      //           );
      //         });
      //       };
      //       image.src = fileUrlOnClient;
      //     };
      //     reader.readAsDataURL(file);
      //   },
      //   onProgress: (progress: number) => {
      //     setFiles((prev: BasicImageTaskInfo[]) =>
      //       prev.map((prevFile: BasicImageTaskInfo) =>
      //         prevFile.fileName === file.name
      //           ? { ...prevFile, progress }
      //           : prevFile
      //       )
      //     );
      //   },
      //   onSuccess: (imageUrl: string) => {
      //     setFiles((prev: BasicImageTaskInfo[]) =>
      //       prev.map((prevFile: BasicImageTaskInfo) =>
      //         prevFile.fileName === file.name
      //           ? {
      //               ...prevFile,
      //               progress: 100,
      //               fileUrl: imageUrl,
      //               // at this point, the fileUrl still not be set, so set it after this step
      //               status: BasicImageTaskStatus.READY,
      //             }
      //           : prevFile
      //       )
      //     );
      //     setFiles((prev: BasicImageTaskInfo[]) =>
      //       prev.map((prevFile: BasicImageTaskInfo) =>
      //         prevFile.fileName === file.name
      //           ? { ...prevFile, taskMethod: () => processTask(prevFile) }
      //           : prevFile
      //       )
      //     );
      //     cancel = () => {};
      //   },
      //   onError: (error: any) => {
      //     setFiles((prev: BasicImageTaskInfo[]) =>
      //       prev.filter(
      //         (prevFile: { fileName: string }) =>
      //           prevFile.fileName !== file.name
      //       )
      //     );
      //     showErrorNotification("Failed to upload file");
      //     console.log(error);
      //   },
      // };
      // const result = uploadToFastAPI(uploadMethodProps);
      // const promise = result.promise;
      // let cancel = result.cancel;
      // try {
      //   await promise;
      // } catch (error) {
      //   console.log(error);
      // }
      // TODO: uppy
      // uppy.on("progress", (progress) => {
      //   setFiles((prev: BasicImageTaskInfo[]) =>
      //     prev.map((prevFile: BasicImageTaskInfo) =>
      //       prevFile.fileName === file.name
      //         ? { ...prevFile, progress: progress }
      //         : prevFile
      //     )
      //   );
      // });
      // uppy.addFile({
      //   name: file.name,
      //   type: file.type,
      //   data: file,
      // });
      // TODO: supabase upload
      // const supabase = createClient();
      // const { data, error } = await supabase.storage
      //   .from("test")
      //   .createSignedUploadUrl(file.name);
      // if (error) {
      //   continue;
      // }
      // await uploadFileToSupabase({
      //   preSignedUrl: data!.signedUrl,
      //   file: file,
      //   onStart: () => {},
      //   onError: () => {},
      //   onProgress: () => {},
      //   onSuccess: () => {},
      // });
      // TODO: upload to supabase
      // const { data: uploadData, error: uploadError } = await supabase.storage
      //   .from("test")
      //   .uploadToSignedUrl(file.name, data!.token, file);
      // console.log(uploadData, uploadError);

      const presignedUrl = await getPresignedUploadUrl(_file.name!, _file.type);

      const uppy = new Uppy({
        autoProceed: false,
      }).use(XHRUpload, {
        method: "PUT",
        formData: false, // Use formData if you need a multipart upload (typically false for S3-like uploads)
        fieldName: "file", // Not needed when formData is false
        endpoint: presignedUrl,
      });

      uppy.on("file-added", (file) => {
        setFiles((prev: BasicImageTaskInfo[]) => {
          const newFile = {
            fileName: file.name,
            fileUrl: "",
            progress: 0,
            deleteMethod: () => {
              uppy.removeFile(file.id);
              setFiles((prev: BasicImageTaskInfo[]) =>
                prev.filter(
                  (prevFile: BasicImageTaskInfo) =>
                    prevFile.fileName !== file.name
                )
              );
            },
            taskMethod: () => {},
            status: BasicImageTaskStatus.NOT_READY,
            processedUrl: "",
          };
          return [...prev, newFile];
        });
      });

      uppy.on("progress", (progress) => {
        setFiles((prev: BasicImageTaskInfo[]) =>
          prev.map((prevFile: BasicImageTaskInfo) =>
            prevFile.fileName === _file!.name
              ? { ...prevFile, progress }
              : prevFile
          )
        );
      });

      uppy.on("complete", async (result) => {
        // Step 1: Retrieve the signed download URL asynchronously
        const signedDownloadUrl = await getSignedDownloadUrl(_file!.name);

        // Step 2: Update the files state with the new URL
        setFiles((prev: BasicImageTaskInfo[]) =>
          prev.map((prevFile: BasicImageTaskInfo) =>
            prevFile.fileName === _file!.name
              ? {
                  ...prevFile,
                  fileUrl: signedDownloadUrl,
                  status: BasicImageTaskStatus.READY,
                }
              : prevFile
          )
        );

        // Step 3: Update the files state to set the taskMethod
        setFiles((prev: BasicImageTaskInfo[]) =>
          prev.map((prevFile: BasicImageTaskInfo) =>
            prevFile.fileName === _file!.name
              ? { ...prevFile, taskMethod: () => processTask(prevFile) }
              : prevFile
          )
        );
      });

      uppy.addFile({
        name: _file.name,
        type: _file.type,
        data: _file,
      });

      // uploadTasks.push(() => uppy.upload());
      uploadTaskPool.addTask(async () => {
        await uppy.upload();
        // should wait for atom update
        // trigger a state update

        // add process task to the pool
        // find the task based on the file name
        // const imageTaskInfo = files.find(
        //   (file) => file.fileName === _file.name
        // );
        // if (imageTaskInfo) {
        //   processTaskPool.addTask(async () => {
        //     await processTask(imageTaskInfo);
        //   });
        // }
      });
    }
  };

  const openImageCompareModal = (file: BasicImageTaskInfo) => {
    setCurrentModalFile(file);
    onOpen();
  };

  return (
    <>
      <Background />
      <ImageCompareModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        leftImage={currentModalFile?.fileUrlOnClient as string}
        rightImage={
          (backendBaseUrl +
            "/download?path=" +
            currentModalFile?.processedUrl) as string
        }
      />

      <div className="flex flex-col gap-12 items-center mt-[96px] mb-24">
        <div>{hero}</div>
        <div className="flex-row flex gap-8">
          <FileDropArea
            allowFileTypes={["image/jpeg", "image/png", "image/webp"]}
            dropAction={onDrop}
          >
            <FileDropCard />
          </FileDropArea>
          <Stepper />
        </div>
        <div className="flex flex-col justify-center items-center gap-2">
          <ControlPanel color={color} />
          <div className="grid max-w-8xl grid-cols-1 gap-5 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {files.map((file) => (
              <CardWithThumbnail
                imgSrc={file.fileUrlOnClient as string}
                key={file.fileName}
                primaryAction={
                  file.status === BasicImageTaskStatus.SUCCEEDED
                    ? () => download(file)
                    : file.taskMethod
                }
                secondaryAction={
                  file.status === BasicImageTaskStatus.SUCCEEDED
                    ? () => openImageCompareModal(file)
                    : file.deleteMethod
                }
                isRunning={file.status === BasicImageTaskStatus.IN_PROGRESS}
                isSuccess={file.status === BasicImageTaskStatus.SUCCEEDED}
                isFailed={file.status === BasicImageTaskStatus.FAILED}
                isUploading={file.status === BasicImageTaskStatus.NOT_READY}
                progress={file.progress}
                caption={file.fileName}
                description={`${file.width}x${file.height}`}
                action_text={actionButtonText}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
