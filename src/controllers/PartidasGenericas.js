import pool from '../../config/db.conf.js';
import PartidaGenerica from '../models/PartidaGenerica.js';
import VersionPresupuesto from '../models/VersionPresupuesto.js';

export default class PartidasGenericas {
    async getById (idPartidaGenerica) {
        let result=[];
        let query='SELECT * FROM `PartidasGenericas` '
        query+='WHERE `Id`= ? ;';
        let params = [idPartidaGenerica];
        
        try {
            const connection = await pool.getConnection();
            const [results] = await connection.query(query, params);
            pool.releaseConnection(connection);

            result = results.map((row) => {
                let partidaGenerica = new PartidaGenerica();
                partidaGenerica.Id = row.Id;
                partidaGenerica.Clave = row.Clave;
                partidaGenerica.Nombre = row.Nombre;
                delete partidaGenerica.Monto;
                partidaGenerica.ConceptoGeneral = row.ConceptoGeneral;
                return partidaGenerica;
            });
        } catch (err) {
            console.log(err);
        }
        if(result.length==1){
            result=result[0];
        }
        return result;
    }

    async getByClave (clavePartidaGenerica) {
        let result=[];
        let query='SELECT * FROM `PartidasGenericas` '
        query+='WHERE `Clave`= ? ;';
        let params = [clavePartidaGenerica];
        
        try {
            const connection = await pool.getConnection();
            const [results] = await connection.query(query, params);
            pool.releaseConnection(connection);

            result = results.map((row) => {
                let partidaGenerica = new PartidaGenerica();
                partidaGenerica.Id = row.Id;
                partidaGenerica.Clave = row.Clave;
                partidaGenerica.Nombre = row.Nombre;
                delete partidaGenerica.Monto;
                partidaGenerica.ConceptoGeneral = row.ConceptoGeneral;
                return partidaGenerica;
            });
        } catch (err) {
            console.log(err);
        }
        if(result.length==1){
            result=result[0];
        }
        return result;
    }

    async getByClaveConceptoGeneral (claveConceptoGeneral) {
        let result=[];
        let query='SELECT PartidasGenericas.* FROM `PartidasGenericas` '
                +'JOIN ConceptosGenerales ON ConceptosGenerales.Id=PartidasGenericas.ConceptoGeneral '
                +'WHERE ConceptosGenerales.Clave= ? ;';
        let params = [claveConceptoGeneral];
        
        try {
            const connection = await pool.getConnection();
            const [results] = await connection.query(query, params);
            pool.releaseConnection(connection);

            result = results.map((row) => {
                let partidaGenerica = new PartidaGenerica();
                partidaGenerica.Id = row.Id;
                partidaGenerica.Clave = row.Clave;
                partidaGenerica.Nombre = row.Nombre;
                delete partidaGenerica.Monto;
                partidaGenerica.ConceptoGeneral = row.ConceptoGeneral;
                return partidaGenerica;
            });
        } catch (err) {
            console.log(err);
        }
        return result;
    }

    async getByClaveCapituloGasto (claveCapituloGasto) {
        let result=[];
        let query='SELECT PartidasGenericas.* FROM `PartidasGenericas` '
                +'JOIN ConceptosGenerales ON ConceptosGenerales.Id=PartidasGenericas.ConceptoGeneral '
                +'JOIN `CapitulosGasto` ON `ConceptosGenerales`.`CapituloGasto` =  `CapitulosGasto`.`Id` '
                +'WHERE CapitulosGasto.Clave= ? ;';
        let params = [claveCapituloGasto];
        
        try {
            const connection = await pool.getConnection();
            const [results] = await connection.query(query, params);
            pool.releaseConnection(connection);

            result = results.map((row) => {
                let partidaGenerica = new PartidaGenerica();
                partidaGenerica.Id = row.Id;
                partidaGenerica.Clave = row.Clave;
                partidaGenerica.Nombre = row.Nombre;
                delete partidaGenerica.Monto;
                partidaGenerica.ConceptoGeneral = row.ConceptoGeneral;
                return partidaGenerica;
            });
        } catch (err) {
            console.log(err);
        }
        return result;
    }

    async getByVersion (idVersion,clavePartidaGenerica) {
        let result=[];
        let query='SELECT `PartidasGenericas`.*, SUM(`Monto`) AS Monto FROM `PartidasGenericas` '
        query+='JOIN `ObjetoDeGasto` ON `PartidasGenericas`.`Id` =  `ObjetoDeGasto`.`PartidaGenerica` '
        query+='WHERE `VersionPresupuesto`= ? ';
        let params = [idVersion];
        
        if(clavePartidaGenerica){
            query+='AND `PartidasGenericas`.`Clave` = ? ';
            params.push(clavePartidaGenerica);
        }

        query+='GROUP BY `PartidasGenericas`.`Id` ORDER BY `PartidasGenericas`.`Clave`;';
        
        try {
            const connection = await pool.getConnection();
            const [results] = await connection.query(query, params);
            pool.releaseConnection(connection);

            result = results.map((row) => {
                let partidaGenerica = new PartidaGenerica();
                delete partidaGenerica.Id;
                partidaGenerica.Clave = row.Clave;
                partidaGenerica.Nombre = row.Nombre;
                partidaGenerica.Monto = row.Monto;
                delete partidaGenerica.ConceptoGeneral;
                return partidaGenerica;
            });
        } catch (err) {
            console.log(err);
        }
        if(result.length==1){
            result=result[0];
        }
        return result;
    }

    async getByVersiones (idsVersiones,clavePartidaGenerica) {
        let result=[];
        let query='SELECT VersionesPresupuesto.*, SUM(Monto) AS Monto FROM VersionesPresupuesto '
                +'JOIN ObjetoDeGasto ON VersionPresupuesto = VersionesPresupuesto.Id '
                +'JOIN PartidasGenericas ON PartidasGenericas.Id=ObjetoDeGasto.PartidaGenerica '
                +'WHERE VersionesPresupuesto.Id IN ('+idsVersiones.join(',')+') AND PartidasGenericas.Clave=? '
                +'GROUP BY VersionesPresupuesto.Id';
        let params = [clavePartidaGenerica];
        try {
            const connection = await pool.getConnection();
            const [results] = await connection.query(query, params);
            pool.releaseConnection(connection);

            result = results.map((row) => {
                let versionPresupuesto = new VersionPresupuesto();
                    versionPresupuesto.Id  = row.Id;
                    versionPresupuesto.Estado = row.Estado;
                    versionPresupuesto.Anio = row.Anio;
                    versionPresupuesto.Tipo = row.Nombre;
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

    async getByVersionConceptoGeneral (idVersion,claveConceptoGeneral) {
        let result=[];

        let query='SELECT `PartidasGenericas`.*, SUM(`Monto`) AS Monto FROM `PartidasGenericas` '
        query+='JOIN `ConceptosGenerales` ON `ConceptosGenerales`.`Id` =  `PartidasGenericas`.`ConceptoGeneral` '
        query+='JOIN `ObjetoDeGasto` ON `PartidasGenericas`.`Id` =  `ObjetoDeGasto`.`PartidaGenerica` '
        query+='WHERE `VersionPresupuesto`= ? ';
        query+='AND `ConceptosGenerales`.`Clave` = ? ';
        query+='GROUP BY `PartidasGenericas`.`Id` ORDER BY `PartidasGenericas`.`Clave`;';
        let params = [idVersion, claveConceptoGeneral];
                
        try {
            const connection = await pool.getConnection();
            const [results] = await connection.query(query, params);
            pool.releaseConnection(connection);

            result = results.map((row) => {
                let partidaGenerica = new PartidaGenerica();
                delete partidaGenerica.Id;
                partidaGenerica.Clave = row.Clave;
                partidaGenerica.Nombre = row.Nombre;
                partidaGenerica.Monto = row.Monto;
                delete partidaGenerica.ConceptoGeneral;
                return partidaGenerica;
            });
        } catch (err) {
            console.log(err);
        }
        return result;
    }


    async getByVersionCapituloGasto (idVersion,claveCapituloGasto) {
        let result=[];

        let query='SELECT `PartidasGenericas`.*, SUM(`Monto`) AS Monto FROM `PartidasGenericas` '
        query+='JOIN `ConceptosGenerales` ON `ConceptosGenerales`.`Id` =  `PartidasGenericas`.`ConceptoGeneral` '
        query+='JOIN `CapitulosGasto` ON `CapitulosGasto`.`Id` =  `ConceptosGenerales`.`CapituloGasto` '
        query+='JOIN `ObjetoDeGasto` ON `PartidasGenericas`.`Id` =  `ObjetoDeGasto`.`PartidaGenerica` '
        query+='WHERE `VersionPresupuesto`= ? ';
        query+='AND `CapitulosGasto`.`Clave` = ? ';
        query+='GROUP BY `PartidasGenericas`.`Id` ORDER BY `PartidasGenericas`.`Clave`;';
        let params = [idVersion, claveCapituloGasto];
                
        try {
            const connection = await pool.getConnection();
            const [results] = await connection.query(query, params);
            pool.releaseConnection(connection);
            
            result = results.map((row) => {
                let partidaGenerica = new PartidaGenerica();
                delete partidaGenerica.Id;
                partidaGenerica.Clave = row.Clave;
                partidaGenerica.Nombre = row.Nombre;
                partidaGenerica.Monto = row.Monto;
                delete partidaGenerica.ConceptoGeneral;
                return partidaGenerica;
            });
        } catch (err) {
            console.log(err);
        }
        return result;
    }
}