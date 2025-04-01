import express from 'express';
import CapitulosDeGasto from '../controllers/CapitulosDeGasto.js';

const router = express.Router();
const capitulosDeGasto=new CapitulosDeGasto();

router.get("/",(req,res) => {
    capitulosDeGasto.getByVersion(res.locals.versionPresupuesto.Id)
    .then(
        (value) => {
            res.status(200).json({
                versionPresupuesto: res.locals.versionPresupuesto,
                presupuesto: value
            })
        },
        (error) => res.status(500).json({message: 'Error al consultar la BDD'})
    )
})
router.get("/:ClaveCapituloGasto",(req,res) => {
    capitulosDeGasto.getByVersion(res.locals.versionPresupuesto.Id,req.params.ClaveCapituloGasto)
    .then(
        (value) => {
            if(value.Clave){
                res.status(200).json({
                    versionPresupuesto: res.locals.versionPresupuesto,
                    presupuesto: value
                })
            }else{
                res.status(404).json({
                    message: "Capitulo de gasto no encontrado"
                })
            }
            
        },
        (error) => res.status(500).json({message: 'Error al consultar la BDD'})
    )
})

export default router;