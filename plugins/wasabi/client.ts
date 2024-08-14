import { S3Client } from "@aws-sdk/client-s3";

const wasabiClient = new S3Client({
  region: "us-central-1", // Replace with your Wasabi bucket region
  endpoint: "https://s3.us-central-1.wasabisys.com", // Replace with your Wasabi endpoint
  credentials: {
    accessKeyId: process.env.WASABI_ACCESS_KEY_ID as string, // Store in your environment variables
    secretAccessKey: process.env.WASABI_SECRET_ACCESS_KEY as string, // Store in your environment variables
  },
});

export default wasabiClient;
