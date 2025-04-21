import express from 'express';
import UnidadResponsable from '../models/UnidadResponsable.js';
import UnidadesResponsables from '../controllers/UnidadesResponsables.js';
import CapitulosDeGasto from '../controllers/CapitulosDeGasto.js';
import ConceptosGenerales from '../controllers/ConceptosGenerales.js';
import PartidasGenericas from '../controllers/PartidasGenericas.js';
import ObjetosDeGasto from '../controllers/ObjetosDeGasto.js';

const router = express.Router();
const unidadesResponsables = new UnidadesResponsables();
const capitulosDeGasto = new CapitulosDeGasto();
const conceptosGenerales = new ConceptosGenerales();
const partidasGenericas = new PartidasGenericas();
const objetosDeGasto = new ObjetosDeGasto();

// Listado de todas las Unidades Responsables
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

// Listado de todas las Unidades Responsables con el monto de presupuesto asignado
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

// Presupuesto(s) para una unidad responsable
router.get("/Presupuesto/:ClaveUnidadResponsable",(req,res) => {
    let claveUR=req.params.ClaveUnidadResponsable;
    let idVersiones=[];
    if(Array.isArray(res.locals.versionPresupuesto)){
        idVersiones=res.locals.versionPresupuesto.map((version) => {
            return version.Id;
        })
    }else{
        idVersiones.push(res.locals.versionPresupuesto.Id);
    }
    const getPresupuesto = async (idVersiones,claveUR) => {
        try {
            const response = await unidadesResponsables.showMontosByVersionesPresupuestoClaveUR(idVersiones,claveUR);
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({message: 'Error al consultar la BDD'});
        }        
    }
    getPresupuesto(idVersiones,claveUR);
})

// Presupuesto(s) una unidad responsable, filtrado para una clave de gasto presupuestal
router.get("/Presupuesto/:ClaveUnidadResponsable/:Filtro",(req,res) => {
    const claveUR=req.params.ClaveUnidadResponsable;
    const filtro=req.params.Filtro;
    let idVersiones=[];
    if(Array.isArray(res.locals.versionPresupuesto)){
        idVersiones=res.locals.versionPresupuesto.map((version) => {
            return version.Id;
        })
    }else{
        idVersiones.push(res.locals.versionPresupuesto.Id);
    }
    const getPresupuesto = async (claveUR,filtro,idVersiones) => {
        const exCapituloGasto=/^[1-9]000$/;
        const exConceptoGeneral=/^[1-9][1-9]00$/;
        const exPartidaGenerica=/^[1-9][1-9][1-9]0$/;
        const exObjetoGasto=/^[1-9][1-9][1-9][1-9]$/;
        let objeto=null;
        let response=[];
        try {
            if(exCapituloGasto.test(filtro)){
                response = await unidadesResponsables.showMontosByVersionesPresupuestoClaveURCapituloGasto(idVersiones,claveUR,filtro);
                objeto = await capitulosDeGasto.getByClave(filtro);
            }
            else if(exConceptoGeneral.test(filtro)){
                response = await unidadesResponsables.showMontosByVersionesPresupuestoClaveURConceptoGeneral(idVersiones,claveUR,filtro);
                objeto = await conceptosGenerales.getByClave(filtro);
            }
            else if(exPartidaGenerica.test(filtro)){
                response =  await unidadesResponsables.showMontosByVersionesPresupuestoClaveURPartidaGenerica(idVersiones,claveUR,filtro);
                objeto = await partidasGenericas.getByClave(filtro);
            }
            else if(exObjetoGasto.test(filtro)){
                response = await unidadesResponsables.showMontosByVersionesPresupuestoClaveURObjetoGasto(idVersiones,claveUR,filtro);
                objeto = await objetosDeGasto.getByClave(filtro,idVersiones[0]);
                
            }
            if(objeto){
                res.status(200).json({
                    filtro: objeto,
                    presupuesto: response
                }) 
            }else{
                res.status(404).json({message: 'Filtro no válido'})
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({message: 'Error al consultar la BDD'})
        }
        
    }
    getPresupuesto(claveUR,filtro,idVersiones);
})


export default router;