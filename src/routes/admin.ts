import express = require("express");
import {
  RegisterAdmin,
  loginAdmin,
  updateProfile,
} from "../controllers/adminController";
import { upload } from "../library/helpers/uploadImage";
import auth from "../middlewares/auth";
const router = express.Router();

/* GET users listing. */
router.post("/register_admin", upload.single("profilePhoto"), RegisterAdmin);
router.post("/login", loginAdmin);
router.put(
  "/update_profile",
  auth,
  upload.single("profilePhoto"),
  updateProfile
);
export default router;
