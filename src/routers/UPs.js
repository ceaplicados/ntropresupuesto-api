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

router.get("/Presupuesto",(req,res) => {
    unidadesPresupuestales.showMontosByVersionPresupuesto(res.locals.versionPresupuesto.Id)
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

router.get("/Presupuesto/:ClaveUnidadPresupuestal",(req,res) => {
    let claveUP=req.params.ClaveUnidadPresupuestal;
    unidadesPresupuestales.showMontosByVersionPresupuestoClaveUP(res.locals.versionPresupuesto.Id,claveUP)
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

router.get("/Presupuesto/:ClaveUnidadPresupuestal/:Filtro",(req,res) => {
    let claveUP=req.params.ClaveUnidadPresupuestal;
    let filtro=req.params.Filtro;
    const exCapituloGasto=/^[1-9]000$/;
    const exConceptoGeneral=/^[1-9][1-9]00$/;
    const exPartidaGenerica=/^[1-9][1-9][1-9]0$/;
    const exObjetoGasto=/^[1-9][1-9][1-9][1-9]$/;

    if(exCapituloGasto.test(filtro)){
        unidadesPresupuestales.showMontosByVersionPresupuestoClaveUPCapituloGasto(res.locals.versionPresupuesto.Id,claveUP,filtro)
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
        unidadesPresupuestales.showMontosByVersionPresupuestoClaveUPConceptoGeneral(res.locals.versionPresupuesto.Id,claveUP,filtro)
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
        unidadesPresupuestales.showMontosByVersionPresupuestoClaveUPPartidaGenerica(res.locals.versionPresupuesto.Id,claveUP,filtro)
        .then(
            (value) => {
                res.status(200).json({
                    versionPresupuesto: res.locals.versionPresupuesto,
                    presupuesto: value
                })
            },
            (error) => res.status(500).json({message: 'Error al consultar la BDD'})
        )
    }else if(exObjetoGasto.test(filtro)){
        unidadesPresupuestales.showMontosByVersionPresupuestoClaveUPObjetoGasto(res.locals.versionPresupuesto.Id,claveUP,filtro)
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
        res.status(404).json({message: 'Filtro no válido'})
    }
})

export default router;