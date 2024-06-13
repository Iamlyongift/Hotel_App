"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoomSchema = exports.createRoomSchema = exports.updateprofileSchema = exports.option = exports.LoginSchema = exports.RegisterSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.RegisterSchema = joi_1.default.object({
    adminName: joi_1.default.string().required(),
    username: joi_1.default.string().required(),
    password: joi_1.default.string()
        .min(6)
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
    confirm_password: joi_1.default.string()
        .valid(joi_1.default.ref("passWord"))
        .required()
        .label("confirm_password")
        .messages({ "any.only": "{{#label}} does not match" }),
    email: joi_1.default.string().email().required(),
    phone_number: joi_1.default.string().required(),
    profilePhoto: joi_1.default.string().required(),
});
exports.LoginSchema = joi_1.default.object({
    username: joi_1.default.string().required(),
    password: joi_1.default.string()
        .min(6)
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
});
exports.option = {
    abortearly: false,
    errors: {
        wrap: {
            label: "",
        },
    },
};
exports.updateprofileSchema = joi_1.default.object({
    adminName: joi_1.default.string(),
    phone_number: joi_1.default.string(),
    profilePhoto: joi_1.default.string(),
});
exports.createRoomSchema = joi_1.default.object({
    roomType: joi_1.default.string().required(),
    pictures: joi_1.default.string().required(),
    price: joi_1.default.string().required(),
    availability: joi_1.default.string().required(),
});
exports.updateRoomSchema = joi_1.default.object({
    roomType: joi_1.default.string().required(),
    pictures: joi_1.default.string().optional(),
    price: joi_1.default.string().required(),
    availability: joi_1.default.string().required(),
});
