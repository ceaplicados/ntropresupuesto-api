import express from 'express';
import ObjetosDeGasto from '../controllers/ObjetosDeGasto.js';

const router = express.Router();
const objetosDeGasto=new ObjetosDeGasto();

router.get("/",(req,res) => {
    objetosDeGasto.getByVersion(res.locals.versionPresupuesto.Id)
    .then(
        (value) => {
            res.status(200).json({
                versionPresupuesto: res.locals.versionPresupuesto,
                presupuesto: value
            })
        },
        (error) => {console.log(error);res.status(500).json({message: 'Error al consultar la BDD'})}
    )
})
router.get("/:Filtro",(req,res) => {
    let filtro=req.params.Filtro;
    const exCapituloGasto=/^[1-9]000$/;
    const exConceptoGeneral=/^[1-9][1-9]00$/;
    const exPartidaGenerica=/^[1-9][1-9][1-9]0$/;

    if(exCapituloGasto.test(filtro)){
        // Filtro por capítulo de gasto
        objetosDeGasto.getByVersionCapituloGasto(res.locals.versionPresupuesto.Id,filtro)
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
        objetosDeGasto.getByVersionConceptoGeneral(res.locals.versionPresupuesto.Id,filtro)
        .then(
            (value) => {
                res.status(200).json({
                    versionPresupuesto: res.locals.versionPresupuesto,
                    presupuesto: value
                })
                
            },
            (error) => res.status(500).json({message: 'Error al consultar la BDD'})
        )
    }else if(exPartidaGenerica.test(filtro)){
        // Filtro por partida genérica
        objetosDeGasto.getByVersionPartidaGenerica(res.locals.versionPresupuesto.Id,filtro)
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
        // Filtro por objeto de gasto
        objetosDeGasto.getByVersion(res.locals.versionPresupuesto.Id,filtro)
        .then(
            (value) => {
                if(value.Clave){
                    res.status(200).json({
                        versionPresupuesto: res.locals.versionPresupuesto,
                        presupuesto: value
                    })
                }else{
                    res.status(404).json({
                        message: "Objeto de gasto no encontrado"
                    })
                }
                
            },
            (error) => res.status(500).json({message: 'Error al consultar la BDD'})
        )
    }
})

export default router;