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
    const claveCapituloGasto=req.params.ClaveCapituloGasto
    let versionesPresupuesto=[];
    Array.isArray(res.locals.versionPresupuesto) 
        ? versionesPresupuesto=res.locals.versionPresupuesto.map( (version) => version.Id )
        : versionesPresupuesto.push(res.locals.versionPresupuesto.Id);
    const getPresupuestos = async(versionesPresupuesto,claveCapituloGasto) => {
        try {
            const presupuestos = await capitulosDeGasto.getByVersiones(versionesPresupuesto,claveCapituloGasto);
            const capituloGasto = await capitulosDeGasto.getByClave(claveCapituloGasto);
            capituloGasto.Id 
                ? res.status(200).json({
                    capituloGasto,
                    presupuestos
                    })
                : res.status(404).json({message: "Capitulo de gasto no encontrado"});
        } catch (error) {
            console.log(error)
            res.status(500).json({message: 'Error al consultar la BDD'});
        }
    }
    getPresupuestos(versionesPresupuesto,claveCapituloGasto);
})

export default router;