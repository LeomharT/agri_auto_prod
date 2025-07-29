export async function downloadFile(res: globalThis.Response) {
  const regex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  const disposition = res.headers.get('content-disposition');
  const filename = regex.exec(disposition ?? '');

  if (filename) {
    const a = document.createElement('a');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    a.href = url;
    a.download = filename[1];
    document.body.append(a);
    a.click();

    URL.revokeObjectURL(url);
    a.remove();
  }
}
