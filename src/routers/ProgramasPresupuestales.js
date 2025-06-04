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


// Presupuesto(s) para un programa presupuestal
router.get("/:ClaveProgramaPresupuestal",(req,res) => {
    let clavePrograma=req.params.ClaveProgramaPresupuestal;
    let idVersiones=[];
    if(Array.isArray(res.locals.versionPresupuesto)){
        idVersiones=res.locals.versionPresupuesto.map((version) => {
            return version.Id;
        })
    }else{
        idVersiones.push(res.locals.versionPresupuesto.Id);
    }
    const getPresupuesto = async (idVersiones,clavePrograma) => {
        try {
            const programa = await programasPresupuestales.getByClaveEstado(clavePrograma,res.locals.estado.Id);
            if(programa.Id){
                const presupuestos = await programasPresupuestales.showMontosByVersionesPresupuestoClavePP(idVersiones,clavePrograma);
                res.status(200).json({programa : programa, presupuestos : presupuestos});
            }
            else{
                res.status(404).json({message: 'No se encontró el programa presupuestal'});
            }
        } catch (error) {
            res.status(500).json({message: 'Error al consultar la BDD'});
            console.log(error);
        }
    }
    getPresupuesto(idVersiones,clavePrograma);
});

export default router;
