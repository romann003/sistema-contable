// import { ZodError } from "zod";

// export const validateSchema = (schema) => (req, res, next) => {
//     try {
//         // schema.parse({ body: req.body, params: req.params, query: req.query });
//         schema.parse(req.body);
//         next();
//     } catch (error) {
//         if (error instanceof ZodError) {
//             return res.status(400).json({ error: error.issues.map((issue) => ({ message: issue.message })) });
//         }
//         return res.status(500).json({ message: "Error de servidor interno" });
//         // return res.status(400).json({ error: error.errors.map((error) => error.message) });
//     }
// }

export const validateSchema = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json(error.errors.map(error => error.message));
    }
};