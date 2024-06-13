import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import adminRequest from "../../types/adminRequest";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (
    req: adminRequest,
    res: Response,
    file: Express.Multer.File
  ) => {
    return {
      folder: "Image_Uploads",
    };
  },
});

export const upload = multer({ storage: storage });
