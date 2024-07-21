"use client";
import React, { useState } from "react";
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
import { Background } from "@/utils/background";

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

  async function process(file: BasicImageTaskInfo) {
    setTaskStatus(file, BasicImageTaskStatus.STARTED);
    setTaskStatus(file, BasicImageTaskStatus.IN_PROGRESS);
    const imageUrl = file.fileUrl;

    const response = await fetch(`${backendBaseUrl}/${backendMethod}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_url: imageUrl,
        file_name: file.fileName,
      }),
      redirect: "follow",
      credentials: "include", // Ensure cookies are included
    });

    if (!response.ok) {
      const errorMessage = "Failed to remove background";
      setTaskStatus(file, BasicImageTaskStatus.FAILED);
      return;
    }

    setTaskStatus(file, BasicImageTaskStatus.SUCCEEDED);

    const result = await response.json();
    const output = result.output;
    setProcessedUrl(file, output);
    console.log(file);
  }

  const onDrop = async (files: File[]) => {
    files.forEach(async (file) => {
      const uploadMethodProps = {
        file: file,
        onStart: () => {
          const deleteMethod = () => {
            cancel && cancel();
            setFiles((prev: BasicImageTaskInfo[]) =>
              prev.filter(
                (prevFile: BasicImageTaskInfo) =>
                  prevFile.fileName !== file.name
              )
            );
          };

          setFiles((prev: BasicImageTaskInfo[]) => {
            const newFile = {
              fileName: file.name,
              fileUrl: "",
              progress: 0,
              deleteMethod,
              taskMethod: () => {},
              status: BasicImageTaskStatus.NOT_READY,
              processedUrl: "",
            };
            return [...prev, newFile];
          });

          const reader = new FileReader();
          reader.onload = () => {
            const fileUrlOnClient = reader.result as string;
            const image = new window.Image();
            image.onload = () => {
              setFiles((prev: BasicImageTaskInfo[]) => {
                return prev.map((prevFile: BasicImageTaskInfo) =>
                  prevFile.fileName === file.name
                    ? {
                        ...prevFile,
                        fileUrlOnClient: reader.result as string,
                        width: image.width,
                        height: image.height,
                      }
                    : prevFile
                );
              });
            };
            image.src = fileUrlOnClient;
          };
          reader.readAsDataURL(file);
        },

        onProgress: (progress: number) => {
          setFiles((prev: BasicImageTaskInfo[]) =>
            prev.map((prevFile: BasicImageTaskInfo) =>
              prevFile.fileName === file.name
                ? { ...prevFile, progress }
                : prevFile
            )
          );
        },

        onSuccess: (imageUrl: string) => {
          setFiles((prev: BasicImageTaskInfo[]) =>
            prev.map((prevFile: BasicImageTaskInfo) =>
              prevFile.fileName === file.name
                ? {
                    ...prevFile,
                    progress: 100,
                    fileUrl: imageUrl,
                    // at this point, the fileUrl still not be set, so set it after this step
                    status: BasicImageTaskStatus.READY,
                  }
                : prevFile
            )
          );

          setFiles((prev: BasicImageTaskInfo[]) =>
            prev.map((prevFile: BasicImageTaskInfo) =>
              prevFile.fileName === file.name
                ? { ...prevFile, taskMethod: () => process(prevFile) }
                : prevFile
            )
          );

          cancel = () => {};
        },

        onError: (error: any) => {
          setFiles((prev: BasicImageTaskInfo[]) =>
            prev.filter(
              (prevFile: { fileName: string }) =>
                prevFile.fileName !== file.name
            )
          );
          showErrorNotification("Failed to upload file");
          console.log(error);
        },
      };

      const result = uploadToFastAPI(uploadMethodProps);
      const promise = result.promise;

      let cancel = result.cancel;

      try {
        await promise;
      } catch (error) {
        console.log(error);
      }
    });
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
