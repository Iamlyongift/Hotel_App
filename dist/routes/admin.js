"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const adminController_1 = require("../controllers/adminController");
const uploadImage_1 = require("../library/helpers/uploadImage");
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = express.Router();
router.post("/register_admin", uploadImage_1.upload.single("profilePhoto"), adminController_1.RegisterAdmin);
router.post("/login", adminController_1.loginAdmin);
router.put("/update_profile", auth_1.default, uploadImage_1.upload.single("profilePhoto"), adminController_1.updateProfile);
exports.default = router;
