"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const adminController_1 = require("../controllers/adminController");
const uploadImage_1 = require("../library/helpers/uploadImage");
const router = express.Router();
router.get("/register_admin", uploadImage_1.upload.single("profilePhoto"), adminController_1.RegisterAdmin);
exports.default = router;
