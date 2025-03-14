import express from 'express';
import estados from '../services/Estados.js';
import versionesPresupuesto from './versionesPresupuesto.js';
import URs from './URs.js';
import UPs from './UPs.js';

const router = express.Router();

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

router.use("/", versionesPresupuesto);
router.use("/URs", URs);
router.use("/UPs", UPs);

export default router;