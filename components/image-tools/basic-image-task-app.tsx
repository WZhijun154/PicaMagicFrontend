"use client";
import React, { useEffect, useState, useCallback, use } from "react";
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

import Uppy from "@uppy/core";
import toast from "react-hot-toast";
import XHRUpload from "@uppy/xhr-upload";
import { TaskPool } from "@/utils/task-pool";
import { upscaleRealEsrgan } from "@/plugins/replicate/prediction";
import {
  getProcessedImageUrl,
  getWatermarkedAndProcessedImageBuffer,
  upscaleImage,
} from "@/plugins/octoai/prediction";
import { getUrlFromBase64 } from "@/utils/image";

import { useAddFile, useRemoveFile, useSetAttributes } from "@/utils/file";
import { saveAs } from "file-saver";
import { useDictionary } from "../dictionary-provider";
import { Slider } from "@nextui-org/react";
import { useLang } from "../dictionary-provider";

let uploadTaskPool = new TaskPool(2);
let processTaskPool = new TaskPool(2);

function Stepper() {
  const stepperColor = useCurrentThemeColor({});
  const dictionary = useDictionary();
  return (
    <div className="flex flex-col justify-center items-center">
      <VerticalSteps
        color={stepperColor as any}
        steps={[
          {
            title: dictionary.stepper.upload.title,
            description: dictionary.stepper.upload.description,
          },
          {
            title: dictionary.stepper.download.title,
            description: dictionary.stepper.download.description,
          },
          {
            title: dictionary.stepper.done.title,
            description: dictionary.stepper.done.description,
          },
        ]}
      />
    </div>
  );
}

interface ControlPanelProps {
  color?: "primary" | "warning" | "success" | "secondary" | "danger";
}

function ScaleSlider({ color }: ControlPanelProps) {
  const [scaleSliderValue, setScaleSliderValue] = useState(2.0);
  const lang = useLang();
  const dictionary = useDictionary();

  return (
    <Button
      color={color as any}
      variant="flat"
      radius="full"
      className="justify-between"
    >
      <Slider
        size="sm"
        step={0.1}
        maxValue={4}
        minValue={2}
        aria-label="scale"
        defaultValue={2}
        className="w-[12rem]"
        showTooltip={true}
        color="primary"
        onChange={(value) => setScaleSliderValue(value as number)}
        classNames={{
          track: "bg-primary/30",
        }}
      />
      {lang === "en" ? (
        <p className="min-w-[8rem] justify-start flex flex-row">
          Resolution x{scaleSliderValue}
        </p>
      ) : (
        <p className="min-w-[6rem] justify-start flex flex-row">
          解像度{scaleSliderValue}倍
        </p>
      )}
    </Button>
  );
}

function ModelSelector({ color }: ControlPanelProps) {
  return (
    <Button color={color as any} variant="flat" radius="full">
      <RadioGroup
        label=""
        color={color as any}
        defaultValue="model-a"
        orientation="horizontal"
        className="px-2 py-2"
      >
        {["Model-A", "Model-B", "Model-C"].map((model) => (
          <Radio
            key={model}
            value={model.toLowerCase()}
            classNames={{
              wrapper: "border-2 border-primary/40",
            }}
          >
            {model}
          </Radio>
        ))}
      </RadioGroup>
    </Button>
  );
}

function ControlPanel({ color = "primary" }: ControlPanelProps) {
  const dictionary = useDictionary();
  return (
    <div className="w-[1280px] h-[48px] bg-content2/0 flex flex-row items-center gap-4">
      <ScaleSlider color={color} />
      <ModelSelector color={color} />
      <Button color={color as any} variant="flat" radius="full">
        <Checkbox
          color={color as any}
          classNames={{
            wrapper: "border-2 border-primary/40",
          }}
        >
          {dictionary.imageTools.controlPanel.enableFaceRestoration}
        </Checkbox>
      </Button>
      <Button color={color as any} radius="full" isDisabled>
        {dictionary.imageTools.controlPanel.downloadAllProcessed}
      </Button>
    </div>
  );
}

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

  const addFile = useAddFile(filesAtom);
  const removeFile = useRemoveFile(filesAtom);
  const setAttributes = useSetAttributes(filesAtom);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currentModalFile, setCurrentModalFile] =
    useState<BasicImageTaskInfo | null>(null);

  async function processTask(file: BasicImageTaskInfo) {
    // avoid stale closure by take file as argument
    const imageUrl = file.fileUrl;

    const { data: submitData, error: submitError } = await upscaleImage({
      model: "RealESRGAN_x4plus_anime_6B",
      scale: 4,
      inputImage: file.fileUrlOnClient as string,
      outputImageEncoding: "png",
    });

    if (submitError) {
      toast.error("Failed to connect to the server");
      setAttributes(file, { status: BasicImageTaskStatus.FAILED });
      return;
    }

    const taskId = submitData.task_id;
    setAttributes(file, { taskId: taskId });

    const {
      data: watermarkedAndProcessedImageData,
      error: watermarkedAndProcessedImageError,
    } = await getWatermarkedAndProcessedImageBuffer(taskId);

    if (watermarkedAndProcessedImageError) {
      toast.error("Failed to connect to the server");
      setAttributes(file, { status: BasicImageTaskStatus.FAILED });
      return;
    }

    const base64Image = Buffer.from(
      watermarkedAndProcessedImageData.buffer
    ).toString("base64");

    const base64Url = getUrlFromBase64(base64Image);

    setAttributes(file, {
      processedUrl: base64Url,
      processedFileName: `${file.fileName}-processed.png`,
      status: BasicImageTaskStatus.SUCCEEDED,
    });
  }

  const onDrop = async (_files: File[]) => {
    for (const _file of _files) {
      if (process.env.NEXT_PUBLIC_NEED_TO_UPLOAD === "1") {
        const presignedUrl = await getPresignedUploadUrl(
          _file.name!,
          _file.type
        );
        // const presignedUrl = "";

        const uppy = new Uppy({
          autoProceed: false,
        }).use(XHRUpload, {
          method: "PUT",
          formData: false, // Use formData if you need a multipart upload (typically false for S3-like uploads)
          fieldName: "file", // Not needed when formData is false
          endpoint: presignedUrl,
        });

        uppy.on("file-added", (file: any) => {
          const fileName = file.name;
          const fileUrl = "";
          const progress = 0;
          const deleteMethod = () => {
            uppy.removeFile(file.id);
            removeFile(_file);
          };
          const processedUrl = "";
          const status = BasicImageTaskStatus.NOT_READY;

          const reader = new FileReader();
          reader.onloadend = () => {
            const fileUrlOnClient = reader.result as string;
            const image = new window.Image();
            image.src = fileUrlOnClient;
            image.onload = () => {
              const width = image.width;
              const height = image.height;
              const newFile: BasicImageTaskInfo = {
                fileName,
                fileUrl,
                progress,
                deleteMethod,
                processedUrl,
                status,
                width,
                height,
                fileUrlOnClient,
                taskMethod: null,
              };
              addFile(newFile);
            };
          };
          reader.readAsDataURL(_file);
        });

        uppy.on("progress", (progress: any) => {
          setAttributes(_file, { progress: progress });
        });

        uppy.on("complete", async (result: any) => {
          // const signedDownloadUrl = await getSignedDownloadUrl(_file!.name);

          setAttributes(_file, {
            // fileUrl: signedDownloadUrl,
            status: BasicImageTaskStatus.READY,
          });
        });

        // uppy.on("upload-error", (file, error) => {
        //   toast.error("Failed to upload file");
        //   setAttributes(_file, { status: BasicImageTaskStatus.FAILED });
        // });

        uppy.addFile({
          name: _file.name,
          type: _file.type,
          data: _file,
        });

        // do not need to upload
        uploadTaskPool.addTask(async () => {
          await uppy.upload();
        });
      } else {
        const fileName = _file.name;
        const fileUrl = "";
        const progress = 0;
        const deleteMethod = () => {
          removeFile(_file);
        };
        const processedUrl = "";
        const status = BasicImageTaskStatus.READY;

        const reader = new FileReader();
        reader.onloadend = () => {
          const fileUrlOnClient = reader.result as string;
          const image = new window.Image();
          image.src = fileUrlOnClient;
          image.onload = () => {
            const width = image.width;
            const height = image.height;
            const newFile: BasicImageTaskInfo = {
              fileName,
              fileUrl,
              progress,
              deleteMethod,
              processedUrl,
              status,
              width,
              height,
              fileUrlOnClient,
              taskMethod: null,
            };
            addFile(newFile);
          };
        };
        reader.readAsDataURL(_file);
      }
    }
  };

  useEffect(() => {
    files.forEach((file) => {
      if (file.status === BasicImageTaskStatus.READY) {
        const task = async () => await processTask(file);
        setAttributes(file, {
          taskMethod: task,
        });
        setAttributes(file, { status: BasicImageTaskStatus.IN_PROGRESS });
        processTaskPool.addTask(task);
      }
    });
  }, [files]);

  const download = async (file: BasicImageTaskInfo) => {
    const { data, error } = await getProcessedImageUrl(file.taskId as string);
    if (error) {
      toast.error("Failed to download file");
    }

    const downloadUrl = data.url;
    const response = await fetch(downloadUrl);

    const _blob = await response.blob();
    saveAs(_blob, file.processedFileName);
  };

  const openImageCompareModal = (file: BasicImageTaskInfo) => {
    setCurrentModalFile(file);
    onOpen();
  };

  return (
    <>
      {/* <Background /> */}
      <ImageCompareModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        leftImage={currentModalFile?.fileUrlOnClient as string}
        rightImage={currentModalFile?.processedUrl as string}
      />

      <div className="flex flex-col gap-12 items-center mt-[96px] mb-24">
        <div>{hero}</div>
        <div className="flex-row flex gap-24 mt-8">
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
          <div className="grid max-w-[84rem] grid-cols-1 gap-5 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
