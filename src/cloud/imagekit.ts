const ImageKit = require('imagekit');

const imagekitCloud = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export const handleUploadImagekit = async (file: any) => {
  const uploaded = await imagekitCloud.upload({
    file: file,
    fileName: 'filename',
    folder: 'user_avatars',
  });
  return uploaded;
};

export const handleDeleteImagekitImage = async (imageId: string) => {
  await imagekitCloud.deleteFile(imageId);
};
