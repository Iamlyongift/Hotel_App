import Joi from "joi";

export const RegisterSchema = Joi.object({
  adminName: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string()
    .min(6)
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
  confirm_password: Joi.string()
    .valid(Joi.ref("passWord"))
    .required()
    .label("confirm_password")
    .messages({ "any.only": "{{#label}} does not match" }),
  email: Joi.string().email().required(),
  phone_number: Joi.string().required(),
  profilePhoto: Joi.string().required(), // Changed to string to match Mongoose schema
});

export const LoginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string()
    .min(6)
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
});

export const option = {
  abortearly: false,
  errors: {
    wrap: {
      label: "",
    },
  },
};

export const updateprofileSchema = Joi.object({
  adminName: Joi.string(),
  phone_number: Joi.string(),
  profilePhoto: Joi.string(), // Changed to string to match Mongoose schema
});

export const createRoomSchema = Joi.object({
  roomType: Joi.string().required(),
  pictures: Joi.string().required(),
  price: Joi.string().required(),
  availability: Joi.string().required(),
});

export const updateRoomSchema = Joi.object({
  roomType: Joi.string().required(),
  pictures: Joi.string().optional(),
  price: Joi.string().required(),
  availability: Joi.string().required(),
});
