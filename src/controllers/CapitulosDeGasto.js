import connection from '../../config/db.conf.js';
import CapituloGasto from '../models/CapituloGasto.js';
import VersionPresupuesto from '../models/VersionPresupuesto.js';

export default class CapitulosDeGasto {
    async getById (IdCapituloDeGasto) {
        let result=[];
        let query='SELECT * FROM `CapitulosGasto` '
        query+='WHERE `Id`= ? ;';
        let params = [IdCapituloDeGasto];
        
        try {
            const [results] = await connection.query(query, params);
            result = results.map((row) => {
                let capituloGasto = new CapituloGasto();
                capituloGasto.Id=row.Id;
                capituloGasto.Clave = row.Clave;
                capituloGasto.Nombre = row.Nombre;
                delete capituloGasto.Monto ;
                return capituloGasto;
            });
        } catch (err) {
            console.log(err);
        }
        if(result.length==1){
            result=result[0];
        }
        return result;
    }

    async getByClave (claveCapituloDeGasto) {
        let result=[];
        let query='SELECT * FROM `CapitulosGasto` '
        query+='WHERE `Clave`= ? ;';
        let params = [claveCapituloDeGasto];
        
        try {
            const [results] = await connection.query(query, params);
            result = results.map((row) => {
                let capituloGasto = new CapituloGasto();
                capituloGasto.Id=row.Id;
                capituloGasto.Clave = row.Clave;
                capituloGasto.Nombre = row.Nombre;
                delete capituloGasto.Monto ;
                return capituloGasto;
            });
        } catch (err) {
            console.log(err);
        }
        if(result.length==1){
            result=result[0];
        }
        return result;
    }

    async getByVersion (idVersion,claveCapituloDeGasto) {
        let result=[];
        let query='SELECT `CapitulosGasto`.*, SUM(`Monto`) AS Monto FROM `CapitulosGasto` '
        query+='JOIN `ConceptosGenerales` ON `CapitulosGasto`.`Id`=`ConceptosGenerales`.`CapituloGasto` '
        query+='JOIN `PartidasGenericas` ON `ConceptosGenerales`.`Id` =  `PartidasGenericas`.`ConceptoGeneral` '
        query+='JOIN `ObjetoDeGasto` ON `PartidasGenericas`.`Id` =  `ObjetoDeGasto`.`PartidaGenerica` '
        query+='WHERE `VersionPresupuesto`= ? ';
        let params = [idVersion];
        
        if(claveCapituloDeGasto){
            query+='AND `CapitulosGasto`.`Clave` = ? ';
            params.push(claveCapituloDeGasto);
        }

        query+='GROUP BY `CapitulosGasto`.`Id`;';
        
        try {
            const [results] = await connection.query(query, params);
            result = results.map((row) => {
                let capituloGasto = new CapituloGasto();
                delete capituloGasto.Id;
                capituloGasto.Clave = row.Clave;
                capituloGasto.Nombre = row.Nombre;
                capituloGasto.Monto = row.Monto;
                return capituloGasto;
            });
        } catch (err) {
            console.log(err);
        }
        if(result.length==1){
            result=result[0];
        }
        return result;
    }
    async getByVersiones (idsVersiones,claveCapituloDeGasto) {
        let result=[];
        let query='SELECT VersionesPresupuesto.*, SUM(Monto) AS Monto FROM VersionesPresupuesto '
                +'JOIN ObjetoDeGasto ON VersionPresupuesto = VersionesPresupuesto.Id '
                +'JOIN PartidasGenericas ON PartidasGenericas.Id=ObjetoDeGasto.PartidaGenerica '
                +'JOIN ConceptosGenerales ON ConceptosGenerales.Id=PartidasGenericas.ConceptoGeneral '
                +'JOIN CapitulosGasto ON CapitulosGasto.Id=ConceptosGenerales.CapituloGasto '
                +'WHERE VersionesPresupuesto.Id IN ('+idsVersiones.join(',')+') AND CapitulosGasto.Clave=? '
                +'GROUP BY VersionesPresupuesto.Id';
        let params = [claveCapituloDeGasto];
        try {
            const [results] = await connection.query(query, params);
            result = results.map((row) => {
                let versionPresupuesto = new VersionPresupuesto();
                    versionPresupuesto.Id  = row.Id;
                    versionPresupuesto.Estado = row.Estado;
                    versionPresupuesto.Anio = row.Anio;
                    versionPresupuesto.Tipo = row.Tipo;
                    versionPresupuesto.Descripcion = row.Descripcion;
                    versionPresupuesto.Fecha = row.Fecha;
                    versionPresupuesto.Actual = true;
                    if(row.Actual==0){
                        versionPresupuesto.Actual = false;
                    }
                    delete versionPresupuesto.ObjetoGasto;
                    delete versionPresupuesto.ProgramaPresupuestal;
                    versionPresupuesto.Monto = row.Monto;
                    return versionPresupuesto;
            });
        } catch (err) {
            console.log(err);
        }
        return result;
    }
}