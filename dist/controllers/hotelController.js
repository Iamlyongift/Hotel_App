"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoom = exports.updateRoom = exports.getSingleRoom = exports.getAllRooms = exports.addRoom = void 0;
const utils_1 = require("../utils/utils.");
const hotelModels_1 = __importDefault(require("../models/hotelModels"));
const cloudinary_1 = require("cloudinary");
const addRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verify = req.user;
        let pictureUrl = "";
        if (req.file) {
            const result = yield cloudinary_1.v2.uploader.upload(req.file.path);
            pictureUrl = result.secure_url;
            req.body.pictures = pictureUrl;
        }
        const validateUser = utils_1.createRoomSchema.validate(req.body, utils_1.option);
        if (validateUser.error) {
            return res
                .status(400)
                .json({ Error: validateUser.error.details[0].message });
        }
        const { roomType, price, availability } = validateUser.value;
        const newRoom = yield hotelModels_1.default.create({
            roomType,
            pictures: pictureUrl,
            price,
            availability,
            user: verify._id,
        });
        res.status(201).json({ message: "Room added successfully", newRoom });
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: "An error occurred while creating the room" });
    }
});
exports.addRoom = addRoom;
const getAllRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getAllRoom = yield hotelModels_1.default.find().populate("user");
        res.status(200).json({
            msg: "rooms sucessfully fetched",
            getAllRoom,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getAllRooms = getAllRooms;
const getSingleRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const room = yield hotelModels_1.default.findById(id);
        if (!room) {
            return res.status(400).json({
                msg: "room not found",
            });
        }
        res.status(200).json({
            msg: "room sucessfully fetched",
            room,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getSingleRoom = getSingleRoom;
const updateRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const validateUser = utils_1.updateRoomSchema.validate(req.body, utils_1.option);
        if (validateUser.error) {
            return res
                .status(400)
                .json({ Error: validateUser.error.details[0].message });
        }
        let pictureUrl = "";
        if (req.file) {
            const result = yield cloudinary_1.v2.uploader.upload(req.file.path);
            pictureUrl = result.secure_url;
            req.body.pictures = pictureUrl;
        }
        const room = yield hotelModels_1.default.findById(id);
        if (!room) {
            return res.status(400).json({
                error: "Room not found",
            });
        }
        const updateRecord = yield hotelModels_1.default.findByIdAndUpdate(id, Object.assign({}, req.body), {
            new: true,
            runValidators: true,
            context: "query",
        });
        if (!updateRecord) {
            return res.status(404).json({
                msg: "Room not updated",
            });
        }
        return res.status(200).json({
            message: "Room updated successfully",
            updateRecord,
        });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "An error occurred while updating the room" });
    }
});
exports.updateRoom = updateRoom;
const deleteRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const room = yield hotelModels_1.default.findByIdAndDelete(id);
        if (!room) {
            return res.status(404).json({
                message: "Exercise not found",
            });
        }
        res.status(200).json({
            message: "Exercise successfully deleted",
            room,
        });
    }
    catch (error) {
        console.log("Problem deleting exercise");
    }
});
exports.deleteRoom = deleteRoom;
