import { CompanySchema } from "../models/Company.js";

export const getCompanies = async (req, res) => {
    try {
        const companies = await CompanySchema.findAll( {  order: [['createdAt' && 'updatedAt', 'DESC']]} );
        if (companies.length === 0) return res.status(404).json({ message: "No hay companias registradas" });
        res.status(200).json(companies);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getCompanyById = async (req, res) => {
    try {
        const getCompany = await CompanySchema.findOne({ where: { id: req.params.companyId } });
        if (!getCompany) return res.status(404).json({ message: "Empresa no encontrada" });

        res.status(200).json(getCompany);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const updateCompanyById = async (req, res) => {
    try {
        const updatedCompany = await CompanySchema.findByPk(req.params.companyId);
        if (!updatedCompany) return res.status(404).json({ message: "Empresa no encontrada" });

        updatedCompany.set(req.body);
        await updatedCompany.save();
        // if (!updatedCompany) return res.status(200).json(updatedCompany);
        res.status(200).json(updatedCompany);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// function allInputValidation(req, res) {
//     const { business_name, nit, phone, address } = req.body;
//     if (!business_name || !nit || !phone || !address) {
//         return res.status(400).json({ message: "Todos los campos son obligatorios" });
//     }
// }

// async function validations (req, res) {
//     if (req.body.business_name) {
//         const business_nameFound = await CompanySchema.findOne({ where: { business_name: req.body.business_name } });
//         if (business_nameFound) return res.status(400).json(['Esta empresa ya existe']);
//     }

//     if (req.body.nit) {
//         const nitFound = await CompanySchema.findOne({ where: { nit: req.body.nit } });
//         if (nitFound) return res.status(400).json(['Este nit ya existe']);
//     }
// }