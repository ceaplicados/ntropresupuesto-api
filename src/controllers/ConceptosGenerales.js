import connection from '../../config/db.conf.js';
import ConceptoGeneral from '../models/ConceptoGeneral.js';

export default class ConceptosGenerales {
    async getById (idConceptoGeneral) {
        let result=[];
        let query='SELECT * FROM `ConceptosGenerales` '
        query+='WHERE `Id`= ? ;';
        let params = [idConceptoGeneral];
        try {
            const [results] = await connection.query(query, params);
            result = results.map((row) => {
                let conceptoGeneral = new ConceptoGeneral();
                conceptoGeneral.Id = row.Id;
                conceptoGeneral.Clave = row.Clave;
                conceptoGeneral.Nombre = row.Nombre;
                delete conceptoGeneral.Monto;
                conceptoGeneral.CapituloGasto = row.CapituloGasto;
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

    async getByClave (claveConceptoGeneral) {
        let result=[];
        let query='SELECT * FROM `ConceptosGenerales` '
        query+='WHERE `Clave`= ? ;';
        let params = [claveConceptoGeneral];
        try {
            const [results] = await connection.query(query, params);
            result = results.map((row) => {
                let conceptoGeneral = new ConceptoGeneral();
                conceptoGeneral.Id = row.Id;
                conceptoGeneral.Clave = row.Clave;
                conceptoGeneral.Nombre = row.Nombre;
                delete conceptoGeneral.Monto;
                conceptoGeneral.CapituloGasto = row.CapituloGasto;
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

        query+='GROUP BY `ConceptosGenerales`.`Id` ORDER BY `ConceptosGenerales`.`Clave`;';
        
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

    async getByVersionCapituloGasto (idVersion,claveCapituloGasto) {
        let result=[];
        let query='SELECT `ConceptosGenerales`.*, SUM(`Monto`) AS Monto FROM `ConceptosGenerales` '
        query+='JOIN `CapitulosGasto` ON `ConceptosGenerales`.`CapituloGasto` =  `CapitulosGasto`.`Id` '
        query+='JOIN `PartidasGenericas` ON `ConceptosGenerales`.`Id` =  `PartidasGenericas`.`ConceptoGeneral` '
        query+='JOIN `ObjetoDeGasto` ON `PartidasGenericas`.`Id` =  `ObjetoDeGasto`.`PartidaGenerica` '
        query+='WHERE `VersionPresupuesto`= ?  AND `CapitulosGasto`.`Clave` = ? ';
        query+='GROUP BY `ConceptosGenerales`.`Id` ORDER BY `ConceptosGenerales`.`Clave`;';
        let params = [idVersion,claveCapituloGasto]; 
                       
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
        return result;
    }
}