import express from 'express';
import UnidadesPresupuestales from '../controllers/UnidadesPresupuestales.js';

const router = express.Router();
const unidadesPresupuestales=new UnidadesPresupuestales();

router.get("/",(req,res) => {
    unidadesPresupuestales.getByEstado(res.locals.estado.Id)
    .then(
        (value) => {
            res.status(200).json(value)
        },
        (error) => res.status(500).json({message: 'Error al consultar la BDD'})
    );
})

export default router;