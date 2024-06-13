"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const hotelSchema = new mongoose_1.default.Schema({
    roomType: { type: String, required: true },
    pictures: { type: String, required: true },
    price: { type: String, required: true },
    availability: { type: String, required: true },
    user: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Admin",
        },
    ],
}, {
    timestamps: true,
});
const Hotel = mongoose_1.default.model("Hotel", hotelSchema);
exports.default = Hotel;
