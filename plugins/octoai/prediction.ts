"use server";
import sharp from "sharp";

interface UpscaleImageProps {
  model: "RealESRGAN_x4plus_anime_6B" | "RealESRNet_x4plus" | "4x-UltraSharp";
  scale: 2 | 3 | 4;
  inputImage: string;
  outputImageEncoding: "jpeg" | "png" | "webp";
}

export async function upscaleImage({
  model,
  scale,
  inputImage,
  outputImageEncoding,
}: UpscaleImageProps): Promise<any> {
  const url = "https://api.novita.ai/v3/async/upscale";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.NOVITA_TOKEN}`,
  };

  const payload = {
    extra: {
      response_image_type: "jpeg",
    },
    request: {
      model_name: "RealESRGAN_x4plus_anime_6B",
      image_base64: inputImage,
      scale_factor: 2,
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return { data: null, error: "fetch error" };
    }

    return { data: await response.json(), error: null };
  } catch (error) {
    console.error("Error upscaling image:", error);
    return { data: null, error: "fetch error" };
  }
}

export async function queryTask(taskId: string): Promise<any> {
  const url = `https://api.novita.ai/v3/async/task-result?task_id=${encodeURIComponent(
    taskId
  )}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.NOVITA_TOKEN}`,
      },
    });

    if (!response.ok) {
      return { data: null, error: "fetch error" };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error("Error:", error);
    return { data: null, error: "fetch error" };
  }
}

export async function pollTask(taskId: string): Promise<any> {
  let taskResult = await queryTask(taskId);
  while (taskResult.data?.task.status !== "TASK_STATUS_SUCCEED") {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    taskResult = await queryTask(taskId);
  }

  return taskResult;
}

const watermarkText = "Hello World!";

const svgText = `
      <svg width="400" height="100">
        <rect x="0" y="0" width="400" height="100" fill="white" opacity="0" />
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="40" fill="white" opacity="0.5">${watermarkText}</text>
      </svg>
    `;
const textBuffer = Buffer.from(svgText);

export async function getWatermarkedAndProcessedImageBuffer(
  taskId: string
): Promise<any> {
  const { data, error } = await pollTask(taskId);
  const processedImageUrl = data.images[0].image_url;
  const processedImage = await fetch(processedImageUrl);
  const processedImageBuffer = Buffer.from(await processedImage.arrayBuffer());
  const watermarkedImageBuffer = await sharp(processedImageBuffer)
    .composite([{ input: textBuffer, gravity: "southeast" }])
    .toBuffer();

  return { data: { buffer: processedImageBuffer }, error: null };
}

export async function getProcessedImageUrl(taskId: string): Promise<any> {
  const { data, error } = await queryTask(taskId);
  const processedImageUrl = data.images[0].image_url;
  return { data: { url: processedImageUrl }, error: null };
}
