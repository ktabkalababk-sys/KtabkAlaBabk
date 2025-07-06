import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import Joi from "joi";
import ImageKit from "imagekit";
import { config } from "dotenv";
import { AppError } from "../utils/appError.js";

config({ path: "./.env" });

// Valid file MIME types
export const fileValidation = {
  image: ["image/png", "image/jpg", "image/jpeg", "image/gif"],
};

// Joi schema for validating uploaded file structure
const fileValidationSchema = Joi.object({
  fieldname: Joi.string().required(),
  originalname: Joi.string().required(),
  size: Joi.number().optional(),
  buffer: Joi.binary().optional(),
  encoding: Joi.string().required(),
  mimetype: Joi.string().required(),
});

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.PUBLICKEY,
  privateKey: process.env.PRIVATEKEY,
  urlEndpoint: process.env.URLENFPOINT,
});

// Setup multer file upload
export const fileUpload = ({ allowFile = fileValidation.image } = {}) => {
  const storage = multer.memoryStorage();

  const fileFilter = (req, file, cb) => {
    const { error } = fileValidationSchema.validate(file);

    if (error || !allowFile.includes(file.mimetype)) {
      return cb(new AppError("Image format not valid", 415), false);
    }

    return cb(null, true);
  };

  return multer({ storage, fileFilter });
};

// Upload single file middleware
export const uploadSingleFile = (fieldName) => fileUpload().single(fieldName);

// Upload image to ImageKit
export const uploadToImageKit = (file, folderName) => {
  return new Promise((resolve, reject) => {
    const fileName = `${uuidv4()}-${file.originalname}`;
    imagekit.upload(
      {
        file: file.buffer,
        fileName,
        folder: `Books/${folderName}`,
      },
      (err, result) => {
        if (err) {
          // Don't throw inside callback — just reject
          return reject(err);
        }
        resolve(result);
      }
    );
  });
};

// Delete image from ImageKit
export const deleteImage = async (fileId) => {
  return new Promise((resolve, reject) => {
    if (!fileId) return resolve(null);

    imagekit.deleteFile(fileId, (err, result) => {
      if (err) {
        console.error("ImageKit Delete Error:", err);
        return reject(new AppError(err.message, 500));
      }

      resolve(result);
    });
  });
};
