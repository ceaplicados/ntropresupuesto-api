import express from 'express';
import CapitulosDeGasto from '../controllers/CapitulosDeGasto.js';
import VersionPresupuesto from '../models/VersionPresupuesto.js';
import VersionesPresupuesto from '../controllers/VersionesPresupuesto.js';

const router = express.Router();
const capitulosDeGasto=new CapitulosDeGasto();
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
    capitulosDeGasto.getByVersion(versionPresupuesto.Id)
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
router.get("/:ClaveCapituloGasto",(req,res) => {
    capitulosDeGasto.getByVersion(versionPresupuesto.Id,req.params.ClaveCapituloGasto)
    .then(
        (value) => {
            if(value.Clave){
                res.status(200).json({
                    versionPresupuesto: versionPresupuesto,
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