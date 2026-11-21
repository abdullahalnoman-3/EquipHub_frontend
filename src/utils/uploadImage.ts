import axios from "axios";

/**
 * Uploads an image file to ImgBB and returns the hosted display URL.
 * Falls back gracefully if no API key is provided.
 */
export async function uploadToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!apiKey || apiKey === "placeholder") {
    // If no key is configured in dev, create local object URL as fallback preview
    return URL.createObjectURL(file);
  }

  const formData = new FormData();
  formData.append("image", file);

  const res = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData);
  if (res.data?.success && res.data?.data?.url) {
    return res.data.data.url;
  }

  throw new Error(res.data?.error?.message || "Failed to upload image to ImgBB");
}
