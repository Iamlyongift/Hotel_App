import { Request, Response } from "express";
import { createRoomSchema, updateRoomSchema, option } from "../utils/utils.";
import Hotel from "../models/hotelModels";
import { v2 as cloudinaryV2 } from "cloudinary";

export const addRoom = async (req: Request | any, res: Response) => {
  try {
    const verify = req.user;

    // Check if a file was uploaded and set the pictures field
    let pictureUrl = "";
    if (req.file) {
      // Upload the image to Cloudinary and retrieve its URL
      const result = await cloudinaryV2.uploader.upload(req.file.path);
      pictureUrl = result.secure_url; // Store the URL of the uploaded picture
      req.body.pictures = pictureUrl; // Set the pictures field in req.body
    }

    // Validate the request body
    const validateUser = createRoomSchema.validate(req.body, option);
    if (validateUser.error) {
      return res
        .status(400)
        .json({ Error: validateUser.error.details[0].message });
    }

    const { roomType, price, availability } = validateUser.value;

    // Create a new room entry in the database
    const newRoom = await Hotel.create({
      roomType,
      pictures: pictureUrl, // Store single picture URL
      price,
      availability,
      user: verify._id, // Ensure user ID is associated with the room
    });

    // Respond with success message and the created room
    res.status(201).json({ message: "Room added successfully", newRoom });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the room" });
  }
};

//getAllRoom
export const getAllRooms = async (req: Request, res: Response) => {
  try {
    const getAllRoom = await Hotel.find().populate("user");
    res.status(200).json({
      msg: "rooms sucessfully fetched",
      getAllRoom,
    });
  } catch (error) {
    console.log(error);
  }
};

//getSingleRoom
export const getSingleRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const room = await Hotel.findById(id);

    if (!room) {
      return res.status(400).json({
        msg: "room not found",
      });
    }
    res.status(200).json({
      msg: "room sucessfully fetched",
      room,
    });
  } catch (error) {
    console.log(error);
  }
};

//update room
export const updateRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate the request body
    const validateUser = updateRoomSchema.validate(req.body, option);
    if (validateUser.error) {
      return res
        .status(400)
        .json({ Error: validateUser.error.details[0].message });
    }

    // Check if a file was uploaded and set the pictures field
    let pictureUrl = "";
    if (req.file) {
      // Upload the image to Cloudinary and retrieve its URL
      const result = await cloudinaryV2.uploader.upload(req.file.path);
      pictureUrl = result.secure_url; // Store the URL of the uploaded picture
      req.body.pictures = pictureUrl; // Set the pictures field in req.body
    }

    // Check if the room exists
    const room = await Hotel.findById(id);
    if (!room) {
      return res.status(400).json({
        error: "Room not found",
      });
    }

    // Update the room
    const updateRecord = await Hotel.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    if (!updateRecord) {
      return res.status(404).json({
        msg: "Room not updated",
      });
    }

    return res.status(200).json({
      message: "Room updated successfully",
      updateRecord,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An error occurred while updating the room" });
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const room = await Hotel.findByIdAndDelete(id);

    if (!room) {
      return res.status(404).json({
        message: "Exercise not found",
      });
    }

    res.status(200).json({
      message: "Exercise successfully deleted",
      room,
    });
  } catch (error) {
    console.log("Problem deleting exercise");
  }
};
