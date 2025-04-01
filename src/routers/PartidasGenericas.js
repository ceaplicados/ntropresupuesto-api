import express from 'express';
import PartidasGenericas from '../controllers/PartidasGenericas.js';

const router = express.Router();
const partidasGenericas=new PartidasGenericas();

router.get("/",(req,res) => {
    partidasGenericas.getByVersion(res.locals.versionPresupuesto.Id)
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
router.get("/:Filtro",(req,res) => {
    let filtro=req.params.Filtro;
    const exCapituloGasto=/^[1-9]000$/;
    const exConceptoGeneral=/^[1-9][1-9]00$/;

    if(exCapituloGasto.test(filtro)){
        // Filtro por capítulo de gasto
        partidasGenericas.getByVersionCapituloGasto(res.locals.versionPresupuesto.Id,filtro)
        .then(
            (value) => {
                res.status(200).json({
                    versionPresupuesto: res.locals.versionPresupuesto,
                    presupuesto: value
                })
                
            },
            (error) => res.status(500).json({message: 'Error al consultar la BDD'})
        )
    }else if(exConceptoGeneral.test(filtro)){
        // Filtro por capítulo de gasto
        partidasGenericas.getByVersionConceptoGeneral(res.locals.versionPresupuesto.Id,filtro)
        .then(
            (value) => {
                res.status(200).json({
                    versionPresupuesto: res.locals.versionPresupuesto,
                    presupuesto: value
                })
                
            },
            (error) => res.status(500).json({message: 'Error al consultar la BDD'})
        )
    }else{
        // filtrar por partida genérica
        partidasGenericas.getByVersion(res.locals.versionPresupuesto.Id,filtro)
        .then(
            (value) => {
                if(value.Clave){
                    res.status(200).json({
                        versionPresupuesto: res.locals.versionPresupuesto,
                        presupuesto: value
                    })
                }else{
                    res.status(404).json({
                        message: "Partida genérica no encontrada"
                    })
                }
                
            },
            (error) => res.status(500).json({message: 'Error al consultar la BDD'})
        )
    }
})

export default router;