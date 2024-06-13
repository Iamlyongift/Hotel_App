import express = require("express");
import auth from "../middlewares/auth";
import { upload } from "../library/helpers/uploadImage";
import {
  addRoom,
  updateRoom,
  deleteRoom,
  getAllRooms,
  getSingleRoom,
} from "../controllers/hotelController";

const router = express.Router();
/* POST create room. */
router.post("/create_room", auth, upload.single("pictures"), addRoom);
router.put("/update_room/:id", auth, upload.single("pictures"), updateRoom);
router.get("/get_All_Room", auth, getAllRooms);
router.get("/get_single_room/:id", auth, getSingleRoom);
router.delete("/delete_single_room/:id", auth, deleteRoom);

export default router;
