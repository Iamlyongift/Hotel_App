import mongoose from "mongoose";

interface HotelType {
  roomType: string;
  pictures: string;
  price: string;
  availability: string;
  user: mongoose.Schema.Types.ObjectId[];
}

const hotelSchema = new mongoose.Schema(
  {
    roomType: { type: String, required: true },
    pictures: { type: String, required: true },
    price: { type: String, required: true },
    availability: { type: String, required: true },
    user: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Hotel = mongoose.model<HotelType>("Hotel", hotelSchema);

export default Hotel;
