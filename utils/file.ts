import { atom } from 'jotai';

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
  NOT_READY = 'NOT_READY',
  READY = 'READY',
  STARTED = 'STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  FAILED = 'FAILED',
  SUCCEEDED = 'SUCCEEDED',
}

export interface BasicImageTaskInfo extends ImageFileInfoProps {
  taskMethod: any;
  processedUrl: string;
  status: BasicImageTaskStatus;
}

export const filesAtomForUpscaler = atom<BasicImageTaskInfo[]>([]);

export const filesAtomForBgRemover = atom<BasicImageTaskInfo[]>([]);

export const filesAtomForColorizer = atom<BasicImageTaskInfo[]>([]);

export const filesAtomForDenoiser = atom<BasicImageTaskInfo[]>([]);

export const filesAtomForDeblurer = atom<BasicImageTaskInfo[]>([]);
