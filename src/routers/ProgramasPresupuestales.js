import express from 'express';
import ProgramasPresupuestales from '../controllers/ProgramasPresupuestales.js';

const router = express.Router();
const programasPresupuestales = new ProgramasPresupuestales();

router.get("/",(req,res) => {
    if(req.query.b){
        if(req.query.b.trim().length>0){
            programasPresupuestales.buscarByVersion(res.locals.versionPresupuesto.Id,req.query.b)
            .then(
                (value) => res.status(200).json({
                    versionPresupuesto: res.locals.versionPresupuesto,
                    programas: value
                }) ,
                (error) => res.status(500).json({message: 'Error al consultar la BDD'})
            );            
        }else{
            res.status(500).json({message: 'Se omitió el término de búsqueda'});
            res.end;
        }
    }else{
        let quantity=25;
        req.query.q ? quantity=req.query.q : quantity=25;
        programasPresupuestales.showMontosByVersion(res.locals.versionPresupuesto.Id,quantity)
        .then(
            (value) => res.status(200).json({
                versionPresupuesto: res.locals.versionPresupuesto,
                programas: value
            }) ,
            (error) => res.status(500).json({message: 'Error al consultar la BDD'})
        );
    }
});

export default router;
