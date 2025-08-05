import express from 'express';
import estados from '../services/Estados.js';
import VersionPresupuesto from '../models/VersionPresupuesto.js';
import VersionesPresupuesto from '../controllers/VersionesPresupuesto.js';
import versionesPresupuesto from './versionesPresupuesto.js';
import URs from './URs.js';
import UPs from './UPs.js';
import CapituloGasto from './CapituloGasto.js';
import ConceptosGenerales from './ConceptosGenerales.js';
import PartidasGenericas from './PartidasGenericas.js';
import ObjetosDeGasto from './ObjetosDeGasto.js';
import ProgramasPresupuestales from './ProgramasPresupuestales.js';
import Indicadores from './Indicadores.js';

const router = express.Router();
const versionesPresupuesto_controller = new VersionesPresupuesto();

let url=[];
let estado={};

router.use("/*",(req,res,next)=>{
    url=req.baseUrl.split("/");
    if(url[0]===""){
        url.shift();
    }
    if(url.length>0){
        estado=estados.estados.filter((estado) => {return estado.Codigo===url[0]});
        if(estado.length>0){
            estado=estado[0];
            res.locals.estado=estado;
            res.locals.url=url;
            next();
        }else{
            res.status(500).json({message: "Código de estado erróneo"});
            res.end;
        }
    }else{
        res.status(500).json({message: "wrong URL"});
        res.end;
    }
});

// Determinar las versiones de presupuesto a utilizar
router.use(/^(?!(\/|\/URs|\/UPs)$).*$/,( req, res, next ) => {
    let versionesPresupuesto=new VersionPresupuesto();
    if(req.query.v){
        const versiones=req.query.v.split(',');
        versionesPresupuesto_controller.showByIds(versiones)
        .then(
            (value) => {
                versionesPresupuesto=value;
                if(versionesPresupuesto.length>1){
                    res.locals.versionPresupuesto=versionesPresupuesto;
                    next();
                }
                else if(versionesPresupuesto.length==1){
                    res.locals.versionPresupuesto=versionesPresupuesto[0];
                    next();
                }
                else{
                    res.status(404).json({
                        message: "Version de presupuesto no encontrada"
                    })
                }
            }
        )
    }else{
        let anios=[null];
        if(req.query.a){
            anios=req.query.a.split(',');
        }
        const getVersiones = async (anios) => {
            let versiones = await Promise.all(
                anios.map((anio) => {
                    return versionesPresupuesto_controller.getActiva(res.locals.estado.Id,anio)
                    .then( value => value)
                })
            )
            versiones=versiones.filter((version) => { return version.Id })
            if(versiones.length==1){
                res.locals.versionPresupuesto=versiones[0];
                next();
            }
            else if(versiones.length>1){
                res.locals.versionPresupuesto=versiones;
                next();
            }
            else{
                res.status(404).json({
                    message: "No existe una version de presupuesto para los años solicitados"
                }) 
            }
        }   
        getVersiones(anios)

    }
});

router.use("/", versionesPresupuesto);
router.use("/Historico", versionesPresupuesto);
router.use("/URs", URs);
router.use("/UPs", UPs);
router.use("/CapituloGasto", CapituloGasto);
router.use("/ConceptosGenerales", ConceptosGenerales);
router.use("/PartidasGenericas", PartidasGenericas);
router.use("/ObjetoDeGasto", ObjetosDeGasto);
router.use("/Programas", ProgramasPresupuestales);
router.use("/Indicadores", Indicadores);

export default router;