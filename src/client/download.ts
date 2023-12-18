export const download = (fileName: string, fileContent: string): void => {
  const a = document.createElement('a');
  a.href = fileContent;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
