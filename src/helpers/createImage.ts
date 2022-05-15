/**
 * Creates a new HTMLImageElement from an image url
 * @param url
 */
export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image: HTMLImageElement = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error: ErrorEvent) => reject(error));
    image.src = url;
  });
