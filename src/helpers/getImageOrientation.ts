import { Orientation } from '../@types/enums';
import { createImage } from './createImage';

type GetImageOrientation = (imageSrc: string) => Promise<Orientation>;
export const getImageOrientation: GetImageOrientation = async (imageSrc) => {
  const image: HTMLImageElement = await createImage(imageSrc);

  if (image.width === image.height) {
    return Orientation.square;
  }

  if (image.width > image.height) {
    return Orientation.landscape;
  }

  return Orientation.portrait;
};
