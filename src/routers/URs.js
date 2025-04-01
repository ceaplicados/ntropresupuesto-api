import express from 'express';
import UnidadResponsable from '../models/UnidadResponsable.js';
import UnidadesResponsables from '../controllers/UnidadesResponsables.js';

const router = express.Router();
const unidadesResponsables=new UnidadesResponsables();

router.get("/",(req,res) => {
    let result=new UnidadResponsable();
    
    unidadesResponsables.getByEstado(res.locals.estado.Id)
    .then(
        (value) => {
            res.status(200).json(value)
        },
        (error) => res.status(500).json({message: 'Error al consultar la BDD'})
    );
})

router.get("/Presupuesto",(req,res) => {
    unidadesResponsables.showMontosByVersionPresupuesto(res.locals.versionPresupuesto.Id)
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

router.get("/Presupuesto/:ClaveUnidadResponsable",(req,res) => {
    let claveUR=req.params.ClaveUnidadResponsable;
    unidadesResponsables.showMontosByVersionPresupuestoClaveUR(res.locals.versionPresupuesto.Id,claveUR)
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

router.get("/Presupuesto/:ClaveUnidadResponsable/:Filtro",(req,res) => {
    let claveUR=req.params.ClaveUnidadResponsable;
    let filtro=req.params.Filtro;
    const exCapituloGasto=/^[1-9]000$/;
    const exConceptoGeneral=/^[1-9][1-9]00$/;
    const exPartidaGenerica=/^[1-9][1-9][1-9]0$/;
    const exObjetoGasto=/^[1-9][1-9][1-9][1-9]$/;

    if(exCapituloGasto.test(filtro)){
        unidadesResponsables.showMontosByVersionPresupuestoClaveURCapituloGasto(res.locals.versionPresupuesto.Id,claveUR,filtro)
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
        unidadesResponsables.showMontosByVersionPresupuestoClaveURConceptoGeneral(res.locals.versionPresupuesto.Id,claveUR,filtro)
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
        unidadesResponsables.showMontosByVersionPresupuestoClaveURPartidaGenerica(res.locals.versionPresupuesto.Id,claveUR,filtro)
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
        unidadesResponsables.showMontosByVersionPresupuestoClaveURObjetoGasto(res.locals.versionPresupuesto.Id,claveUR,filtro)
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