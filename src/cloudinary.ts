import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dxfqf6fgv',
  api_key: '458512914161167',
  api_secret: 'y5aixZe7RT-YLYDBlOWUN8zPBmg',
});

export const handleUpload = async (file: string) => {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: 'image',
    folder: 'reccomendations',
  });
  return res;
};

// cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// api_key: process.env.CLOUDINARY_API_KEY,
// api_secret: process.env.CLOUDINARY_API_SECRET,
