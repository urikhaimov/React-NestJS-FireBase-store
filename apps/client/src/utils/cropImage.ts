// src/utils/cropImage.ts
export async function getCroppedImg(imageSrc: string, crop: any, zoom: number): Promise<Blob> {
  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // <-- critical for blob to work
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = url;
    });

  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const pixelCrop = {
    x: crop.x * scaleX,
    y: crop.y * scaleY,
    width: crop.width * scaleX,
    height: crop.height * scaleY,
  };

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx?.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to create cropped blob'));
    }, 'image/png');
  });
}
