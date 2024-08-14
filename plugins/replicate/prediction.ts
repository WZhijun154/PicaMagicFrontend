"use server";

import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

interface UpscaleRealEsrganOptions {
  image: string;
  scale: 2 | 3 | 4;
  faceEnhance: boolean;
}

export async function upscaleRealEsrgan({
  image,
  scale,
  faceEnhance,
}: UpscaleRealEsrganOptions) {
  const prediction = await replicate.deployments.predictions.create(
    "wzhijun154",
    "real-esrgan",
    {
      input: {
        image: image,
        scale: scale,
        face_enhance: faceEnhance,
      },
    }
  );

  const result = await replicate.wait(prediction);

  console.log(result);
}
