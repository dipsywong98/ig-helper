export const fileToDataUrl = async (file: File): Promise<string> => (
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener(
      'load',
      () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('suppose to generate data url'));
        }
      },
      false,
    );

    reader.addEventListener(
      'error',
      () => {
        reject(reader.error);
      },
      false,
    );

    reader.readAsDataURL(file);
  }));

function convertDataURIToBinary(dataURI) {
  const BASE64_MARKER = ';base64,';
  const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  const base64 = dataURI.substring(base64Index);
  const raw = window.atob(base64);
  const rawLength = raw.length;
  const array = new Uint8Array(new ArrayBuffer(rawLength));

  for (let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

export const convertToJPG = async function (file: File): Promise<string> {
  const img = document.createElement('img');
  img.src = await fileToDataUrl(file);
  return new Promise((resolve) => {
    img.onload = async function (event) {
      // This line is dynamically creating a canvas element
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      // Resize your image here
      console.log(img.width, img.height);
      ctx.drawImage(img, 0, 0, img.width, img.height);
      // // To blob
      const jpgBlob = await new Promise((resolve2) => { canvas.toBlob(resolve2, 'image/jpg', 1); }); // refer to canvas.toblob API
      // To file
      // @ts-ignore
      const jpgFile = await new File([jpgBlob], `${file.name}.jpg`, { type: 'image/jpg' }); // refer to File API
      fileToDataUrl(jpgFile).then(resolve);
      // resolve(await);
    };
  });
};
