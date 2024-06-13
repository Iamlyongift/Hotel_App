"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const uploadImage_1 = require("../library/helpers/uploadImage");
const hotelController_1 = require("../controllers/hotelController");
const router = express.Router();
router.post("/create_room", auth_1.default, uploadImage_1.upload.single("pictures"), hotelController_1.addRoom);
router.put("/update_room/:id", auth_1.default, uploadImage_1.upload.single("pictures"), hotelController_1.updateRoom);
router.get("/get_All_Room", auth_1.default, hotelController_1.getAllRooms);
router.get("/get_single_room/:id", auth_1.default, hotelController_1.getSingleRoom);
router.delete("/delete_single_room/:id", auth_1.default, hotelController_1.deleteRoom);
exports.default = router;
