import { Request, Response } from "express";
import cloudinary from "../lib/cloudinary";
import fs from "fs";

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const file = req.file as Express.Multer.File;

    if (!file) {
      res.status(400).json({ message: "No image file uploaded" });
      return;
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "chatgroups",
    });

    fs.unlinkSync(file.path);
    
    res.status(200).json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ message: "Failed to upload image" });
  }
};
