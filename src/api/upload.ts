import fetchData from '../utils/fetchData';
const prefix: string = import.meta.env.VITE_SERVER_HOST;

type UploadFileResponse = {
  fileUrl: string;
  fileId: string;
};

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.set('file', file);

  return fetchData<UploadFileResponse>(`${prefix}/api/file/upload`, {
    method: 'POST',
    body: formData,
  });
}
