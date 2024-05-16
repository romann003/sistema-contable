import { Router } from "express";
import * as companyController from "../controllers/company.controller.js";
import { authJwt } from "../middlewares/index.js";
import {validateCompany} from "../validators/company.validator.js";


const router = Router();

router.get('/', [authJwt.verifyToken, authJwt.isSuperAdmin], companyController.getCompanies);
router.get('/:companyId', [authJwt.verifyToken, authJwt.isSuperAdmin], companyController.getCompanyById);
router.put('/:companyId', [authJwt.verifyToken, authJwt.isSuperAdmin], validateCompany(), companyController.updateCompanyById);

export default router;