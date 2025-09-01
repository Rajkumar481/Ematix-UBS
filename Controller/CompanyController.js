import Company from "../Schemas/CompanySchema.js";

export const createCompany = async (req, res) => {
    try {
        const saved = await Company.create(req.body);
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const getAllCompanys = async (req, res) => {
    try {
        const companys = await Company.find();
        res.json(companys);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) return res.status(404).send("Company not found");
        res.json(company);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const updateCompany = async (req, res) => {
    try {
        const updated = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).send('Company not found');
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const deleteCompany = async (req, res) => {
    try {
        const deleted = await Company.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).send('Company not found');
        res.send('Company deleted');
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
