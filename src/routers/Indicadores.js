import express from 'express';
import Indicadores from '../controllers/Indicadores.js';

const router = express.Router();
const indicadores = new Indicadores();

// Presupuesto(s) para un programa presupuestal
router.get("/:ClaveProgramaPresupuestal",(req,res) => {
    let clavePrograma=req.params.ClaveProgramaPresupuestal;
    const getIndicadores = async (clavePrograma) => {
        try {
            const result = await indicadores.getByClaveProgramaIdEstado(clavePrograma,res.locals.estado.Id);
            if(result.length > 0){
                res.status(200).json(result);
            }
            else{
                res.status(404).json({message: 'No se encontraron indicadores'});
            }
        } catch (error) {
            res.status(500).json({message: 'Error al consultar la BDD'});
            console.log(error);
        }
    }
    getIndicadores(clavePrograma);
});

export default router;
