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

export const fileToJpgDataUrl = async (file: File): Promise<string> => {
  const img = document.createElement('img');
  img.src = await fileToDataUrl(file);
  return new Promise((resolve) => {
    img.onload = async () => {
      // This line is dynamically creating a canvas element
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, img.width, img.height);
      resolve(canvas.toDataURL('image/jpeg'));
    };
  });
};
