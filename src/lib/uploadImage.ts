export interface ImageUploadResponse {
  uploadUrl: string;
  originalUrl: string;
  optimizedUrl: string;
  thumbnailUrl: string;
}

export async function uploadImage(file: File, entity: "product" | "brand"): Promise<ImageUploadResponse> {
  // 1. Request signed upload URL
  const res = await fetch("/api/uploads/url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filename: file.name,
      entity,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to get upload URL");
  }

  const data: ImageUploadResponse = await res.json();

  // 2. Upload file to S3 using fetch PUT
  const uploadRes = await fetch(data.uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  if (!uploadRes.ok) {
    throw new Error("Failed to upload image to S3");
  }

  // 3. Return the image URLs
  return data;
}
