import connection from '../../config/db.conf.js';
import ConceptoGeneral from '../models/ConceptoGeneral.js';

export default class ConceptosGenerales {
    async getByVersion (idVersion,claveConceptoGeneral) {
        let result=[];
        let query='SELECT `ConceptosGenerales`.*, SUM(`Monto`) AS Monto FROM `ConceptosGenerales` '
        query+='JOIN `PartidasGenericas` ON `ConceptosGenerales`.`Id` =  `PartidasGenericas`.`ConceptoGeneral` '
        query+='JOIN `ObjetoDeGasto` ON `PartidasGenericas`.`Id` =  `ObjetoDeGasto`.`PartidaGenerica` '
        query+='WHERE `VersionPresupuesto`= ? ';
        let params = [idVersion];
        
        if(claveConceptoGeneral){
            query+='AND `ConceptosGenerales`.`Clave` = ? ';
            params.push(claveConceptoGeneral);
        }

        query+='GROUP BY `ConceptosGenerales`.`Id`;';
        
        try {
            const [results] = await connection.query(query, params);
            result = results.map((row) => {
                let conceptoGeneral = new ConceptoGeneral();
                delete conceptoGeneral.Id;
                conceptoGeneral.Clave = row.Clave;
                conceptoGeneral.Nombre = row.Nombre;
                conceptoGeneral.Monto = row.Monto;
                delete conceptoGeneral.CapituloGasto;
                return conceptoGeneral;
            });
        } catch (err) {
            console.log(err);
        }
        if(result.length==1){
            result=result[0];
        }
        return result;
    }
}