import express from 'express';
import UnidadesPresupuestales from '../controllers/UnidadesPresupuestales.js';
import VersionPresupuesto from '../models/VersionPresupuesto.js';
import VersionesPresupuesto from '../controllers/VersionesPresupuesto.js';

const router = express.Router();
const unidadesPresupuestales=new UnidadesPresupuestales();
const versionesPresupuesto = new VersionesPresupuesto();

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
    let result=[];
    let versionPresupuesto=new VersionPresupuesto();

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
                        resolve(versionPresupuesto.Id);
                    }
                }, 
                (error) => res.status(500).json({message: 'Error al consultar la BDD'})
            )
        }
    })
    .then(
        (idVersion) => {            
            unidadesPresupuestales.showMontosByVersionPresupuesto(idVersion)
            .then(
                (value) => {
                    res.status(200).json({
                        versionPresupuesto: versionPresupuesto,
                        presupuesto: value
                    })
                },
                (error) => res.status(500).json({message: 'Error al consultar la BDD'})
            )
        }
    )
})

export default router;