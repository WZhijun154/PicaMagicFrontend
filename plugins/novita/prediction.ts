"use server";

interface UpscaleImageProps {
  model: string;
  scale: number;
  initImage: string;
  initImageUrl: string;
  outputImageEncoding: string;
}

export async function upscaleImage({
  model,
  scale,
  initImage,
  initImageUrl,
  outputImageEncoding,
}: UpscaleImageProps): Promise<any> {
  const url = "https://image.octoai.run/upscaling";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OCTOAI_TOKEN}`,
  };

  const body = JSON.stringify({
    model,
    scale,
    // init_image: initImage,
    init_image_url: initImageUrl,
    output_image_encoding: outputImageEncoding,
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error upscaling image:", error);
    throw error;
  }
}
