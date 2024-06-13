"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const adminSchema = new mongoose_1.default.Schema({
    adminName: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    phone_number: { type: String, required: true },
    profilePhoto: { type: String, required: true },
    hotel: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Hotel",
        },
    ],
}, {
    timestamps: true,
});
const Admin = mongoose_1.default.model("Admin", adminSchema);
exports.default = Admin;
