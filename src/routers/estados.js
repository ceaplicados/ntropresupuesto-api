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

router.use(/^(?!(\/|\/URs|\/UPs)$).*$/,( req, res, next ) => {
    let versionPresupuesto=new VersionPresupuesto();
    const getVersionPresupuesto = new Promise((resolve) => {
        if(req.query.v){
            versionesPresupuesto_controller.show(req.query.v)
            .then(
                (value) => {
                    versionPresupuesto=value;
                    if(versionPresupuesto.Id){
                        //resolve(versionPresupuesto.Id);
                        res.locals.versionPresupuesto=versionPresupuesto;
                        next();
                    }else{
                        res.status(404).json({
                            message: "Version de presupuesto no encontrada"
                        })
                    }
                }
            )
        }else{
            let anio=null;
            if(req.query.a){
                anio=req.query.a;
            }
            versionesPresupuesto_controller.getActiva(res.locals.estado.Id,anio)
            .then( 
                (value) => {
                    versionPresupuesto=value;
                    if(versionPresupuesto.Id){
                        res.locals.versionPresupuesto=versionPresupuesto;
                        next();
                    }else{
                        res.status(404).json({
                            message: "No existe una version de presupuesto para el año solicitado"
                        })
                    }
                }, 
                (error) => res.status(500).json({message: 'Error al consultar la BDD'})
            )
        }
    })
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

export default router;