import { Router } from "express";
import { identifyUser } from "../controller/user.controller.js";

const router = Router()

//We define the route here, i.e, /identify
router.route("/identify").post(identifyUser)

export default router