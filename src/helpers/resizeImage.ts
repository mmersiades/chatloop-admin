import { createImage } from './createImage';

export const resizeImage = async (imageSrc: string): Promise<string> => {
  const image: HTMLImageElement = await createImage(imageSrc);
  const canvas = document.createElement('canvas');

  // Calculates and sets canvas size
  const MAX_SIZE = 512;
  let width = image.width;
  let height = image.height;

  if (width > height) {
    if (width > MAX_SIZE) {
      height *= MAX_SIZE / width;
      width = MAX_SIZE;
    }
  } else {
    if (height > MAX_SIZE) {
      width *= MAX_SIZE / height;
      height = MAX_SIZE;
    }
  }
  canvas.width = width;
  canvas.height = height;

  // Creates canvas and image
  const ctx = canvas.getContext('2d');
  ctx && ctx.drawImage(image, 0, 0, width, height);

  // Converts image to dataUrl
  const dataUrl: string = canvas.toDataURL('image/png');
  return dataUrl;
};
