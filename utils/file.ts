import { atom, Atom, useSetAtom, PrimitiveAtom } from "jotai";

export interface FileInfoProps {
  fileName: string;
  fileUrl: string;
  progress: number;
  fileUrlOnClient?: string;
  deleteMethod?: () => void;
}

export interface ImageFileInfoProps extends FileInfoProps {
  width?: number;
  height?: number;
}

export enum BasicImageTaskStatus {
  NOT_READY = "NOT_READY",
  READY = "READY",
  STARTED = "STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  FAILED = "FAILED",
  SUCCEEDED = "SUCCEEDED",
}

export interface BasicImageTaskInfo extends ImageFileInfoProps {
  taskMethod: any;
  processedUrl: string;
  watermarkedProcessedUrl?: string;
  status: BasicImageTaskStatus;
}

export const filesAtomForUpscaler = atom<BasicImageTaskInfo[]>([]);

export const filesAtomForBgRemover = atom<BasicImageTaskInfo[]>([]);

export const filesAtomForColorizer = atom<BasicImageTaskInfo[]>([]);

export const filesAtomForDenoiser = atom<BasicImageTaskInfo[]>([]);

export const filesAtomForDeblurer = atom<BasicImageTaskInfo[]>([]);

// utility hooks
export const useAddFile = (filesAtom: PrimitiveAtom<BasicImageTaskInfo[]>) => {
  const setFiles = useSetAtom(filesAtom);

  return (file: BasicImageTaskInfo) => {
    setFiles((prevFiles) => [...prevFiles, file]);
  };
};

export const useRemoveFile = (
  filesAtom: PrimitiveAtom<BasicImageTaskInfo[]>
) => {
  const setFiles = useSetAtom(filesAtom);

  return (file: BasicImageTaskInfo | File) => {
    let fileName = file instanceof File ? file.name : file.fileName;
    setFiles((prevFiles) => prevFiles.filter((f) => f.fileName !== fileName));
  };
};

export const useSetAttributes = (
  filesAtom: PrimitiveAtom<BasicImageTaskInfo[]>
) => {
  const setFiles = useSetAtom(filesAtom);

  return (
    file: File | BasicImageTaskInfo,
    attributes: Partial<BasicImageTaskInfo>
  ) => {
    const fileName = file instanceof File ? file.name : file.fileName;

    setFiles((prevFiles) =>
      prevFiles.map((prevFile) =>
        prevFile.fileName === fileName
          ? { ...prevFile, ...attributes }
          : prevFile
      )
    );
  };
};
