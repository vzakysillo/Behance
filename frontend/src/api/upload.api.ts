import { AxiosApi, type ApiResponse } from "./axios.api";

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await AxiosApi.post<ApiResponse<{ url: string }>>("/upload/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const url = res.data.data?.url;
  if (!url) throw new Error("No image URL returned");
  return url;
};
