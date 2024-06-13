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
exports.updateProfile = exports.loginAdmin = exports.RegisterAdmin = void 0;
const utils_1 = require("../utils/utils.");
const AdminModels_1 = __importDefault(require("../models/AdminModels"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cloudinary_1 = require("cloudinary");
const jwtsecret = process.env.JWT_SECRET;
const RegisterAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminName = req.body.adminName;
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        const phone_number = req.body.phone_number;
        const profilePhoto = req.body.profilePhoto;
        const validateAdmin = utils_1.RegisterSchema.validate(req.body.option);
        if (validateAdmin.error) {
            res.status(400).json({ Error: validateAdmin.error.details[0].message });
        }
        const passwordHash = yield bcryptjs_1.default.hash(password, yield bcryptjs_1.default.genSalt(12));
        const existingAdmin = yield AdminModels_1.default.findOne({ email: email });
        let pictureUrl = "";
        if (req.file) {
            const result = yield cloudinary_1.v2.uploader.upload(req.file.path);
            pictureUrl = result.secure_url;
        }
        if (!existingAdmin) {
            const newAdmin = yield AdminModels_1.default.create({
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
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "internal server error" });
    }
});
exports.RegisterAdmin = RegisterAdmin;
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const { error } = utils_1.LoginSchema.validate(req.body, utils_1.option);
        if (error) {
            return res.status(400).json({ Error: error.details[0].message });
        }
        const User = yield AdminModels_1.default.findOne({ username });
        if (!User) {
            return res.status(400).json({ error: "Admin not found" });
        }
        const validUser = yield bcryptjs_1.default.compare(password, User.password);
        if (!validUser) {
            return res.status(400).json({ error: "Invalid password" });
        }
        const token = jsonwebtoken_1.default.sign({ _id: User._id }, jwtsecret, { expiresIn: "30d" });
        return res.status(200).json({
            msg: "Login Successful",
            User,
            token,
        });
    }
    catch (error) {
        console.error("Something went wrong logging in:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.loginAdmin = loginAdmin;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminName, phone_number, password, profilePhoto } = req.body;
        const { error, value } = utils_1.updateprofileSchema.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            return res
                .status(400)
                .json({ Error: error.details.map((err) => err.message) });
        }
        let passwordHash = undefined;
        if (password) {
            passwordHash = yield bcryptjs_1.default.hash(password, yield bcryptjs_1.default.genSalt(12));
        }
        let pictureUrl = profilePhoto;
        if (req.file) {
            const result = yield cloudinary_1.v2.uploader.upload(req.file.path);
            pictureUrl = result.secure_url;
        }
        const updateFields = {
            adminName,
            phone_number,
            profilePhoto: pictureUrl,
        };
        if (passwordHash) {
            updateFields.password = passwordHash;
        }
        const profile = yield AdminModels_1.default.findByIdAndUpdate(req.user._id, updateFields, {
            new: true,
        });
        if (!profile) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User updated", profile });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "An unexpected error occurred" });
    }
});
exports.updateProfile = updateProfile;
