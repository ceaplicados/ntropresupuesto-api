import express from 'express';
import ObjetosDeGasto from '../controllers/ObjetosDeGasto.js';

const router = express.Router();
const objetosDeGasto=new ObjetosDeGasto();

router.get("/",(req,res) => {
    objetosDeGasto.getByVersion(res.locals.versionPresupuesto.Id)
    .then(
        (value) => {
            res.status(200).json({
                versionPresupuesto: res.locals.versionPresupuesto,
                presupuesto: value
            })
        },
        (error) => {console.log(error);res.status(500).json({message: 'Error al consultar la BDD'})}
    )
})
router.get("/:Filtro",(req,res) => {
    const filtro=req.params.Filtro;
    const getPartidasGenericas = async (filtro) => {
        const exCapituloGasto=/^[1-9]000$/;
        const exConceptoGeneral=/^[1-9][1-9]00$/;
        const exPartidaGenerica=/^[1-9][1-9][1-9]0$/;
        const exObjetoGasto=/^[1-9][1-9][1-9][1-9]$/;
        let conceptos=[];
        try {
            if(exCapituloGasto.test(filtro)){
                conceptos = await objetosDeGasto.getByClaveCapituloGasto(filtro);
            }
            else if(exConceptoGeneral.test(filtro)){
                conceptos = await objetosDeGasto.getByClaveConceptoGeneral(filtro);
            }
            else if(exPartidaGenerica.test(filtro)){
                conceptos = await objetosDeGasto.getByClavePartidaGenerica(filtro);
            }
            else if(exObjetoGasto.test(filtro)){
                conceptos = await objetosDeGasto.getByClave(filtro);
            }
            if(conceptos.length > 0){
                let versionesPresupuesto=[];
                Array.isArray(res.locals.versionPresupuesto) 
                    ? versionesPresupuesto=res.locals.versionPresupuesto.map( (version) => version.Id )
                    : versionesPresupuesto.push(res.locals.versionPresupuesto.Id);
                const getPresupuestos = async (conceptos,versionesPresupuesto) => {
                    let response = await Promise.all(
                        conceptos.map((concepto) => {
                            return objetosDeGasto.getByVersiones(versionesPresupuesto,concepto.Clave,concepto.Nombre)
                            .then( value => {
                                const obj={objetoDeGasto: concepto,presupuestos: value}
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
                res.status(404).json({message: "Objeto de gasto no encontrado"});
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({message: 'Error al consultar la BDD'})
        }
    } 
    getPartidasGenericas(filtro)
})

export default router;