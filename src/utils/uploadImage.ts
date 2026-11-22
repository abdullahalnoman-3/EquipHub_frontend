import axios from "axios";

/**
 * Converts a File into a compact, persistent Base64 Data URL.
 * Automatically resizes to max 600px width/height to keep payload size small (~30-60KB).
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const MAX_SIZE = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height = Math.round((height * MAX_SIZE) / width);
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width = Math.round((width * MAX_SIZE) / height);
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
            resolve(dataUrl);
          } else {
            resolve(reader.result as string);
          }
        } catch {
          resolve(reader.result as string);
        }
      };
      img.onerror = () => resolve(reader.result as string);
      img.src = reader.result as string;
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads an image file directly to the project backend server.
 * The backend saves the file to disk in `uploads/` and serves it via Express static route.
 * Returns the permanent hosted URL (e.g. `http://localhost:5000/uploads/file-1732...jpg`).
 * Only this clean URL is stored in MongoDB.
 */
export async function uploadToImgBB(file: File): Promise<string> {
  // 1. Primary: Upload directly to the project backend server
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const uploadEndpoint = `${apiBaseUrl}/upload`;

    const formData = new FormData();
    formData.append("image", file);

    const res = await axios.post(uploadEndpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data?.success && res.data?.data?.url) {
      return res.data.data.url;
    }
  } catch (backendErr) {
    console.warn("Backend local upload failed, trying fallback:", backendErr);
  }

  // 2. Secondary: ImgBB if valid external API key is provided
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (apiKey && apiKey !== "placeholder") {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData);
      if (res.data?.success && res.data?.data?.url) {
        return res.data.data.url;
      }
    } catch (imgbbErr) {
      console.warn("ImgBB upload failed:", imgbbErr);
    }
  }

  // 3. Fallback: Base64 Data URL if servers are unreachable
  return fileToBase64(file);
}
