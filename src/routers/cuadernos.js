import express from 'express';
import Cuadernos from '../controllers/Cuadernos.js';

const router = express.Router();
const cuadernos=new Cuadernos();

router.get("/",(req,res) => {
    cuadernos.listPublic()
    .then(
        (value) => {
            res.status(200).json(value)
        },
        (error) => res.status(500).json({message: 'Error al consultar la BDD'})
    );
})

router.get("/User",(req,res) => {
    cuadernos.getByUser(req.user)
    .then(
        (value) => {
            res.status(200).json(value)
        },
        (error) => res.status(500).json({message: 'Error al consultar la BDD'})
    );
})

export default router;