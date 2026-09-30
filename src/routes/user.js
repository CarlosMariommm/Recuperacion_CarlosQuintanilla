import express from "express";
import registerUserController from "../controller/registerUserController.js";

import upload from "../utils/cloudinaryConfig.js"

const rouer= express.Router();
Router.route("/")
.post(upload.single("image"), registerUserController.register);

export default router;
