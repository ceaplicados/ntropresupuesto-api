import express from 'express';
import PartidasGenericas from '../controllers/PartidasGenericas.js';

const router = express.Router();
const partidasGenericas=new PartidasGenericas();

router.get("/",(req,res) => {
    partidasGenericas.getByVersion(res.locals.versionPresupuesto.Id)
    .then(
        (value) => {
            res.status(200).json({
                versionPresupuesto: res.locals.versionPresupuesto,
                presupuesto: value
            })
        },
        (error) => res.status(500).json({message: 'Error al consultar la BDD'})
    )
})
router.get("/:Filtro",(req,res) => {
    const filtro=req.params.Filtro;
    const getPartidasGenericas = async (filtro) => {
        const exCapituloGasto=/^[1-9]000$/;
        const exConceptoGeneral=/^[1-9][1-9]00$/;
        const exPartidaGenerica=/^[1-9][1-9][1-9]0$/;
        let conceptos=[];
        try {
            if(exCapituloGasto.test(filtro)){
                conceptos = await partidasGenericas.getByClaveCapituloGasto(filtro);
            }
            else if(exConceptoGeneral.test(filtro)){
                conceptos = await partidasGenericas.getByClaveConceptoGeneral(filtro);
            }
            else if(exPartidaGenerica.test(filtro)){
                conceptos = await partidasGenericas.getByClave(filtro);
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
                            return partidasGenericas.getByVersiones(versionesPresupuesto,concepto.Clave)
                            .then( value => {
                                const obj={partidaGenerica: concepto,presupuestos: value}
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
                res.status(404).json({message: "Partida genérica no encontrada"});
            }
        } catch (error) {
            res.status(500).json({message: 'Error al consultar la BDD'})
        }
    } 
    getPartidasGenericas(filtro)
})

export default router;