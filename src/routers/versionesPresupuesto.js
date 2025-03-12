import express from 'express';
import VersionesPresupuesto from '../controllers/VersionesPresupuesto.js';

const router = express.Router();
const versionesPresupuesto = new VersionesPresupuesto();
router.get("/",(req,res) => {
    versionesPresupuesto.showByEstado(res.locals.estado.Id)
        .then(
            function(value) { 
                res.status(200).json(value);
             },
            function(error) { 
                res.status(500).json({message: 'Error al consultar la BDD'});
            }
          );
    
});

export default router;
