import { Router } from "express";
import * as companyController from "../controllers/company.controller.js";
import { authJwt } from "../middlewares/index.js";
import {validateCompany} from "../validators/company.validator.js";


const router = Router();

router.get('/:companyId', [authJwt.verifyToken, authJwt.isAdmin], companyController.getCompanyById);
router.put('/:companyId', [authJwt.verifyToken, authJwt.isAdmin], validateCompany(), companyController.updateCompanyById);

export default router;