import express from 'express';
import VersionesPresupuesto from '../controllers/VersionesPresupuesto.js';

const router = express.Router();
const versionesPresupuesto = new VersionesPresupuesto();

router.get("/",(req,res) => {
    versionesPresupuesto.showByEstado(res.locals.estado.Id)
    .then(
        (value) => res.status(200).json(value) ,
        (error) => res.status(500).json({message: 'Error al consultar la BDD'})
    );
});

router.get("/Historico",(req,res) => {
    versionesPresupuesto.getHistoricoByEstado(res.locals.estado.Id)
    .then(
        (value) => res.status(200).json(value) ,
        (error) => res.status(500).json({message: 'Error al consultar la BDD'})
    );
});

export default router;
