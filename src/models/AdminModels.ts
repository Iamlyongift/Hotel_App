import mongoose from "mongoose";

interface AdminType {
  adminName: string;
  username: string;
  password: string;
  email: string;
  phone_number: string;
  profilePhoto: string;
  hotel: mongoose.Schema.Types.ObjectId[];
}

const adminSchema = new mongoose.Schema(
  {
    adminName: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    phone_number: { type: String, required: true },
    profilePhoto: { type: String, required: true },
    hotel: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model<AdminType>("Admin", adminSchema);

export default Admin;
