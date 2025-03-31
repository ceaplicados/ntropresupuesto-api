import express from 'express';
import ConceptosGenerales from '../controllers/ConceptosGenerales.js';
import VersionPresupuesto from '../models/VersionPresupuesto.js';
import VersionesPresupuesto from '../controllers/VersionesPresupuesto.js';

const router = express.Router();
const conceptosGenerales=new ConceptosGenerales();
const versionesPresupuesto = new VersionesPresupuesto();

let versionPresupuesto=new VersionPresupuesto();

router.use("/*",(req,res,next)=>{
    const getVersionPresupuesto = new Promise((resolve) => {
        if(req.query.v){
            versionesPresupuesto.show(req.query.v)
            .then(
                (value) => {
                    versionPresupuesto=value;
                    if(versionPresupuesto.Id){
                        resolve(versionPresupuesto.Id);
                    }
                }
            )
        }else{
            let anio=null;
            if(req.query.a){
                anio=req.query.a;
            }
            versionesPresupuesto.getActiva(res.locals.estado.Id,anio)
            .then( 
                (value) => {
                    versionPresupuesto=value;
                    if(versionPresupuesto.Id){
                        next();
                    }
                }, 
                (error) => res.status(500).json({message: 'Error al consultar la BDD'})
            )
        }
    })
    
});
router.get("/",(req,res) => {
    conceptosGenerales.getByVersion(versionPresupuesto.Id)
    .then(
        (value) => {
            res.status(200).json({
                versionPresupuesto: versionPresupuesto,
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
        conceptosGenerales.getByVersionCapituloGasto(versionPresupuesto.Id,filtro)
        .then(
            (value) => {
                res.status(200).json({
                    versionPresupuesto: versionPresupuesto,
                    presupuesto: value
                })
                
            },
            (error) => res.status(500).json({message: 'Error al consultar la BDD'})
        )
    }else{
        // Filtro por concepto general
        conceptosGenerales.getByVersion(versionPresupuesto.Id,filtro)
        .then(
            (value) => {
                if(value.Clave){
                    res.status(200).json({
                        versionPresupuesto: versionPresupuesto,
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