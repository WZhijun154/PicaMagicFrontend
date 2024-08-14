"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import wasabiClient from "./client";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export async function getPresignedUploadUrl(
  fileName: string,
  fileType: string
) {
  const command = new PutObjectCommand({
    Bucket: process.env.WASABI_USERLOADED_BUCKET,
    Key: fileName,
    ContentType: fileType, // Replace with the actual content type
  });

  try {
    const presignedUrl = await getSignedUrl(wasabiClient, command, {
      expiresIn: 3600,
    });
    return presignedUrl;
  } catch (error) {
    return "Error getting presigned URL";
  }
}

export async function getSignedDownloadUrl(fileName: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.WASABI_USERLOADED_BUCKET,
    Key: fileName,
  });

  try {
    const presignedUrl = await getSignedUrl(wasabiClient, command, {
      expiresIn: 3600, // 1 hour
    });
    return presignedUrl;
  } catch (error) {
    return "Error getting presigned URL";
  }
}
