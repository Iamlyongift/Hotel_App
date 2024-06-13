import { Request, Response } from "express";

import {
  RegisterSchema,
  LoginSchema,
  updateprofileSchema,
  option,
} from "../utils/utils.";
import Admin from "../models/AdminModels";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v2 as cloudinaryV2 } from "cloudinary";

const jwtsecret = process.env.JWT_SECRET as string;

export const RegisterAdmin = async (req: Request, res: Response) => {
  try {
    const adminName = req.body.adminName;
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const phone_number = req.body.phone_number;
    const profilePhoto = req.body.profilePhoto;

    //validate user

    const validateAdmin = RegisterSchema.validate(req.body.option);

    if (validateAdmin.error) {
      res.status(400).json({ Error: validateAdmin.error.details[0].message });
    }
    //Hashing password
    const passwordHash = await bcrypt.hash(password, await bcrypt.genSalt(12));

    const existingAdmin = await Admin.findOne({ email: email });

    // Initialize a variable to store the picture URL
    let pictureUrl = "";

    // Check if a file was uploaded
    if (req.file) {
      // Upload the image to Cloudinary and retrieve its URL
      const result = await cloudinaryV2.uploader.upload(req.file.path);
      pictureUrl = result.secure_url; // Store the URL of the uploaded picture
    }
    //create admin logins
    if (!existingAdmin) {
      const newAdmin = await Admin.create({
        adminName,
        username,
        password: passwordHash,
        email,
        phone_number,
        profilePhoto: pictureUrl,
      });
      return res.status(200).json({ msg: "Registeration sucessful", newAdmin });
    }
    res.status(400).json({ error: "admin already exist" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "internal server error" });
  }
};

//Admin login
export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Validate user input
    const { error } = LoginSchema.validate(req.body, option);
    if (error) {
      return res.status(400).json({ Error: error.details[0].message });
    }

    // Verify if user exists
    const User = await Admin.findOne({ username });
    if (!User) {
      return res.status(400).json({ error: "Admin not found" });
    }

    // Compare password
    const validUser = await bcrypt.compare(password, User.password);
    if (!validUser) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Generate token
    const token = jwt.sign({ _id: User._id }, jwtsecret, { expiresIn: "30d" });

    // Send response
    return res.status(200).json({
      msg: "Login Successful",
      User,
      token,
    });
  } catch (error) {
    console.error("Something went wrong logging in:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//update adminprofile
export const updateProfile = async (req: Request | any, res: Response) => {
  try {
    const { adminName, phone_number, password, profilePhoto } = req.body;

    // Validate request body
    const { error, value } = updateprofileSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ Error: error.details.map((err: any) => err.message) });
    }

    // Check if password is provided and hash it
    let passwordHash = undefined;
    if (password) {
      passwordHash = await bcrypt.hash(password, await bcrypt.genSalt(12));
    }

    let pictureUrl = profilePhoto; // Use existing profile photo if no new one is uploaded

    // Check if a file was uploaded
    if (req.file) {
      // Upload the image to Cloudinary and retrieve its URL
      const result = await cloudinaryV2.uploader.upload(req.file.path);
      pictureUrl = result.secure_url; // Store the URL of the uploaded picture
    }

    // Construct update object
    const updateFields: any = {
      adminName,
      phone_number,
      profilePhoto: pictureUrl,
    };

    if (passwordHash) {
      updateFields.password = passwordHash;
    }

    // Find and update the user profile using the authenticated user's ID
    const profile = await Admin.findByIdAndUpdate(req.user._id, updateFields, {
      new: true,
    });

    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated", profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};
