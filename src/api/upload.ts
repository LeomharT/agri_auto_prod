import fetchData from '../utils/fetchData';
const prefix: string = import.meta.env.VITE_SERVER_HOST;

type UploadFileResponse = {
  bucketName: string;
  fileUrl: string;
  objectName: string;
};

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.set('file', file);

  return fetchData<UploadFileResponse>(`${prefix}/api/fileStorage/uploadFile`, {
    method: 'POST',
    body: formData,
  });
}
