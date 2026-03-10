import { S3Client } from "@aws-sdk/client-s3";

const AWS_REGION = process.env.AWS_REGION || "us-east-1";
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_S3_ENDPOINT = process.env.AWS_S3_ENDPOINT;

export const s3Client = new S3Client({
  region: AWS_REGION,
  endpoint: AWS_S3_ENDPOINT || undefined,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID || "",
    secretAccessKey: AWS_SECRET_ACCESS_KEY || "",
  },
  forcePathStyle: process.env.AWS_S3_FORCE_PATH_STYLE === "true",
});

export const BUCKET_NAME = process.env.AWS_S3_BUCKET;
