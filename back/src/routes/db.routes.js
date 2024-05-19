import { Router } from "express";
// import { dbUserSchema } from "../models/DbUsers.js";
import * as dbController from "../controllers/db.controller.js";

const router = Router();

router.post('/', dbController.createDbUser);
router.get('/', dbController.showDbUsers);


export default router;