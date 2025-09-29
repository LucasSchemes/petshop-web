import express from "express";
const router = express.Router();

// exemplo de rota
router.get("/", (req, res) => {
    res.send("Rota de slots funcionando!");
});

export default router;
