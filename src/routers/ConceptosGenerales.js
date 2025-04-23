import express from 'express';
import ConceptosGenerales from '../controllers/ConceptosGenerales.js';

const router = express.Router();
const conceptosGenerales=new ConceptosGenerales();

router.get("/",(req,res) => {
    conceptosGenerales.getByVersion(res.locals.versionPresupuesto.Id)
    .then(
        (value) => {
            res.status(200).json({
                versionPresupuesto: res.locals.versionPresupuesto.Id,
                presupuesto: value
            })
        },
        (error) => res.status(500).json({message: 'Error al consultar la BDD'})
    )
})
router.get("/:Filtro",(req,res) => {
    const filtro=req.params.Filtro;
    const getConceptosGenerales = async (filtro) => {
        const exCapituloGasto=/^[1-9]000$/;
        const exConceptoGeneral=/^[1-9][1-9]00$/;
        let conceptos=[];
        try {
            if(exCapituloGasto.test(filtro)){
                conceptos = await conceptosGenerales.getByClaveCapituloGasto(filtro);
            }
            else if(exConceptoGeneral.test(filtro)){
                conceptos = await conceptosGenerales.getByClave(filtro);
                conceptos = [conceptos];
            }
            if(conceptos.length > 0){
                let versionesPresupuesto=[];
                Array.isArray(res.locals.versionPresupuesto) 
                    ? versionesPresupuesto=res.locals.versionPresupuesto.map( (version) => version.Id )
                    : versionesPresupuesto.push(res.locals.versionPresupuesto.Id);
                const getPresupuestos = async (conceptos,versionesPresupuesto) => {
                    let response = await Promise.all(
                        conceptos.map((concepto) => {
                            return conceptosGenerales.getByVersiones(versionesPresupuesto,concepto.Clave)
                            .then( value => {
                                const obj={...concepto,presupuestos: value}
                                return obj
                            })
                        })
                    )
                    response = response.filter((concepto) => {return concepto.presupuestos.length>0})
                    res.status(200).json(response);
                }
                getPresupuestos(conceptos,versionesPresupuesto)
            }
            else{
                res.status(404).json({message: "Concepto general no encontrado"});
            }
        } catch (error) {
            res.status(500).json({message: 'Error al consultar la BDD'})
        }
    } 
    getConceptosGenerales(filtro)
})

export default router;