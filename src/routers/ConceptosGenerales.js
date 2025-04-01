import express from 'express';
import ConceptosGenerales from '../controllers/ConceptosGenerales.js';

const router = express.Router();
const conceptosGenerales=new ConceptosGenerales();

router.get("/",(req,res) => {
    conceptosGenerales.getByVersion(res.locals.versionPresupuesto.Id)
    .then(
        (value) => {
            res.status(200).json({
                versionPresupuesto: res.locals.versionPresupuesto.Id,
                presupuesto: value
            })
        },
        (error) => res.status(500).json({message: 'Error al consultar la BDD'})
    )
})
router.get("/:Filtro",(req,res) => {
    let filtro=req.params.Filtro;
    const exCapituloGasto=/^[1-9]000$/;
    
    if(exCapituloGasto.test(filtro)){
        // Filtro por capítulo de gasto
        conceptosGenerales.getByVersionCapituloGasto(res.locals.versionPresupuesto.Id,filtro)
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
        // Filtro por concepto general
        conceptosGenerales.getByVersion(res.locals.versionPresupuesto.Id,filtro)
        .then(
            (value) => {
                if(value.Clave){
                    res.status(200).json({
                        versionPresupuesto: res.locals.versionPresupuesto,
                        presupuesto: value
                    })
                }else{
                    res.status(404).json({
                        message: "Concepto general no encontrado"
                    })
                }
                
            },
            (error) => res.status(500).json({message: 'Error al consultar la BDD'})
        )
    }
})

export default router;